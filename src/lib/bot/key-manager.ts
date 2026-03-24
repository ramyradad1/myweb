/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Gemini API Key Manager
 * 
 * - Decrypts AES-256-GCM encrypted keys from environment variables (server-side only)
 * - Provides round-robin rotation across all 8 keys per request
 * - Keys are NEVER exposed to the browser (no NEXT_PUBLIC_ prefix)
 */

import { createDecipheriv } from 'crypto';

// ─── Internal State ───
let decryptedKeys: string[] | null = null;
let currentIndex = 0;

/**
 * Decrypt a single AES-256-GCM encrypted string.
 * Expected format: iv:authTag:ciphertext (all hex-encoded)
 */
function decrypt(encryptedStr: string, secretHex: string): string {
  const [ivHex, authTagHex, ciphertext] = encryptedStr.split(':');

  const key = Buffer.from(secretHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Lazily loads and decrypts all API keys on first call.
 * Throws if env vars are missing or decryption fails.
 */
function loadKeys(): string[] {
  if (decryptedKeys) return decryptedKeys;

  const secret = process.env.GEMINI_ENCRYPTION_SECRET;
  const encryptedJson = process.env.GEMINI_ENCRYPTED_KEYS;

  if (!secret || !encryptedJson) {
    throw new Error(
      '[KeyManager] Missing GEMINI_ENCRYPTION_SECRET or GEMINI_ENCRYPTED_KEYS in environment variables.'
    );
  }

  try {
    const encryptedArray: string[] = JSON.parse(encryptedJson);
    decryptedKeys = encryptedArray.map((enc) => decrypt(enc, secret));
    console.log(`[KeyManager] ✅ Successfully loaded ${decryptedKeys.length} API keys.`);
    return decryptedKeys;
  } catch (error: any) {
    throw new Error(`[KeyManager] Failed to decrypt API keys: ${error.message}`);
  }
}

/**
 * Returns the next API key using round-robin rotation.
 * Each call returns a different key to distribute load and avoid rate limits.
 */
export function getNextApiKey(): string {
  const keys = loadKeys();
  const key = keys[currentIndex];
  currentIndex = (currentIndex + 1) % keys.length;
  return key;
}

/**
 * Returns the total number of available API keys.
 */
export function getKeyCount(): number {
  return loadKeys().length;
}

/**
 * Resets the rotation index (useful for testing).
 */
export function resetRotation(): void {
  currentIndex = 0;
}
