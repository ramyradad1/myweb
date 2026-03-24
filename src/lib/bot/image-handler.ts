/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Image Handler Module
 * Responsible for downloading images from scraped articles, optimizing them,
 * and renaming them to SEO-friendly filenames before saving to Firebase Storage
 * or an external CDN like Cloudinary.
 */

import axios from 'axios';

// Mock structure for real implementation (requires Firebase Admin/Cloudinary keys)
export async function processArticleImage(originalUrl: string, seoFilename: string): Promise<string> {
  console.log(`[Image Handler] Downloading image from: ${originalUrl}`);
  
  try {
    // 1. Download image buffer
    // const response = await axios.get(originalUrl, { responseType: 'arraybuffer' });
    // const buffer = Buffer.from(response.data, 'binary');

    // 2. Optimize image (e.g., using sharp in a real node environment)
    // const optimizedBuffer = await sharp(buffer)
    //   .resize(800)
    //   .webp({ quality: 80 })
    //   .toBuffer();

    // 3. Upload to CDN / Storage with the seoFilename
    // const uploadedUrl = await uploadToCDN(optimizedBuffer, `${seoFilename}.webp`);
    
    // For now, return the original URL until storage is configured
    console.log(`[Image Handler] Image processed as ${seoFilename}.webp`);
    
    // Fallback logic for development
    return originalUrl;
  } catch (error: any) {
    console.error(`[Image Handler Error] Failed to process image ${originalUrl}:`, error.message);
    return originalUrl; // Return original if optimization fails
  }
}

/**
 * Generates an SEO friendly filename based on the topic and an index
 */
export function generateSeoFilename(topicSlug: string, index: number): string {
  const dateStr = new Date().toISOString().split('T')[0];
  return `${topicSlug}-${dateStr}-${index}`;
}
