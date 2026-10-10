import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const metaEnv = (typeof import.meta !== 'undefined' && import.meta?.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyD6_97zp1Gp6UgV5BMZsnToR4cCHAgives",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "biosense-collar.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "biosense-collar",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "biosense-collar.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "391724008606",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:391724008606:web:8972b48ad1b77c5254e78f",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-G6TTRGR4M6",
  databaseURL: metaEnv.VITE_FIREBASE_DATABASE_URL || "https://biosense-collar-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

let db = null;
let rtdb = null;

try {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  });
  rtdb = getDatabase(app);
  console.log('✅ Firebase connected successfully');
} catch (e) {
  console.warn('⚠️ Firebase init error — running with local mock data:', e.message);
}

export { db, rtdb };
export const firebaseReady = db !== null;
