import { db } from './firebase.js';
import {
  collection, doc, getDocs, setDoc, deleteDoc, updateDoc, query, where, getDoc
} from 'firebase/firestore';
import { CENTER_LAT, CENTER_LNG, MOCK_CATTLE, STATIC_GPS_LOCATIONS } from './mockData.js';

// Re-export constants
export { CENTER_LAT, CENTER_LNG, STATIC_GPS_LOCATIONS };

const STORAGE_KEY = 'biosense_cattle_records_v2'; // v2: uses local /images/ photo paths

let _runtimeCattle = [...MOCK_CATTLE];

// Helper to access persistent localStorage safely in browser, Node, or Capacitor
function getStoredCattle() {
  const storage = typeof localStorage !== 'undefined' ? localStorage : null;
  if (!storage) return [..._runtimeCattle];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        _runtimeCattle = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading cattle from localStorage:', err);
  }
  // Initialize with seed data if not present
  try {
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CATTLE));
    }
  } catch {
    // Ignore quota errors
  }
  return [...MOCK_CATTLE];
}

function saveStoredCattle(cattleList) {
  _runtimeCattle = cattleList;
  const storage = typeof localStorage !== 'undefined' ? localStorage : null;
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(cattleList));
  } catch (err) {
    console.warn('Error saving cattle to localStorage:', err);
  }
}

function sanitizeCattle(cattleList) {
  return cattleList.map((c, idx) => {
    const defaultGps = STATIC_GPS_LOCATIONS[idx % STATIC_GPS_LOCATIONS.length];
    const cowGps = c.telemetry?.gps;
    const isValidNewRegion = cowGps && cowGps.lat > 11.0 && cowGps.lat < 11.2 && cowGps.lng > 77.0 && cowGps.lng < 77.3;
    const finalGps = isValidNewRegion ? cowGps : defaultGps;

    return {
      ...c,
      id: String(c.id || `collar-${idx + 1}`),
      name: c.name || 'Unnamed',
      nickname: c.nickname || '',
      animalType: c.animalType || 'Cow',
      breed: c.breed || 'Native',
      age: c.age || '3 Years',
      gender: c.gender || 'Female',
      farmerId: c.farmerId || 'farmer-uma',
      deviceStatus: c.deviceStatus || 'Online',
      notes: c.notes || '',
      photo: String(c.id) === '101' && (!c.photo || c.photo.includes('unsplash.com'))
        ? '/images/gir-cattle-herd.jpg'
        : String(c.id) === '102' && (!c.photo || c.photo.includes('unsplash.com'))
        ? '/images/collar-cow-hero.jpg'
        : c.photo || '/images/gir-cattle-herd.jpg',
      telemetry: {
        ...(c.telemetry || {}),
        heartRate: c.telemetry?.heartRate || 72,
        temperature: c.telemetry?.temperature || 38.6,
        battery: c.telemetry?.battery !== undefined ? c.telemetry.battery : 90,
        gps: finalGps,
        lastUpdated: c.telemetry?.lastUpdated || 'Live ⚡'
      },
      history: c.history || {
        heartRate: [70, 72, 71, 74, 72, 73, 72],
        temperature: [38.5, 38.6, 38.5, 38.7, 38.6, 38.6, 38.6],
        timeLabels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
      },
      vaccinations: c.vaccinations || [],
      medicalTreatments: c.medicalTreatments || [],
      healthMonitoringHistory: c.healthMonitoringHistory || [],
      status: c.status || 'Healthy'
    };
  });
}

/**
 * Fetch cattle list.
 * Merges Firestore remote data with persistent local store.
 */
export async function getCattle(farmerId = 'farmer-uma') {
  let localList = getStoredCattle();

  if (!db) {
    _runtimeCattle = localList;
    const filtered = localList.filter((c) => !farmerId || c.farmerId === farmerId);
    return sanitizeCattle(filtered);
  }

  try {
    const q = query(collection(db, 'cattle'), where('farmerId', '==', farmerId));
    const snapshot = await getDocs(q);
    const firestoreData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (firestoreData.length > 0) {
      // Merge Firestore data with local storage:
      // Firestore takes precedence, but don't lose locally added records not yet synced
      const firestoreMap = new Map(firestoreData.map((d) => [String(d.id), d]));
      const merged = [...firestoreData];

      // Add any local items for this farmer that aren't yet in Firestore
      for (const item of localList) {
        if (item.farmerId === farmerId && !firestoreMap.has(String(item.id))) {
          merged.push(item);
          // Try background sync to Firestore
          setDoc(doc(db, 'cattle', String(item.id)), item).catch((e) =>
            console.warn('Background sync error for item', item.id, e.message)
          );
        }
      }

      _runtimeCattle = merged;
      saveStoredCattle(merged);
      return sanitizeCattle(merged);
    } else {
      // If Firestore is empty for this farmer, seed Firestore with our local items
      const farmerCattle = localList.filter((c) => !farmerId || c.farmerId === farmerId);
      for (const cow of farmerCattle) {
        setDoc(doc(db, 'cattle', String(cow.id)), cow).catch((e) =>
          console.warn('Initial seed error for cow', cow.id, e.message)
        );
      }
      _runtimeCattle = localList;
      return sanitizeCattle(farmerCattle);
    }
  } catch (e) {
    console.warn('getCattle Firestore notice (using persistent store):', e.message);
    _runtimeCattle = localList;
    return sanitizeCattle(localList.filter((c) => !farmerId || c.farmerId === farmerId));
  }
}

