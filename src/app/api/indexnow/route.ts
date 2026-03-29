import { NextResponse } from 'next/server';

const INDEXNOW_KEY = 'c25727a75df1407193adbeb40b3e6906';
const SITE_URL = 'https://technify.space';

/**
 * POST /api/indexnow
 * Submits URLs to IndexNow for instant indexing by Bing, Yandex, DuckDuckGo, etc.
 * 
 * Body: { urls: string[] }  — array of full URLs to submit
 * Or no body to submit sitemap URLs automatically
 */
export async function POST(request: Request) {
  try {
    let urlsToSubmit: string[] = [];

    // Try to get URLs from request body
    try {
      const body = await request.json();
      if (body.urls && Array.isArray(body.urls)) {
        urlsToSubmit = body.urls;
      }
    } catch {
      // No body — auto-discover from sitemap
    }

    // If no URLs provided, fetch from sitemap
    if (urlsToSubmit.length === 0) {
      const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`);
      const sitemapText = await sitemapRes.text();
      const locMatches = sitemapText.match(/<loc>(.*?)<\/loc>/g);
      if (locMatches) {
        urlsToSubmit = locMatches.map(m => m.replace(/<\/?loc>/g, ''));
      }
    }

    if (urlsToSubmit.length === 0) {
      return NextResponse.json({ error: 'No URLs to submit' }, { status: 400 });
    }

    // Submit to IndexNow API
    const indexNowPayload = {
      host: 'technify.space',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urlsToSubmit.slice(0, 10000), // Max 10,000 URLs per request
    };

    const indexNowRes = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(indexNowPayload),
    });

    // Also ping Google sitemap
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`);

    return NextResponse.json({
      success: true,
      urlsSubmitted: urlsToSubmit.length,
      indexNowStatus: indexNowRes.status,
      message: `Submitted ${urlsToSubmit.length} URLs to IndexNow + pinged Google sitemap`,
    });
  } catch (error) {
    console.error('IndexNow submission error:', error);
    return NextResponse.json({ error: 'Failed to submit URLs' }, { status: 500 });
  }
}

// GET endpoint to check key
export async function GET() {
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyUrl: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    status: 'active',
  });
}
