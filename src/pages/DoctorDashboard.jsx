import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldAlert, Stethoscope, Users, Phone, ArrowRight, Activity, Thermometer } from 'lucide-react';

export default function DoctorDashboard() {
  const { cattle, consultations, setActiveTab, setSelectedCattleId, t } = useContext(AppContext);

  // Filter emergency cattle across all farms
  const emergencyCattle = cattle.filter((c) => c.status === 'Emergency');
  const activeConsultCount = consultations.filter((c) => c.status === 'Consulting').length;

  const handleConsultClick = (collarId) => {
    setSelectedCattleId(collarId);
    setActiveTab('doctor-consultation');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome doctor banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-display">
          {t('Welcome, Dr. Rajesh Kannan', 'வரவேற்கிறோம், டாக்டர் ராஜேஷ் கண்ணன்')} 🩺
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {t('Assigned Government District Vet Officer - Madurai East', 'அரசு நியமிக்கப்பட்ட கால்நடை மருத்துவ அதிகாரி - மதுரை கிழக்கு')}
        </p>
      </div>

      {/* Vet Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emergencies */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${emergencyCattle.length > 0 ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 animate-pulse' : 'bg-slate-55 dark:bg-slate-800 text-slate-400'}`}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('Emergency Cases', 'அவசர வழக்குகளின் எண்ணிக்கை')}</p>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{emergencyCattle.length}</h4>
          </div>
        </div>

        {/* Consulting queue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-teal-500">
            <Stethoscope size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('Consultations Room', 'ஆலோசனை அறைகள்')}</p>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{activeConsultCount}</h4>
          </div>
        </div>

        {/* Active Farms */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('Assigned Dairy Farms', 'கண்காணிக்கப்படும் பண்ணைகள்')}</p>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">42</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EMERGENCY ALERTS LOG */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-500" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Emergency Cases Queue', 'அவசர சிகிச்சை தேவைப்படுபவை')}</h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 min-h-[220px]">
            {emergencyCattle.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <span className="text-3xl">🛡️</span>
                <p className="text-xs font-bold">{t('Zero active distress telemetry signals in the district.', 'தற்போது எந்த அவசர வழக்குகளும் இல்லை.')}</p>
              </div>
            ) : (
              emergencyCattle.map((cow) => (
                <div key={cow.id} className="p-5 space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">🐄 {cow.name} (Collar {cow.id})</h4>
                      <p className="text-xxs text-slate-400 mt-0.5">{t('Farmer Name:', 'பயனர்:')} Uma • Madurai East</p>
                    </div>
                    <span className="px-2 py-0.5 text-xxs font-extrabold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-md animate-pulse">
                      CRITICAL HEALTH
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-rose-500 animate-pulse-heart" />
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">{t('Pulse Rate', 'இதயத்துடிப்பு')}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{cow.telemetry.heartRate} BPM</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer size={16} className="text-amber-500" />
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">{t('Temperature', 'வெப்பநிலை')}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{cow.telemetry.temperature}°C</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConsultClick(cow.id)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-xs hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t('Open Consultation Room', 'ஆலோசனையைத் தொடங்கு')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* OPEN CONSULTATION CASES LIST */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center gap-2">
            <Stethoscope size={18} className="text-teal-500" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('Active Consultations Queue', 'ஆலோசனை வேண்டுகோள்கள்')}</h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 min-h-[220px]">
            {consultations.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <span className="text-3xl">💬</span>
                <p className="text-xs font-bold">{t('No consultation requests pending.', 'ஆலோசனை கோரிக்கைகள் ஏதுமில்லை.')}</p>
              </div>
            ) : (
              consultations.map((consult) => (
                <div key={consult.id} className="p-5 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">👨🌾 {consult.farmerName} • {consult.animalName} (Collar {consult.collarId})</h4>
                    <p className="text-xxs text-slate-400 mt-1 font-bold">{t('Issue reported:', 'விவரித்த பிரச்சனை:')}</p>
                    <p className="text-xs text-slate-500 leading-normal mt-0.5 italic">{consult.symptoms}</p>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Status: <span className={consult.status === 'Consulting' ? 'text-teal-500 font-extrabold' : 'text-emerald-500 font-extrabold'}>{consult.status.toUpperCase()}</span>
                    </span>
                    
                    <button
                      onClick={() => handleConsultClick(consult.collarId)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>{t('Go to Chat Room', 'அரட்டை அறைக்குச் செல்')}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
