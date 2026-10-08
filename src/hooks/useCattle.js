/**
 * useCattle.js — Custom hook for cattle/collar registry
 *
 * Wraps cattleService so React components get reactive state
 * without knowing anything about the underlying data source.
 *
 * Usage:
 *   const { cattle, addCollar, removeCollar, loading } = useCattle(farmerId);
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getCattle, 
  addCattle, 
  deleteCattle,
  addVaccinationRecord as addVacService,
  addMedicalTreatmentRecord as addMedService,
  addHealthMonitoringRecord as addHmService
} from '../services/cattleService';

/**
 * @param {string} farmerId  — e.g. 'farmer-uma'
 */
export function useCattle(farmerId = 'farmer-uma') {
  const [cattle, setCattle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCattle(farmerId)
      .then((data) => {
        if (!cancelled) {
          setCattle(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [farmerId]);

  /**
   * Register a new collar and update local state.
   */
  const addCollar = useCallback(
    async (collarData) => {
      const newCow = await addCattle({ ...collarData, farmerId });
      setCattle((prev) => [...prev, newCow]);
      return newCow;
    },
    [farmerId]
  );

  /**
   * Remove a collar and update local state.
   */
  const removeCollar = useCallback(async (collarId) => {
    await deleteCattle(collarId);
    setCattle((prev) => prev.filter((c) => c.id !== collarId));
  }, []);

  /**
   * Add a vaccination record to a specific cattle.
   */
  const addVaccination = useCallback(async (collarId, record) => {
    const newRecord = await addVacService(collarId, record);
    setCattle((prev) =>
      prev.map((c) =>
        c.id === collarId
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
        c.id === collarId
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
        c.id === collarId
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
    removeCollar, 
    addVaccination,
    addMedicalTreatment,
    addHealthMonitoring,
    syncTelemetry, 
    loading, 
    error 
  };
}
