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
import hindiDictionary from './hindiDictionary.json';


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ─── UI State (this context's own responsibility) ──────────────────────────
  const [activeRole, setActiveRole] = useState('guest'); // 'guest' | 'farmer' | 'doctor'
  const [activeTab, setActiveTab]   = useState('home');
  const [selectedCattleId, setSelectedCattleId] = useState('101');
  const [language, setLanguage]     = useState('en');   // 'en' | 'ta' | 'hi'

  const [darkMode, setDarkMode]     = useState(false);

  // ─── User Profiles ─────────────────────────────────────────────────────────
  const [farmerProfile, setFarmerProfile] = useState({
    id: 'farmer-uma',
    name: 'Uma',
    mobile: '+91 98765 43210',
    address: 'Plot 4, Green Valley Organic Farm, Madurai, Tamil Nadu, 625020',
    cattleCount: 2
  });

  const [doctorProfile, setDoctorProfile] = useState({
    name: 'Dr. Rajesh Kannan',
    qualification: 'M.V.Sc (Animal Husbandry)',
    hospital: 'Madurai East Government Veterinary Hospital',
    experience: '12 Years',
    phone: '+91 94432 10987',
    email: 'dr.rajesh@vetgov.in'
  });

  // ─── Simulation Config (UI-driven, passed to telemetry service) ────────────
  const [simConfig, setSimConfig] = useState({
    heartRateMode: 'normal', // 'normal' | 'high' | 'low'
    tempMode: 'normal',      // 'normal' | 'high'
    batteryDrain: false,
    geofenceBreach: false,
    liveMapWander: true
  });

  // ─── AI Chatbot messages (local to UI, no backend needed yet) ─────────────
  const [chatbotMessages, setChatbotMessages] = useState([
    {
      sender: 'bot',
      text: {
        en: 'Hello, I am your BioSense AI Assistant. How can I help you and your livestock today? You can ask in English, Tamil, or Hindi.',
        ta: 'வணக்கம், நான் உங்கள் பயோசென்ஸ் AI உதவியாளர். இன்று உங்களுக்கும் உங்கள் கால்நடைகளுக்கும் நான் எவ்வாறு உதவ முடியும்? நீங்கள் ஆங்கிலம் அல்லது தமிழில் கேட்கலாம்.',
        hi: 'नमस्ते, मैं आपका बायोसेन्स एआई सहायक हूँ। आज मैं आपकी और आपके पशुओं की कैसे मदद कर सकता हूँ? आप अंग्रेजी, तमिल या हिंदी में पूछ सकते हैं।'
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // ─── Data Hooks ───────────────────────────────────────────────────────────
  const farmerId = farmerProfile.id;

  // Cattle registry
  const {
    cattle,
    setCattle,
    addCollar: addCollarFromService,
    removeCollar,
    addVaccination,
    addMedicalTreatment,
    addHealthMonitoring,
    loading: cattleLoading
  } = useCattle(farmerId);

  // Alerts / Notifications
  const { notifications, markRead, markAllRead, clearAlerts } = useAlerts(farmerId);

  // Consultations
  const {
    consultations,
    sendConsultationMessage,
    prescribe: prescribeFromService,
    createConsultation
  } = useConsultations(farmerId);

  // Live telemetry — feeds back into cattle state via syncTelemetry
  useTelemetry({
    cattle,
    simConfig,
    farmerId,
    onCattleUpdate: (updatedCattle) => setCattle(updatedCattle)
  });

  // ─── Dark Mode side effect ─────────────────────────────────────────────────
  useEffect(() => {
    const root = window.document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
  }, [darkMode]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Register a new collar + update farmer cattle count + push success notification.
   * This is the public-facing function that FarmerDashboard calls.
   */
  const addCollar = useCallback(
    async (collarData) => {
      const newCow = await addCollarFromService(collarData);

      // Update profile cattle count
      setFarmerProfile((prev) => ({ ...prev, cattleCount: prev.cattleCount + 1 }));

      // Push success notification
      await pushAlert({
        collarId: newCow.id,
        farmerId,
        title: 'New Collar Registered',
        message: `Collar ID ${newCow.id} (${newCow.name}) has been successfully linked to the system.`,
        type: 'success'
      });

      return newCow;
    },
    [addCollarFromService, farmerId]
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
    (keyEn, keyTa) => {
      if (language === 'ta') return keyTa;
      if (language === 'hi') return hindiDictionary[keyEn] || keyEn;
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

        // Profiles
        farmerProfile,
        setFarmerProfile,
        doctorProfile,
        setDoctorProfile,

        // Simulation (dev/demo only)
        simConfig,
        setSimConfig,

        // Cattle data (from useCattle + useTelemetry)
        cattle,
        setCattle,
        addCollar,
        removeCollar,
        addVaccination,
        addMedicalTreatment,
        addHealthMonitoring,
        cattleLoading,

        // Notifications (from useAlerts)
        notifications,
        setNotifications: () => {}, // no-op shim for backward compatibility
        markRead,
        markAllRead,
        clearAlerts,

        // Consultations (from useConsultations)
        consultations,
        setConsultations: () => {}, // no-op shim for backward compatibility
        prescribe,
        sendConsultationMessage,
        createConsultation,

        // AI Chatbot (local state)
        chatbotMessages,
        setChatbotMessages,

        // i18n
        t,

        // GPS center (used by GPSTracking, CattleDetails)
        centerLat: 11.077809,
        centerLng: 77.142879
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
