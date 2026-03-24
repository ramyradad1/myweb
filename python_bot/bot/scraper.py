from curl_cffi import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from datetime import datetime, timezone, timedelta
from bot.config import load_config
from bot.logger import log_info

def fetch_url_with_rotation(url: str, headers: dict, timeout: int = 20):
    impersonates = ["chrome120", "safari15_3", "chrome110", "edge99"]
    last_err = None
    for imp in impersonates:
        try:
            res = requests.get(url, headers=headers, timeout=timeout, impersonate=imp)
            res.raise_for_status()
            return res
        except Exception as e:
            last_err = e
            continue
    raise Exception(f"All TLS impersonation attempts failed. Last error: {last_err}")

def scrape_article(url: str) -> dict | str | None:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }
    
    try:
        response = fetch_url_with_rotation(url, headers, timeout=15)
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 1. Extract Title
        title_element = soup.select_one('h1.article-title, h1.title, article h1, h1')
        title = title_element.get_text(strip=True) if title_element else soup.title.string.strip() if soup.title else ""
        
        # Check max age
        config = load_config()
        max_age_hours = config.get("max_age_hours", 24)
        
        publish_time_str = None
        meta_pub = soup.select_one('meta[property="article:published_time"]')
        if meta_pub:
            publish_time_str = meta_pub.get('content')
        else:
            time_tag = soup.select_one('time[pubdate], time[datetime]')
            if time_tag:
                publish_time_str = time_tag.get('datetime')
                
        if publish_time_str:
            try:
                clean_str = publish_time_str.strip().replace(" UTC", "").replace(" GMT", "")
                if " " in clean_str and "T" not in clean_str:
                    parts = clean_str.split(" ", 1)
                    if len(parts) == 2:
                        clean_str = f"{parts[0]}T{parts[1].replace(' ', '')}"
                        
                pub_dt = datetime.fromisoformat(clean_str.replace("Z", "+00:00"))
                if pub_dt.tzinfo is None:
                    pub_dt = pub_dt.replace(tzinfo=timezone.utc)
                
                now = datetime.now(timezone.utc)
                age = now - pub_dt
                if age > timedelta(hours=max_age_hours):
                    log_info(f"Article {url} is too old ({age.total_seconds() / 3600:.1f} hours). Max allowed is {max_age_hours}h.")
                    return "too_old"
            except Exception as e:
                log_info(f"Warning: Could not parse publish time {publish_time_str}: {e}")
        
        # 2. Extract Content Body
        content_selectors = [
            'article .post-content',
            'article .entry-content',
            'article .c-entry-content',
            '.article-body',
            '.post-body',
            'main article',
            'article'
        ]
        
        content_node = None
        for selector in content_selectors:
            node = soup.select_one(selector)
            if node:
                content_node = node
                break
                
        if not content_node:
            log_info(f"Could not find article payload main body on {url}")
            return None
            
        assert content_node is not None
        
        # Clean up
        for element in content_node.select('script, style, iframe, .ad, .advertisement, .social-share, .newsletter-signup'):
            element.decompose()
            
        # 3. Extract Images
        images = []
        for img in content_node.find_all('img'):
            src = img.get('src') or img.get('data-src')
            alt = img.get('alt') or title
            
            if src and 'data:image' not in src and 'pixel' not in src and 'spacer' not in src:
                absolute_url = urljoin(url, src)
                images.append({"url": absolute_url, "alt": alt.strip()})
                
        # 4. Extract clean HTML
        content_html = str(content_node)
        
        return {
            "title": title,
            "content": content_html.strip(),
            "images": images,
            "sourceUrl": url
        }
        
    except Exception as e:
        log_info(f"Failed to scrape {url}: {e}")
        return None

def scrape_latest_links(source_url: str, max_links: int = 15) -> list[str]:
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
        }
        
        response = fetch_url_with_rotation(source_url, headers, timeout=20)
        
        soup = BeautifulSoup(response.text, 'html.parser')
        links_dict = {}
        base_url = f"{urlparse(source_url).scheme}://{urlparse(source_url).netloc}"
        
        for a_tag in soup.select('article a, .post-feed a, h2 a, h3 a'):
            href = a_tag.get('href')
            if href:
                if href.startswith('/'):
                    href = urljoin(base_url, href)
                    
                if len(href) > len(base_url) + 10 and href.startswith('http'):
                    if '/category/' not in href and '/author/' not in href:
                        if href not in links_dict:
                            links_dict[href] = True
                        
        return list(links_dict.keys())[:max_links]
    except Exception as e:
        log_info(f"Failed to fetch links from {source_url}: {e}")
        return []
