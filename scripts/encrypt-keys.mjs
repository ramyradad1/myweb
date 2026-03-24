/**
 * One-time script to encrypt Gemini API keys using AES-256-GCM.
 * 
 * Usage:
 *   node scripts/encrypt-keys.mjs
 * 
 * This will:
 * 1. Generate a random encryption secret (if not provided)
 * 2. Encrypt all API keys
 * 3. Print the values to add to .env.local
 */

import { randomBytes, createCipheriv } from 'crypto';

// ─── Raw API Keys (will NOT be stored anywhere after encryption) ───
const RAW_KEYS = [
  'AIzaSyBfEzZIWSPv-MlZz0rPD_fmtYI6Wp-0EvQ',
  'AIzaSyDsl7gkK_KZqG9mQMJid5No4-jHezya1RM',
  'AIzaSyAQRHS57fgyVFUBTZtB-UzeOurM6RJaImw',
  'AIzaSyDb9pzkKkme8GOINyB-MyOIAyQg9AzbKcw',
  'AIzaSyAjrqDlWaEYYh7L3CyYLKNI0FQWPIv1sVo',
  'AIzaSyCK5aGbuJiATTIx0N8b7O0gbMedKeLvhgY',
  'AIzaSyBp5L12HgUkimutOCbryjVlUxBAxmMB3Zs',
  'AIzaSyA-HotvV6FUepPC-uqnqlYbfiIg2ApvXnA',
];

// Generate a random 32-byte (256-bit) encryption secret
const secret = randomBytes(32);
const secretHex = secret.toString('hex');

/**
 * Encrypt a single plaintext string using AES-256-GCM.
 * Returns a string in the format: iv:authTag:ciphertext (all hex-encoded)
 */
function encrypt(plaintext, keyBuffer) {
  const iv = randomBytes(16); // 128-bit IV
  const cipher = createCipheriv('aes-256-gcm', keyBuffer, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

// Encrypt all keys
const encryptedKeys = RAW_KEYS.map((key) => encrypt(key, secret));

// Output
console.log('\n══════════════════════════════════════════════════');
console.log('  🔐 Gemini API Keys Encrypted Successfully!');
console.log('══════════════════════════════════════════════════\n');
console.log('Add the following to your .env.local file:\n');
console.log(`GEMINI_ENCRYPTION_SECRET="${secretHex}"`);
console.log(`GEMINI_ENCRYPTED_KEYS='${JSON.stringify(encryptedKeys)}'`);
console.log('\n══════════════════════════════════════════════════');
console.log('⚠️  DELETE this script after use if you want extra security.');
console.log('⚠️  NEVER commit .env.local to git.');
console.log('══════════════════════════════════════════════════\n');
