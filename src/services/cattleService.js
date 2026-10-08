import { db } from './firebase';
import {
  collection, doc, getDocs, setDoc, deleteDoc, updateDoc, query, where
} from 'firebase/firestore';
import { CENTER_LAT, CENTER_LNG, MOCK_CATTLE, STATIC_GPS_LOCATIONS } from './mockData';

// Re-export so other files can still import CENTER_LAT/LNG from here
export { CENTER_LAT, CENTER_LNG, STATIC_GPS_LOCATIONS };

// In-memory fallback store (starts with demo data)
let _fallbackCattle = [...MOCK_CATTLE];

export async function getCattle(farmerId) {
  const sanitizeCattle = (cattleList) => cattleList.map((c, idx) => {
    const defaultGps = STATIC_GPS_LOCATIONS[idx % STATIC_GPS_LOCATIONS.length];
    const cowGps = c.telemetry?.gps;
    // If GPS is missing or from the old coordinates (around lat 9.9), force to the 3 static coordinates
    const isValidNewRegion = cowGps && cowGps.lat > 11.0 && cowGps.lat < 11.2 && cowGps.lng > 77.0 && cowGps.lng < 77.3;
    const finalGps = isValidNewRegion ? cowGps : defaultGps;

    return {
      ...c,
      photo: c.photo && c.photo.includes('1546182990-dffeafbe841d') 
        ? 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&auto=format&fit=crop&q=80'
        : c.photo,
      telemetry: {
        ...(c.telemetry || {}),
        heartRate: c.telemetry?.heartRate || 72,
        temperature: c.telemetry?.temperature || 38.6,
        battery: c.telemetry?.battery || 90,
        gps: finalGps,
        lastUpdated: 'Live ⚡'
      }
    };
  });

  if (!db) {
    return sanitizeCattle(_fallbackCattle.filter((c) => !farmerId || c.farmerId === farmerId));
  }
  try {
    const q = query(collection(db, 'cattle'), where('farmerId', '==', farmerId || 'farmer-uma'));
    const snapshot = await getDocs(q);
    const firestoreData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    // If Firestore is empty, return demo data so the dashboard is never blank
    return firestoreData.length > 0 ? sanitizeCattle(firestoreData) : sanitizeCattle(_fallbackCattle);
  } catch (e) {
    console.warn('getCattle error (using fallback):', e.message);
    return sanitizeCattle(_fallbackCattle);
  }
}

export async function addCattle(collarData) {
  const newId = collarData.id || String(Math.floor(Math.random() * 9000) + 1000);
  const newCow = {
    name: collarData.name || 'Unnamed',
    nickname: collarData.nickname || '',
    breed: collarData.breed || 'Native',
    age: `${collarData.age || 2} Years`,
    gender: collarData.gender || 'Female',
    farmerId: collarData.farmerId || 'farmer-uma',
    photo: collarData.photo || '',
    telemetry: {
      heartRate: 72, temperature: 38.6, battery: 100,
      gps: { lat: CENTER_LAT, lng: CENTER_LNG }, lastUpdated: 'Just now'
    },
    history: {
      heartRate: [72, 72, 72, 72, 72, 72, 72],
      temperature: [38.6, 38.6, 38.6, 38.6, 38.6, 38.6, 38.6],
      timeLabels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
    },
    status: 'Healthy'
  };

  _fallbackCattle = [..._fallbackCattle, { id: newId, ...newCow }];

  if (db) {
    try { await setDoc(doc(db, 'cattle', newId), newCow); }
    catch (e) { console.warn('addCattle Firestore error:', e.message); }
  }
  return { id: newId, ...newCow };
}

export async function deleteCattle(collarId) {
  _fallbackCattle = _fallbackCattle.filter((c) => c.id !== collarId);
  if (!db) return;
  try { await deleteDoc(doc(db, 'cattle', collarId)); }
  catch (e) { console.warn('deleteCattle error:', e.message); }
}

export async function updateCattleMetadata(collarId, updates) {
  _fallbackCattle = _fallbackCattle.map((c) => c.id === collarId ? { ...c, ...updates } : c);
  if (!db) return;
  try { await updateDoc(doc(db, 'cattle', collarId), updates); }
  catch (e) { console.warn('updateCattleMetadata error:', e.message); }
}

export async function addVaccinationRecord(collarId, record) {
  const newRecord = {
    id: record.id || `vac-${collarId}-${Date.now()}`,
    dateAdministered: record.dateAdministered || new Date().toISOString().split('T')[0],
    ...record
  };
  _fallbackCattle = _fallbackCattle.map((c) => {
    if (c.id === collarId) {
      return {
        ...c,
        vaccinations: [newRecord, ...(c.vaccinations || [])]
      };
    }
    return c;
  });
  return newRecord;
}

export async function addMedicalTreatmentRecord(collarId, record) {
  const newRecord = {
    id: record.id || `med-${collarId}-${Date.now()}`,
    date: record.date || new Date().toISOString().split('T')[0],
    ...record
  };
  _fallbackCattle = _fallbackCattle.map((c) => {
    if (c.id === collarId) {
      return {
        ...c,
        medicalTreatments: [newRecord, ...(c.medicalTreatments || [])]
      };
    }
    return c;
  });
  return newRecord;
}

export async function addHealthMonitoringRecord(collarId, record) {
  const newRecord = {
    id: record.id || `hm-${collarId}-${Date.now()}`,
    date: record.date || new Date().toISOString().split('T')[0],
    ...record
  };
  _fallbackCattle = _fallbackCattle.map((c) => {
    if (c.id === collarId) {
      return {
        ...c,
        healthMonitoringHistory: [newRecord, ...(c.healthMonitoringHistory || [])]
      };
    }
    return c;
  });
  return newRecord;
}
