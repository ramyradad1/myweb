import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Parse .env.local manually
const envContent = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

const projectId = env['FIREBASE_PROJECT_ID'];
const clientEmail = env['FIREBASE_CLIENT_EMAIL'];
const privateKey = env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n');

console.log('Project ID:', projectId);
console.log('Client Email:', clientEmail);
console.log('Private Key loaded:', !!privateKey);

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin credentials in .env.local');
  process.exit(1);
}

const app = initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
});

const auth = getAuth(app);

// List all sign-in providers
console.log('\n--- Checking Firebase Auth Providers ---');

const emailToCheck = process.argv[2] || 'admin@nexusinsights.com';
console.log(`\nLooking up user: ${emailToCheck}`);

try {
  const userRecord = await auth.getUserByEmail(emailToCheck);
  console.log('✅ User FOUND!');
  console.log('  UID:', userRecord.uid);
  console.log('  Email:', userRecord.email);
  console.log('  Email Verified:', userRecord.emailVerified);
  console.log('  Disabled:', userRecord.disabled);
  console.log('  Providers:', userRecord.providerData.map(p => p.providerId).join(', '));
} catch (error) {
  if (error.code === 'auth/user-not-found') {
    console.log('❌ User NOT FOUND in Firebase Auth.');
    console.log('   You need to create this user first.');
    console.log('\n--- Creating user now... ---');
    try {
      const newUser = await auth.createUser({
        email: emailToCheck,
        password: 'admin123',
        emailVerified: true,
      });
      console.log('✅ User created successfully!');
      console.log('  UID:', newUser.uid);
      console.log('  Email:', newUser.email);
      console.log('  Password: admin123 (change this!)');
    } catch (createErr) {
      console.error('Failed to create user:', createErr.message);
    }
  } else {
    console.error('Error:', error.code, error.message);
  }
}
