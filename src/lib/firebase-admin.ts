import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Using replace correctly formats the private key when loaded from .env
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    });
    console.log('[Firebase Admin] Initialized successfully.');
  } catch (error: unknown) {
    console.error('[Firebase Admin] Initialization error:', error instanceof Error ? error.message : String(error));
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminRtdb = admin.database();
export const adminStorage = admin.storage();
