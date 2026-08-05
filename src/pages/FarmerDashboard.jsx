import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, ArrowRight, ShieldAlert, Heart, Battery, Compass, ChevronRight, Activity, Thermometer } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

export default function FarmerDashboard() {
  const { cattle, addCollar, setSelectedCattleId, setActiveTab, t } = useContext(AppContext);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [collarId, setCollarId] = useState('');
  const [breed, setBreed] = useState('Gir');
  const [age, setAge] = useState('3');
  const [gender, setGender] = useState('Female');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Stats calculation
  const totalCount = cattle.length;
  const healthyCount = cattle.filter((c) => c.status === 'Healthy').length;
  const warningCount = cattle.filter((c) => c.status === 'Warning').length;
  const emergencyCount = cattle.filter((c) => c.status === 'Emergency').length;

  const handleCardClick = (id) => {
    setSelectedCattleId(id);
    setActiveTab('cattle-details');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(t('Please enter an animal name', 'தயவுசெய்து மாட்டின் பெயரை உள்ளிடவும்'));
      return;
    }
    if (!collarId.trim()) {
      setErrorMsg(t('Please enter a collar ID', 'காலர் ஐடியை உள்ளிடவும்'));
      return;
    }

    setIsConnecting(true);
    
    // Simulate hardware connection delay
    setTimeout(() => {
      addCollar({
        id: collarId,
        name,
        nickname,
        breed,
        age,
        gender,
        photo: photoPreview || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&auto=format&fit=crop&q=80'
      });

      // Reset and close
      setName('');
      setNickname('');
      setCollarId('');
      setBreed('Gir');
      setAge('3');
      setGender('Female');
      setPhoto(null);
      setPhotoPreview('');
      setErrorMsg('');
      setIsConnecting(false);
      setShowAddModal(false);

      // Confetti burst
      canvasConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-display">
            {t('Welcome, Uma', 'வரவேற்கிறோம், உமா')} 🌾
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {t("Here is the live status of your dairy farm's livestock.", 'இன்று உங்களது பண்ணை கால்நடைகளின் நேரடி உடல்நிலை விவரங்கள்.')}
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg('');
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md shadow-emerald-700/10 hover:shadow-lg active:scale-98 transition-all cursor-pointer text-sm"
        >
          <Plus size={18} />
          <span>{t('Add New Collar', 'புதிய காலர் சேர்')}</span>
        </button>
      </div>

      {/* Summary Vitals Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total */}
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg sm:text-xl shrink-0">
            🐄
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider leading-tight">{t('My Cattle', 'மொத்த மாடுகள்')}</p>
            <h4 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{totalCount}</h4>
          </div>
        </div>

        {/* Healthy */}
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0">
            <Activity size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider leading-tight">{t('Healthy', 'ஆரோக்கியம்')}</p>
            <h4 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{healthyCount}</h4>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 shrink-0">
            <Battery size={20} className="rotate-270 sm:w-6 sm:h-6" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider leading-tight">{t('Warning', 'எச்சரிக்கை')}</p>
            <h4 className="text-xl sm:text-2xl font-bold text-amber-500">{warningCount}</h4>
          </div>
        </div>

        {/* Emergency */}
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 shrink-0">
            <ShieldAlert size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider leading-tight">{t('Emergency', 'அவசரநிலை')}</p>
            <h4 className="text-xl sm:text-2xl font-bold text-rose-500">{emergencyCount}</h4>
          </div>
        </div>
      </div>

      {/* Cattle Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cattle.map((cow) => {
          const isEmergency = cow.status === 'Emergency';
          const isWarning = cow.status === 'Warning';
          
          let statusBadgeColor = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
          let statusLabel = t('🟢 Healthy', '🟢 நலம்');

          if (isEmergency) {
            statusBadgeColor = 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 animate-pulse';
            statusLabel = t('🔴 Emergency', '🔴 அவசரநிலை');
          } else if (isWarning) {
            statusBadgeColor = 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900';
            statusLabel = t('🟡 Warning', '🟡 எச்சரிக்கை');
          }

          return (
            <div
              key={cow.id}
              onClick={() => handleCardClick(cow.id)}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
            >
              {/* Card Header Info */}
              <div className="p-5 flex gap-4">
                <img
                  src={cow.photo}
                  alt={cow.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform"
                />
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">COLLAR ID: {cow.id}</span>
                    <span className={`px-2 py-0.5 text-xxs font-bold border rounded-lg uppercase tracking-wider ${statusBadgeColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                  
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {cow.name}
                  </h3>
                  
                  <p className="text-xs text-slate-500 font-medium">
                    {cow.breed} • {cow.age} • {cow.gender}
                  </p>
                </div>
              </div>

              {/* Sensor Live Feed Bar */}
              <div className="bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/60 p-4 grid grid-cols-3 gap-2 text-center">
                {/* Heart Rate */}
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Heart size={10} className="text-rose-500 animate-pulse-heart" />
                    {t('Heart Rate', 'இதயத்துடிப்பு')}
                  </span>
                  <p className={`text-sm font-bold ${cow.telemetry.heartRate > 100 || cow.telemetry.heartRate < 50 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                    {cow.telemetry.heartRate} <span className="text-xxs font-normal text-slate-400">BPM</span>
                  </p>
                </div>

                {/* Temperature */}
                <div className="space-y-0.5 border-x border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Thermometer size={10} className="text-amber-500" />
                    {t('Temperature', 'வெப்பநிலை')}
                  </span>
                  <p className={`text-sm font-bold ${cow.telemetry.temperature > 40.0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                    {cow.telemetry.temperature} <span className="text-xxs font-normal text-slate-400">°C</span>
                  </p>
                </div>

                {/* Battery */}
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Battery size={10} className={`${cow.telemetry.battery < 20 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} />
                    {t('Battery', 'பேட்டரி')}
                  </span>
                  <p className={`text-sm font-bold ${cow.telemetry.battery < 20 ? 'text-rose-500 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                    {cow.telemetry.battery}%
                  </p>
                </div>
              </div>

              {/* Action trigger footer */}
              <div className="px-5 py-3 bg-slate-100/50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>{t('View Telemetry & Health History', 'இருப்பிடம் & சுகாதார வரலாறு')}</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD COLLAR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 md:p-6 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Design header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 sticky top-0 bg-white dark:bg-slate-900 z-10 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐄</span>
                <div>
                  <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white font-display">
                    {t('Link New BioSense Collar', 'புதிய மாடு காலர் இணைக்கவும்')}
                  </h3>
                  <p className="text-xs text-slate-400">{t('Configure hardware node registration.', 'புதிய காலருக்கான விவரங்கள்.')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">{t('Animal Photo', 'மாட்டின் புகைப்படம்')}</label>
                <div className="relative w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center group cursor-pointer">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-slate-400 group-hover:scale-110 transition-transform">📷</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Animal Name', 'மாட்டின் பெயர்')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Lakshmi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Nick Name', 'செல்லப் பெயர்')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Lachu"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Hardware Collar ID', 'காலர் ஐடி')}</label>
                <input
                  type="text"
                  placeholder="e.g. 103"
                  value={collarId}
                  onChange={(e) => setCollarId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 dark:text-white border border-teal-200 dark:border-teal-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Breed', 'இனம்')}</label>
                  <select
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                  >
                    <option value="Gir">Gir (Desi)</option>
                    <option value="Jersey">Jersey</option>
                    <option value="Holstein">Holstein</option>
                    <option value="Sahiwal">Sahiwal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Age (Years)', 'வயது (வருடங்களில்)')}</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Gender', 'பாலினம்')}</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-850 p-1 rounded-xl">
                  {['Female', 'Male'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 rounded-lg font-bold text-xs capitalize transition-all ${
                        gender === g
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {t(g, g === 'Female' ? 'பெண்' : 'ஆண்')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3 pb-2 md:pb-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isConnecting}
                  className="w-1/2 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm transition-all disabled:opacity-50"
                >
                  {t('Cancel', 'ரத்து')}
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="w-1/2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl text-sm hover:shadow-lg hover:shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span className="text-xs sm:text-sm">{t('Connecting...', 'இணைக்கிறது...')}</span>
                    </>
                  ) : (
                    t('Link Collar', 'காலரை இணை')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
