import { db } from './firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';

// ─── In-memory fallback for alerts while Firestore loads ──────────────────────
let _localAlerts = [];
let _listeners = [];

function _notify() {
  _listeners.forEach((cb) => cb([..._localAlerts]));
}

export function subscribeToAlerts(farmerId, callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  // Simple query without orderBy to avoid needing a composite index
  const q = query(
    collection(db, 'alerts'),
    where('farmerId', '==', farmerId || 'farmer-uma')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      // Sort client-side by timestamp desc to avoid needing a Firestore index
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    callback(alerts);
  }, (error) => {
    console.warn("Alerts Firestore error (falling back to local):", error.message);
    // Fallback: use local in-memory alerts
    _listeners.push(callback);
    callback([..._localAlerts]);
  });

  return unsubscribe;
}

export async function pushAlert(alert) {
  const newAlert = {
    ...alert,
    timestamp: Date.now(),
    read: false
  };

  // Always keep a local copy so the app works even if Firestore write fails
  _localAlerts = [{ id: Date.now(), ...newAlert }, ..._localAlerts];
  _notify();

  if (!db) return;
  try {
    await addDoc(collection(db, 'alerts'), newAlert);
  } catch (e) {
    console.warn("pushAlert Firestore error:", e.message);
  }
}

export async function markAlertRead(alertId) {
  _localAlerts = _localAlerts.map((a) => (a.id === alertId ? { ...a, read: true } : a));
  _notify();

  if (!db) return;
  try {
    await updateDoc(doc(db, 'alerts', String(alertId)), { read: true });
  } catch (e) {
    console.warn("markAlertRead error:", e.message);
  }
}

export async function markAllAlertsRead(farmerId) {
  _localAlerts = _localAlerts.map((a) => ({ ...a, read: true }));
  _notify();

  if (!db) return;
  try {
    const q = query(
      collection(db, 'alerts'),
      where('farmerId', '==', farmerId || 'farmer-uma'),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.update(d.ref, { read: true }));
    await batch.commit();
  } catch (e) {
    console.warn("markAllAlertsRead error:", e.message);
  }
}
