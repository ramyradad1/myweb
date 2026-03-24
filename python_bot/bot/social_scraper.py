import os
import requests
from .logger import log_info

def fetch_trending_problems() -> list:
    """
    Fetches trending technical problems from Reddit using Free Search APIs (DuckDuckGo).
    No API keys required!
    """
    log_info("[Social Scraper] Scanning Reddit for trending technical problems via Free Search Engine...")
    problems = []
    
    try:
        from duckduckgo_search import DDGS
        queries = [
            "site:reddit.com/r/techsupport 'how to fix' OR 'help'",
            "site:reddit.com/r/webdev 'not working' OR 'error'"
        ]
        
        with DDGS() as ddgs:
            for q in queries:
                results = ddgs.text(q, max_results=3)
                if results:
                    for r in results:
                        problems.append({
                            "title": str(r.get("title", "")),
                            "body": str(r.get("body", "")),
                            "source": "Reddit (via Core Search)",
                            "url": str(r.get("href", ""))
                        })
        
        if problems:
            log_info(f"[Social Scraper] Successfully extracted {len(problems)} genuine user problems from Reddit.")
            return problems
    except Exception as e:
        log_info(f"[Social Scraper] Core Search failed: {e}")
        
    # Fallback to Mock if no internet or blocked
    log_info("[Social Scraper] Fetching fallback problems from simulated community streams...")
    mock_problems = [
        {
            "title": "Help! My Next.js 14 app is giving Hydration Failed errors when using useState",
            "body": "I recently upgraded to Next 14 App Router and all my client components throw 'Hydration failed because the initial UI does not match what was rendered on the server.' How do I actually fix this?",
            "source": "Reddit (Mock)",
            "url": "https://reddit.com/r/nextjs/mock"
        }
    ]
    return mock_problems

if __name__ == "__main__":
    res = fetch_trending_problems()
    for p in res:
        print(p["title"])
