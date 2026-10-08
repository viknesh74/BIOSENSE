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

  // Consultations & Appointments
  const {
    consultations,
    appointments,
    sendConsultationMessage,
    prescribe: prescribeFromService,
    createConsultation,
    bookAppointment: bookAppointmentFromService,
    updateAppointmentStatus: updateAppointmentStatusFromService
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
   * Book appointment wrapper with farmer & doctor notifications
   */
  const bookAppointment = useCallback(
    async (appointmentData) => {
      const newApt = await bookAppointmentFromService(appointmentData);
      
      await pushAlert({
        collarId: newApt.collarId,
        farmerId,
        title: 'Veterinary Appointment Booked',
        message: `Appointment request sent to ${newApt.vetName} for ${newApt.animalName} on ${newApt.preferredDate}.`,
        type: 'info'
      });

      return newApt;
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
<<<<<<< HEAD
    (keyEn, keyTa, keyHi) => {
      if (language === 'ta') return keyTa || keyEn;
      if (language === 'hi') return keyHi || hindiDictionary[keyEn] || keyEn;
=======
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

      // 3. Dynamic patterns for alerts and telemetry notifications
      let m = keyEn.match(/^Collar (\d+) \(([^)]+)\) status changed to (.+)\.$/);
      if (m) {
        const id = m[1];
        const name = m[2];
        const status = dict?.[m[3]] || m[3];
        if (language === 'ta') return `காலர் ${id} (${name}) நிலை ${status} ஆக மாறியது.`;
        if (language === 'hi') return `कॉलर ${id} (${name}) की स्थिति बदलकर ${status} हो गई है।`;
        if (language === 'ml') return `കോളർ ${id} (${name}) അവസ്ഥ ${status} ആയി മാറി.`;
        if (language === 'kn') return `ಕಾಲರ್ ${id} (${name}) ಸ್ಥಿತಿಯು ${status} ಗೆ ಬದಲಾಗಿದೆ.`;
      }

      m = keyEn.match(/^Collar (\d+) \(([^)]+)\) HR at (\d+) BPM\. Urgent checkup required\.$/);
      if (m) {
        const [, id, name, hr] = m;
        if (language === 'ta') return `காலர் ${id} (${name}) இதயத்துடிப்பு ${hr} BPM. உடனடி பரிசோதனை தேவை.`;
        if (language === 'hi') return `कॉलर ${id} (${name}) एचआर ${hr} BPM पर है। तत्काल जांच की आवश्यकता है।`;
        if (language === 'ml') return `കോളർ ${id} (${name}) ഹൃദയമിടിപ്പ് ${hr} BPM. അടിയന്തര പരിശോധന ആവശ്യമാണ്.`;
        if (language === 'kn') return `ಕಾಲರ್ ${id} (${name}) ಎಚ್‌ಆರ್ ${hr} BPM ಆಗಿದೆ. ತಕ್ಷಣದ ತಪಾಸಣೆ ಅಗತ್ಯವಿದೆ.`;
      }

      m = keyEn.match(/^Collar (\d+) \(([^)]+)\) HR dropped to (\d+) BPM\. Emergency care needed\.$/);
      if (m) {
        const [, id, name, hr] = m;
        if (language === 'ta') return `காலர் ${id} (${name}) இதயத்துடிப்பு ${hr} BPM ஆக குறைந்தது. அவசர சிகிச்சை தேவை.`;
        if (language === 'hi') return `कॉलर ${id} (${name}) एचआर घटकर ${hr} BPM हो गया है। आपातकालीन देखभाल की आवश्यकता है।`;
        if (language === 'ml') return `കോളർ ${id} (${name}) ഹൃദയമിടിപ്പ് ${hr} BPM ആയി കുറഞ്ഞു. അടിയന്തര പരിചരണം ആവശ്യമാണ്.`;
        if (language === 'kn') return `ಕಾಲರ್ ${id} (${name}) ಎಚ್‌ಆರ್ ${hr} BPM ಗೆ ಕುಸಿದಿದೆ. ತುರ್ತು ಆರೈಕೆ ಅಗತ್ಯವಿದೆ.`;
      }

      m = keyEn.match(/^Collar (\d+) \(([^)]+)\) has fever of ([\d.]+)°C\.$/);
      if (m) {
        const [, id, name, temp] = m;
        if (language === 'ta') return `காலர் ${id} (${name}) ${temp}°C காய்ச்சல் கொண்டுள்ளது.`;
        if (language === 'hi') return `कॉलर ${id} (${name}) को ${temp}°C बुखार है।`;
        if (language === 'ml') return `കോളർ ${id} (${name}) ${temp}°C പനിയുണ്ട്.`;
        if (language === 'kn') return `ಕಾಲರ್ ${id} (${name}) ${temp}°C ಜ್ವರವನ್ನು ಹೊಂದಿದೆ.`;
      }

      m = keyEn.match(/^Collar (\d+) \(([^)]+)\) battery at (\d+)%\.$/);
      if (m) {
        const [, id, name, batt] = m;
        if (language === 'ta') return `காலர் ${id} (${name}) பேட்டரி ${batt}% ஆக உள்ளது.`;
        if (language === 'hi') return `कॉलर ${id} (${name}) की बैटरी ${batt}% है।`;
        if (language === 'ml') return `കോളർ ${id} (${name}) ബാറ്ററി ${batt}% ആയി.`;
        if (language === 'kn') return `ಕಾಲರ್ ${id} (${name}) ಬ್ಯಾಟರಿ ${batt}% ಆಗಿದೆ.`;
      }

      m = keyEn.match(/^Collar (\d+) \(([^)]+)\) is outside the farm geofence boundary!$/);
      if (m) {
        const [, id, name] = m;
        if (language === 'ta') return `காலர் ${id} (${name}) பண்ணையின் ஜியோஃபென்ஸ் எல்லைக்கு வெளியே உள்ளது!`;
        if (language === 'hi') return `कॉलर ${id} (${name}) फार्म जियोफेंस सीमा से बाहर है!`;
        if (language === 'ml') return `കോളർ ${id} (${name}) ഫാം ജിയോഫെൻസ് പരിധിക്ക് പുറത്താണ്!`;
        if (language === 'kn') return `ಕಾಲರ್ ${id} (${name}) ಫಾರ್ಮ್ ಜಿಯೋಫೆನ್ಸ್ ಗಡಿಯಿಂದ ಹೊರಗಿದೆ!`;
      }

      m = keyEn.match(/^Dr\. Rajesh Kannan submitted a new prescription for (.+)\.$/);
      if (m) {
        const name = m[1];
        if (language === 'ta') return `டாக்டர் ராஜேஷ் கண்ணன் ${name} மாட்டுக்கான புதிய மருந்துச்சீட்டை வழங்கியுள்ளார்.`;
        if (language === 'hi') return `डॉ. राजेश कन्नन ने ${name} के लिए नया नुस्खा प्रस्तुत किया है।`;
        if (language === 'ml') return `ഡോ. രാജേഷ് കണ്ണൻ ${name}-നായി പുതിയ കുറിപ്പടി നൽകി.`;
        if (language === 'kn') return `ಡಾ. ರಾಜೇಶ್ ಕಣ್ಣನ್ ${name} ಗಾಗಿ ಹೊಸ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸಲ್ಲಿಸಿದ್ದಾರೆ.`;
      }

      m = keyEn.match(/^New collar registered: Collar (\d+) \(([^)]+)\)\.$/);
      if (m) {
        const [, id, name] = m;
        if (language === 'ta') return `புதிய காலர் பதிவு செய்யப்பட்டது: காலர் ${id} (${name}).`;
        if (language === 'hi') return `नया कॉलर पंजीकृत: कॉलर ${id} (${name})।`;
        if (language === 'ml') return `புതിയ കോളർ രജിസ്റ്റർ ചെയ്തു: കോളർ ${id} (${name}).`;
        if (language === 'kn') return `ಹೊಸ ಕಾಲರ್ ನೋಂದಾಯಿಸಲಾಗಿದೆ: ಕಾಲರ್ ${id} (${name}).`;
      }

      m = keyEn.match(/^Emergency: Heart rate is spiking at (\d+) BPM\. Fever check recommended\.$/);
      if (m) {
        const hr = m[1];
        if (language === 'ta') return `அவசரம்: இதயத் துடிப்பு ${hr} BPM ஆக அதிகரித்துள்ளது.`;
        if (language === 'hi') return `आपातकाल: हृदय गति ${hr} BPM पर बढ़ रही है। बुखार की जांच अनुशंसित है।`;
        if (language === 'ml') return `அടിയന്തരാവസ്ഥ: ഹൃദയമിടിപ്പ് ${hr} BPM ആയി ഉയരുന്നു. പനി പരിശോധന ശുപാർശ ചെയ്യുന്നു.`;
        if (language === 'kn') return `ತುರ್ತು: ಹೃದಯ ಬಡಿತವು ${hr} BPM ಗೆ ಹೆಚ್ಚುತ್ತಿದೆ. ಜ್ವರ ತಪಾಸಣೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.`;
      }

      m = keyEn.match(/^Emergency: Low heart rate detected \((\d+) BPM\)\. Immediate medical checkup needed\.$/);
      if (m) {
        const hr = m[1];
        if (language === 'ta') return `அவசரம்: இதயத் துடிப்பு ${hr} BPM ஆகக் குறைந்துள்ளது.`;
        if (language === 'hi') return `आपातकाल: कम हृदय गति (${hr} BPM) पाई गई। तत्काल चिकित्सा जांच की आवश्यकता है।`;
        if (language === 'ml') return `அടിയന്തരാവസ്ഥ: കുറഞ്ഞ ഹൃദയമിടിപ്പ് കണ്ടെത്തി (${hr} BPM). ഉടനടി മെഡിക്കൽ പരിശോധന ആവശ്യമാണ്.`;
        if (language === 'kn') return `ತುರ್ತು: ಕಡಿಮೆ ಹೃದಯ ಬಡಿತ ಪತ್ತೆಯಾಗಿದೆ (${hr} BPM). ತಕ್ಷಣದ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆ ಅಗತ್ಯವಿದೆ.`;
      }

      m = keyEn.match(/^Emergency: Fever detected \(([\d.]+)°C \/ ([\d.]+)°F\)\. Request a vet consultation\.$/);
      if (m) {
        const [, temp, tempF] = m;
        if (language === 'ta') return `அவசரம்: மாட்டின் வெப்பநிலை ${temp}°C காய்ச்சலை காட்டுகிறது.`;
        if (language === 'hi') return `आपातकाल: बुखार पाया गया (${temp}°C / ${tempF}°F)। पशु चिकित्सक परामर्श का अनुरोध करें।`;
        if (language === 'ml') return `അടിയന്തരാവസ്ഥ: പനി കണ്ടെത്തി (${temp}°C / ${tempF}°F). ഒരു മൃഗഡോക്ടറുമായി ബന്ധപ്പെടുക.`;
        if (language === 'kn') return `ತುರ್ತು: ಜ್ವರ ಪತ್ತೆಯಾಗಿದೆ (${temp}°C / ${tempF}°F). ಪಶುವೈದ್ಯರ ಸಮಾಲೋಚನೆಗೆ ವಿನಂತಿಸಿ.`;
      }

      m = keyEn.match(/^Warning: Battery level critical \((\d+)%\)\. Please plug in transmitter charger\.$/);
      if (m) {
        const batt = m[1];
        if (language === 'ta') return `எச்சரிக்கை: காலர் பேட்டரி அளவு (${batt}%) மிகக் குறைவாக உள்ளது.`;
        if (language === 'hi') return `चेतावनी: बैटरी का स्तर गंभीर (${batt}%)। कृपया ट्रांसमीटर चार्जर लगाएं।`;
        if (language === 'ml') return `മുന്നറിയിപ്പ്: ബാറ്ററി നില നിർണായകമാണ് (${batt}%). ദയവായി ട്രാൻസ്മിറ്റർ ചാർജർ പ്ലഗ് ചെയ്യുക.`;
        if (language === 'kn') return `ಎಚ್ಚರಿಕೆ: ಬ್ಯಾಟರಿ ಮಟ್ಟವು ತೀರಾ ಕಡಿಮೆಯಾಗಿದೆ (${batt}%). ದಯವಿಟ್ಟು ಚಾರ್ಜರ್ ಪ್ಲಗ್ ಮಾಡಿ.`;
      }

      if (language === 'ta' && keyTa) return keyTa;
>>>>>>> a03f2ad (Add full multi-language support with 5 languages, updated dictionaries, components, and UI)
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

        // Consultations & Appointments (from useConsultations)
        consultations,
        appointments,
        setConsultations: () => {}, // no-op shim for backward compatibility
        prescribe,
        sendConsultationMessage,
        createConsultation,
        bookAppointment,
        updateAppointmentStatus,

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
