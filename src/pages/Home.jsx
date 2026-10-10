import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContext } from '../context/AppContext';
import { 
  Shield, 
  Key, 
  ArrowRight, 
  Stethoscope, 
  Building2, 
  CheckCircle2, 
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
  AlertCircle,
  Activity,
  Heart,
  Thermometer,
  MapPin,
  Radio,
  Sun,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowUpRight,
  ChevronRight,
  Wifi,
  BatteryCharging,
  Compass,
  Check,
  Clock,
  PhoneCall
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

  // Active Interactive Sensor Callout State
  const [selectedSensor, setSelectedSensor] = useState(0);

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
    setOtpCode('7429');
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

  // Hardware Sensor Features for Interactive Product Showcase
  const collarSensors = [
    {
      id: 0,
      title: 'Monocrystalline Solar Harvester',
      subtitle: 'Continuous Daylight Recharging',
      badge: 'Autonomous Energy',
      icon: Sun,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      description: 'Integrated top-strap photovoltaic module converts diffuse field sunlight into steady trickle power, delivering uninterrupted multi-season battery life without manual collar removal.',
      metric: '3.7V • Continuous Trickle',
      pinPosition: { top: '24%', left: '54%' }
    },
    {
      id: 1,
      title: 'Sub-Dermal Optical PPG Pulse Sensor',
      subtitle: 'Resting & Ruminating Heart Rate',
      badge: 'Cardio-Vascular Vitals',
      icon: Heart,
      color: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
      description: 'Precision multi-wavelength photoplethysmography measures capillary pulse waves through neck tissue, detecting early cardiac strain, pain responses, and physical fatigue.',
      metric: '60–84 BPM Baseline',
      pinPosition: { top: '68%', left: '62%' }
    },
    {
      id: 2,
      title: 'DS18B20 Digital Temperature Probe',
      subtitle: '±0.1°C Precision Core Thermal Node',
      badge: 'Thermal Vigilance',
      icon: Thermometer,
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      description: 'High-resolution thermistor calibrated specifically for ruminant physiology detects subclinical mastitis fever spikes and estrus heat cycles up to 48 hours prior to visible clinical signs.',
      metric: '38.5°C – 39.2°C Range',
      pinPosition: { top: '76%', left: '59%' }
    },
    {
      id: 3,
      title: 'NEO-6M GPS & LoRaWAN/4G Transceiver',
      subtitle: 'Sub-5 Meter Satellite Geofencing',
      badge: 'Spatial Telemetry',
      icon: MapPin,
      color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      description: 'Multi-constellation GPS chipset paired with long-range cellular & LoRa transceivers streams pasture coordinates, grazing radius metrics, and instant breach alerts to the farmer portal.',
      metric: '5-Second Broadcast Interval',
      pinPosition: { top: '70%', left: '68%' }
    },
    {
      id: 4,
      title: 'IP67 Hermetic Ruggedized Casing',
      subtitle: 'All-Weather Agricultural Durability',
      badge: 'Field Engineering',
      icon: ShieldCheck,
      color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30',
      description: 'Ultrasonically welded, UV-stabilized polymer housing resists mud immersion, torrential monsoons, herd rubbing against trees, and extreme pasture temperature swings.',
      metric: 'IP67 Waterproof & Dust-tight',
      pinPosition: { top: '78%', left: '61%' }
    }
  ];

  // Data Journey Flow
  const dataJourneySteps = [
    {
      step: '01',
      title: 'Physiological Sensing',
      subtitle: 'On-Collar Node',
      icon: Cpu,
      description: 'Photovoltaic collar captures PPG pulse wave, skin temperature, and satellite coordinates every 5 seconds.'
    },
    {
      step: '02',
      title: 'Encrypted Telemetry Uplink',
      subtitle: '4G LTE & LoRa Gateway',
      icon: Radio,
      description: 'Data packets are packed and encrypted across farm-wide LoRaWAN gateways or cellular networks with failover.'
    },
    {
      step: '03',
      title: 'BioSense Intelligence Engine',
      subtitle: 'Cloud Anomaly Triage',
      icon: Layers,
      description: 'Automated algorithms cross-reference baseline cattle vitals, detecting fever, estrus spikes, and geofence breaches.'
    },
    {
      step: '04',
      title: 'Actionable Tele-Care Delivery',
      subtitle: 'Farmer & Vet Collaboration',
      icon: Stethoscope,
      description: 'Instant notification dispatched to the farmer app and connected veterinary officer with digital prescription access.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F0] dark:bg-[#0A1612] text-[#20312A] dark:text-[#E2EBE6] flex flex-col font-sans transition-colors duration-300 selection:bg-[#4B8A64] selection:text-white">
      
      {/* ── TOP EDITORIAL ANNOUNCEMENT BAR ── */}
      <div className="bg-[#103B2D] text-[#DDEADF] text-[11px] font-semibold px-4 py-2 border-b border-[#174D38] flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#174D38] text-white text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Pilot Live
            </span>
            <span className="hidden sm:inline text-xs text-[#DDEADF]">
              Deploying across Tamil Nadu & Indian Dairy Cooperatives • VCI Accredited Veterinary Network
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline-flex items-center gap-1 text-[#EEF5F0]/80">
              <PhoneCall size={12} className="text-emerald-400" />
              24/7 Cattle Helpline: 1800-425-VET
            </span>
            <div className="h-3 w-px bg-[#174D38] hidden sm:block" />
            <LanguageDropdown variant="default" />
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION BAR ── */}
      <header className="sticky top-0 bg-[#F7F6F0]/90 dark:bg-[#0A1612]/90 backdrop-blur-md border-b border-[#DDEADF]/60 dark:border-[#174D38]/40 z-40 px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <Logo className="text-2xl md:text-3xl" showTagline={true} />
          </div>

          {/* Quick Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-widest text-[#5A7065] dark:text-[#9FB5AA]">
            <a href="#collar-story" className="hover:text-[#174D38] dark:hover:text-emerald-300 transition-colors">Smart Hardware</a>
            <a href="#how-it-works" className="hover:text-[#174D38] dark:hover:text-emerald-300 transition-colors">Telemetry Engine</a>
            <a href="#gir-herd" className="hover:text-[#174D38] dark:hover:text-emerald-300 transition-colors">Herd Wellness</a>
            <a href="#vet-network" className="hover:text-[#174D38] dark:hover:text-emerald-300 transition-colors">Veterinary Tele-Care</a>
          </nav>

          {/* Portal Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openLoginModal('doctor')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#103B2D] dark:text-emerald-300 bg-white dark:bg-[#103B2D]/80 border border-[#DDEADF] dark:border-[#174D38] rounded-xl hover:bg-[#EEF5F0] dark:hover:bg-[#174D38] transition-all cursor-pointer shadow-xs"
            >
              <Stethoscope size={15} className="text-[#4B8A64] dark:text-emerald-400" />
              <span>{t('Veterinarian Portal', 'கால்நடை மருத்துவர்', 'पशु चिकित्सक')}</span>
            </button>

            <button
              onClick={() => openLoginModal('farmer')}
              className="px-5 py-2.5 text-xs md:text-sm font-bold bg-[#174D38] hover:bg-[#103B2D] text-white rounded-xl shadow-md shadow-[#174D38]/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{t('Sign In', 'உள்நுழை', 'साइन इन')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION — THE CINEMATIC PRODUCT LAUNCH
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#103B2D] text-white pt-12 pb-20 md:pt-16 md:pb-28">
        
        {/* Ambient Botanical Gradients & Textured Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#174D38_0%,#103B2D_60%,#0A241B_100%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#4B8A64]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Portals */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-200 text-xs font-semibold">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Next-Generation Cattle Telemetry & Clinical Tele-Care</span>
            </div>

            {/* Main Punchy Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white leading-[1.08]">
              Better Livestock Care Starts With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-[#DDEADF]">
                Knowing.
              </span>
            </h1>

            {/* Concise Supporting Copy */}
            <p className="text-base sm:text-lg text-[#DDEADF]/90 max-w-2xl font-normal leading-relaxed">
              {t(
                'Monitor animal health, track grazing locations, manage vaccinations, and connect with veterinary professionals through one intelligent platform.',
                'மாடுகளின் இதயத்துடிப்பு, உடல் வெப்பநிலையைக் கண்காணித்து, மேய்ச்சல் எல்லையைக் குறித்து, கால்நடை மருத்துவர்களுடன் நேரடியாக இணைக்கும் அதிநவீன பயோசென்ஸ் காலர்.',
                'पशु स्वास्थ्य की निगरानी करें, चरने के स्थान ट्रैक करें, टीकाकरण प्रबंधित करें और एक ही मंच के माध्यम से पशु चिकित्सकों से जुड़ें।'
              )}
            </p>

            {/* Primary Action Portals */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => openLoginModal('farmer')}
                className="px-8 py-4 text-sm md:text-base font-extrabold bg-[#4B8A64] hover:bg-emerald-600 text-white rounded-2xl shadow-xl shadow-black/30 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>🌾 {t('Explore Farmer Portal', 'விவசாயி கட்டுப்பாட்டு அறை', 'किसान पोर्टल')}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => openLoginModal('doctor')}
                className="px-7 py-4 text-sm md:text-base font-extrabold bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Stethoscope size={18} className="text-emerald-300" />
                <span>{t('Veterinarian Portal', 'கால்நடை மருத்துவர் தளம்', 'पशु चिकित्सक पोर्टल')}</span>
              </button>
            </div>

            {/* Micro Live Stats Strip */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/10 max-w-lg">
              <div>
                <p className="text-2xl font-black font-display text-white">99.4%</p>
                <p className="text-[11px] text-[#DDEADF]/70 font-medium">Fever Pre-Detection</p>
              </div>
              <div>
                <p className="text-2xl font-black font-display text-white">&lt; 5s</p>
                <p className="text-[11px] text-[#DDEADF]/70 font-medium">Sensor Sync Latency</p>
              </div>
              <div>
                <p className="text-2xl font-black font-display text-white">100%</p>
                <p className="text-[11px] text-[#DDEADF]/70 font-medium">Solar Self-Powered</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Real Photography Showcase with Interactive Sensor Chips */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            {/* The Main High-Resolution Photo Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/15 bg-[#0A241B] group">
              <img 
                src="/images/collar-cow-hero.jpg" 
                alt="Brown dairy cow actively grazing wearing the BioSense smart solar collar" 
                className="w-full h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Natural Photographic Vignette & Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A241B]/90 via-[#0A241B]/20 to-transparent pointer-events-none" />

              {/* Floating Live Telemetry Badge on Photo */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl px-3.5 py-2 text-white flex items-center gap-2.5 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <div className="text-left leading-tight">
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Live Collar Telemetry</p>
                  <p className="text-xs font-extrabold font-mono">Tag #102 • Ganga (Jersey)</p>
                </div>
              </div>

              {/* Solar Battery Indicator */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-1.5 text-white flex items-center gap-1.5 text-xs font-bold font-mono">
                <BatteryCharging size={14} className="text-amber-400" />
                <span>Solar 98%</span>
              </div>

              {/* Photovoltaic Collar Callout Overlay at Bottom of Card */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/95 dark:bg-[#103B2D]/95 backdrop-blur-md border border-white/30 text-[#20312A] dark:text-white shadow-xl">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 font-black text-[#174D38] dark:text-emerald-300 uppercase tracking-wider text-[11px]">
                    <Activity size={14} className="text-rose-500 animate-pulse" />
                    <span>Real-Time Biometric Stream</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    Normal
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-200/60 dark:border-white/10">
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-black/30">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Heart Rate</p>
                    <p className="text-sm font-black font-mono text-rose-600 dark:text-rose-400">72 BPM</p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-black/30">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Temperature</p>
                    <p className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">38.6°C</p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-black/30">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">GPS Signal</p>
                    <p className="text-sm font-black font-mono text-cyan-600 dark:text-cyan-400">Locked ⚡</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Hardware Annotation Callout */}
            <div className="mt-4 flex items-center justify-between px-2 text-xs text-[#DDEADF]/80">
              <span className="flex items-center gap-1.5">
                <Sun size={13} className="text-amber-400" />
                Actual hardware prototype in field grazing test
              </span>
              <span className="font-mono text-[11px] text-emerald-300">Firmware v2.4.1</span>
            </div>
          </motion.div>

        </div>

        {/* ── PRODUCT CAPABILITY STRIP ── */}
        <div className="mt-14 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
            
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                <Heart size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Health Monitoring</h4>
                <p className="text-[11px] text-[#DDEADF]/70">PPG pulse & core temperature</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                <Compass size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">GPS Tracking</h4>
                <p className="text-[11px] text-[#DDEADF]/70">Pasture geofencing & alerts</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Vaccination Passports</h4>
                <p className="text-[11px] text-[#DDEADF]/70">Automated booster schedules</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Stethoscope size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Veterinary Support</h4>
                <p className="text-[11px] text-[#DDEADF]/70">VCI verified doctor tele-consults</p>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          PRODUCT STORYTELLING SECTION — SENSORS & HARDWARE ARCHITECTURE
          ───────────────────────────────────────────────────────────── */}
      <section id="collar-story" className="py-20 md:py-28 px-6 max-w-7xl mx-auto w-full">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDEADF] dark:bg-[#174D38]/50 text-[#174D38] dark:text-emerald-300 text-xs font-extrabold uppercase tracking-widest">
            <Cpu size={14} />
            Hardware Architecture
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-display text-[#103B2D] dark:text-white tracking-tight">
            Engineered For The Farm. <br className="hidden sm:inline" />Calibrated For The Cow.
          </h2>
          <p className="text-base text-[#5A7065] dark:text-[#9FB5AA] leading-relaxed">
            Every millimeter of the BioSense smart collar is designed to endure grueling dairy farm conditions while providing non-invasive physiological precision.
          </p>
        </div>

        {/* Interactive Sensor Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Interactive Hardware Hotspots on Real Photo */}
          <div className="lg:col-span-7 bg-white dark:bg-[#103B2D] p-6 rounded-3xl border border-[#DDEADF] dark:border-[#174D38] shadow-xl relative overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img 
                src="/images/collar-cow-hero.jpg" 
                alt="Detailed BioSense Smart Collar hardware on cow neck" 
                className="w-full h-[480px] object-cover object-center"
              />

              {/* Dynamic Interactive Hotspot Pins */}
              {collarSensors.map((sensor) => {
                const isSelected = selectedSensor === sensor.id;
                return (
                  <button
                    key={sensor.id}
                    onClick={() => setSelectedSensor(sensor.id)}
                    style={{ top: sensor.pinPosition.top, left: sensor.pinPosition.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all cursor-pointer z-20 ${
                      isSelected 
                        ? 'bg-[#174D38] text-white ring-4 ring-emerald-400 scale-125 shadow-2xl' 
                        : 'bg-white/90 text-[#174D38] hover:scale-110 shadow-lg'
                    }`}
                    title={sensor.title}
                  >
                    <sensor.icon size={16} />
                  </button>
                );
              })}

              {/* Bottom Sensor Overlay Strip */}
              <div className="absolute bottom-4 inset-x-4 bg-black/75 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {collarSensors[selectedSensor].badge}
                  </span>
                  <h4 className="text-sm font-extrabold">{collarSensors[selectedSensor].title}</h4>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white/10 text-[#DDEADF]">
                  {collarSensors[selectedSensor].metric}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400 text-center">
              Click any circular sensor marker above to inspect its real operational role in the livestock collar.
            </p>
          </div>

          {/* Right: Sensor Feature Selector Cards */}
          <div className="lg:col-span-5 space-y-3">
            {collarSensors.map((sensor) => {
              const isSelected = selectedSensor === sensor.id;
              const Icon = sensor.icon;
              return (
                <div
                  key={sensor.id}
                  onClick={() => setSelectedSensor(sensor.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected 
                      ? 'bg-white dark:bg-[#174D38] border-[#174D38] dark:border-emerald-400 shadow-lg translate-x-1' 
                      : 'bg-white/60 dark:bg-[#103B2D]/60 hover:bg-white dark:hover:bg-[#103B2D] border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${sensor.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-[#103B2D] dark:text-white truncate">
                          {sensor.title}
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-[#4B8A64] dark:text-emerald-400">
                          {sensor.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA] mt-1 line-clamp-2">
                        {sensor.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── THE DATA JOURNEY BREAKDOWN ── */}
        <div id="how-it-works" className="mt-24 pt-16 border-t border-[#DDEADF] dark:border-[#174D38]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4B8A64] dark:text-emerald-400 block mb-2">
              Continuous Telemetry Pipeline
            </span>
            <h3 className="text-2xl md:text-3xl font-black font-display text-[#103B2D] dark:text-white">
              From Grazing Pasture To Clinical Prescription
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataJourneySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-[#103B2D] p-6 rounded-3xl border border-[#DDEADF] dark:border-[#174D38] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black font-display text-[#DDEADF] dark:text-[#174D38]">
                        {step.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#EEF5F0] dark:bg-[#174D38] text-[#174D38] dark:text-emerald-300 flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                    </div>
                    <h4 className="text-base font-extrabold text-[#103B2D] dark:text-white font-display">
                      {step.title}
                    </h4>
                    <p className="text-[11px] font-bold uppercase text-[#4B8A64] dark:text-emerald-400 mt-0.5">
                      {step.subtitle}
                    </p>
                    <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA] mt-3 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-[#174D38] dark:text-emerald-400">
                    <span>Verified Protocol</span>
                    <Check size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          EDITORIAL HERD WELLNESS SECTION (INDIAN GIR CATTLE PHOTO)
          ───────────────────────────────────────────────────────────── */}
      <section id="gir-herd" className="py-20 bg-white dark:bg-[#0A1612] border-y border-[#DDEADF] dark:border-[#174D38] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Indian Gir Cattle Herd Photography Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#EEF5F0] dark:border-[#103B2D]">
              <img 
                src="/images/gir-cattle-herd.jpg" 
                alt="Indigenous Indian Gir cattle herd with curved horns grazing in open green pasture" 
                className="w-full h-[450px] object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

              {/* Floating Breed & Heritage Badge */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-[#174D38] text-white tracking-widest inline-block mb-1.5">
                  Desi Cattle Breed Specialist
                </span>
                <h4 className="text-xl font-black font-display">Gir, Sahiwal, Kangayam & Red Sindhi</h4>
                <p className="text-xs text-[#DDEADF] mt-1">
                  Tailored biometric models calibrated for indigenous Indian dairy breeds and tropical heat tolerance.
                </p>
              </div>
            </div>

            {/* Floating Stat Chip */}
            <div className="absolute -bottom-6 -right-4 hidden sm:flex bg-[#103B2D] text-white p-4 rounded-2xl shadow-xl border border-white/20 items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
                36h
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#DDEADF]/70">Early Heat Detection</p>
                <p className="text-xs font-black">Optimal Insemination Window</p>
              </div>
            </div>
          </div>

          {/* Right: Farm Herd Wellness Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF5F0] dark:bg-[#174D38]/40 text-[#174D38] dark:text-emerald-300 text-xs font-extrabold uppercase tracking-widest">
              Herd Grazing & Health
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#103B2D] dark:text-white tracking-tight leading-tight">
              Peace of Mind For Every Grazing Animal On Your Land.
            </h2>

            <p className="text-base text-[#5A7065] dark:text-[#9FB5AA] leading-relaxed">
              Managing a herd shouldn't rely on guesswork or late-night pasture checks. BioSense gives dairy farmers a complete operational picture of animal nutrition, rumination duration, and vital recovery after calving.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF5F0] dark:bg-[#103B2D] text-[#174D38] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#103B2D] dark:text-white">Smart Pasture Geofencing</h4>
                  <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA]">
                    Define virtual grazing boundaries on satellite maps. Receive instant SMS & push alerts if an animal strays into railway or forested perimeters.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF5F0] dark:bg-[#103B2D] text-[#174D38] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#103B2D] dark:text-white">Digital Vaccination Passports</h4>
                  <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA]">
                    Never miss Foot-and-Mouth Disease (FMD), Blackleg, or Brucellosis boosters. Automatically synced with state veterinary immunization drives.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF5F0] dark:bg-[#103B2D] text-[#174D38] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#103B2D] dark:text-white">Multilingual Voice Support</h4>
                  <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA]">
                    Built for Indian farmers with full interactive guidance in Tamil, Hindi, Kannada, Malayalam, and English.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => openLoginModal('farmer')}
                className="px-6 py-3.5 text-xs font-black bg-[#174D38] hover:bg-[#103B2D] text-white rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Herd Dashboard</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          VETERINARY CLINICAL TELE-CARE SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="vet-network" className="py-20 md:py-28 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Professional Clinical Description */}
          <div className="lg:col-span-6 space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDEADF] dark:bg-[#174D38]/40 text-[#174D38] dark:text-emerald-300 text-xs font-extrabold uppercase tracking-widest">
              <Stethoscope size={14} />
              Veterinary Tele-Care Infrastructure
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#103B2D] dark:text-white tracking-tight leading-tight">
              Certified Veterinarians Connected In Real-Time.
            </h2>

            <p className="text-base text-[#5A7065] dark:text-[#9FB5AA] leading-relaxed">
              When a cow's temperature rises or resting heart rate drops, the system doesn't generate noisy panic. It equips licensed VCI veterinary officers with authenticated clinical history, dosage charts, and emergency response tools.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#103B2D] border border-[#DDEADF] dark:border-[#174D38] shadow-xs">
                <h4 className="text-xs font-black uppercase text-[#174D38] dark:text-emerald-400">VCI Accreditation</h4>
                <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA] mt-1">
                  Only verified veterinary surgeons with state council registration numbers can issue digital prescriptions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#103B2D] border border-[#DDEADF] dark:border-[#174D38] shadow-xs">
                <h4 className="text-xs font-black uppercase text-[#174D38] dark:text-emerald-400">Instant Tele-Consult</h4>
                <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA] mt-1">
                  Connect via voice, video, or CattleCare AI diagnostic photos directly to the nearest government dispensary.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => openLoginModal('doctor')}
                className="px-6 py-3.5 text-xs font-black bg-[#103B2D] hover:bg-[#174D38] text-white rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Stethoscope size={15} className="text-emerald-300" />
                <span>Enter Veterinarian Portal</span>
              </button>

              <button
                onClick={() => setShowRegistrationModal(true)}
                className="text-xs font-bold text-[#174D38] dark:text-emerald-300 hover:underline cursor-pointer"
              >
                Apply for Doctor Access →
              </button>
            </div>
          </div>

          {/* Right: Real Photography of Vet Examination */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#103B2D]">
              <img 
                src="/images/vet-exam.jpg" 
                alt="Licensed veterinary doctor examining cattle vitals on pasture farm" 
                className="w-full h-[450px] object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Prescription Badge */}
              <div className="absolute bottom-5 left-5 right-5 text-white bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold">
                    Official Telemedicine Node
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                    VCI Verified
                  </span>
                </div>
                <h4 className="text-sm font-black">Madurai East Government Veterinary Hospital</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Dr. Rajesh Kannan, M.V.Sc • 24/7 Remote Advisory & Farm Visit Dispatch
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FARMER REAL TESTIMONIAL & EMPOWERMENT
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#EEF5F0] dark:bg-[#0A241B] border-t border-[#DDEADF] dark:border-[#174D38] px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#174D38] text-white flex items-center justify-center mx-auto text-2xl shadow-lg">
            🌾
          </div>
          <blockquote className="text-xl sm:text-2xl font-bold font-display text-[#103B2D] dark:text-[#EEF5F0] leading-snug">
            “When Ganga showed early temperature elevation at 2:00 AM, the BioSense collar triggered an alert before she even showed physical sluggishness. Dr. Rajesh confirmed mild heat stress and advised cooling within an hour. It saved her lactation yield.”
          </blockquote>
          <div>
            <p className="text-sm font-black text-[#174D38] dark:text-emerald-400">Uma Chandrasekaran</p>
            <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA]">Green Valley Dairy Farm, Tamil Nadu • 24 Dairy Cows</p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER — CLEAN AGRITECH EDITORIAL
          ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#103B2D] text-[#DDEADF] pt-14 pb-10 border-t border-[#174D38] px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#174D38]">
          <div className="space-y-3">
            <Logo className="text-2xl" variant="light" showTagline={true} />
            <p className="text-xs text-[#DDEADF]/80 leading-relaxed pt-2">
              Next-generation IoT livestock wearable platform combining real-time vital telemetry, pasture satellite geofencing, and verified veterinary tele-care.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => openLoginModal('farmer')} className="hover:text-emerald-300 transition-colors">
                  Farmer Herd Console
                </button>
              </li>
              <li>
                <button onClick={() => openLoginModal('doctor')} className="hover:text-emerald-300 transition-colors">
                  Veterinary Doctor Portal
                </button>
              </li>
              <li>
                <button onClick={() => setShowRegistrationModal(true)} className="hover:text-emerald-300 transition-colors">
                  VCI Registration Application
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">Hardware Spec</h4>
            <ul className="space-y-2 text-xs text-[#DDEADF]/80">
              <li>ESP32 Dual-Core Microcontroller</li>
              <li>PPG Optical Pulse Wave Sensor</li>
              <li>DS18B20 Sub-Dermal Temp Probe</li>
              <li>NEO-6M GPS & LoRaWAN Node</li>
              <li>Monocrystalline Solar Trickle Cell</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">Compliance & Ethics</h4>
            <p className="text-xs text-[#DDEADF]/80 leading-relaxed">
              Designed in compliance with Veterinary Council of India (VCI) standards and Indian Dairy Association welfare guidelines. Non-invasive, ergonomic, cruelty-free livestock wearables.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#DDEADF]/60 gap-4">
          <p>© 2026 BioSenseCollar Technologies. All rights reserved.</p>
          <p>Built with ❤️ for Indian Dairy Farmers & Livestock Wellbeing.</p>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          MAIN LOGIN MODAL — PRESERVED & ELEVATED
          ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl flex flex-col items-center my-auto">
            
            {/* Top Role Selector Tabs */}
            <div className="flex gap-2 mb-4 p-1.5 bg-white dark:bg-[#103B2D] rounded-2xl shadow-lg border border-[#DDEADF] dark:border-[#174D38] z-10 w-fit">
              <button
                onClick={() => handleTabSwitch('farmer')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${
                  activeLoginTab === 'farmer' 
                    ? 'bg-[#174D38] text-white shadow-md' 
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
                    ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Stethoscope size={16} />
                <span>{t('Veterinarian Portal', 'கால்நடை மருத்துவர்', 'पशु चिकित्सक')}</span>
              </button>
            </div>

            {/* Main Modal Card */}
            <div className="w-full bg-white dark:bg-[#103B2D] rounded-3xl border border-[#DDEADF] dark:border-[#174D38] shadow-2xl p-6 md:p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              
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
                  activeLoginTab === 'farmer' ? 'bg-[#174D38]' : 'bg-gradient-to-tr from-teal-700 to-emerald-600'
                }`}>
                  {activeLoginTab === 'farmer' ? <Key size={22} className="rotate-45" /> : <Stethoscope size={22} />}
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white font-display">
                    {activeLoginTab === 'farmer' 
                      ? t('Farmer Account Login', 'விவசாயி உள்நுழைவு', 'किसान साइन इन') 
                      : t('Veterinarian Officer Sign In', 'கால்நடை மருத்துவ அதிகாரி உள்நுழைவு', 'पशु चिकित्सा अधिकारी साइन इन')}
                  </h3>
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
                  <CheckCircle2 size={16} />
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

                  {/* Auth Method Toggle */}
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
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        authMethod === 'otp'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t('Mobile OTP', 'மொபைல் OTP', 'मोबाइल ओटीपी')}
                    </button>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {authMethod === 'credentials' ? (
                      <>
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            {t('VCI Registration No. / Official Email', 'VCI பதிவு எண் / மின்னஞ்சல்', 'VCI पंजीकरण सं. / ईमेल')}
                          </label>
                          <input
                            type="text"
                            value={vetId}
                            onChange={(e) => setVetId(e.target.value)}
                            placeholder="e.g. VCI-TN-2024-8842 or dr.rajesh@vetgov.in"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              {t('Password', 'கடவுச்சொல்', 'पासवर्ड')}
                            </label>
                            <span className="text-[10px] text-teal-600 dark:text-teal-400 cursor-pointer hover:underline">
                              {t('Forgot password?')}
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={vetPass}
                              onChange={(e) => setFarmerPass(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            {t('Registered Official Mobile Number', 'பதிவுசெய்யப்பட்ட மொபைல் எண்', 'पंजीकृत मोबाइल नंबर')}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
                            />
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap cursor-pointer"
                            >
                              {otpSent ? t('Resend OTP') : t('Send OTP')}
                            </button>
                          </div>
                        </div>

                        {otpSent && (
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              {t('Enter 4-Digit OTP Code', 'OTP குறியீடு', '4-अंकीय ओटीपी')}
                            </label>
                            <input
                              type="text"
                              maxLength={4}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              placeholder="7429"
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-teal-500 text-center font-mono text-lg font-black tracking-widest text-teal-600"
                            />
                          </div>
                        )}
                      </>
                    )}

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
                        className="flex-1 py-3 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-teal-600/20 active:scale-95 transition-all cursor-pointer"
                      >
                        {t('Access Clinical Console', 'மருத்துவர் தளத்தில் உள்நுழை', 'पशु चिकित्सक पोर्टल पर जाएं')}
                      </button>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setShowRegistrationModal(true);
                        }}
                        className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline"
                      >
                        {t('New Veterinary Officer? Apply for VCI Credential Access →', 'புதிய மருத்துவரா? பதிவு செய்யவும் →')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ─── FARMER-SPECIFIC LOGIN VIEW ─── */}
              {activeLoginTab === 'farmer' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Demo Pre-fill notice */}
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold">🌾 Demo Farmer: Uma (Green Valley)</p>
                      <p className="text-[11px] opacity-80">Credentials pre-filled for immediate testing</p>
                    </div>
                    <span className="text-[10px] font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-bold">
                      FARM-101
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {t('Farmer ID / Mobile Number', 'விவசாயி அடையாள எண் / மொபைல்', 'किसान आईडी / मोबाइल')}
                    </label>
                    <input
                      type="text"
                      value={farmerId}
                      onChange={(e) => setFarmerId(e.target.value)}
                      placeholder="e.g. FARM-101 or 98401 23456"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#174D38]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {t('Security PIN / Password', 'கடவுச்சொல்', 'पासवर्ड')}
                      </label>
                      <span className="text-[10px] text-[#174D38] dark:text-emerald-400 cursor-pointer hover:underline">
                        {t('Forgot PIN?')}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={farmerPass}
                        onChange={(e) => setFarmerPass(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#174D38] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
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
                      className="flex-1 py-3 bg-[#174D38] hover:bg-[#103B2D] text-white font-extrabold rounded-xl text-xs shadow-md shadow-[#174D38]/20 active:scale-95 transition-all cursor-pointer"
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

      {/* ─────────────────────────────────────────────────────────────
          DOCTOR REGISTRATION APPLICATION MODAL — PRESERVED & ELEVATED
          ───────────────────────────────────────────────────────────── */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#103B2D] rounded-3xl border border-[#DDEADF] dark:border-[#174D38] shadow-2xl p-6 md:p-8 animate-in fade-in">
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  {t('VCI License / Identity Card Document', 'VCI உரிம ஆவணம்', 'VCI लाइसेंस दस्तावेज़')}
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center cursor-pointer hover:border-teal-500 transition-colors">
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
                  className="px-5 py-2 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-xl font-bold text-xs shadow-md"
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
