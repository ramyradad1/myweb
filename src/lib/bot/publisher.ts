/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Publisher Pipeline
 * Orchestrates the full process: Scrape -> Rewrite -> Check -> Image Handle -> Save to Firestore
 */

import { scrapeArticle } from './scraper';
import { rewriteArticle, RewrittenArticle } from './rewriter';
import { checkUniqueness } from './uniqueness';
import { processArticleImage, generateSeoFilename } from './image-handler';
import { supabaseAdmin } from '../supabase-admin';

export async function processAndPublishUrl(url: string) {
  console.log(`[Publisher] Starting pipeline for: ${url}`);
  
  // 1. Scrape
  const scrapedData = await scrapeArticle(url);
  if (!scrapedData || !scrapedData.content) {
    console.error(`[Publisher] Scrape failed or empty content for ${url}`);
    return false;
  }
  
  console.log(`[Publisher] Successfully scraped: "${scrapedData.title}"`);

  // 2. AI Rewrite (Translation + Restructuring + SEO Gen)
  const rewritten = await rewriteArticle(scrapedData.title, scrapedData.content);
  if (!rewritten) {
    console.error(`[Publisher] Rewrite failed for ${url}`);
    return false;
  }
  
  console.log(`[Publisher] Rewrite successful. New Title: "${rewritten.title}"`);

  // 3. Uniqueness Check
  const uniqueness = await checkUniqueness(scrapedData.content, rewritten.content);
  console.log(`[Publisher] Uniqueness Score: ${uniqueness.score}%`);
  
  if (!uniqueness.isUnique) {
    console.warn(`[Publisher] Article rejected. Too similar (${uniqueness.score}%).`);
    // In a real pipeline, we might retry the rewrite automatically here with higher 'temperature'
    return false;
  }

  // 4. Handle Images (Replacing original URLs with optimized, CDN-hosted URLs)
  let finalHtml = rewritten.content;
  const processedImages = [];
  
  let i = 0;
  for (const img of scrapedData.images) {
    const seoFilename = generateSeoFilename(rewritten.slug, i);
    const newImageUrl = await processArticleImage(img.url, seoFilename);
    processedImages.push(newImageUrl);
    
    // Very basic replacement in HTML snippet (assuming src mapped 1:1)
    // In reality, you'd use Cheerio on finalHtml to safely update src attributes
    finalHtml = finalHtml.replace(img.url, newImageUrl);
    i++;
  }
  
  // Get main hero image
  const heroImage = processedImages.length > 0 ? processedImages[0] : 'https://placehold.co/800x400?text=No+Image';

  const americanNames = ['John Davis', 'Emily Chen', 'Michael Reynolds', 'Sarah Thompson', 'David Sterling'];
  const randomAuthor = americanNames[Math.floor(Math.random() * americanNames.length)];

  // 5. Save to Database (Firestore)
  try {
    const articleDocument = {
      title: rewritten.title,
      slug: rewritten.slug,
      metaDescription: rewritten.metaDescription,
      content: finalHtml,
      category: rewritten.category,
      tags: rewritten.tags,
      author: randomAuthor,
      sourceUrl: url,
      heroImage: heroImage,
      views: 0,
      status: 'published',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };

    // Supabase DB call
    const { error } = await supabaseAdmin.from('articles').insert(articleDocument);
    if (error) throw error;
    
    console.log(`✅ [Publisher] Successfully published article: /articles/${rewritten.slug}`);
    return true;
  } catch (error: any) {
    console.error(`[Publisher] Failed to save to database:`, error.message);
    return false;
  }
}