/**
 * Add a new collar / cattle record.
 * Validates uniqueness, saves to persistent storage and Firestore.
 */
export async function addCattle(collarData) {
  const targetId = String(collarData.id || collarData.collarId || Math.floor(Math.random() * 9000) + 1000).trim();
  
  // 1. Prevent duplicate IDs
  const existingRecords = getStoredCattle();
  const duplicate = existingRecords.find((c) => String(c.id).toLowerCase() === targetId.toLowerCase()) ||
                    _runtimeCattle.find((c) => String(c.id).toLowerCase() === targetId.toLowerCase());
  if (duplicate) {
    throw new Error(`Collar ID "${targetId}" is already registered (${duplicate.name}). Please use a unique device ID.`);
  }

  // 2. Build full record
  const newCow = {
    id: targetId,
    name: collarData.name?.trim() || 'Unnamed',
    nickname: collarData.nickname?.trim() || '',
    animalType: collarData.animalType || 'Cow',
    breed: collarData.breed || 'Native',
    age: collarData.age ? (String(collarData.age).includes('Year') ? String(collarData.age) : `${collarData.age} Years`) : '3 Years',
    gender: collarData.gender || 'Female',
    farmerId: collarData.farmerId || 'farmer-uma',
    photo: collarData.photo || '',
    notes: collarData.notes || '',
    deviceStatus: collarData.deviceStatus || 'Online',
    telemetry: {
      heartRate: Number(collarData.telemetry?.heartRate || 72),
      temperature: Number(collarData.telemetry?.temperature || 38.6),
      battery: Number(collarData.telemetry?.battery !== undefined ? collarData.telemetry.battery : 100),
      gps: collarData.telemetry?.gps || { lat: CENTER_LAT, lng: CENTER_LNG },
      lastUpdated: 'Just now'
    },
    history: {
      heartRate: [72, 72, 72, 72, 72, 72, 72],
      temperature: [38.6, 38.6, 38.6, 38.6, 38.6, 38.6, 38.6],
      timeLabels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
    },
    vaccinations: collarData.vaccinations || [],
    medicalTreatments: collarData.medicalTreatments || [],
    healthMonitoringHistory: collarData.healthMonitoringHistory || [],
    status: collarData.status || 'Healthy',
    createdAt: new Date().toISOString()
  };

  // 3. Save to persistent local storage immediately
  const updatedList = [...existingRecords.filter((c) => String(c.id) !== targetId), newCow];
  saveStoredCattle(updatedList);

  // 4. Save to Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'cattle', targetId), newCow);
    } catch (e) {
      console.warn('addCattle Firestore write note:', e.message);
    }
  }

  return sanitizeCattle([newCow])[0];
}

/**
 * Edit an existing collar.
 * Preserves stable document ID, updates persistent storage and Firestore.
 */
