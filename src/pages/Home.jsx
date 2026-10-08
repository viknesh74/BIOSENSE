import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, 
  Key, 
  ArrowRight, 
  Stethoscope, 
  Building2, 
  CheckCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  Upload, 
  X,
  User,
  AlertCircle
} from 'lucide-react';
import Logo from '../components/Logo';

import LanguageDropdown from '../components/LanguageDropdown';

export default function Home() {
  const { setActiveRole, setActiveTab, setDoctorProfile, t } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLoginTab, setActiveLoginTab] = useState('farmer'); // 'farmer' | 'doctor'
  const [authMethod, setAuthMethod] = useState('credentials'); // 'credentials' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration modal
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Farmer form
  const [farmerId, setFarmerId] = useState('FARM-101');
  const [farmerPass, setFarmerPass] = useState('farmer123');

  // Veterinarian form
  const [vetId, setVetId] = useState('VCI-TN-2024-8842');
  const [vetPass, setVetPass] = useState('vetdoctor2026');
  const [vetHospital, setVetHospital] = useState('Madurai East Government Veterinary Hospital');
  const [vetRole, setVetRole] = useState('Senior Veterinary Officer (M.V.Sc)');
  const [mobileNumber, setMobileNumber] = useState('+91 94432 10987');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Vet Registration form
  const [regForm, setRegForm] = useState({
    name: '',
    vciNumber: '',
    qualification: 'M.V.Sc (Animal Husbandry)',
    hospital: 'Madurai East Government Veterinary Hospital',
    email: '',
    mobile: '',
    licenseFile: null
  });

  const openLoginModal = (initialTab = 'farmer') => {
    setActiveLoginTab(initialTab);
    setIsModalOpen(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleTabSwitch = (tab) => {
    setActiveLoginTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Preset Vet Profiles for 1-Click Instant Demo Access
  const vetPresets = [
    {
      id: 'VCI-TN-2024-8842',
      name: 'Dr. Rajesh Kannan',
      qualification: 'M.V.Sc (Animal Husbandry)',
      hospital: 'Madurai East Government Veterinary Hospital',
      phone: '+91 94432 10987',
      email: 'dr.rajesh@vetgov.in',
      role: 'District Veterinary Officer',
      badgeColor: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'VCI-TN-2023-4109',
      name: 'Dr. Ramesh Kumar',
      qualification: 'B.V.Sc & A.H',
      hospital: 'Mobile Veterinary Clinic Unit #3',
      phone: '+91 98421 55670',
      email: 'dr.ramesh@vetgov.in',
      role: 'Field Livestock Medical Officer',
      badgeColor: 'from-teal-600 to-cyan-600'
    },
    {
      id: 'VCI-EMERG-24X7',
      name: 'Dr. Priya Sundaram',
      qualification: 'M.V.Sc (Veterinary Surgery)',
      hospital: 'District Emergency Veterinary Centre',
      phone: '+91 98840 99881',
      email: 'emergency.vet@vetgov.in',
      role: '24/7 Emergency On-Call Surgeon',
      badgeColor: 'from-rose-600 to-red-600'
    }
  ];

  const handleQuickVetLogin = (preset) => {
    setDoctorProfile({
      name: preset.name,
      qualification: preset.qualification,
      hospital: preset.hospital,
      experience: '10+ Years',
      phone: preset.phone,
      email: preset.email,
      vciNumber: preset.id
    });
    setActiveRole('doctor');
    setActiveTab('doctor-dashboard');
    setIsModalOpen(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeLoginTab === 'farmer') {
      if (!farmerId.trim()) {
        setErrorMsg(t('Please enter your Farmer ID / Mobile', 'தயவுசெய்து உங்கள் விவசாயி ஐடியை உள்ளிடவும்', 'कृपया किसान आईडी दर्ज करें'));
        return;
      }
      setActiveRole('farmer');
      setActiveTab('dashboard');
      setIsModalOpen(false);
    } else {
      // Vet login validation
      if (authMethod === 'credentials') {
        if (!vetId.trim()) {
          setErrorMsg(t('Please enter your VCI Registration Number / Email', 'தயவுசெய்து உங்கள் VCI பதிவு எண்ணை உள்ளிடவும்', 'कृपया VCI पंजीकरण संख्या दर्ज करें'));
          return;
        }
        if (!vetPass.trim()) {
          setErrorMsg(t('Please enter your password', 'கடவுச்சொல்லை உள்ளிடவும்', 'पासवर्ड दर्ज करें'));
          return;
        }
      } else {
        if (!otpCode || otpCode.length < 4) {
          setErrorMsg(t('Please enter the 4-digit OTP sent to your phone', '4 இலக்க OTP குறியீட்டை உள்ளிடவும்', '4-अंकीय ओटीपी दर्ज करें'));
          return;
        }
      }

      setDoctorProfile({
        name: 'Dr. Rajesh Kannan',
        qualification: 'M.V.Sc (Animal Husbandry)',
        hospital: vetHospital,
        experience: '12 Years',
        phone: mobileNumber,
        email: vetId.includes('@') ? vetId : 'dr.rajesh@vetgov.in',
        vciNumber: vetId
      });

      setActiveRole('doctor');
      setActiveTab('doctor-dashboard');
      setIsModalOpen(false);
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode('7429'); // Pre-fill mock OTP for smooth testing
    setSuccessMsg(t('OTP sent successfully to registered mobile (+91 94432 10987). Demo Code: 7429', 'OTP வெற்றிகரமாக அனுப்பப்பட்டது. டெமோ குறியீடு: 7429', 'ओटीपी सफलतापूर्वक भेजा गया। डेमो कोड: 7429'));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.vciNumber) return;

    setDoctorProfile({
      name: regForm.name,
      qualification: regForm.qualification,
      hospital: regForm.hospital,
      experience: 'Verified',
      phone: regForm.mobile || '+91 94432 10987',
      email: regForm.email || `${regForm.name.toLowerCase().replace(/\s+/g, '')}@vetgov.in`,
      vciNumber: regForm.vciNumber
    });

    setShowRegistrationModal(false);
    setActiveRole('doctor');
    setActiveTab('doctor-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Header Navigation */}
      <header className="sticky top-0 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="text-3xl" />
        </div>

<<<<<<< HEAD
        <div className="flex items-center gap-3">
=======
        <div className="flex items-center gap-4">
          <LanguageDropdown />
>>>>>>> a03f2ad (Add full multi-language support with 5 languages, updated dictionaries, components, and UI)
          <button
            onClick={() => openLoginModal('doctor')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl hover:bg-teal-100 transition-all cursor-pointer"
          >
            <Stethoscope size={15} />
            <span>{t('Veterinary Doctor Portal', 'கால்நடை மருத்துவர் தளம்', 'पशु चिकित्सक पोर्टल')}</span>
          </button>

          <button
            onClick={() => openLoginModal('farmer')}
            className="px-6 py-2.5 text-sm font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {t('Sign in', 'உள்நுழை', 'साइन इन')}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-14 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-6 animate-in fade-in">
          <Sparkles size={14} />
          <span>{t('IoT Livestock Collar & Vet Tele-Care Platform', 'IoT ஸ்மார்ட் காலர் & கால்நடை மருத்துவ தளம்', 'IoT स्मार्ट कॉलर और पशु चिकित्सा टेली-केयर प्लेटफॉर्म')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
          {t('Real-Time Health Monitoring for', 'கால்நடைகளின் ஆரோக்கியத்தை', 'वास्तविक समय स्वास्थ्य निगरानी')} <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
            {t('Your Livestock & Herd', 'உங்கள் மாடுகளுக்கு', 'आपके पशुधन के लिए')}
          </span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed mx-auto">
          {t(
            'BioSense Collar integrates ESP32 microcontrollers, high-accuracy vital sensors, and GPS tracking to monitor body vitals, map grazing zones, and connect dairy farmers with government veterinary doctors in real-time.',
            'பயோசென்ஸ் காலர் என்பது ESP32 மைக்ரோகண்ட்ரோலர்கள் மற்றும் மிகத்துல்லியமான சுகாதார சென்சார்கள் மூலம் உங்கள் மாடுகளின் இதயத்துடிப்பு, வெப்பநிலை மற்றும் இருப்பிடத்தைக் கண்காணித்து, அவசர தேவைகளில் மருத்துவர்களுடன் இணைக்கும் ஒரு நவீன IoT தொழில்நுட்பமாகும்.',
            'बायोसेन्स कॉलर एक स्मार्ट कॉलर प्रणाली है जो पशुओं के स्वास्थ्य की निगरानी करता है, जीपीएस मार्ग का पता लगाता है, चरने वाले क्षेत्रों को जियोफेंस करता है, और वास्तविक समय में किसानों को पशु चिकित्सकों से जोड़ता है।'
          )}
        </p>

        {/* Portals Action Buttons */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center items-center">
          <button
            onClick={() => openLoginModal('farmer')}
            className="px-8 py-4 text-sm md:text-base font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>🌾 {t('Enter Farmer Console', 'விவசாயி கட்டுப்பாட்டு அறை', 'किसान कंसोल')}</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => openLoginModal('doctor')}
            className="px-8 py-4 text-sm md:text-base font-extrabold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Stethoscope size={18} className="text-teal-500" />
            <span>{t('Veterinarian Doctor Login', 'கால்நடை மருத்துவர் உள்நுழைவு', 'पशु चिकित्सक लॉगिन')}</span>
          </button>
        </div>

        {/* Feature Highlights Pill Row */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-2xl">⚡</span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mt-2">{t('Live Telemetry', 'நேரடி அளவீடு', 'लाइव टेलीमेट्री')}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('Heart Rate & Temp streaming', 'இதயம் மற்றும் வெப்பநிலை', 'हृदय गति और तापमान')}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-2xl">📍</span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mt-2">{t('GPS Geofence', 'பாதுகாப்பு எல்லை', 'जीपीएस जियोफेंस')}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('Grazing perimeter alerts', 'எல்லை கடந்தால் எச்சரிக்கை', 'चराई सीमा अलर्ट')}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-2xl">💉</span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mt-2">{t('Vaccine Ledger', 'தடுப்பூசி பதிவேடு', 'टीकाकरण खाता')}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('Immunization schedule', 'தடுப்பூசி அட்டவணை', 'प्रतिरक्षण अनुसूची')}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-2xl">🤖</span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mt-2">{t('Gemini AI Bot', 'Gemini AI உதவியாளர்', 'जेमिनी एआई बॉट')}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('Voice-to-text vet advice', 'குரல் உள்ளீட்டு ஆலோசனை', 'वॉइस-टू-टेक्स्ट सलाह')}</p>
          </div>
        </div>
      </section>

      {/* ── MAIN LOGIN MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          
          <div className="w-full max-w-xl flex flex-col items-center my-auto">
            
            {/* Top Role Selector Tabs */}
            <div className="flex gap-2 mb-4 p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 z-10 w-fit">
              <button
                onClick={() => handleTabSwitch('farmer')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${
                  activeLoginTab === 'farmer' 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🌾</span>
                <span>{t('Farmer Portal', 'விவசாயி', 'किसान')}</span>
              </button>

              <button
                onClick={() => handleTabSwitch('doctor')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${
                  activeLoginTab === 'doctor' 
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Stethoscope size={16} />
                <span>{t('Veterinarian Portal', 'கால்நடை மருத்துவர்', 'पशु चिकित्सक')}</span>
              </button>
            </div>

            {/* Main Modal Card */}
            <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-300 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 ${
                  activeLoginTab === 'farmer' ? 'bg-emerald-600' : 'bg-gradient-to-tr from-teal-600 to-cyan-600'
                }`}>
                  {activeLoginTab === 'farmer' ? <Key size={22} className="rotate-45" /> : <Stethoscope size={22} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-white font-display">
                      {activeLoginTab === 'farmer' 
                        ? t('Farmer Account Login', 'விவசாயி உள்நுழைவு', 'किसान साइन इन') 
                        : t('Veterinarian Officer Sign In', 'கால்நடை மருத்துவ அதிகாரி உள்நுழைவு', 'पशु चिकित्सा अधिकारी साइन इन')}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeLoginTab === 'farmer'
                      ? t('Access your herd telemetry, collars, and health files.', 'உங்கள் மாடுகளின் விவரங்களை அணுகவும்.')
                      : t('Official portal for licensed veterinarians (VCI Verified).', 'அரசு உரிமம் பெற்ற கால்நடை மருத்துவர்களுக்கான தளம்.')}
                  </p>
                </div>
              </div>

              {/* Messages */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ─── VETERINARIAN-SPECIFIC LOGIN VIEW ─── */}
              {activeLoginTab === 'doctor' && (
                <div className="space-y-5">
                  
                  {/* Quick 1-Click Vet Demo Selection Banner */}
                  <div className="p-3.5 bg-teal-50/70 dark:bg-teal-950/30 rounded-2xl border border-teal-100 dark:border-teal-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-1">
                        <Sparkles size={12} className="text-amber-500" />
                        {t('Instant 1-Click Vet Login (Demo Profiles)', 'உடனடி மருத்துவர் உள்நுழைவு (டெமோ)', 'त्वरित 1-क्लिक पशु चिकित्सक लॉगिन')}
                      </span>
                      <span className="text-[9px] text-teal-600 dark:text-teal-400 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                        VCI Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {vetPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickVetLogin(preset)}
                          className="p-2.5 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-all group hover:scale-[1.02] shadow-2xs cursor-pointer"
                        >
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 truncate">
                            {preset.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{preset.role}</p>
                          <span className="text-[9px] font-extrabold text-teal-600 dark:text-teal-400 mt-1 block">
                            Login as Vet →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auth Method Toggle for Doctor: Password vs Mobile OTP */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setAuthMethod('credentials')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        authMethod === 'credentials'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t('VCI License / Password', 'VCI உரிமம் / கடவுச்சொல்', 'VCI लाइसेंस / पासवर्ड')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('otp')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        authMethod === 'otp'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Smartphone size={12} />
                      {t('Mobile OTP Login', 'மொபைல் OTP', 'मोबाइल ओटीपी')}
                    </button>
                  </div>

                  {/* Form fields for Doctor */}
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    
                    {authMethod === 'credentials' ? (
                      <>
                        {/* VCI License / Registration Number */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            {t('VCI / State Council Registration No.', 'VCI / மாநில கவுன்சில் பதிவு எண்', 'VCI / राज्य परिषद पंजीकरण सं.')} *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={vetId}
                              onChange={(e) => setVetId(e.target.value)}
                              placeholder="e.g. VCI-TN-2024-8842 or official email"
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs font-bold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                              Verified ✓
                            </span>
                          </div>
                        </div>

                        {/* Assigned Hospital / Zone */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            {t('Assigned Government Veterinary Centre', 'ஒதுக்கப்பட்ட கால்நடை மருத்துவமனை', 'आवंटित सरकारी पशु चिकित्सा केंद्र')}
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select
                              value={vetHospital}
                              onChange={(e) => setVetHospital(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-teal-500 text-xs font-bold"
                            >
                              <option value="Madurai East Government Veterinary Hospital">Madurai East Government Veterinary Hospital</option>
                              <option value="Mobile Veterinary Clinic Unit #3 - Annur Zone">Mobile Veterinary Clinic Unit #3 - Annur Zone</option>
                              <option value="Coimbatore Central Animal Health Poly-clinic">Coimbatore Central Animal Health Poly-clinic</option>
                              <option value="Tamil Nadu Animal Husbandry District Headquarters">Tamil Nadu Animal Husbandry District Headquarters</option>
                            </select>
                          </div>
                        </div>

                        {/* Password Field with Show/Hide */}
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              {t('Account Password / Security PIN', 'கடவுச்சொல் / பின்', 'पासवर्ड / सुरक्षा पिन')} *
                            </label>
                            <a href="#forgot" className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline">
                              {t('Forgot PIN?', 'மறந்துவிட்டதா?', 'भूल गए?')}
                            </a>
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={vetPass}
                              onChange={(e) => setVetPass(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs font-black tracking-widest"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Mobile OTP Authentication Mode */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            {t('Registered Doctor Mobile Number', 'பதிவு செய்யப்பட்ட மொபைல் எண்', 'पंजीकृत मोबाइल नंबर')} *
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-teal-500 text-xs font-bold"
                            />
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs shrink-0"
                            >
                              {otpSent ? t('Resend OTP', 'மீண்டும் அனுப்பு', 'पुनः भेजें') : t('Send OTP', 'OTP அனுப்பு', 'ओटीपी भेजें')}
                            </button>
                          </div>
                        </div>

                        {otpSent && (
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              {t('Enter 4-Digit OTP Code', '4 இலக்க OTP குறியீட்டை உள்ளிடவும்', '4-अंकीय कोड दर्ज करें')} *
                            </label>
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="e.g. 7429"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-teal-500 text-center text-lg font-black tracking-widest"
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Submit Button & Vet Portal Entry */}
                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="w-1/3 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        {t('Cancel', 'ரத்து', 'रद्द करें')}
                      </button>
                      
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-extrabold rounded-xl text-xs hover:from-teal-500 hover:to-cyan-500 shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Stethoscope size={16} />
                        <span>{t('Sign in to Vet Console', 'மருத்துவர் தளத்தில் உள்நுழை', 'पशु चिकित्सक कंसोल में साइन इन करें')}</span>
                      </button>
                    </div>

                    {/* Doctor Account Registration Link */}
                    <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>{t('New government or private vet?', 'புதிய கால்நடை மருத்துவரா?', 'नए पशु चिकित्सक?')}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setShowRegistrationModal(true);
                        }}
                        className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        {t('Apply for VCI Access →', 'VCI அணுகலுக்கு விண்ணப்பிக்கவும் →', 'VCI पहुंच के लिए आवेदन करें →')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ─── FARMER LOGIN VIEW ─── */}
              {activeLoginTab === 'farmer' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      {t('Farmer ID / Mobile Number', 'பயனர் ஐடி / மொபைல் எண்', 'किसान आईडी / मोबाइल नंबर')}
                    </label>
                    <input
                      type="text"
                      value={farmerId}
                      onChange={(e) => setFarmerId(e.target.value)}
                      placeholder="e.g. FARM-101"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {t('Password', 'கடவுச்சொல்', 'पासवर्ड')}
                      </label>
                      <a href="#forgot" className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline">
                        {t('Forgot?', 'மறந்துவிட்டதா?', 'भूल गए?')}
                      </a>
                    </div>
                    <input
                      type="password"
                      value={farmerPass}
                      onChange={(e) => setFarmerPass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-xs font-black tracking-widest"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="w-1/3 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200"
                    >
                      {t('Cancel', 'ரத்து', 'रद्द करें')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      {t('Sign in to Farm Console', 'விவசாயி தளத்தில் உள்நுழை', 'साइन इन करें')}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ── DOCTOR REGISTRATION APPLICATION MODAL ── */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display">
                    {t('Apply for Veterinarian Access', 'கால்நடை மருத்துவர் பதிவு', 'पशु चिकित्सक पहुंच के लिए आवेदन करें')}
                  </h3>
                  <p className="text-xs text-slate-400">{t('Submit VCI / State Board credentials for verification.', 'VCI சான்றிதழைச் சமர்ப்பிக்கவும்.')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                    {t('Doctor Full Name', 'மருத்துவர் பெயர்', 'पूरा नाम')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Kumar"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                    {t('VCI Council Reg. Number', 'VCI பதிவு எண்', 'VCI पंजीकरण सं.')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VCI-TN-2024-9988"
                    value={regForm.vciNumber}
                    onChange={(e) => setRegForm({ ...regForm, vciNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                    {t('Qualification Degree', 'கல்வி தகுதி', 'योग्यता')}
                  </label>
                  <select
                    value={regForm.qualification}
                    onChange={(e) => setRegForm({ ...regForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <option value="M.V.Sc (Animal Husbandry)">M.V.Sc (Animal Husbandry)</option>
                    <option value="B.V.Sc & A.H">B.V.Sc & A.H</option>
                    <option value="M.V.Sc (Veterinary Surgery)">M.V.Sc (Veterinary Surgery)</option>
                    <option value="M.V.Sc (Veterinary Medicine)">M.V.Sc (Veterinary Medicine)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                    {t('Official Mobile', 'மொபைல் எண்', 'मोबाइल')}
                  </label>
                  <input
                    type="text"
                    placeholder="+91 94432 10987"
                    value={regForm.mobile}
                    onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  {t('Assigned Government Hospital / Clinic', 'மருத்துவமனை / மையம்', 'अस्पताल / क्लिनिक')}
                </label>
                <input
                  type="text"
                  value={regForm.hospital}
                  onChange={(e) => setRegForm({ ...regForm, hospital: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  {t('VCI License / Identity Card Document', 'VCI உரிம ஆவணம்', 'VCI लाइसेंस दस्तावेज़')}
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center cursor-pointer hover:border-teal-500 transition-colors">
                  <Upload size={20} className="mx-auto text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-500 font-semibold">{t('Click to upload VCI Certificate PDF / JPG', 'VCI சான்றிதழைப் பதிவேற்றவும்')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs"
                >
                  {t('Cancel', 'ரத்து', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold text-xs shadow-md"
                >
                  {t('Submit & Instant Activate', 'சமர்ப்பித்து இயக்கவும்', 'सत्यापित करें और सक्रिय करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
