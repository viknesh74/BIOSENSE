import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Heart, 
  Thermometer, 
  MapPin, 
  Battery, 
  Eye, 
  Download, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  ArrowLeft,
  Pill,
  Activity,
  Calendar,
  Plus,
  Printer,
  CheckCircle,
  Clock,
  User,
  X,
  Sparkles,
  FileText
} from 'lucide-react';

export default function CattleDetails() {
  const { cattle, selectedCattleId, setSelectedCattleId, setActiveTab, addVaccination, addMedicalTreatment, addHealthMonitoring, t } = useContext(AppContext);
  
  const [viewMode, setViewMode] = useState(selectedCattleId ? 'detail' : 'list'); // 'list' or 'detail'
  const [activeTabSub, setActiveTabSub] = useState('telemetry'); // 'telemetry' | 'vaccines' | 'treatments' | 'history'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals inside detail view
  const [showVacModal, setShowVacModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);

  // New Record Form States
  const [vacForm, setVacForm] = useState({
    name: '',
    diseaseTarget: '',
    dateAdministered: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    dosage: '2 ml (Subcutaneous)',
    batchNo: '',
    administeredBy: 'Dr. Rajesh Kannan, MVSc',
    location: 'Madurai East Government Veterinary Hospital',
    notes: '',
    status: 'Completed'
  });

  const [medForm, setMedForm] = useState({
    diagnosis: '',
    severity: 'Moderate',
    treatingDoctor: 'Dr. Rajesh Kannan, MVSc',
    clinic: 'Government Veterinary Hospital',
    symptomsObserved: '',
    drugName: '',
    drugDosage: '',
    drugDuration: '',
    recoveryStatus: 'Recovering',
    followUpDate: '',
    notes: ''
  });

  // Filter cattle for the list view
  const filteredCattle = cattle.filter(c => {
    const query = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query);
  });

  const handleSelectCattle = (id) => {
    setSelectedCattleId(id);
    setViewMode('detail');
  };

  // --- 1. LIST VIEW --- //
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 font-sans pb-10">
        {/* Search Bar Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              {t('Livestock Database & Medical Files', 'கால்நடை தரவுத்தளம் & மருத்துவ கோப்புகள்', 'पशुधन डेटाबेस और चिकित्सा फाइलें')}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {t('Search and select cattle to view live telemetry, vaccinations, and treatment history.', 'மாடுகளைத் தேடி அவற்றின் நேரலை தரவு, தடுப்பூசி மற்றும் மருத்துவ வரலாற்றைப் பார்க்கவும்.', 'लाइव टेलीमेट्री, टीकाकरण और उपचार इतिहास देखने के लिए मवेशी चुनें।')}
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t('Search by name or Collar ID...', 'பெயர் அல்லது ஐடி மூலம் தேடவும்...', 'नाम या कॉलर आईडी से खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-semibold transition-all"
            />
          </div>
        </div>

        {/* Grid View */}
        {filteredCattle.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCattle.map((cow) => {
              const isEmergency = cow.status === 'Emergency';
              const isWarning = cow.status === 'Warning';
              const vacCount = (cow.vaccinations || []).length;
              const medCount = (cow.medicalTreatments || []).length;
              
              return (
                <div 
                  key={cow.id}
                  onClick={() => handleSelectCattle(cow.id)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 flex flex-col"
                >
                  <div className="h-40 overflow-hidden relative">
                    {cow.photo ? (
                      <img
                        src={cow.photo}
                        alt={cow.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                        {cow.animalType === 'Sheep' ? '🐑' : cow.animalType === 'Goat' ? '🐐' : cow.animalType === 'Buffalo' ? '🐃' : '🐄'}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg border border-white/10 uppercase tracking-widest">
                      ID: {cow.id}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white font-display mb-1">{cow.name}</h3>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-500">
                          {vacCount} {t('Vaccines', 'தடுப்பூசி', 'टीके')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-bold">{cow.breed} • {cow.age}</p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${
                        isEmergency ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {isEmergency ? <AlertTriangle size={14} className="animate-pulse" /> :
                         isWarning ? <AlertTriangle size={14} /> :
                         <ShieldCheck size={14} />}
                        <span>
                          {isEmergency ? t('Emergency', 'அவசரம்', 'आपातकाल') :
                           isWarning ? t('Warning', 'எச்சரிக்கை', 'चेतावनी') :
                           t('Healthy', 'ஆரோக்கியம்', 'स्वस्थ')}
                        </span>
                      </div>

                      <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                        <Pill size={12} />
                        {medCount} {t('Treatments', 'சிகிச்சை', 'उपचार')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {t('No cattle found', 'மாடுகள் கிடைக்கவில்லை', 'कोई मवेशी नहीं मिला')}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              {t('Try adjusting your search query or check the Collar ID again.', 'உங்கள் தேடலை மாற்றி மீண்டும் தேடவும்.', 'अपनी खोज क्वेरी को समायोजित करने का प्रयास करें।')}
            </p>
          </div>
        )}
      </div>
    );
  }

  // --- 2. DETAIL VIEW LOGIC --- //
  const cow = cattle.find((c) => c.id === selectedCattleId) || cattle[0];
  const hr = cow.telemetry?.heartRate || 72;
  const temp = cow.telemetry?.temperature || 38.6;
  const batt = cow.telemetry?.battery || 90;
  const status = cow.status || 'Healthy';

  const tempF = ((temp * 9) / 5 + 32).toFixed(1);

  const cowVaccinations = cow.vaccinations || [];
  const cowTreatments = cow.medicalTreatments || [];
  const cowHealthLogs = cow.healthMonitoringHistory || [];

  let statusBg = 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900';
  let statusText = 'text-emerald-700 dark:text-emerald-400';
  let statusIcon = <ShieldCheck className="text-emerald-500" size={24} />;
  let statusMsg = t('All vitals are stable. Live sensors indicating normal range.', 'அனைத்து உடல்நிலைகளும் சீராக உள்ளன.', 'सभी महत्वपूर्ण अंग स्थिर हैं।');

  if (status === 'Emergency') {
    statusBg = 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 animate-pulse';
    statusText = 'text-rose-700 dark:text-rose-400';
    statusIcon = <AlertTriangle className="text-rose-500" size={24} />;
    
    if (hr > 105) {
      statusMsg = t(`Emergency: Heart rate is spiking at ${hr} BPM. Fever check recommended.`, `அவசரம்: இதயத் துடிப்பு ${hr} BPM ஆக அதிகரித்துள்ளது.`, `आपातकाल: हृदय गति ${hr} BPM पर बढ़ रही है।`);
    } else if (hr < 50) {
      statusMsg = t(`Emergency: Low heart rate detected (${hr} BPM). Immediate medical checkup needed.`, `அவசரம்: இதயத் துடிப்பு ${hr} BPM ஆகக் குறைந்துள்ளது.`, `आपातकाल: कम हृदय गति (${hr} BPM)।`);
    } else if (temp > 40.0) {
      statusMsg = t(`Emergency: Fever detected (${temp}°C / ${tempF}°F). Request a vet consultation.`, `அவசரம்: மாட்டின் வெப்பநிலை ${temp}°C காய்ச்சலை காட்டுகிறது.`, `आपातकाल: बुखार पाया गया (${temp}°C / ${tempF}°F)।`);
    } else {
      statusMsg = t('Emergency: GPS geofence boundary breached. Check live tracking map.', 'அவசரம்: மாடு பாதுகாப்பு எல்லையைத் தாண்டியுள்ளது.', 'आपातकाल: जियोफेंस सीमा का उल्लंघन।');
    }
  } else if (status === 'Warning') {
    statusBg = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900';
    statusText = 'text-amber-700 dark:text-amber-400';
    statusIcon = <AlertTriangle className="text-amber-500" size={24} />;
    
    if (batt < 20) {
      statusMsg = t(`Warning: Battery level critical (${batt}%). Please plug in transmitter charger.`, `எச்சரிக்கை: காலர் பேட்டரி அளவு (${batt}%) மிகக் குறைவாக உள்ளது.`, `चेतावनी: बैटरी का स्तर गंभीर (${batt}%)।`);
    } else {
      statusMsg = t('Warning: Subtle vital fluctuations. Continue monitoring.', 'எச்சரிக்கை: லேசான உடல்நிலை மாற்றங்கள் உள்ளன.', 'चेतावनी: सूक्ष्म महत्वपूर्ण उतार-चढ़ाव।');
    }
  }

  const handleSaveVaccination = async (e) => {
    e.preventDefault();
    if (!vacForm.name) return;

    await addVaccination(cow.id, {
      ...vacForm,
      diseaseTarget: vacForm.diseaseTarget || vacForm.name,
      batchNo: vacForm.batchNo || `BATCH-${Date.now().toString().slice(-4)}`
    });

    setShowVacModal(false);
    setVacForm({
      name: '',
      diseaseTarget: '',
      dateAdministered: new Date().toISOString().split('T')[0],
      nextDueDate: '',
      dosage: '2 ml (Subcutaneous)',
      batchNo: '',
      administeredBy: 'Dr. Rajesh Kannan, MVSc',
      location: 'Madurai East Government Veterinary Hospital',
      notes: '',
      status: 'Completed'
    });
  };

  const handleSaveTreatment = async (e) => {
    e.preventDefault();
    if (!medForm.diagnosis) return;

    await addMedicalTreatment(cow.id, {
      diagnosis: medForm.diagnosis,
      severity: medForm.severity,
      treatingDoctor: medForm.treatingDoctor,
      clinic: medForm.clinic,
      symptomsObserved: medForm.symptomsObserved,
      prescriptions: medForm.drugName ? [
        { drug: medForm.drugName, dosage: medForm.drugDosage || 'As advised', duration: medForm.drugDuration || '3 Days' }
      ] : [],
      recoveryStatus: medForm.recoveryStatus,
      followUpDate: medForm.followUpDate,
      notes: medForm.notes
    });

    setShowMedModal(false);
    setMedForm({
      diagnosis: '',
      severity: 'Moderate',
      treatingDoctor: 'Dr. Rajesh Kannan, MVSc',
      clinic: 'Government Veterinary Hospital',
      symptomsObserved: '',
      drugName: '',
      drugDosage: '',
      drugDuration: '',
      recoveryStatus: 'Recovering',
      followUpDate: '',
      notes: ''
    });
  };

  const handlePrintPassport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans pb-12 max-w-7xl mx-auto print:max-w-none print:p-0">
      
      {/* Detail Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <button 
          onClick={() => setViewMode('list')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl transition-all w-max border border-slate-200 dark:border-slate-700"
        >
          <ArrowLeft size={16} />
          {t('Back to all Cattle', 'அனைத்து மாடுகளுக்கும் திரும்பவும்', 'सभी मवेशियों पर वापस जाएं')}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintPassport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
          >
            <Printer size={15} />
            {t('Print Medical Passport', 'மருத்துவ பாஸ்போர்ட் அச்சிடுக', 'पासपोर्ट प्रिंट करें')}
          </button>
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck size={14} />
            <span>{t('Live Telemetry Streaming', 'நேரடி தரவு ஸ்ட்ரீமிங்', 'लाइव टेलीमेट्री')}</span>
          </div>
        </div>
      </div>

      {/* Meta Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 animate-in fade-in zoom-in-95 duration-300">
        <div className="md:col-span-1 h-64 md:h-full min-h-[220px]">
          {cow.photo ? (
            <img
              src={cow.photo}
              alt={cow.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-8xl">
              {cow.animalType === 'Sheep' ? '🐑' : cow.animalType === 'Goat' ? '🐐' : cow.animalType === 'Buffalo' ? '🐃' : '🐄'}
            </div>
          )}
        </div>

        <div className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 tracking-widest uppercase">
                {t('Collar Activated Node', 'காலர் ஐடி பதிவிறக்கம்', 'कॉलर सक्रिय नोड')}
              </span>
              <span className="text-xs text-slate-400 font-bold">Collar ID: {cow.id}</span>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display">{cow.name}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{t('Breed', 'இனம்', 'नस्ल')}</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cow.breed}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{t('Age', 'வயது', 'आयु')}</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cow.age}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{t('Gender', 'பாலினம்', 'लिंग')}</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cow.gender || 'Female'}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{t('Health Passport', 'பாஸ்போர்ட்', 'पासपोर्ट')}</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">BIO-{cow.id}-PASS</p>
              </div>
            </div>
          </div>

          {/* Status Indicators Banner */}
          <div className={`p-4 border rounded-2xl flex items-start gap-3.5 ${statusBg}`}>
            <div className="shrink-0 mt-0.5">{statusIcon}</div>
            <div>
              <h4 className={`text-sm font-bold uppercase tracking-wider ${statusText}`}>
                {status === 'Healthy' ? t('Healthy Vitals Status', 'ஆரோக்கிய நிலை', 'स्वस्थ जीवन शक्ति') : status === 'Warning' ? t('Warning status', 'எச்சரிக்கை நிலை', 'चेतावनी') : t('Emergency Status Alert', 'அவசர நிலை எச்சரிக்கை', 'आपातकाल')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{statusMsg}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-1 overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveTabSub('telemetry')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTabSub === 'telemetry'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity size={15} />
          {t('Live Telemetry & Vitals', 'நேரலை சென்சார் அளவீடு', 'लाइव टेलीमेट्री')}
        </button>

        <button
          onClick={() => setActiveTabSub('vaccines')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTabSub === 'vaccines'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck size={15} />
          {t('Vaccination Schedule', 'தடுப்பூசி அட்டவணை', 'टीकाकरण अनुसूची')} ({cowVaccinations.length})
        </button>

        <button
          onClick={() => setActiveTabSub('treatments')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTabSub === 'treatments'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Pill size={15} />
          {t('Medical Treatment History', 'மருத்துவ சிகிச்சை வரலாறு', 'चिकित्सा उपचार इतिहास')} ({cowTreatments.length})
        </button>

        <button
          onClick={() => setActiveTabSub('history')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTabSub === 'history'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar size={15} />
          {t('Historical Health Audits', 'வரலாற்று உடல்நிலை பதிவுகள்', 'ऐतिहासिक स्वास्थ्य ऑडिट')} ({cowHealthLogs.length})
        </button>
      </div>

      {/* ── TAB 1: LIVE SENSOR TELEMETRY ── */}
      {activeTabSub === 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Heart Rate Dial Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Heart Rate', 'இதயத்துடிப்பு', 'हृदय गति')}</span>
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                  <Heart size={18} className="animate-pulse-heart" />
                </div>
              </div>
              <div>
                <h3 className={`text-4xl font-extrabold font-display ${hr > 105 || hr < 50 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {hr}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{t('Normal: 60-90 BPM (Resting)', 'வழக்கமான அளவு: 60-90 BPM', 'सामान्य: 60-90 BPM')}</p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    hr > 105 || hr < 50 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min((hr / 150) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Temperature Dial Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Body Temperature', 'உடல் வெப்பநிலை', 'शरीर का तापमान')}</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
                  <Thermometer size={18} />
                </div>
              </div>
              <div>
                <h3 className={`text-4xl font-extrabold font-display ${temp > 40.0 ? 'text-rose-500 font-black' : 'text-slate-900 dark:text-white'}`}>
                  {temp}°C
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {tempF}°F • {t('Normal: 38.5 - 39.5°C', 'வழக்கமான அளவு: 38.5 - 39.5°C', 'सामान्य: 38.5 - 39.5°C')}
                </p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    temp > 40.0 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(((temp - 35) / 10) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* GPS Coordinate Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Live GPS Coordinates', 'ஜிபிஎஸ் இருப்பிடம்', 'लाइव जीपीएस')}</span>
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-teal-500 group-hover:scale-105 transition-transform">
                  <MapPin size={18} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {cow.telemetry?.gps?.lat?.toFixed(5) || '11.07780'} N
                </h4>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {cow.telemetry?.gps?.lng?.toFixed(5) || '77.14287'} E
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{t('Transmitting via NEO-6M', 'NEO-6M ஜிபிஎஸ்', 'NEO-6M द्वारा')}</p>
              </div>
              <div className="text-xs text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 py-1.5 px-2.5 rounded-lg flex justify-between items-center">
                <span>{t('Geofence Safe Zone', 'பாதுகாப்பு எல்லை', 'सुरक्षित क्षेत्र')}</span>
                <span className="text-emerald-500 font-bold">
                  {t('INSIDE', 'உள்ளே', 'अंदर')}
                </span>
              </div>
            </div>

            {/* Battery Telemetry Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Battery Status', 'பேட்டரி நிலை', 'बैटरी स्थिति')}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${batt < 20 ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 animate-pulse' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500'}`}>
                  <Battery size={18} />
                </div>
              </div>
              <div>
                <h3 className={`text-4xl font-extrabold font-display ${batt < 20 ? 'text-rose-500 font-black' : 'text-slate-900 dark:text-white'}`}>
                  {batt}%
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {batt < 20 ? t('Charge Immediately', 'உடனடியாக சார்ஜ் செய்யவும்', 'तुरंत चार्ज करें') : t('Collar Transmitting', 'செயல்பாட்டில் உள்ளது', 'ट्रांसमीटर चालू')}
                </p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    batt < 20 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${batt}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('gps')}
              className="flex-1 min-w-[200px] p-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-md transition-all"
            >
              <MapPin size={18} />
              <span>{t('View Live Tracking Map', 'நேரடி வரைபடத்தைக் காண்க', 'लाइव ट्रैकिंग देखें')}</span>
            </button>
            <button
              onClick={() => setActiveTab('cattle-analytics')}
              className="flex-1 min-w-[200px] p-4 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition-all"
            >
              <Eye size={18} className="text-emerald-500" />
              <span>{t('View Health Charts History', 'சுகாதார வரைபடங்கள்', 'स्वास्थ्य चार्ट देखें')}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: VACCINATION RECORDS & SCHEDULE ── */}
      {activeTabSub === 'vaccines' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={22} />
                {t(`Vaccination Passport: ${cow.name}`, `${cow.name}-இன் தடுப்பூசி விவரங்கள்`, `${cow.name} का टीकाकरण पासपोर्ट`)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('Immunization timeline, completed doses, and upcoming booster reminders.', 'செலுத்தப்பட்ட தடுப்பூசிகள் மற்றும் அடுத்த தவணைகள்.', 'टीकाकरण समयरेखा और आगामी बूस्टर।')}
              </p>
            </div>

            <button
              onClick={() => setShowVacModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 w-max"
            >
              <Plus size={16} />
              {t('Add Vaccination Record', 'தடுப்பூசி பதிவு சேர்', 'टीकाकरण जोड़ें')}
            </button>
          </div>

          {cowVaccinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cowVaccinations.map((vac) => (
                <div
                  key={vac.id}
                  className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {vac.diseaseTarget}
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white font-display mt-0.5">
                        {vac.name}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                      vac.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {vac.status === 'Completed' ? t('Completed', 'முடிந்தது', 'पूर्ण') : t('Upcoming Booster', 'அடுத்த தவணை', 'आगामी')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200/60 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Date Given', 'செலுத்திய தேதி', 'दिनांक')}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{vac.dateAdministered}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Next Due Date', 'அடுத்த தவணை', 'अगला बूस्टर')}</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{vac.nextDueDate || 'Annual'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Dosage & Route', 'அளவு', 'खुराक')}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{vac.dosage}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Batch #', 'பேட்ச் எண்', 'बैच नं')}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{vac.batchNo}</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <p><strong>{t('Administered by:', 'மருத்துவர்:', 'प्रशासक:')}</strong> {vac.administeredBy}</p>
                    {vac.notes && <p className="italic text-slate-600 dark:text-slate-400">"{vac.notes}"</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <ShieldCheck className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('No vaccination records logged yet', 'தடுப்பூசி பதிவுகள் இல்லை', 'कोई टीकाकरण रिकॉर्ड नहीं')}</p>
              <button
                onClick={() => setShowVacModal(true)}
                className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                + {t('Add First Vaccination', 'முதல் தடுப்பூசியைப் பதிவு செய்', 'पहला टीका जोड़ें')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: MEDICAL TREATMENT & PRESCRIPTIONS ── */}
      {activeTabSub === 'treatments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Pill className="text-teal-500" size={22} />
                {t(`Medical & Clinical Storage: ${cow.name}`, `${cow.name}-இன் மருத்துவ சிகிச்சை பதிவுகள்`, `${cow.name} का चिकित्सा इतिहास`)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('Diagnosed illnesses, veterinary prescriptions, medicines administered, and recovery outcomes.', 'நோய் சிகிச்சை வரலாறு மற்றும் மருந்து விவரங்கள்.', 'निदान की गई बीमारियाँ और पशु चिकित्सक नुस्खे।')}
              </p>
            </div>

            <button
              onClick={() => setShowMedModal(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 w-max"
            >
              <Plus size={16} />
              {t('Add Medical Treatment', 'சிகிச்சை பதிவு சேர்', 'उपचार जोड़ें')}
            </button>
          </div>

          {cowTreatments.length > 0 ? (
            <div className="space-y-4">
              {cowTreatments.map((med) => (
                <div
                  key={med.id}
                  className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-teal-600 dark:text-teal-400">{med.date}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-bold">{med.severity} {t('Severity', 'தீவிரம்', 'गंभीरता')}</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white font-display mt-1">
                        {med.diagnosis}
                      </h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider w-max ${
                      med.recoveryStatus === 'Fully Recovered'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {med.recoveryStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>{t('Symptoms Observed:', 'அறிகுறிகள்:', 'लक्षण:')}</strong> {med.symptomsObserved}
                  </p>

                  {/* Prescriptions list */}
                  {med.prescriptions && med.prescriptions.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                        <Pill size={12} />
                        {t('Prescribed Medications & Regimen', 'பரிந்துரைக்கப்பட்ட மருந்துகள்', 'निर्धारित दवाएं')}
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {med.prescriptions.map((rx, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs flex justify-between items-center">
                            <span className="font-bold text-slate-800 dark:text-slate-200">• {rx.drug}</span>
                            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">{rx.dosage} ({rx.duration})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 gap-2">
                    <div>
                      <strong>{t('Attending Vet:', 'மருத்துவர்:', 'चिकित्सक:')}</strong> {med.treatingDoctor} ({med.clinic})
                    </div>
                    {med.notes && (
                      <div className="italic text-emerald-600 dark:text-emerald-400">
                        {med.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <Pill className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('No medical treatments logged', 'சிகிச்சை பதிவுகள் இல்லை', 'कोई उपचार रिकॉर्ड नहीं')}</p>
              <button
                onClick={() => setShowMedModal(true)}
                className="mt-3 text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline"
              >
                + {t('Add Treatment Entry', 'சிகிச்சை பதிவு சேர்', 'उपचार जोड़ें')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: HISTORICAL HEALTH AUDITS ── */}
      {activeTabSub === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Calendar className="text-indigo-500" size={22} />
              {t(`Historical Vital Checkups & Health Audits: ${cow.name}`, `${cow.name}-இன் வரலாற்று உடல்நிலை தணிக்கை`, `${cow.name} का स्वास्थ्य इतिहास`)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t('How health and sensor vitals were monitored previously across different dates.', 'சென்சார் மற்றும் உடல்நிலை எவ்வாறு முன்பு கண்காணிக்கப்பட்டது.', 'पिछले स्वास्थ्य और सेंसर रुझान।')}
            </p>
          </div>

          <div className="space-y-4">
            {cowHealthLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{log.date}</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{log.vetCheckupSummary}</h4>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-1">
                    <span><strong>{t('Activity:', 'செயல்பாடு:', 'गतिविधि:')}</strong> {log.activityLevel}</span>
                    <span>•</span>
                    <span><strong>{t('Rumination:', 'அசைபோடுதல்:', 'जुगाली:')}</strong> {log.ruminationMinutes} mins/day</span>
                    <span>•</span>
                    <span><strong>{t('Incident Alerts:', 'எச்சரிக்கைகள்:', 'अलर्ट:')}</strong> {log.alertIncidentCount}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1">Source: {log.monitoredBy}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 min-w-[70px]">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{t('Avg HR', 'இதயம்', 'एचआर')}</span>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{log.avgHeartRate} BPM</p>
                  </div>
                  <div className="text-center px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 min-w-[70px]">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{t('Avg Temp', 'வெப்பநிலை', 'तापमान')}</span>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{log.avgTemp}°C</p>
                  </div>
                  <div className="text-center px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 min-w-[80px]">
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">{t('Health Score', 'மதிப்பெண்', 'स्कोर')}</span>
                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">{log.healthScore}/100</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: ADD VACCINATION ── */}
      {showVacModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={22} />
                <h3 className="font-bold font-display text-base">{t(`Add Vaccine for ${cow.name}`, `${cow.name}-க்கு தடுப்பூசி சேர்`, `${cow.name} के लिए टीका जोड़ें`)}</h3>
              </div>
              <button onClick={() => setShowVacModal(false)} className="p-1 rounded-lg hover:bg-white/20 text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVaccination} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  {t('Vaccine Name', 'தடுப்பூசி பெயர்', 'टीके का नाम')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FMD Bi-annual Booster Dose"
                  value={vacForm.name}
                  onChange={(e) => setVacForm({ ...vacForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Target Disease', 'இலக்கு நோய்', 'लक्षित रोग')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Foot-and-Mouth Disease"
                    value={vacForm.diseaseTarget}
                    onChange={(e) => setVacForm({ ...vacForm, diseaseTarget: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Status', 'நிலை', 'स्थिति')}
                  </label>
                  <select
                    value={vacForm.status}
                    onChange={(e) => setVacForm({ ...vacForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Completed">{t('Completed', 'முடிந்தது', 'पूर्ण')}</option>
                    <option value="Upcoming">{t('Upcoming Due', 'அடுத்த தவணை', 'आगामी')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Date Administered', 'செலுத்திய தேதி', 'दिनांक')}
                  </label>
                  <input
                    type="date"
                    value={vacForm.dateAdministered}
                    onChange={(e) => setVacForm({ ...vacForm, dateAdministered: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Next Due Date', 'அடுத்த தவணை தேதி', 'अगली देय तिथि')}
                  </label>
                  <input
                    type="date"
                    value={vacForm.nextDueDate}
                    onChange={(e) => setVacForm({ ...vacForm, nextDueDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Dosage & Route', 'அளவு', 'खुराक')}
                  </label>
                  <input
                    type="text"
                    value={vacForm.dosage}
                    onChange={(e) => setVacForm({ ...vacForm, dosage: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Batch / Vial No.', 'பேட்ச் எண்', 'बैच संख्या')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FMD-TN-2026"
                    value={vacForm.batchNo}
                    onChange={(e) => setVacForm({ ...vacForm, batchNo: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  {t('Administered By (Veterinarian)', 'மருத்துவர் பெயர்', 'पशु चिकित्सक')}
                </label>
                <input
                  type="text"
                  value={vacForm.administeredBy}
                  onChange={(e) => setVacForm({ ...vacForm, administeredBy: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowVacModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs"
                >
                  {t('Cancel', 'ரத்து', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md"
                >
                  {t('Save Vaccination', 'சேமிக்கவும்', 'सुरक्षित करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD MEDICAL TREATMENT ── */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Pill size={22} />
                <h3 className="font-bold font-display text-base">{t(`Add Treatment Record for ${cow.name}`, `${cow.name}-க்கு சிகிச்சை சேர்`, `${cow.name} के लिए उपचार जोड़ें`)}</h3>
              </div>
              <button onClick={() => setShowMedModal(false)} className="p-1 rounded-lg hover:bg-white/20 text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  {t('Diagnosis / Ailment', 'நோய் கண்டறிதல்', 'रोग निदान')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mild Mastitis / Bloat / Indigestion"
                  value={medForm.diagnosis}
                  onChange={(e) => setMedForm({ ...medForm, diagnosis: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Severity', 'தீவிரம்', 'गंभीरता')}
                  </label>
                  <select
                    value={medForm.severity}
                    onChange={(e) => setMedForm({ ...medForm, severity: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Mild">{t('Mild', 'லேசானது', 'हल्का')}</option>
                    <option value="Moderate">{t('Moderate', 'மிதமானது', 'मध्यम')}</option>
                    <option value="Severe">{t('Severe', 'தீவிரமானது', 'गंभीर')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Recovery Status', 'மீட்பு நிலை', 'वसूली स्थिति')}
                  </label>
                  <select
                    value={medForm.recoveryStatus}
                    onChange={(e) => setMedForm({ ...medForm, recoveryStatus: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Under Treatment">{t('Under Treatment', 'சிகிச்சையில் உள்ளது', 'उपचाराधीन')}</option>
                    <option value="Recovering">{t('Recovering', 'குணமடைந்து வருகிறது', 'सुधार हो रहा है')}</option>
                    <option value="Fully Recovered">{t('Fully Recovered', 'முழுமையாக குணமடைந்தது', 'पूरी तरह ठीक')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  {t('Symptoms Observed', 'கண்டறியப்பட்ட அறிகுறிகள்', 'लक्षण')}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Swollen udder, slight temperature spike (39.2°C)"
                  value={medForm.symptomsObserved}
                  onChange={(e) => setMedForm({ ...medForm, symptomsObserved: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              {/* Medicine field */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                  {t('Prescribed Medicine', 'பரிந்துரைக்கப்பட்ட மருந்து', 'दवा विवरण')}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={medForm.drugName}
                    onChange={(e) => setMedForm({ ...medForm, drugName: e.target.value })}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-semibold col-span-1"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 15ml IM)"
                    value={medForm.drugDosage}
                    onChange={(e) => setMedForm({ ...medForm, drugDosage: e.target.value })}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-semibold col-span-1"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 3 Days)"
                    value={medForm.drugDuration}
                    onChange={(e) => setMedForm({ ...medForm, drugDuration: e.target.value })}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-semibold col-span-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Attending Veterinarian', 'மருத்துவர் பெயர்', 'पशु चिकित्सक')}
                  </label>
                  <input
                    type="text"
                    value={medForm.treatingDoctor}
                    onChange={(e) => setMedForm({ ...medForm, treatingDoctor: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Follow-up Checkup Date', 'மறுபரிசோதனை தேதி', 'फॉलो-अप दिनांक')}
                  </label>
                  <input
                    type="date"
                    value={medForm.followUpDate}
                    onChange={(e) => setMedForm({ ...medForm, followUpDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMedModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs"
                >
                  {t('Cancel', 'ரத்து', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs shadow-md"
                >
                  {t('Save Treatment', 'சேமிக்கவும்', 'सुरक्षित करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