export async function updateCattle(collarId, updates) {
  const targetId = String(collarId).trim();
  const existingRecords = getStoredCattle();
  let targetIndex = existingRecords.findIndex((c) => String(c.id) === targetId);
  let activeList = [...existingRecords];

  if (targetIndex === -1) {
    targetIndex = _runtimeCattle.findIndex((c) => String(c.id) === targetId);
    activeList = [..._runtimeCattle];
  }

  if (targetIndex === -1) {
    throw new Error(`Collar ID "${targetId}" not found for update.`);
  }

  const existingCow = activeList[targetIndex];

  // Disallow changing the primary ID in updates to prevent breaking data integrity
  const safeUpdates = { ...updates };
  delete safeUpdates.id;

  const updatedCow = {
    ...existingCow,
    ...safeUpdates,
    id: targetId, // STABLE ID GUARANTEED
    name: safeUpdates.name !== undefined ? safeUpdates.name : existingCow.name,
    nickname: safeUpdates.nickname !== undefined ? safeUpdates.nickname : existingCow.nickname,
    animalType: safeUpdates.animalType !== undefined ? safeUpdates.animalType : existingCow.animalType,
    breed: safeUpdates.breed !== undefined ? safeUpdates.breed : existingCow.breed,
    age: safeUpdates.age !== undefined ? (String(safeUpdates.age).includes('Year') ? String(safeUpdates.age) : `${safeUpdates.age} Years`) : existingCow.age,
    gender: safeUpdates.gender !== undefined ? safeUpdates.gender : existingCow.gender,
    photo: safeUpdates.photo !== undefined ? safeUpdates.photo : existingCow.photo,
    notes: safeUpdates.notes !== undefined ? safeUpdates.notes : existingCow.notes,
    deviceStatus: safeUpdates.deviceStatus !== undefined ? safeUpdates.deviceStatus : existingCow.deviceStatus,
    status: safeUpdates.status !== undefined ? safeUpdates.status : existingCow.status,
    updatedAt: new Date().toISOString()
  };

  activeList[targetIndex] = updatedCow;
  saveStoredCattle(activeList);

  // Sync with Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'cattle', targetId), updatedCow, { merge: true });
    } catch (e) {
      console.warn('updateCattle Firestore notice:', e.message);
    }
  }

  return sanitizeCattle([updatedCow])[0];
}

// Alias for backwards compatibility
export const updateCattleMetadata = updateCattle;

/**
 * Delete a collar record.
 * Deletes from persistent storage and Firestore.
 */
export async function deleteCattle(collarId) {
  const targetId = String(collarId).trim();
  const existingRecords = getStoredCattle();
  const filtered = existingRecords.filter((c) => String(c.id) !== targetId);
  _runtimeCattle = _runtimeCattle.filter((c) => String(c.id) !== targetId);

  saveStoredCattle(filtered);

  if (db) {
    try {
      await deleteDoc(doc(db, 'cattle', targetId));
    } catch (e) {
      console.warn('deleteCattle Firestore notice:', e.message);
    }
  }

  return true;
}

export async function addVaccinationRecord(collarId, record) {
  const targetId = String(collarId).trim();
  const newRecord = {
    id: record.id || `vac-${targetId}-${Date.now()}`,
    dateAdministered: record.dateAdministered || new Date().toISOString().split('T')[0],
    ...record
  };

  const records = getStoredCattle();
  const cow = records.find((c) => String(c.id) === targetId);
  if (cow) {
    cow.vaccinations = [newRecord, ...(cow.vaccinations || [])];
    saveStoredCattle(records);
    if (db) {
      try {
        await updateDoc(doc(db, 'cattle', targetId), {
          vaccinations: cow.vaccinations
        });
      } catch (e) {
        console.warn('addVaccinationRecord Firestore notice:', e.message);
      }
    }
  }
  return newRecord;
}

export async function addMedicalTreatmentRecord(collarId, record) {
  const targetId = String(collarId).trim();
  const newRecord = {
    id: record.id || `med-${targetId}-${Date.now()}`,
    date: record.date || new Date().toISOString().split('T')[0],
    ...record
  };

  const records = getStoredCattle();
  const cow = records.find((c) => String(c.id) === targetId);
  if (cow) {
    cow.medicalTreatments = [newRecord, ...(cow.medicalTreatments || [])];
    saveStoredCattle(records);
    if (db) {
      try {
        await updateDoc(doc(db, 'cattle', targetId), {
          medicalTreatments: cow.medicalTreatments
        });
      } catch (e) {
        console.warn('addMedicalTreatmentRecord Firestore notice:', e.message);
      }
    }
  }
  return newRecord;
}

export async function addHealthMonitoringRecord(collarId, record) {
  const targetId = String(collarId).trim();
  const newRecord = {
    id: record.id || `hm-${targetId}-${Date.now()}`,
    date: record.date || new Date().toISOString().split('T')[0],
    ...record
  };

  const records = getStoredCattle();
  const cow = records.find((c) => String(c.id) === targetId);
  if (cow) {
    cow.healthMonitoringHistory = [newRecord, ...(cow.healthMonitoringHistory || [])];
    saveStoredCattle(records);
    if (db) {
      try {
        await updateDoc(doc(db, 'cattle', targetId), {
          healthMonitoringHistory: cow.healthMonitoringHistory
        });
      } catch (e) {
        console.warn('addHealthMonitoringRecord Firestore notice:', e.message);
      }
    }
  }
  return newRecord;
}
