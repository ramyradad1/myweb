/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getNextApiKey } from './key-manager';

// API key is now fetched per-request from the encrypted key manager (round-robin rotation)

export interface RewrittenArticle {
  title: string;
  slug: string;
  metaDescription: string;
  content: string; // HTML formatted
  category: string;
  tags: string[];
}

/**
 * Main AI rewriting function that takes scraped HTML content, translates it to Arabic (if needed),
 * and completely restructures/rewrites it.
 */
export async function rewriteArticle(
  originalTitle: string, 
  originalHtml: string,
  tone: string = 'Professional, native American English, highly engaging, and indistinguishable from an expert human writer',
  modelName: string = 'gemini-2.5-flash'
): Promise<RewrittenArticle | null> {
  try {
    // Get a rotated API key from the encrypted key manager
    const genAI = new GoogleGenerativeAI(getNextApiKey());
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
      You are a Senior Editor and highly professional SEO expert for a top-tier US digital magazine (Technify).
      Your task is to take the following article (which might be in any language) and rewrite it completely in fluent, engaging **American English**.
      The new article must be 100% unique and not sound like a literal translation or cheap spun content, to ensure high SEO ranking and avoid duplicate content penalties.
      
      Original Article (Title): ${originalTitle}
      Original Content (HTML):
      ${originalHtml}

      Strict Instructions:
      1. **Complete Restructuring**: Change the flow of ideas if necessary, add a completely new hook/introduction, and a conclusion that summarizes the value.
      2. **Tone**: The tone must be ${tone}.
      3. **HTML Format**: The output MUST be clean HTML format (use <h2>, <h3>, <p>, <ul>, <blockquote> where appropriate). Do NOT include <html> or <body> tags.
      4. **Avoid Literal Translation**: Use native US English idioms, professional journalistic phrasing, and rewrite sentences completely.
      5. **Keyword Density**: Focus smartly on the main keyword without stuffing.

      I need the output EXCLUSIVELY in a precise JSON format containing the following fields:
      {
        "title": "A new, highly engaging, SEO-optimized title (max 60 chars)",
        "slug": "url-slug-in-english-based-on-topic-with-hyphens",
        "metaDescription": "An engaging meta description that encourages clicks (max 155 chars)",
        "content": "The full rewritten article content in HTML format based on instructions above",
        "category": "One appropriate category (e.g., Technology, Business, Health, AI)",
        "tags": ["tag1", "tag2", "tag3", "tag4"]
      }
      
      Return ONLY the JSON string. Do NOT wrap it in markdown block quotes like \`\`\`json.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7, // Balances creativity with factuality
        topP: 0.9,
      }
    });

    const responseText = result.response.text();
    
    // Clean up potential markdown formatting from the response
    const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsedData = JSON.parse(cleanJsonString);
      return parsedData as RewrittenArticle;
    } catch (parseError) {
      console.error("[Rewriter] Failed to parse AI JSON response:", cleanJsonString);
      return null;
    }

  } catch (error: any) {
    console.error(`[Rewriter Error]:`, error.message);
    return null;
  }
}

/**
 * Generates unique Alt Text for scraped images using AI
 */
export async function generateImageAltText(articleContext: string, imageUrl: string): Promise<string> {
  // In a real implementation, we could pass the image itself to Gemini Vision.
  // For cost/speed, we generate contextual alt text based on the article topic.
  return `Illustrative image related to ${articleContext}`;
}
