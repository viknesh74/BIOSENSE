/**
 * useCattle.js — Custom hook for cattle/collar registry
 *
 * Wraps cattleService so React components get reactive state
 * without knowing anything about the underlying data source.
 *
 * Full CRUD support:
 *   - getCattle / refreshCattle
 *   - addCollar
 *   - updateCollar
 *   - removeCollar
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getCattle, 
  addCattle, 
  updateCattle as updateCattleService,
  deleteCattle,
  addVaccinationRecord as addVacService,
  addMedicalTreatmentRecord as addMedService,
  addHealthMonitoringRecord as addHmService
} from '../services/cattleService';

/**
 * @param {string} farmerId — e.g. 'farmer-uma'
 */
export function useCattle(farmerId = 'farmer-uma') {
  const [cattle, setCattle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCattle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCattle(farmerId);
      setCattle(data);
    } catch (err) {
      console.error('Failed to load cattle records:', err);
      setError(err.message || 'Failed to load cattle');
    } finally {
      setLoading(false);
    }
  }, [farmerId]);

  // Initial fetch
  useEffect(() => {
    fetchCattle();
  }, [fetchCattle]);

  /**
   * Register a new collar and update reactive state.
   */
  const addCollar = useCallback(
    async (collarData) => {
      setError(null);
      try {
        const newCow = await addCattle({ ...collarData, farmerId });
        setCattle((prev) => {
          const filtered = prev.filter((c) => String(c.id) !== String(newCow.id));
          return [...filtered, newCow];
        });
        return newCow;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [farmerId]
  );

  /**
   * Update an existing collar (keeps stable document ID).
   */
  const updateCollar = useCallback(
    async (collarId, updates) => {
      setError(null);
      try {
        const updated = await updateCattleService(collarId, updates);
        setCattle((prev) =>
          prev.map((c) => (String(c.id) === String(collarId) ? { ...c, ...updated } : c))
        );
        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  /**
   * Remove a collar and update reactive state.
   */
  const removeCollar = useCallback(async (collarId) => {
    setError(null);
    try {
      await deleteCattle(collarId);
      setCattle((prev) => prev.filter((c) => String(c.id) !== String(collarId)));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Add a vaccination record to a specific cattle.
   */
  const addVaccination = useCallback(async (collarId, record) => {
    const newRecord = await addVacService(collarId, record);
    setCattle((prev) =>
      prev.map((c) =>
        String(c.id) === String(collarId)
          ? { ...c, vaccinations: [newRecord, ...(c.vaccinations || [])] }
          : c
      )
    );
    return newRecord;
  }, []);

  /**
   * Add a medical treatment record to a specific cattle.
   */
  const addMedicalTreatment = useCallback(async (collarId, record) => {
    const newRecord = await addMedService(collarId, record);
    setCattle((prev) =>
      prev.map((c) =>
        String(c.id) === String(collarId)
          ? { ...c, medicalTreatments: [newRecord, ...(c.medicalTreatments || [])] }
          : c
      )
    );
    return newRecord;
  }, []);

  /**
   * Add a health monitoring checkup log.
   */
  const addHealthMonitoring = useCallback(async (collarId, record) => {
    const newRecord = await addHmService(collarId, record);
    setCattle((prev) =>
      prev.map((c) =>
        String(c.id) === String(collarId)
          ? { ...c, healthMonitoringHistory: [newRecord, ...(c.healthMonitoringHistory || [])] }
          : c
      )
    );
    return newRecord;
  }, []);

  /**
   * Update the live telemetry for a specific collar in local state.
   */
  const syncTelemetry = useCallback((updatedCattle) => {
    setCattle(updatedCattle);
  }, []);

  return { 
    cattle, 
    setCattle, 
    addCollar, 
    updateCollar,
    removeCollar, 
    refreshCattle: fetchCattle,
    addVaccination,
    addMedicalTreatment,
    addHealthMonitoring,
    syncTelemetry, 
    loading, 
    error 
  };
}
