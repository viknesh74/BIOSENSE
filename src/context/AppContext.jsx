/**
 * AppContext.jsx — Application State & Context Provider
 *
 * ARCHITECTURE:
 * This context is intentionally kept slim — it owns only UI state.
 * All data concerns (cattle, telemetry, alerts, consultations) are delegated
 * to dedicated service modules and custom hooks in src/services/ and src/hooks/.
 *
 * ┌─────────────────────────────────────────────────┐
 * │  AppContext (UI State)                          │
 * │   ├── activeRole / activeTab / language         │
 * │   ├── darkMode / farmerProfile / doctorProfile  │
 * │   └── Wire-in from hooks:                       │
 * │       ├── useCattle      → cattle, addCollar    │
 * │       ├── useTelemetry   → live sensor updates  │
 * │       ├── useAlerts      → notifications        │
 * │       └── useConsultations → chat, prescriptions│
 * └─────────────────────────────────────────────────┘
 *
 * Pages and components continue to read everything from this single context —
 * no page-level changes required.
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useCattle } from '../hooks/useCattle';
import { useTelemetry } from '../hooks/useTelemetry';
import { useAlerts } from '../hooks/useAlerts';
import { useConsultations } from '../hooks/useConsultations';
import { pushAlert } from '../services/alertService';
import dictionaries from '../translations/index';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ─── UI State (this context's own responsibility) ──────────────────────────
  const [activeRole, setActiveRole] = useState('guest'); // 'guest' | 'farmer' | 'doctor'
  const [activeTab, setActiveTab]   = useState('home');
  const [selectedCattleId, setSelectedCattleId] = useState('101');
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('biosense_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('biosense_lang', lang);
    } catch (e) {}
  }, []);

  const [darkMode, setDarkMode]     = useState(false);

  // ─── User Profiles ─────────────────────────────────────────────────────────
  const [farmerProfile, setFarmerProfile] = useState({
    id: 'farmer-uma',
    name: 'Uma',
    mobile: '+91 98765 43210',
    location: 'Madurai, TN',
    herdCount: 3,
    avatar: '👩‍🌾'
  });

  const [doctorProfile, setDoctorProfile] = useState({
    id: 'doc-rajesh',
    name: 'Dr. Rajesh Kannan, BVSc',
    license: 'VCI-TN-2018-04421',
    clinic: 'Meenakshi Veterinary Care Hospital',
    phone: '+91 94431 88990',
    address: 'Near Madurai Toll Gate, Madurai, TN',
    verified: true,
    avatar: '👨‍⚕️'
  });

  // Keep dark class synced on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ─── Data Domain: Cattle ───────────────────────────────────────────────────
  const {
    cattle,
    loading: cattleLoading,
    error: cattleError,
    addCollar: addCollarFromService,
    addVaccinationRecord,
    addMedicalTreatmentRecord
  } = useCattle();

  // ─── Data Domain: Telemetry (Live WebSocket simulation) ────────────────────
  const { isConnected: telemetryConnected } = useTelemetry(cattle);

  // ─── Data Domain: Alerts ───────────────────────────────────────────────────
  const farmerId = farmerProfile.id;
  const {
    alerts,
    unreadAlertCount,
    markAsRead,
    markAllAsRead,
    clearAlert
  } = useAlerts(farmerId);

  // ─── Data Domain: Consultations ───────────────────────────────────────────
  const {
    consultations,
    appointments,
    unreadConsultationCount,
    sendConsultationMessage: sendMessageFromService,
    prescribe: prescribeFromService,
    bookAppointment: bookAppointmentFromService,
    updateAppointmentStatus: updateAppointmentStatusFromService
  } = useConsultations(farmerId);

  // ─── Action Wrappers (orchestrate cross-cutting events) ────────────────────

  /**
   * Register a new collar → notifies farmer via alert service.
   */
  const addCollar = useCallback(
    async (collarData) => {
      const newCow = await addCollarFromService(collarData);
      setSelectedCattleId(newCow.id);

      await pushAlert({
        collarId: newCow.id,
        farmerId,
        title: 'New Collar Registered',
        message: `New collar registered: Collar ${newCow.id} (${newCow.name}).`,
        type: 'success'
      });

      return newCow;
    },
    [addCollarFromService, farmerId]
  );

  /**
   * Farmer sends a chat message to the vet.
   */
  const sendConsultationMessage = useCallback(
    async (consultationId, text, image) => {
      await sendMessageFromService(consultationId, text, image, 'farmer');
    },
    [sendMessageFromService]
  );

  /**
   * Book appointment wrapper
   */
  const bookAppointment = useCallback(
    async (appointmentData) => {
      const newAppt = await bookAppointmentFromService(appointmentData);
      
      await pushAlert({
        collarId: appointmentData.collarId || '101',
        farmerId,
        title: 'Appointment Request Sent',
        message: `Your appointment request with ${appointmentData.vetName || 'veterinarian'} for ${appointmentData.date} has been submitted.`,
        type: 'info'
      });

      return newAppt;
    },
    [bookAppointmentFromService, farmerId]
  );

  /**
   * Update appointment status wrapper
   */
  const updateAppointmentStatus = useCallback(
    async (appointmentId, status, notes) => {
      const updated = await updateAppointmentStatusFromService(appointmentId, status, notes);
      
      await pushAlert({
        collarId: updated?.collarId || '101',
        farmerId,
        title: `Appointment ${status}`,
        message: `Dr. Rajesh Kannan marked your appointment as ${status}. ${notes ? `Notes: ${notes}` : ''}`,
        type: status === 'Confirmed' ? 'success' : 'info'
      });

      return updated;
    },
    [updateAppointmentStatusFromService, farmerId]
  );

  /**
   * Doctor prescribes medicines → pushes a notification to farmer.
   */
  const prescribe = useCallback(
    async (consultationId, rxMedicines) => {
      await prescribeFromService(consultationId, rxMedicines);

      const consultation = consultations.find((c) => c.id === consultationId);
      await pushAlert({
        collarId: consultation?.collarId || '',
        farmerId,
        title: 'Digital Prescription Received',
        message: `Dr. Rajesh Kannan submitted a new prescription for ${consultation?.animalName || 'your cattle'}.`,
        type: 'info'
      });
    },
    [prescribeFromService, consultations, farmerId]
  );

  // ─── Translation helper ───────────────────────────────────────────────────
  const t = useCallback(
    (keyEn, keyTa, keyHi, keyMl, keyKn) => {
      if (keyEn === undefined || keyEn === null || keyEn === '') return '';
      if (typeof keyEn !== 'string') return keyEn;

      if (language === 'en') return keyEn;

      // 1. Direct dictionary lookup
      const dict = dictionaries[language];
      if (dict) {
        if (dict[keyEn] !== undefined && dict[keyEn] !== null) return dict[keyEn];
        const trimmed = keyEn.trim();
        if (dict[trimmed] !== undefined && dict[trimmed] !== null) return dict[trimmed];
      }

      // 2. Positional argument fallbacks
      if (language === 'ta' && keyTa) return keyTa;
      if (language === 'hi' && keyHi) return keyHi;
      if (language === 'ml' && keyMl) return keyMl;
      if (language === 'kn' && keyKn) return keyKn;

      return keyEn;
    },
    [language]
  );

  // ─── Context value (backward-compatible with all existing pages) ──────────
  return (
    <AppContext.Provider
      value={{
        // Navigation / UI
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        selectedCattleId,
        setSelectedCattleId,
        language,
        setLanguage,
        darkMode,
        setDarkMode,

        // User profiles
        farmerProfile,
        setFarmerProfile,
        doctorProfile,
        setDoctorProfile,

        // Translation
        t,

        // Cattle domain
        cattle,
        cattleLoading,
        cattleError,
        addCollar,
        addVaccinationRecord,
        addMedicalTreatmentRecord,

        // Telemetry domain
        telemetryConnected,

        // Alerts domain
        alerts,
        unreadAlertCount,
        markAsRead,
        markAllAsRead,
        clearAlert,

        // Consultations domain
        consultations,
        appointments,
        unreadConsultationCount,
        sendConsultationMessage,
        prescribe,
        bookAppointment,
        updateAppointmentStatus,

        // Backwards compatibility alias
        tTa: (en, ta) => (language === 'ta' ? ta || en : en)
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
