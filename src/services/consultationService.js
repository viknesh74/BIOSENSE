import { db } from './firebase';
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';

// ─── Local fallback data ───────────────────────────────────────────────────────
let _localConsultations = [
  {
    id: 'c-102',
    collarId: '102',
    animalName: 'Ganga',
    farmerName: 'Uma',
    farmerId: 'farmer-uma',
    symptoms: 'Low battery and temperature hovering near high limit.',
    messages: [
      {
        sender: 'farmer',
        text: 'Hello Doctor, Ganga is showing slightly higher temperature today. Can you review?',
        time: '12:15 PM'
      },
      {
        sender: 'doctor',
        text: 'Sure, Uma. I am reviewing the live telemetry data. Temperature is 39.1°C which is normal but slightly high. Keep monitoring.',
        time: '12:20 PM'
      }
    ],
    prescription: null,
    status: 'Consulting',
    date: new Date().toISOString().split('T')[0]
  }
];

let _localListeners = [];

function _notifyLocal() {
  _localListeners.forEach((cb) => cb([..._localConsultations]));
}

export function subscribeToConsultations(farmerId, callback) {
  if (!db) {
    _localListeners.push(callback);
    callback([..._localConsultations]);
    return () => {
      _localListeners = _localListeners.filter((cb_) => cb_ !== callback);
    };
  }

  const q = query(
    collection(db, 'consultations'),
    where('farmerId', '==', farmerId || 'farmer-uma')
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Show local fallback if Firestore is empty
    callback(data.length > 0 ? data : _localConsultations);
  }, (error) => {
    console.warn("Consultations Firestore error (using local):", error.message);
    _localListeners.push(callback);
    callback([..._localConsultations]);
  });
}

export async function sendConsultationMessage(consultationId, sender, text) {
  const message = {
    sender,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Update local state immediately for instant UI feedback
  _localConsultations = _localConsultations.map((c) =>
    c.id === consultationId ? { ...c, messages: [...c.messages, message] } : c
  );
  _notifyLocal();

  if (!db) return;
  try {
    await updateDoc(doc(db, 'consultations', consultationId), {
      messages: arrayUnion(message)
    });
  } catch (e) {
    console.warn('sendConsultationMessage error:', e.message);
  }
}

export async function addPrescription(consultationId, rxMedicines) {
  _localConsultations = _localConsultations.map((c) =>
    c.id === consultationId ? { ...c, prescription: rxMedicines, status: 'Prescribed' } : c
  );
  _notifyLocal();

  if (!db) return;
  try {
    await updateDoc(doc(db, 'consultations', consultationId), {
      prescription: rxMedicines,
      status: 'Prescribed'
    });
  } catch (e) {
    console.warn('addPrescription error:', e.message);
  }
}

export async function createConsultation(data) {
  const newConsultation = {
    id: `c-${Date.now()}`,
    ...data,
    messages: [],
    prescription: null,
    status: 'Consulting',
    date: new Date().toISOString().split('T')[0]
  };

  _localConsultations = [newConsultation, ..._localConsultations];
  _notifyLocal();

  if (!db) return newConsultation;
  try {
    const docRef = await addDoc(collection(db, 'consultations'), newConsultation);
    return { ...newConsultation, id: docRef.id };
  } catch (e) {
    console.warn('createConsultation error:', e.message);
    return newConsultation;
  }
}
