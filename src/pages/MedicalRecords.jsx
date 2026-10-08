import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  ShieldCheck, 
  Pill, 
  Activity, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  FileText, 
  User, 
  Heart,
  X,
  Sparkles
} from 'lucide-react';

export default function MedicalRecords() {
  const { cattle, setSelectedCattleId, setActiveTab, addVaccination, addMedicalTreatment, t } = useContext(AppContext);

  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all' | 'vaccines' | 'treatments' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCattleId, setFilterCattleId] = useState('all');
  
  // Modals
  const [showVacModal, setShowVacModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);

  // New Record Forms State
  const [vacForm, setVacForm] = useState({
    cattleId: cattle[0]?.id || '101',
    name: '',
    diseaseTarget: '',
    dateAdministered: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    dosage: '2 ml (Subcutaneous)',
    batchNo: '',
    administeredBy: 'Dr. Rajesh Kannan, MVSc',
    location: 'Primary Veterinary Dispensary',
    notes: '',
    status: 'Completed'
  });

  const [medForm, setMedForm] = useState({
    cattleId: cattle[0]?.id || '101',
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

  // Calculate Aggregates across the entire herd
  const allVaccinations = cattle.flatMap(c => 
    (c.vaccinations || []).map(v => ({ ...v, cowName: c.name, cowId: c.id, cowBreed: c.breed }))
  );

  const allTreatments = cattle.flatMap(c => 
    (c.medicalTreatments || []).map(m => ({ ...m, cowName: c.name, cowId: c.id, cowBreed: c.breed }))
  );

  const allHealthLogs = cattle.flatMap(c => 
    (c.healthMonitoringHistory || []).map(h => ({ ...h, cowName: c.name, cowId: c.id, cowBreed: c.breed }))
  );

  const totalVaccinesCompleted = allVaccinations.filter(v => v.status === 'Completed').length;
  const upcomingVaccines = allVaccinations.filter(v => v.status === 'Upcoming').length;
  const underTreatmentCount = allTreatments.filter(t => t.recoveryStatus === 'Under Treatment' || t.recoveryStatus === 'Recovering').length;

  // Filtered lists
  const filteredVaccinations = allVaccinations.filter(v => {
    const matchesCattle = filterCattleId === 'all' || v.cowId === filterCattleId;
    const matchesQuery = v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.cowName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.diseaseTarget?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCattle && matchesQuery;
  });

  const filteredTreatments = allTreatments.filter(m => {
    const matchesCattle = filterCattleId === 'all' || m.cowId === filterCattleId;
    const matchesQuery = m.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.cowName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.treatingDoctor?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCattle && matchesQuery;
  });

  const handleSaveVaccination = async (e) => {
    e.preventDefault();
    if (!vacForm.name || !vacForm.cattleId) return;

    await addVaccination(vacForm.cattleId, {
      name: vacForm.name,
      diseaseTarget: vacForm.diseaseTarget || vacForm.name,
      dateAdministered: vacForm.dateAdministered,
      nextDueDate: vacForm.nextDueDate || '',
      dosage: vacForm.dosage,
      batchNo: vacForm.batchNo || `BATCH-${Date.now().toString().slice(-4)}`,
      administeredBy: vacForm.administeredBy,
      location: vacForm.location,
      notes: vacForm.notes,
      status: vacForm.status
    });

    setShowVacModal(false);
    setVacForm({
      cattleId: cattle[0]?.id || '101',
      name: '',
      diseaseTarget: '',
      dateAdministered: new Date().toISOString().split('T')[0],
      nextDueDate: '',
      dosage: '2 ml (Subcutaneous)',
      batchNo: '',
      administeredBy: 'Dr. Rajesh Kannan, MVSc',
      location: 'Primary Veterinary Dispensary',
      notes: '',
      status: 'Completed'
    });
  };

  const handleSaveTreatment = async (e) => {
    e.preventDefault();
    if (!medForm.diagnosis || !medForm.cattleId) return;

    await addMedicalTreatment(medForm.cattleId, {
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
      cattleId: cattle[0]?.id || '101',
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

  const openCowProfile = (cowId) => {
    setSelectedCattleId(cowId);
    setActiveTab('cattle-details');
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-7xl mx-auto">

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-500/30 border border-emerald-400/40 rounded-full text-xs font-extrabold uppercase tracking-widest text-emerald-200">
              {t('Livestock Health Repository', 'கால்நடை சுகாதார களஞ்சியம்', 'पशुधन स्वास्थ्य भंडार')}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight text-white">
            {t('Vaccination & Medical Storage', 'தடுப்பூசி & மருத்துவ சிகிச்சை பதிவேடு', 'टीकाकरण और चिकित्सा रिकॉर्ड')}
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
            {t(
              'Complete digital health ledger: track immunization schedules, past illness treatments, veterinary prescriptions, and historical vital trends for your entire herd.',
              'முழுமையான மருத்துவ பதிவேடு: தடுப்பூசி அட்டவணை, கடந்த கால சிகிச்சைகள் மற்றும் வரலாற்று உடல்நிலை பதிவுகளைக் கண்காணிக்கவும்.',
              'संपूर्ण डिजिटल स्वास्थ्य खाता: अपने पूरे झुंड के लिए टीकाकरण कार्यक्रम, पिछले उपचार और ऐतिहासिक रुझानों को ट्रैक करें।'
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 z-10 shrink-0">
          <button
            onClick={() => setShowVacModal(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95"
          >
            <Plus size={16} />
            {t('Record Vaccination', 'தடுப்பூசி பதிவு செய்', 'टीकाकरण रिकॉर्ड करें')}
          </button>
          <button
            onClick={() => setShowMedModal(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-all backdrop-blur-md border border-white/20 flex items-center gap-2 active:scale-95"
          >
            <Plus size={16} />
            {t('Add Treatment', 'சிகிச்சை சேர்', 'उपचार जोड़ें')}
          </button>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('Vaccines Given', 'செலுத்தப்பட்ட தடுப்பூசிகள்', 'दिए गए टीके')}</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">{totalVaccinesCompleted}</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{t('100% Verified Log', 'சரிபார்க்கப்பட்டது', 'सत्यापित')}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('Upcoming Boosters', 'வரவிருக்கும் பூஸ்டர்', 'आगामी बूस्टर')}</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">{upcomingVaccines}</h3>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{t('Due next 30 days', 'அடுத்த 30 நாட்களில்', 'अगले 30 दिनों में')}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Pill size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('Under Treatment', 'சிகிச்சையில் உள்ளவை', 'उपचाराधीन')}</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">{underTreatmentCount}</h3>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">{t('Active Care Plan', 'கவனிப்பில் உள்ளது', 'सक्रिय देखभाल')}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('Herd Health Score', 'மந்தை சுகாதார குறியீடு', 'झुंड स्वास्थ्य स्कोर')}</span>
            <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display mt-0.5">93 / 100</h3>
            <p className="text-[11px] text-slate-400 font-semibold">{t('Optimal Herd Status', 'சிறந்த நிலை', 'उत्कृष्ट स्थिति')}</p>
          </div>
        </div>
      </div>

      {/* Main Filter & Navigation Tabs Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Sub-tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('All Records', 'அனைத்து பதிவுகள்', 'सभी रिकॉर्ड')}
          </button>
          <button
            onClick={() => setActiveSubTab('vaccines')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'vaccines'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            {t('Vaccinations', 'தடுப்பூசிகள்', 'टीकाकरण')} ({allVaccinations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('treatments')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'treatments'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Pill size={14} />
            {t('Medical Treatments', 'சிகிச்சைகள்', 'चिकित्सा')} ({allTreatments.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity size={14} />
            {t('Health History', 'வரலாறு', 'इतिहास')} ({allHealthLogs.length})
          </button>
        </div>

        {/* Filter per cattle & Search bar */}
        <div className="flex items-center gap-3">
          <select
            value={filterCattleId}
            onChange={(e) => setFilterCattleId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">{t('All Livestock (Full Herd)', 'அனைத்து மாடுகள்', 'सभी मवेशी')}</option>
            {cattle.map(c => (
              <option key={c.id} value={c.id}>{c.name} (Collar {c.id})</option>
            ))}
          </select>

          <div className="relative w-full md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder={t('Search records...', 'தேடவும்...', 'खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: VACCINATION LEDGER */}
      {(activeSubTab === 'all' || activeSubTab === 'vaccines') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                  {t('Vaccination Immunization Ledger', 'தடுப்பூசி செலுத்திய விவரங்கள்', 'टीकाकरण खाता')}
                </h2>
                <p className="text-xs text-slate-400">{t('Verified batches, administering veterinarians, and booster schedules.', 'தடுப்பூசி விவரங்கள் மற்றும் அடுத்த தவணை தேதிகள்.', 'सत्यापित बैच और बूस्टर कार्यक्रम।')}</p>
              </div>
            </div>
            <button
              onClick={() => setShowVacModal(true)}
              className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Plus size={14} />
              {t('New Vaccination', 'புதிய தடுப்பூசி', 'नया टीका')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredVaccinations.map((vac) => (
              <div
                key={vac.id}
                className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {vac.diseaseTarget}
                      </span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white font-display mt-0.5">
                        {vac.name}
                      </h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                      vac.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {vac.status === 'Completed' ? t('Completed', 'முடிக்கப்பட்டது', 'पूर्ण') : t('Upcoming Booster', 'அடுத்த தவணை', 'आगामी')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200/60 dark:border-slate-800/80 my-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Cattle Node', 'மாடு', 'पशु')}</span>
                      <p 
                        onClick={() => openCowProfile(vac.cowId)}
                        className="font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 cursor-pointer flex items-center gap-1"
                      >
                        {vac.cowName} (ID: {vac.cowId})
                        <ChevronRight size={12} />
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Administered On', 'செலுத்தப்பட்ட தேதி', 'दिया गया दिनांक')}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{vac.dateAdministered}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Next Booster Due', 'அடுத்த தவணை தேதி', 'अगला बूस्टर')}</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{vac.nextDueDate || 'Annual'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Dosage & Route', 'அளவு', 'खुराक')}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{vac.dosage}</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <p><strong>{t('Administered by:', 'மருத்துவர்:', 'प्रशासित किया:')}</strong> {vac.administeredBy}</p>
                    <p><strong>{t('Batch #:', 'பேட்ச் எண்:', 'बैच नं:')}</strong> <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{vac.batchNo}</code></p>
                    {vac.notes && <p className="italic text-slate-600 dark:text-slate-400 mt-1">"{vac.notes}"</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: MEDICAL TREATMENTS & PRESCRIPTIONS STORAGE */}
      {(activeSubTab === 'all' || activeSubTab === 'treatments') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400">
                <Pill size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                  {t('Past Medical Treatments & Clinical Care', 'மருத்துவ சிகிச்சை & மருந்து குறிப்புகள்', 'चिकित्सा उपचार और नुस्खे')}
                </h2>
                <p className="text-xs text-slate-400">{t('Historical medical diagnoses, veterinary doctor consultations, and prescribed regimens.', 'நோய் சிகிச்சை வரலாறு மற்றும் மருந்து பரிந்துரைகள்.', 'ऐतिहासिक नैदानिक उपचार और पशु चिकित्सक नुस्खे।')}</p>
              </div>
            </div>
            <button
              onClick={() => setShowMedModal(true)}
              className="text-xs font-extrabold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Plus size={14} />
              {t('New Medical Record', 'புதிய சிகிச்சை பதிவு', 'नया चिकित्सा रिकॉर्ड')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredTreatments.map((med) => (
              <div
                key={med.id}
                className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {med.date} • {med.severity} {t('Severity', 'தீவிரம்', 'गंभीरता')}
                      </span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white font-display mt-0.5">
                        {med.diagnosis}
                      </h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                      med.recoveryStatus === 'Fully Recovered'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {med.recoveryStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                    <p 
                      onClick={() => openCowProfile(med.cowId)}
                      className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer inline-flex items-center gap-1 mb-1"
                    >
                      {t('Patient:', 'நோயாளி:', 'रोगी:')} {med.cowName} (Collar ID: {med.cowId})
                      <ChevronRight size={12} />
                    </p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      <strong>{t('Symptoms:', 'அறிகுறிகள்:', 'लक्षण:')}</strong> {med.symptomsObserved}
                    </p>
                  </div>

                  {/* Prescribed Medications */}
                  {med.prescriptions && med.prescriptions.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
                        <Pill size={12} />
                        {t('Prescribed Regimen', 'பரிந்துரைக்கப்பட்ட மருந்துகள்', 'निर्धारित दवाएं')}
                      </span>
                      {med.prescriptions.map((rx, idx) => (
                        <div key={idx} className="text-xs flex justify-between items-center text-slate-700 dark:text-slate-200">
                          <span className="font-bold">• {rx.drug}</span>
                          <span className="text-[11px] text-slate-400">{rx.dosage} ({rx.duration})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex justify-between items-center pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                    <span><strong>{t('Treating Vet:', 'மருத்துவர்:', 'चिकित्सक:')}</strong> {med.treatingDoctor}</span>
                    <span>{med.clinic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: HISTORICAL HEALTH MONITORING LOGS */}
      {(activeSubTab === 'all' || activeSubTab === 'history') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                {t('Historical Health Audits & Sensor Trends', 'வரலாற்று உடல்நிலை தணிக்கை & சென்சார் போக்குகள்', 'ऐतिहासिक स्वास्थ्य ऑडिट')}
              </h2>
              <p className="text-xs text-slate-400">{t('Past vital milestones, grazing activity averages, and telemetry checkups.', 'கடந்த கால உடல்நிலை தணிக்கை விவரங்கள்.', 'पिछले स्वास्थ्य रिकॉर्ड और सेंसर डेटा।')}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {allHealthLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{log.date}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span 
                      onClick={() => openCowProfile(log.cowId)}
                      className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-500 cursor-pointer"
                    >
                      {log.cowName} (ID: {log.cowId})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{log.vetCheckupSummary}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Source: {log.monitoredBy}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{t('Avg HR', 'இதயத்துடிப்பு', 'एचआर')}</span>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{log.avgHeartRate} BPM</p>
                  </div>
                  <div className="text-center px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{t('Avg Temp', 'வெப்பநிலை', 'तापमान')}</span>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{log.avgTemp}°C</p>
                  </div>
                  <div className="text-center px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900">
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">{t('Health Score', 'மதிப்பெண்', 'स्कोर')}</span>
                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">{log.healthScore}/100</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL 1: ADD VACCINATION RECORD ── */}
      {showVacModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={22} />
                <h3 className="font-bold font-display text-base">{t('Record New Vaccination', 'புதிய தடுப்பூசியைப் பதிவு செய்', 'नया टीकाकरण दर्ज करें')}</h3>
              </div>
              <button onClick={() => setShowVacModal(false)} className="p-1 rounded-lg hover:bg-white/20 text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVaccination} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Select Cattle', 'மாட்டைத் தேர்ந்தெடுக்கவும்', 'मवेशी चुनें')}
                  </label>
                  <select
                    value={vacForm.cattleId}
                    onChange={(e) => setVacForm({ ...vacForm, cattleId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold"
                  >
                    {cattle.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (Collar {c.id})</option>
                    ))}
                  </select>
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
                    <option value="Completed">{t('Completed (Administered)', 'செலுத்தப்பட்டது', 'पूर्ण')}</option>
                    <option value="Upcoming">{t('Upcoming (Scheduled)', 'திட்டமிடப்பட்டது', 'आगामी')}</option>
                  </select>
                </div>
              </div>

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
                  {t('Save Record', 'சேமிக்கவும்', 'सुरक्षित करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ADD MEDICAL TREATMENT RECORD ── */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Pill size={22} />
                <h3 className="font-bold font-display text-base">{t('Add Medical Treatment Log', 'புதிய சிகிச்சை பதிவு சேர்', 'नया उपचार जोड़ें')}</h3>
              </div>
              <button onClick={() => setShowMedModal(false)} className="p-1 rounded-lg hover:bg-white/20 text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Select Cattle', 'மாட்டைத் தேர்ந்தெடுக்கவும்', 'मवेशी चुनें')}
                  </label>
                  <select
                    value={medForm.cattleId}
                    onChange={(e) => setMedForm({ ...medForm, cattleId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold"
                  >
                    {cattle.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (Collar {c.id})</option>
                    ))}
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
                  {t('Diagnosis / Ailment', 'நோய் கண்டறிதல்', 'रोग निदान')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mild Mastitis / Bloat / Heat Stress"
                  value={medForm.diagnosis}
                  onChange={(e) => setMedForm({ ...medForm, diagnosis: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                />
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

              {/* Medication prescribed */}
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
                  {t('Save Medical Record', 'பதிவைச் சேமிக்கவும்', 'रिकॉर्ड सुरक्षित करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
