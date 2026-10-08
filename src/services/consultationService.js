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

let _localAppointments = [
  {
    id: 'apt-101-1',
    farmerId: 'farmer-uma',
    farmerName: 'Uma',
    farmerPhone: '+91 98765 43210',
    collarId: '101',
    animalName: 'Meenu',
    animalBreed: 'Gir (Desi)',
    vetName: 'Dr. Rajesh Kannan',
    vetHospital: 'Madurai East Government Veterinary Hospital',
    appointmentType: 'Farm Doorstep Visit',
    preferredDate: '2026-10-14',
    preferredTimeSlot: 'Morning (09:00 AM - 12:00 PM)',
    urgency: 'Normal',
    reason: 'Routine quarterly lactation vital audit and ultrasound checkup.',
    status: 'Confirmed',
    bookedAt: '2026-10-08',
    doctorNotes: 'Scheduled for morning farm route visit.'
  },
  {
    id: 'apt-102-1',
    farmerId: 'farmer-uma',
    farmerName: 'Uma',
    farmerPhone: '+91 98765 43210',
    collarId: '102',
    animalName: 'Ganga',
    animalBreed: 'Jersey',
    vetName: 'Dr. Rajesh Kannan',
    vetHospital: 'Madurai East Government Veterinary Hospital',
    appointmentType: 'Live Tele-Consultation',
    preferredDate: '2026-10-10',
    preferredTimeSlot: 'Afternoon (02:00 PM - 05:00 PM)',
    urgency: 'Urgent',
    reason: 'Review thermal spikes (39.1°C) and vital warning trends on collar sensor.',
    status: 'Pending',
    bookedAt: '2026-10-09',
    doctorNotes: 'Awaiting doctor confirmation.'
  }
];

let _localListeners = [];
let _localAppointmentListeners = [];

function _notifyLocal() {
  _localListeners.forEach((cb) => cb([..._localConsultations]));
}

function _notifyAppointmentListeners() {
  _localAppointmentListeners.forEach((cb) => cb([..._localAppointments]));
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
    callback(data.length > 0 ? data : _localConsultations);
  }, (error) => {
    console.warn("Consultations Firestore error (using local):", error.message);
    _localListeners.push(callback);
    callback([..._localConsultations]);
  });
}

export function subscribeToAppointments(farmerId, callback) {
  _localAppointmentListeners.push(callback);
  callback([..._localAppointments]);
  return () => {
    _localAppointmentListeners = _localAppointmentListeners.filter((cb_) => cb_ !== callback);
  };
}

export async function sendConsultationMessage(consultationId, sender, text) {
  const message = {
    sender,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

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

export async function bookAppointment(data) {
  const newAppointment = {
    id: `apt-${Date.now()}`,
    status: 'Pending',
    bookedAt: new Date().toISOString().split('T')[0],
    doctorNotes: 'Awaiting veterinarian confirmation.',
    ...data
  };

  _localAppointments = [newAppointment, ..._localAppointments];
  _notifyAppointmentListeners();
  return newAppointment;
}

export async function updateAppointmentStatus(appointmentId, status, doctorNotes = '') {
  _localAppointments = _localAppointments.map((a) =>
    a.id === appointmentId
      ? { ...a, status, doctorNotes: doctorNotes || a.doctorNotes }
      : a
  );
  _notifyAppointmentListeners();
  return _localAppointments.find((a) => a.id === appointmentId);
}
