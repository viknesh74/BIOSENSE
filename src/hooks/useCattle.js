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
import { getCattle, addCattle, deleteCattle } from '../services/cattleService';

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
   * @param {Object} collarData
   * @returns {Promise<Object>}  — the created cattle record
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
   * @param {string} collarId
   */
  const removeCollar = useCallback(async (collarId) => {
    await deleteCattle(collarId);
    setCattle((prev) => prev.filter((c) => c.id !== collarId));
  }, []);

  /**
   * Update the live telemetry for a specific collar in local state.
   * Called by useTelemetry when new sensor data arrives.
   * @param {Array} updatedCattle
   */
  const syncTelemetry = useCallback((updatedCattle) => {
    setCattle(updatedCattle);
  }, []);

  return { cattle, setCattle, addCollar, removeCollar, syncTelemetry, loading, error };
}
