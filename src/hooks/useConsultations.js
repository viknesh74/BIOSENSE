/**
 * useConsultations.js — Custom hook for vet consultations
 *
 * Wraps consultationService and provides reactive consultation state.
 *
 * Usage:
 *   const { consultations, sendMessage, prescribe, createConsultation } = useConsultations(farmerId);
 */

import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToConsultations,
  sendConsultationMessage,
  addPrescription,
  createConsultation as createConsultationService
} from '../services/consultationService';

/**
 * @param {string} farmerId  — e.g. 'farmer-uma'
 */
export function useConsultations(farmerId = 'farmer-uma') {
  const [consultations, setConsultations] = useState([]);

  // Subscribe to real-time consultation updates
  useEffect(() => {
    const unsubscribe = subscribeToConsultations(farmerId, (data) => {
      setConsultations(data);
    });
    return unsubscribe;
  }, [farmerId]);

  /**
   * Send a message in a consultation thread.
   * @param {string} consultationId
   * @param {string} sender  — 'farmer' | 'doctor'
   * @param {string} text
   */
  const sendMessage = useCallback(async (consultationId, sender, text) => {
    await sendConsultationMessage(consultationId, sender, text);
  }, []);

  /**
   * Doctor adds a prescription — marks consultation as 'Prescribed'
   * and triggers a farmer notification (handled in AppContext via alertService).
   *
   * @param {string} consultationId
   * @param {Array}  rxMedicines
   */
  const prescribe = useCallback(async (consultationId, rxMedicines) => {
    await addPrescription(consultationId, rxMedicines);
  }, []);

  /**
   * Farmer opens a new consultation request.
   * @param {Object} data  — { collarId, animalName, farmerName, symptoms }
   */
  const createConsultation = useCallback(
    async (data) => {
      return await createConsultationService({ ...data, farmerId });
    },
    [farmerId]
  );

  return { consultations, sendMessage, prescribe, createConsultation };
}
