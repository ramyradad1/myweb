/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedArticle {
  title: string;
  content: string; // HTML content
  images: { url: string; alt: string }[];
  sourceUrl: string;
}

/**
 * Scrapes an article from a given URL using heuristic selectors
 * tailored for major news and tech blogs.
 */
export async function scrapeArticle(url: string): Promise<ScrapedArticle | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    // 1. Extract Title (Try standard article title selectors, fallback to H1 or title tag)
    let title = $('h1.article-title').text() 
             || $('h1.title').text() 
             || $('article h1').text() 
             || $('h1').first().text()
             || $('title').text();
             
    title = title.trim();

    // 2. Extract Content Body
    // Common selectors for article body content
    const contentSelectors = [
      'article .post-content',
      'article .entry-content',
      'article .c-entry-content',
      '.article-body',
      '.post-body',
      'main article',
      'article'
    ];

    let $content: any = null;
    
    for (const selector of contentSelectors) {
      if ($(selector).length > 0) {
        $content = $(selector).first();
        break;
      }
    }

    if (!$content) {
      console.warn(`[Scraper] Could not find article payload main body on ${url}`);
      return null;
    }

    // Clean up unnecessary interactive/ad elements before extracting text/images
    $content.find('script, style, iframe, .ad, .advertisement, .social-share, .newsletter-signup').remove();

    // 3. Extract Images from the body
    const images: { url: string; alt: string }[] = [];
    $content.find('img').each((_: any, el: any) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      const alt = $(el).attr('alt') || title;
      
      if (src && !src.includes('data:image') && !src.includes('pixel') && !src.includes('spacer')) {
        // Resolve relative URLs to absolute
        const absoluteUrl = new URL(src, url).href;
        images.push({ url: absoluteUrl, alt: alt.trim() });
      }
    });

    // 4. Extract clean HTML
    // We get the HTML so the AI rewriter understands the structure (headings, paragraphs)
    const contentHtml = $content.html() || '';

    return {
      title,
      content: contentHtml.trim(),
      images,
      sourceUrl: url
    };
  } catch (error: any) {
    console.error(`[Scraper Error] Failed to scrape ${url}:`, error.message);
    return null;
  }
}

/**
 * Scrapes a homepage or RSS feed to find recent article URLs
 */
export async function scrapeLatestLinks(sourceUrl: string, maxLinks: number = 5): Promise<string[]> {
  try {
    const response = await axios.get(sourceUrl);
    const $ = cheerio.load(response.data);
    const links: Set<string> = new Set();
    const baseUrl = new URL(sourceUrl).origin;

    // Look for links inside article tags or typical feed layouts
    $('article a, .post-feed a, h2 a, h3 a').each((_, el) => {
      let href = $(el).attr('href');
      if (href) {
        // Resolve absolute URL
        if (href.startsWith('/')) href = `${baseUrl}${href}`;
        // Verify it looks like an article URL (contains date or slug-like structure)
        if (href.length > baseUrl.length + 10 && href.includes('http')) {
           // Basic filter to avoid category pages or author pages
           if (!href.includes('/category/') && !href.includes('/author/')) {
             links.add(href);
           }
        }
      }
    });

    return Array.from(links).slice(0, maxLinks);
  } catch (error) {
    console.error(`[Scraper Error] Failed to fetch links from ${sourceUrl}`);
    return [];
  }
}
