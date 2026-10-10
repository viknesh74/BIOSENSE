import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Heart, 
  Thermometer, 
  MapPin, 
  Battery, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  ArrowLeft, 
  Pill, 
  Activity, 
  Plus, 
  Printer, 
  X, 
  Sparkles, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Cpu, 
  Radio, 
  Compass, 
  RefreshCw,
  Eye 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { DropdownMenu, DropdownMenuItem } from '../components/ui/DropdownMenu';
import { CollarFormDialog } from '../components/collars/CollarFormDialog';
import { DeleteCollarDialog } from '../components/collars/DeleteCollarDialog';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Fix Leaflet marker icon issue
const cowMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function CattleDetails() {
  const { 
    cattle, 
    selectedCattleId, 
    setSelectedCattleId, 
    setActiveTab, 
    addCollar,
    updateCollar,
    removeCollar,
    addVaccination, 
    addMedicalTreatment, 
    addHealthMonitoring,
    refreshCattle,
    cattleLoading,
    t 
  } = useContext(AppContext);
  
  const [viewMode, setViewMode] = useState(selectedCattleId ? 'detail' : 'list'); // 'list' | 'detail'
  const [activeTabSub, setActiveTabSub] = useState('overview'); // 'overview' | 'telemetry' | 'gps' | 'vaccines' | 'treatments' | 'collar'
  
  // Search, filter & sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [animalTypeFilter, setAnimalTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc');

  // Collar CRUD dialog states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCollar, setEditingCollar] = useState(null);
  const [deletingCollar, setDeletingCollar] = useState(null);

  // Medical Record Form States
  const [showVacModal, setShowVacModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);

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

  // Filtered & Sorted cattle list
  const filteredCattle = useMemo(() => {
    return cattle
      .filter((c) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = !query || 
          c.name.toLowerCase().includes(query) || 
          String(c.id).toLowerCase().includes(query) ||
          (c.breed && c.breed.toLowerCase().includes(query));

        const matchesType = animalTypeFilter === 'ALL' || (c.animalType || 'Cow') === animalTypeFilter;
        const matchesStatus = statusFilter === 'ALL' || (c.status || 'Healthy') === statusFilter;

        return matchesQuery && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'id-asc') return String(a.id).localeCompare(String(b.id));
        if (sortBy === 'id-desc') return String(b.id).localeCompare(String(a.id));
        return 0;
      });
  }, [cattle, searchQuery, animalTypeFilter, statusFilter, sortBy]);

  const handleSelectCattle = (id) => {
    setSelectedCattleId(id);
    setViewMode('detail');
  };

  const handleEditClick = (e, cow) => {
    e.stopPropagation();
    setEditingCollar(cow);
  };

  const handleDeleteClick = (e, cow) => {
    e.stopPropagation();
    setDeletingCollar(cow);
  };

  // ---------------------------------------------------------------------------
  // 1. LIST VIEW
  // ---------------------------------------------------------------------------
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 font-sans pb-12 max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <div className="bg-white dark:bg-[#0D2219] p-6 md:p-8 rounded-3xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF5F0] dark:bg-[#174D38]/50 text-[#174D38] dark:text-[#A8D5BA] text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {cattle.length} {t('Active Collars Online', 'செயலில் உள்ள காலர்கள்')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#103B2D] text-white text-[10px] font-bold uppercase tracking-wider">
                IoT Fleet Management
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#103B2D] dark:text-white font-display">
              {t('Livestock Database & Smart Collars', 'கால்நடை தரவுத்தளம் & ஸ்மார்ட் காலர்கள்', 'पशुधन डेटाबेस और स्मार्ट कॉलर')}
            </h2>
            <p className="text-[#5A7065] dark:text-[#9FB5AA] text-sm mt-1 max-w-xl">
              {t('Monitor and manage telemetry collars, vital health metrics, and electronic medical records across your entire herd.', 'உங்கள் மந்தையின் அனைத்து மாடுகளின் காலர் தரவு மற்றும் மருத்துவ விவரங்களை நிர்வகிக்கவும்.')}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => refreshCattle?.()}
              title={t('Refresh Records')}
              className="gap-2 border-[#DDEADF] dark:border-[#174D38]"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">{t('Sync')}</span>
            </Button>

            <Button
              variant="default"
              size="md"
              onClick={() => setShowAddModal(true)}
              className="bg-[#4B8A64] hover:bg-emerald-600 text-white shadow-lg shadow-black/10 border-0"
            >
              <Plus size={18} />
              <span>{t('Add New Collar', 'புதிய காலர் சேர்', 'नया कॉलर जोड़ें')}</span>
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-[#0D2219] p-4 md:p-5 rounded-2xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A7065] dark:text-[#9FB5AA]" size={18} />
            <input
              type="text"
              placeholder={t('Search by livestock name, breed or Collar ID...', 'பெயர் அல்லது காலர் ஐடி மூலம் தேடுக...', 'नाम या कॉलर आईडी से खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F7F6F0] dark:bg-[#06140E] text-[#103B2D] dark:text-white border border-[#DDEADF] dark:border-[#174D38] rounded-xl focus:outline-none focus:border-[#4B8A64] focus:ring-2 focus:ring-[#4B8A64]/20 text-sm font-medium transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Animal Type Pills */}
            <div className="flex items-center gap-1 bg-[#EEF5F0] dark:bg-[#06140E] p-1 rounded-xl border border-[#DDEADF]/60 dark:border-[#174D38] text-xs font-semibold">
              {['ALL', 'Cow', 'Buffalo', 'Goat'].map((type) => (
                <button
                  key={type}
                  onClick={() => setAnimalTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    animalTypeFilter === type
                      ? 'bg-white dark:bg-[#103B2D] text-[#103B2D] dark:text-white shadow-xs font-bold'
                      : 'text-[#5A7065] dark:text-[#9FB5AA] hover:text-[#103B2D] dark:hover:text-white'
                  }`}
                >
                  {type === 'ALL' ? t('All Types') : type === 'Cow' ? '🐄 Cow' : type === 'Buffalo' ? '🐃 Buffalo' : '🐐 Goat'}
                </button>
              ))}
            </div>

            {/* Health Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 text-xs font-bold rounded-xl border border-[#DDEADF] dark:border-[#174D38] bg-[#F7F6F0] dark:bg-[#06140E] text-[#20312A] dark:text-[#DDEADF] focus:outline-none focus:ring-2 focus:ring-[#4B8A64]/20"
            >
              <option value="ALL">{t('All Health Status')}</option>
              <option value="Healthy">🟢 Healthy</option>
              <option value="Warning">🟡 Warning</option>
              <option value="Emergency">🔴 Emergency</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 text-xs font-bold rounded-xl border border-[#DDEADF] dark:border-[#174D38] bg-[#F7F6F0] dark:bg-[#06140E] text-[#20312A] dark:text-[#DDEADF] focus:outline-none focus:ring-2 focus:ring-[#4B8A64]/20"
            >
              <option value="name-asc">{t('Name (A → Z)')}</option>
              <option value="name-desc">{t('Name (Z → A)')}</option>
              <option value="id-asc">{t('Collar ID (Asc)')}</option>
              <option value="id-desc">{t('Collar ID (Desc)')}</option>
            </select>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {cattleLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
                <Skeleton className="h-44 w-full rounded-2xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCattle.length > 0 ? (
          /* Grid View Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCattle.map((cow) => {
              const isEmergency = cow.status === 'Emergency';
              const isWarning = cow.status === 'Warning';
              const vacCount = (cow.vaccinations || []).length;
              const medCount = (cow.medicalTreatments || []).length;
              const batt = cow.telemetry?.battery ?? 85;

              return (
                <div 
                  key={cow.id}
                  onClick={() => handleSelectCattle(cow.id)}
                  className="bg-white dark:bg-[#0D2219] rounded-3xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs overflow-hidden hover:shadow-xl hover:border-[#4B8A64] transition-all duration-300 cursor-pointer group hover:-translate-y-1 flex flex-col relative"
                >
                  {/* Photo Header */}
                  <div className="h-44 overflow-hidden relative bg-[#EEF5F0] dark:bg-[#06140E]">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                      {cow.animalType === 'Sheep' ? '🐑' : cow.animalType === 'Goat' ? '🐐' : cow.animalType === 'Buffalo' ? '🐃' : '🐄'}
                    </div>

                    {cow.photo && (
                      <img
                        src={cow.photo}
                        alt={cow.name}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="relative w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-1"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-2" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold rounded-xl border border-white/10 uppercase tracking-wider flex items-center gap-1">
                        <Cpu size={12} className="text-emerald-400" />
                        <span>ID: {cow.id}</span>
                      </div>
                    </div>

                    {/* 3-Dot Actions Menu */}
                    <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu
                        trigger={
                          <button
                            type="button"
                            className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center transition-colors border border-white/10"
                            title={t('Collar Options')}
                          >
                            <MoreVertical size={16} />
                          </button>
                        }
                      >
                        <DropdownMenuItem
                          icon={Eye}
                          onClick={() => handleSelectCattle(cow.id)}
                        >
                          {t('View Details', 'விவரங்கள்')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          icon={Edit}
                          onClick={(e) => handleEditClick(e, cow)}
                        >
                          {t('Edit Collar', 'காலர் மாற்று')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          destructive
                          icon={Trash2}
                          onClick={(e) => handleDeleteClick(e, cow)}
                        >
                          {t('Delete Collar', 'காலர் நீக்கு')}
                        </DropdownMenuItem>
                      </DropdownMenu>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white z-3">
                      <span className="text-[11px] font-bold tracking-wide flex items-center gap-1 text-[#DDEADF]">
                        <Radio size={12} className="text-emerald-400 animate-pulse" />
                        {cow.deviceStatus || 'Online'}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        <Battery size={13} className={batt < 20 ? 'text-rose-400' : 'text-emerald-400'} />
                        <span>{batt}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="text-xl font-black text-[#103B2D] dark:text-white font-display group-hover:text-[#4B8A64] transition-colors">
                            {cow.name}
                          </h3>
                          <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA] font-semibold mt-0.5">
                            {t(cow.breed)} • {cow.age}
                          </p>
                        </div>
                        <span className="text-[10px] bg-[#EEF5F0] dark:bg-[#174D38]/40 text-[#174D38] dark:text-[#A8D5BA] px-2 py-1 rounded-lg font-bold border border-[#DDEADF]/50 dark:border-[#174D38]/50 shrink-0">
                          {vacCount} {t('Vaccines', 'தடுப்பூசி')}
                        </span>
                      </div>

                      {/* Vitals Summary Pill */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#DDEADF]/60 dark:border-[#174D38]/60 text-xs">
                        <div className="flex items-center gap-1.5 text-[#5A7065] dark:text-[#9FB5AA]">
                          <Heart size={14} className="text-rose-500" />
                          <span className="font-bold text-[#103B2D] dark:text-white">{cow.telemetry?.heartRate || 72} BPM</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#5A7065] dark:text-[#9FB5AA]">
                          <Thermometer size={14} className="text-amber-500" />
                          <span className="font-bold text-[#103B2D] dark:text-white">{cow.telemetry?.temperature || 38.6}°C</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="pt-3 border-t border-[#DDEADF]/60 dark:border-[#174D38]/60 flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${
                        isEmergency ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {isEmergency ? <AlertTriangle size={15} className="animate-pulse" /> :
                         isWarning ? <AlertTriangle size={15} /> :
                         <ShieldCheck size={15} />}
                        <span>
                          {isEmergency ? t('Emergency', 'அவசரம்', 'ஆபாத்', 'आपातकाल') :
                           isWarning ? t('Warning', 'எச்சரிக்கை', 'चेतावनी') :
                           t('Healthy', 'ஆரோக்கியம்', 'स्वस्थ')}
                        </span>
                      </div>

                      <span className="text-[11px] text-[#4B8A64] dark:text-[#A8D5BA] font-bold flex items-center gap-1">
                        <Pill size={13} />
                        {medCount} {t('Treatments', 'சிகிச்சை')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search / Fleet State */
          <div className="text-center py-20 bg-white dark:bg-[#0D2219] rounded-3xl border border-dashed border-[#DDEADF] dark:border-[#174D38]/60 p-8">
            <div className="w-16 h-16 bg-[#EEF5F0] dark:bg-[#174D38]/40 text-[#4B8A64] rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Cpu size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#103B2D] dark:text-white font-display">
              {searchQuery ? t('No matching livestock found') : t('No collars registered yet')}
            </h3>
            <p className="text-[#5A7065] dark:text-[#9FB5AA] text-sm mt-1.5 max-w-md mx-auto">
              {searchQuery
                ? t('Try adjusting your search query or check the Collar ID again.')
                : t('Connect your first BioSense IoT collar to monitor live cattle vitals, location, and vaccinations in real time.')}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {searchQuery ? (
                <Button variant="secondary" onClick={() => setSearchQuery('')}>
                  {t('Clear Search')}
                </Button>
              ) : null}
              <Button variant="default" onClick={() => setShowAddModal(true)}>
                <Plus size={18} />
                <span>{t('Register New Collar', 'புதிய காலர் சேர்')}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Add Collar Dialog */}
        <CollarFormDialog
          open={showAddModal}
          onOpenChange={setShowAddModal}
          initialData={null}
          existingCattle={cattle}
          onSubmit={addCollar}
          t={t}
        />

        {/* Edit Collar Dialog */}
        <CollarFormDialog
          open={Boolean(editingCollar)}
          onOpenChange={(open) => !open && setEditingCollar(null)}
          initialData={editingCollar}
          existingCattle={cattle}
          onSubmit={(updates) => updateCollar(editingCollar.id, updates)}
          t={t}
        />

        {/* Delete Collar Dialog */}
        <DeleteCollarDialog
          open={Boolean(deletingCollar)}
          onOpenChange={(open) => !open && setDeletingCollar(null)}
          collar={deletingCollar}
          onConfirmDelete={removeCollar}
          t={t}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. DETAIL VIEW LOGIC
  // ---------------------------------------------------------------------------
  const cow = cattle.find((c) => String(c.id) === String(selectedCattleId)) || cattle[0];

  if (!cow) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('No collar selected')}</h3>
        <Button className="mt-4" onClick={() => setViewMode('list')}>{t('Back to List')}</Button>
      </div>
    );
  }

  const hr = cow.telemetry?.heartRate || 72;
  const temp = cow.telemetry?.temperature || 38.6;
  const batt = cow.telemetry?.battery ?? 90;
  const status = cow.status || 'Healthy';
  const tempF = ((temp * 9) / 5 + 32).toFixed(1);

  const cowVaccinations = cow.vaccinations || [];
  const cowTreatments = cow.medicalTreatments || [];
  const cowHealthLogs = cow.healthMonitoringHistory || [];

  // Historical vitals for Recharts
  const historyData = (cow.history?.timeLabels || ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']).map((time, idx) => ({
    time,
    heartRate: cow.history?.heartRate?.[idx] || 72,
    temperature: cow.history?.temperature?.[idx] || 38.6
  }));

  let statusBg = 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900';
  let statusText = 'text-emerald-700 dark:text-emerald-400';
  let statusIcon = <ShieldCheck className="text-emerald-500" size={24} />;
  let statusMsg = t('All vitals are stable. Live sensors indicating normal resting range.', 'அனைத்து உடல்நிலைகளும் சீராக உள்ளன.');

  if (status === 'Emergency') {
    statusBg = 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 animate-pulse';
    statusText = 'text-rose-700 dark:text-rose-400';
    statusIcon = <AlertTriangle className="text-rose-500" size={24} />;
    statusMsg = t(`Emergency vital spike: Heart rate is at ${hr} BPM and temperature is at ${temp}°C.`);
  } else if (status === 'Warning') {
    statusBg = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900';
    statusText = 'text-amber-700 dark:text-amber-400';
    statusIcon = <AlertTriangle className="text-amber-500" size={24} />;
    statusMsg = batt < 20 
      ? t(`Warning: Collar battery level is low (${batt}%). Please recharge transmitter.`)
      : t('Warning: Minor vital fluctuations detected. Continued observation advised.');
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

  return (
    <div className="space-y-6 font-sans pb-12 max-w-7xl mx-auto print:max-w-none print:p-0">
      
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0D2219] p-4 rounded-2xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs print:hidden">
        <button 
          onClick={() => setViewMode('list')}
          className="flex items-center gap-2 px-4 py-2 bg-[#F7F6F0] dark:bg-[#174D38]/30 hover:bg-[#EEF5F0] dark:hover:bg-[#174D38]/50 text-[#103B2D] dark:text-[#DDEADF] font-bold text-sm rounded-xl transition-all w-max border border-[#DDEADF] dark:border-[#174D38]"
        >
          <ArrowLeft size={16} />
          {t('Back to all Cattle', 'அனைத்து மாடுகளுக்கும் திரும்பவும்', 'सभी मवेशियों पर वापस जाएं')}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingCollar(cow)}
            className="gap-1.5 border-[#DDEADF] dark:border-[#174D38]"
          >
            <Edit size={14} />
            <span>{t('Edit Collar', 'காலர் மாற்று')}</span>
          </Button>

          <Button
            variant="subtleRose"
            size="sm"
            onClick={() => setDeletingCollar(cow)}
            className="gap-1.5"
          >
            <Trash2 size={14} />
            <span>{t('Delete Collar', 'நீக்கு')}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5"
          >
            <Printer size={14} />
            <span>{t('Print Passport', 'பாஸ்போர்ட் அச்சிடுக')}</span>
          </Button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF5F0] dark:bg-[#174D38]/50 text-[#174D38] dark:text-[#A8D5BA] text-xs font-bold">
            <Radio size={12} className="text-emerald-500 animate-pulse" />
            <span>{t('Live Telemetry ⚡')}</span>
          </span>
        </div>
      </div>

      {/* Meta Profile Card */}
      <div className="bg-white dark:bg-[#0D2219] rounded-3xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 animate-in fade-in zoom-in-95 duration-300">
        <div className="md:col-span-1 h-64 md:h-full min-h-[220px] relative bg-[#EEF5F0] dark:bg-[#06140E]">
          <div className="absolute inset-0 flex items-center justify-center text-8xl">
            {cow.animalType === 'Sheep' ? '🐑' : cow.animalType === 'Goat' ? '🐐' : cow.animalType === 'Buffalo' ? '🐃' : '🐄'}
          </div>
          {cow.photo && (
            <img
              src={cow.photo}
              alt={cow.name}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="relative w-full h-full object-cover z-1"
            />
          )}
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold rounded-lg border border-white/10 uppercase z-2">
            {t('Collar ID')}: {cow.id}
          </div>
        </div>

        <div className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#4B8A64] dark:text-[#A8D5BA] tracking-widest uppercase flex items-center gap-1.5">
                <Cpu size={14} />
                {t('Collar Activated Node', 'காலர் ஐடி பதிவிறக்கம்')}
              </span>
              <span className="text-xs text-[#5A7065] dark:text-[#9FB5AA] font-bold">Node UID: #{cow.id}</span>
            </div>
            
            <h2 className="text-3xl font-black text-[#103B2D] dark:text-white font-display flex items-center gap-3">
              <span>{cow.name}</span>
              {cow.nickname && (
                <span className="text-sm font-semibold text-[#5A7065] dark:text-[#9FB5AA]">({cow.nickname})</span>
              )}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-[#F7F6F0] dark:bg-[#06140E] rounded-xl border border-[#DDEADF]/60 dark:border-[#174D38]/60">
                <span className="text-[10px] text-[#5A7065] dark:text-[#9FB5AA] font-bold uppercase">{t('Breed', 'இனம்')}</span>
                <p className="text-xs font-bold text-[#103B2D] dark:text-white mt-0.5">{t(cow.breed)}</p>
              </div>
              <div className="p-3 bg-[#F7F6F0] dark:bg-[#06140E] rounded-xl border border-[#DDEADF]/60 dark:border-[#174D38]/60">
                <span className="text-[10px] text-[#5A7065] dark:text-[#9FB5AA] font-bold uppercase">{t('Age', 'வயது')}</span>
                <p className="text-xs font-bold text-[#103B2D] dark:text-white mt-0.5">{cow.age}</p>
              </div>
              <div className="p-3 bg-[#F7F6F0] dark:bg-[#06140E] rounded-xl border border-[#DDEADF]/60 dark:border-[#174D38]/60">
                <span className="text-[10px] text-[#5A7065] dark:text-[#9FB5AA] font-bold uppercase">{t('Gender', 'பாலினம்')}</span>
                <p className="text-xs font-bold text-[#103B2D] dark:text-white mt-0.5">{cow.gender || 'Female'}</p>
              </div>
              <div className="p-3 bg-[#F7F6F0] dark:bg-[#06140E] rounded-xl border border-[#DDEADF]/60 dark:border-[#174D38]/60">
                <span className="text-[10px] text-[#5A7065] dark:text-[#9FB5AA] font-bold uppercase">{t('Health Passport')}</span>
                <p className="text-xs font-bold text-[#4B8A64] dark:text-[#A8D5BA] mt-0.5">BIO-{cow.id}-PASS</p>
              </div>
            </div>
          </div>

          {/* Status Indicators Banner */}
          <div className={`p-4 border rounded-2xl flex items-start gap-3.5 ${statusBg}`}>
            <div className="shrink-0 mt-0.5">{statusIcon}</div>
            <div>
              <h4 className={`text-sm font-bold uppercase tracking-wider ${statusText}`}>
                {status === 'Healthy' ? t('Healthy Vitals Status', 'ஆரோக்கிய நிலை') : status === 'Warning' ? t('Warning Status', 'எச்சரிக்கை நிலை') : t('Emergency Status Alert', 'அவசர நிலை எச்சரிக்கை')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{statusMsg}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex bg-white dark:bg-[#0D2219] p-1.5 rounded-2xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs gap-1 overflow-x-auto print:hidden">
        {[
          { id: 'overview', label: t('Overview', 'சுருக்கம்'), icon: Sparkles },
          { id: 'telemetry', label: t('Live Health & Vitals', 'நேரலை உடல்நிலை'), icon: Activity },
          { id: 'gps', label: t('GPS & Geofencing', 'ஜிபிஎஸ் வரைபடம்'), icon: MapPin },
          { id: 'vaccines', label: `${t('Vaccination Records', 'தடுப்பூசி')} (${cowVaccinations.length})`, icon: ShieldCheck },
          { id: 'treatments', label: `${t('Medical History', 'சிகிச்சை')} (${cowTreatments.length})`, icon: Pill },
          { id: 'collar', label: t('Collar Hardware', 'காலர் வன்பொருள்'), icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabSub === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabSub(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#103B2D] dark:bg-[#174D38] text-white shadow-xs'
                  : 'text-[#5A7065] dark:text-[#9FB5AA] hover:text-[#103B2D] dark:hover:text-white'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {activeTabSub === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vitals Snapshot */}
            <div className="bg-white dark:bg-[#0D2219] p-6 rounded-3xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#5A7065] dark:text-[#9FB5AA]">{t('Real-Time Vitals Snapshot')}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F7F6F0] dark:bg-[#06140E] rounded-2xl">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-[#5A7065] dark:text-[#9FB5AA]">
                    <Heart size={16} className="text-rose-500 animate-pulse-heart" />
                    <span>{t('Heart Rate')}</span>
                  </div>
                  <span className="font-extrabold text-sm text-[#103B2D] dark:text-white">{hr} BPM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F7F6F0] dark:bg-[#06140E] rounded-2xl">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-[#5A7065] dark:text-[#9FB5AA]">
                    <Thermometer size={16} className="text-amber-500" />
                    <span>{t('Body Temperature')}</span>
                  </div>
                  <span className="font-extrabold text-sm text-[#103B2D] dark:text-white">{temp}°C ({tempF}°F)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F7F6F0] dark:bg-[#06140E] rounded-2xl">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-[#5A7065] dark:text-[#9FB5AA]">
                    <Battery size={16} className="text-emerald-500" />
                    <span>{t('Transmitter Battery')}</span>
                  </div>
                  <span className="font-extrabold text-sm text-[#103B2D] dark:text-white">{batt}%</span>
                </div>
              </div>
            </div>

            {/* Recent Medical Log */}
            <div className="bg-white dark:bg-[#0D2219] p-6 rounded-3xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#5A7065] dark:text-[#9FB5AA]">{t('Recent Medical Event')}</h4>
                <Button variant="ghost" size="sm" onClick={() => setActiveTabSub('treatments')} className="text-xs text-[#4B8A64]">
                  {t('View All')}
                </Button>
              </div>
              {cowTreatments[0] ? (
                <div className="p-4 bg-[#EEF5F0]/60 dark:bg-[#174D38]/20 border border-[#DDEADF]/60 dark:border-[#174D38]/40 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold text-[#4B8A64] dark:text-[#A8D5BA] uppercase">{cowTreatments[0].date}</span>
                  <h5 className="font-bold text-sm text-[#103B2D] dark:text-white">{cowTreatments[0].diagnosis}</h5>
                  <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA] line-clamp-2">{cowTreatments[0].symptomsObserved}</p>
                </div>
              ) : (
                <p className="text-xs text-[#5A7065] italic py-6 text-center">{t('No medical treatments recorded.')}</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#0D2219] p-6 rounded-3xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs space-y-3 flex flex-col justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#5A7065] dark:text-[#9FB5AA]">{t('Quick Operations')}</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 text-xs border-[#DDEADF] dark:border-[#174D38]" onClick={() => setActiveTabSub('gps')}>
                  <MapPin size={15} className="text-[#4B8A64]" />
                  <span>{t('Inspect Live GPS Map')}</span>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-xs border-[#DDEADF] dark:border-[#174D38]" onClick={() => setShowVacModal(true)}>
                  <Plus size={15} className="text-emerald-500" />
                  <span>{t('Log Vaccination')}</span>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-xs border-[#DDEADF] dark:border-[#174D38]" onClick={() => setShowMedModal(true)}>
                  <Pill size={15} className="text-[#4B8A64]" />
                  <span>{t('Record Treatment')}</span>
                </Button>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setEditingCollar(cow)} className="w-full">
                {t('Configure Collar')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: LIVE HEALTH & TELEMETRY ── */}
      {activeTabSub === 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Heart Rate Dial */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Heart Rate')}</span>
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500">
                  <Heart size={18} className="animate-pulse-heart" />
                </div>
              </div>
              <div>
                <h3 className={`text-4xl font-extrabold font-display ${hr > 105 || hr < 50 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {hr} <span className="text-sm font-semibold text-slate-400">BPM</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{t('Normal resting: 60-90 BPM')}</p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${hr > 105 || hr < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min((hr / 150) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Temperature Dial */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Body Temperature')}</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500">
                  <Thermometer size={18} />
                </div>
              </div>
              <div>
                <h3 className={`text-4xl font-extrabold font-display ${temp > 40.0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {temp}°C
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{tempF}°F • {t('Normal: 38.5 - 39.5°C')}</p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${temp > 40.0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(((temp - 35) / 10) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* GPS Summary */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Live GPS Coordinates')}</span>
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-teal-500">
                  <MapPin size={18} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100 truncate">
                  {cow.telemetry?.gps?.lat?.toFixed(5) || '11.07780'}° N
                </h4>
                <h4 className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100 truncate">
                  {cow.telemetry?.gps?.lng?.toFixed(5) || '77.14287'}° E
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">{t('Transmitting via NEO-6M GPS')}</p>
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 py-1.5 px-2.5 rounded-lg flex justify-between items-center">
                <span>{t('Geofence Safe Zone')}</span>
                <span>{t('INSIDE 🟢')}</span>
              </div>
            </div>

            {/* Battery Status */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Collar Battery')}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${batt < 20 ? 'bg-rose-50 text-rose-500 animate-pulse' : 'bg-emerald-50 text-emerald-500'}`}>
                  <Battery size={18} />
                </div>
              </div>
              <div>
                <h3 className={`text-4xl font-extrabold font-display ${batt < 20 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {batt}%
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{batt < 20 ? t('Charge Immediately') : t('Collar Transmitting')}</p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${batt < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${batt}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recharts Vitals Trend Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {t('24-Hour Heart Rate & Temperature Trend', 'இதயத்துடிப்பு & வெப்பநிலை வரலாறு')}
                </h4>
                <p className="text-xs text-slate-400">{t('Real-time sensor intervals streamed from collar transmitter')}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Heart Rate (BPM)
                </span>
                <span className="flex items-center gap-1.5 text-teal-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Temperature (°C)
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="temperature" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: GPS LOCATION & GEOFENCING ── */}
      {activeTabSub === 'gps' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <MapPin className="text-teal-500" size={22} />
                <span>{t('Live GPS Position & Grazing Geofence', 'ஜிபிஎஸ் நேரலை வரைபடம்')}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('Collar GPS transmitter broadcasts exact coordinates every 5 seconds with geofence breach alert.')}
              </p>
            </div>

            <Button variant="default" size="sm" onClick={() => setActiveTab('gps')}>
              <Compass size={16} />
              <span>{t('Open Full GPS Command Map')}</span>
            </Button>
          </div>

          <div className="h-96 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
            <MapContainer
              center={[cow.telemetry?.gps?.lat || 11.077809, cow.telemetry?.gps?.lng || 77.142879]}
              zoom={16}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[cow.telemetry?.gps?.lat || 11.077809, cow.telemetry?.gps?.lng || 77.142879]}
                icon={cowMarkerIcon}
              >
                <Popup>
                  <div className="p-1">
                    <p className="font-bold text-sm text-slate-900">{cow.name}</p>
                    <p className="text-xs text-slate-600">Collar ID: #{cow.id}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Battery: {batt}% • Status: {status}</p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[11.077809, 77.142879]}
                radius={250}
                pathOptions={{ color: '#059669', fillColor: '#10b981', fillOpacity: 0.15 }}
              />
            </MapContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t('Latitude')}</span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {cow.telemetry?.gps?.lat?.toFixed(6) || '11.077809'}° N
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t('Longitude')}</span>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                {cow.telemetry?.gps?.lng?.toFixed(6) || '77.142879'}° E
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t('Geofence Radius')}</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                250 meters (Safe Grazing)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: VACCINATION RECORDS & SCHEDULE ── */}
      {activeTabSub === 'vaccines' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={22} />
                {t(`Vaccination Passport: ${cow.name}`, `${cow.name}-இன் தடுப்பூசி விவரங்கள்`)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('Immunization timeline, completed doses, and upcoming booster reminders.')}
              </p>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => setShowVacModal(true)}
              className="gap-2"
            >
              <Plus size={16} />
              <span>{t('Add Vaccination Record', 'தடுப்பூசி பதிவு சேர்')}</span>
            </Button>
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
                    <Badge variant={vac.status === 'Completed' ? 'emerald' : 'warning'}>
                      {vac.status === 'Completed' ? t('Completed', 'முடிந்தது') : t('Upcoming Booster', 'அடுத்த தவணை')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200/60 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Date Given', 'செலுத்திய தேதி')}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{vac.dateAdministered}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Next Due Date', 'அடுத்த தவணை')}</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{vac.nextDueDate || 'Annual'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Dosage & Route', 'அளவு')}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{vac.dosage}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Batch #', 'பேட்ச் எண்')}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{vac.batchNo}</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <p><strong>{t('Administered by:', 'மருத்துவர்:')}</strong> {vac.administeredBy}</p>
                    {vac.notes && <p className="italic text-slate-600 dark:text-slate-400">"{vac.notes}"</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <ShieldCheck className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('No vaccination records logged yet')}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVacModal(true)}
                className="mt-3 text-emerald-600"
              >
                + {t('Add First Vaccination')}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: MEDICAL TREATMENT & PRESCRIPTIONS ── */}
      {activeTabSub === 'treatments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Pill className="text-teal-500" size={22} />
                {t(`Medical History & Tele-Care: ${cow.name}`)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('Recorded clinical diagnoses, active antibiotic courses, and follow-up schedules.')}
              </p>
            </div>

            <Button
              variant="teal"
              size="sm"
              onClick={() => setShowMedModal(true)}
              className="gap-2"
            >
              <Plus size={16} />
              <span>{t('Record Medical Treatment', 'மருத்துவ பதிவு சேர்')}</span>
            </Button>
          </div>

          {cowTreatments.length > 0 ? (
            <div className="space-y-4">
              {cowTreatments.map((med) => (
                <div
                  key={med.id}
                  className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{med.date}</span>
                        <Badge variant={med.severity === 'Severe' ? 'destructive' : med.severity === 'Moderate' ? 'warning' : 'emerald'}>
                          {med.severity}
                        </Badge>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white font-display mt-1">
                        {med.diagnosis}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-900">
                        {med.recoveryStatus || 'Under Treatment'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <strong>{t('Clinical Observations:')}</strong> {med.symptomsObserved}
                  </p>

                  {med.prescriptions && med.prescriptions.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('Prescribed Rx Protocol:')}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {med.prescriptions.map((rx, rIdx) => (
                          <div key={rIdx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                            <p className="font-bold text-slate-800 dark:text-slate-200">{rx.drug}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{rx.dosage} • {rx.duration}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span>{t('Treating Vet:')} <strong>{med.treatingDoctor}</strong></span>
                    {med.followUpDate && <span>{t('Follow-up:')} <strong>{med.followUpDate}</strong></span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <Pill className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('No medical treatments recorded')}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMedModal(true)}
                className="mt-3 text-teal-600"
              >
                + {t('Log First Treatment')}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: COLLAR HARDWARE DIAGNOSTICS ── */}
      {activeTabSub === 'collar' && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Cpu className="text-emerald-500" size={22} />
                <span>{t('Collar Hardware & Sensor Telemetry Node')}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('Physical collar device parameters, sensor calibration, and wireless connectivity status.')}
              </p>
            </div>

            <Button variant="default" size="sm" onClick={() => setEditingCollar(cow)}>
              <Edit size={16} />
              <span>{t('Edit Collar Metadata')}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t('Collar Hardware ID')}</span>
              <p className="text-base font-mono font-black text-slate-900 dark:text-white mt-1">#{cow.id}</p>
              <span className="text-[10px] text-emerald-600 font-bold">Stable Device Identifier</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t('Firmware Version')}</span>
              <p className="text-base font-mono font-black text-slate-900 dark:text-white mt-1">v2.4.1-BLE</p>
              <span className="text-[10px] text-slate-400">Up to date</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t('Wireless Transceiver')}</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">ESP32 + 4G LTE</p>
              <span className="text-[10px] text-emerald-600 font-bold">Signal: -68 dBm (Strong)</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t('Sensor Package')}</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">MAX30102 + DS18B20</p>
              <span className="text-[10px] text-slate-400">PPG & Contact Probe</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
            <h5 className="text-xs font-bold uppercase text-slate-500">{t('Owner & Association')}</h5>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t('Linked Farmer ID:')} <span className="font-mono text-emerald-600">{cow.farmerId || 'farmer-uma'}</span>
            </p>
            {cow.notes && (
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <strong>{t('Herd Notes:')}</strong> {cow.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Edit Collar Dialog */}
      <CollarFormDialog
        open={Boolean(editingCollar)}
        onOpenChange={(open) => !open && setEditingCollar(null)}
        initialData={editingCollar}
        existingCattle={cattle}
        onSubmit={(updates) => updateCollar(editingCollar.id, updates)}
        t={t}
      />

      {/* Delete Collar Dialog */}
      <DeleteCollarDialog
        open={Boolean(deletingCollar)}
        onOpenChange={(open) => !open && setDeletingCollar(null)}
        collar={deletingCollar}
        onConfirmDelete={async (id) => {
          await removeCollar(id);
          setViewMode('list');
        }}
        t={t}
      />

      {/* Vaccination Modal */}
      {showVacModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
                {t('Add Vaccination Record', 'தடுப்பூசி பதிவு சேர்க்க')}
              </h3>
              <button onClick={() => setShowVacModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVaccination} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Vaccine Name')}</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. FMD Bi-annual Booster"
                  value={vacForm.name}
                  onChange={(e) => setVacForm({ ...vacForm, name: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Date Administered')}</label>
                  <input
                    type="date"
                    value={vacForm.dateAdministered}
                    onChange={(e) => setVacForm({ ...vacForm, dateAdministered: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Next Due Date')}</label>
                  <input
                    type="date"
                    value={vacForm.nextDueDate}
                    onChange={(e) => setVacForm({ ...vacForm, nextDueDate: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Batch Number')}</label>
                <input
                  type="text"
                  placeholder="e.g. FMD-TN-2026-09"
                  value={vacForm.batchNo}
                  onChange={(e) => setVacForm({ ...vacForm, batchNo: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Clinical Notes')}</label>
                <textarea
                  rows={2}
                  value={vacForm.notes}
                  onChange={(e) => setVacForm({ ...vacForm, notes: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button variant="secondary" size="sm" type="button" onClick={() => setShowVacModal(false)}>
                  {t('Cancel')}
                </Button>
                <Button variant="default" size="sm" type="submit">
                  {t('Save Record')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Treatment Modal */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
                {t('Record Medical Treatment', 'மருத்துவ சிகிச்சை சேர்க்க')}
              </h3>
              <button onClick={() => setShowMedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Diagnosis / Condition')}</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Mild Mastitis, Rumen Acidosis"
                  value={medForm.diagnosis}
                  onChange={(e) => setMedForm({ ...medForm, diagnosis: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Severity')}</label>
                  <select
                    value={medForm.severity}
                    onChange={(e) => setMedForm({ ...medForm, severity: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Recovery Status')}</label>
                  <select
                    value={medForm.recoveryStatus}
                    onChange={(e) => setMedForm({ ...medForm, recoveryStatus: e.target.value })}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                  >
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Recovering">Recovering</option>
                    <option value="Fully Recovered">Fully Recovered</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Symptoms Observed')}</label>
                <textarea
                  rows={2}
                  value={medForm.symptomsObserved}
                  onChange={(e) => setMedForm({ ...medForm, symptomsObserved: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('Prescribed Medicine (Drug)')}</label>
                <input
                  type="text"
                  placeholder="e.g. Cloxacillin Infusion"
                  value={medForm.drugName}
                  onChange={(e) => setMedForm({ ...medForm, drugName: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button variant="secondary" size="sm" type="button" onClick={() => setShowMedModal(false)}>
                  {t('Cancel')}
                </Button>
                <Button variant="teal" size="sm" type="submit">
                  {t('Save Treatment')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
