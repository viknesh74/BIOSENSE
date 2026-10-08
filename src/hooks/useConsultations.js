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
  subscribeToAppointments,
  sendConsultationMessage,
  addPrescription,
  createConsultation as createConsultationService,
  bookAppointment as bookAppointmentService,
  updateAppointmentStatus as updateAppointmentStatusService
} from '../services/consultationService';

/**
 * @param {string} farmerId  — e.g. 'farmer-uma'
 */
export function useConsultations(farmerId = 'farmer-uma') {
  const [consultations, setConsultations] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Subscribe to real-time consultation updates
  useEffect(() => {
    const unsubscribeConsult = subscribeToConsultations(farmerId, (data) => {
      setConsultations(data);
    });
    const unsubscribeApt = subscribeToAppointments(farmerId, (data) => {
      setAppointments(data);
    });
    return () => {
      if (unsubscribeConsult) unsubscribeConsult();
      if (unsubscribeApt) unsubscribeApt();
    };
  }, [farmerId]);

  /**
   * Send a message in a consultation thread.
   */
  const sendMessage = useCallback(async (consultationId, sender, text) => {
    await sendConsultationMessage(consultationId, sender, text);
  }, []);

  /**
   * Doctor adds a prescription
   */
  const prescribe = useCallback(async (consultationId, rxMedicines) => {
    await addPrescription(consultationId, rxMedicines);
  }, []);

  /**
   * Farmer opens a new consultation request.
   */
  const createConsultation = useCallback(
    async (data) => {
      return await createConsultationService({ ...data, farmerId });
    },
    [farmerId]
  );

  /**
   * Farmer books an appointment with a nearby vet/clinic.
   */
  const bookAppointment = useCallback(
    async (data) => {
      return await bookAppointmentService({ ...data, farmerId });
    },
    [farmerId]
  );

  /**
   * Doctor or Farmer updates appointment status (e.g. Confirmed, Completed, Cancelled).
   */
  const updateAppointmentStatus = useCallback(
    async (appointmentId, status, notes) => {
      return await updateAppointmentStatusService(appointmentId, status, notes);
    },
    []
  );

  return { 
    consultations, 
    appointments, 
    sendMessage, 
    prescribe, 
    createConsultation, 
    bookAppointment, 
    updateAppointmentStatus 
  };
}
