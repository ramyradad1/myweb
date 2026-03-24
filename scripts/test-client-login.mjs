import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Testing Client SDK Login...');
console.log('Project ID:', firebaseConfig.projectId);
console.log('API Key starts with:', firebaseConfig.apiKey?.substring(0, 10) + '...');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = process.argv[2] || 'admin@nexusinsights.com';
const password = process.argv[3] || 'admin123';

console.log(`Attempting login with: ${email}`);

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log('✅ LOGIN SUCCESSFUL (Client SDK)!');
    console.log('User UID:', userCredential.user.uid);
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ LOGIN FAILED (Client SDK)');
    console.log('Error Code:', error.code);
    console.log('Error Message:', error.message);
    process.exit(1);
  });
