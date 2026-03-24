/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Bot Scheduler
 * In a real Next.js application, this could be run via a cron job hitting an API route,
 * or using a background worker (like Cloud-Run, Inngest, Quirrel, etc.).
 * Here we define the logic that would be triggered by to the cron.
 */

import { scrapeLatestLinks } from './scraper';
import { processAndPublishUrl } from './publisher';

const TARGET_SOURCES = [
  'https://techcrunch.com',
  'https://www.theverge.com',
];

/**
 * Main cron function. Called every X hours.
 * Fetches recent articles from target sources, picks a few, and runs the publisher.
 */
export async function runSchedulerCron() {
  console.log(`[Scheduler] Cron triggered at ${new Date().toISOString()}`);
  
  let successCount = 0;
  
  // Randomize source order to avoid patterns
  const shuffledSources = TARGET_SOURCES.sort(() => 0.5 - Math.random());
  
  for (const source of shuffledSources) {
    if (successCount >= 3) break; // Limit to 3 articles per cron run
    
    console.log(`[Scheduler] Checking source: ${source}`);
    const latestLinks = await scrapeLatestLinks(source, 5);
    
    // Pick a random un-published link
    // In reality, check DB first if url already exists
    const targetLink = latestLinks[Math.floor(Math.random() * latestLinks.length)];
    
    if (targetLink) {
      console.log(`[Scheduler] Selected link for processing: ${targetLink}`);
      try {
        const isPublished = await processAndPublishUrl(targetLink);
        if (isPublished) {
          successCount++;
        }
      } catch (e) {
        console.error(`[Scheduler Error] Failed processing ${targetLink}`, e);
      }
    }
  }
  
  console.log(`[Scheduler] Cron run completed. Published ${successCount} new articles.`);
  return { successCount };
}
