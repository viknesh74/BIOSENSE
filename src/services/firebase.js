import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD6_97zp1Gp6UgV5BMZsnToR4cCHAgives",
  authDomain: "biosense-collar.firebaseapp.com",
  projectId: "biosense-collar",
  storageBucket: "biosense-collar.firebasestorage.app",
  messagingSenderId: "391724008606",
  appId: "1:391724008606:web:8972b48ad1b77c5254e78f",
  measurementId: "G-G6TTRGR4M6",
  databaseURL: "https://biosense-collar-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

let db = null;
let rtdb = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  rtdb = getDatabase(app);
  console.log('✅ Firebase connected successfully');
} catch (e) {
  console.warn('⚠️ Firebase init error — running with local mock data:', e.message);
}

export { db, rtdb };
export const firebaseReady = db !== null;
