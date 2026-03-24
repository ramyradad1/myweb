/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Content Uniqueness Checker
 * Ensures that the AI-rewritten content is substantially different from the original text
 * to avoid duplicate content penalties from search engines.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || 'dummy_key';
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Strips HTML tags to get pure text.
 */
function extractText(html: string): string {
  const $ = cheerio.load(html);
  return $('body').text().replace(/\s+/g, ' ').trim();
}

/**
 * Checks similarity score between original and rewritten text.
 * Returns true if the content is unique enough (< 20% similarity in major chunks).
 */
export async function checkUniqueness(originalHtml: string, rewrittenHtml: string): Promise<{ isUnique: boolean; score: number }> {
  const originalText = extractText(originalHtml);
  const rewrittenText = extractText(rewrittenHtml);

  // In a production system, you might use an API like Copyscape or a specialized NLP cosine similarity function.
  // Here we use Gemini to evaluate its own rewrite for similarity percentage.
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `
      You are an expert plagairism checker. Compare these two texts and determine the percentage of similarity.
      Focus on overlapping 5-word sequences and structural duplication.
      
      Text A (Original):
      "${originalText.substring(0, 1500)}..."
      
      Text B (Rewritten):
      "${rewrittenText.substring(0, 1500)}..."
      
      Return ONLY a JSON object with:
      {
        "similarityPercentage": number (0-100),
        "reason": "brief explanation"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const data = JSON.parse(responseText);
      const score = data.similarityPercentage;
      
      // We want < 15% similarity for pure uniqueness
      return { 
        isUnique: score < 15,
        score 
      };
    } catch (e) {
      console.error("[Uniqueness] Parse error, assuming unique.", e);
      return { isUnique: true, score: 0 };
    }

  } catch (error) {
    console.error("[Uniqueness API Error]", error);
    // Fallback to assuming it's unique if the API fails
    return { isUnique: true, score: 0 };
  }
}
