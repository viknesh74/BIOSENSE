import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { FileText, Printer, Calendar, ShieldCheck, Heart, Thermometer } from 'lucide-react';

export default function Reports() {
  const { cattle, selectedCattleId, setSelectedCattleId, farmerProfile, consultations, t } = useContext(AppContext);
  const [reportType, setReportType] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  const cow = cattle.find((c) => c.id === selectedCattleId) || cattle[0];

  // Averages calculations for mock reporting
  const avgHR = Math.round(cow.history.heartRate.reduce((a, b) => a + b, 0) / cow.history.heartRate.length);
  const avgTemp = (cow.history.temperature.reduce((a, b) => a + b, 0) / cow.history.temperature.length).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  // Find active prescription if any
  const prescription = consultations.find((c) => c.collarId === cow.id)?.prescription;

  return (
    <div className="space-y-6 font-sans print:m-0 print:p-0">
      {/* Configuration Header - Hide during browser printing */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-slate-500">{t('Livestock:', 'கால்நடை:')}</span>
          <div className="flex gap-2">
            {cattle.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCattleId(c.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  selectedCattleId === c.id
                    ? 'bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100 text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {/* Duration Filters */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/40">
            {['daily', 'weekly', 'monthly'].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  reportType === type
                    ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
                }`}
              >
                {t(type, type === 'daily' ? 'தினசரி' : type === 'weekly' ? 'வாராந்திர' : 'மாதாந்திர')}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
          >
            <Printer size={14} />
            <span>{t('Print PDF', 'அறிக்கை பதிவிறக்கம்')}</span>
          </button>
        </div>
      </div>

      {/* Clinical Report Sheet Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 max-w-3xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight uppercase leading-none">
              {t('BioSense Clinical Vitals Report', 'பயோசென்ஸ் மருத்துவ சுகாதார அறிக்கை')}
            </h1>
            <p className="text-slate-400 text-xxs font-bold mt-1.5 tracking-wider uppercase">
              {t('Official Veterinary Diagnostics Log', 'அதிகாரப்பூர்வ கால்நடை கண்டறிதல் அறிக்கை')}
            </p>
          </div>
          <span className="text-3xl print:block">🐄</span>
        </div>

        {/* Informational Metadata Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t('Farm Owner Details', 'விவசாயி விவரம்')}</span>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{farmerProfile.name}</h4>
            <p className="text-slate-500 text-xxs mt-0.5">{farmerProfile.mobile}</p>
            <p className="text-slate-400 text-[10px] mt-0.5 max-w-xs">{farmerProfile.address}</p>
          </div>

          <div className="text-right sm:text-left sm:pl-8 sm:border-l border-slate-150 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t('Livestock Details', 'கால்நடை விவரம்')}</span>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">🐄 {cow.name}</h4>
            <p className="text-slate-500 text-xxs mt-0.5">{t('Collar ID', 'காலர் ஐடி')}: {cow.id}</p>
            <p className="text-slate-400 text-[10px] mt-0.5">{cow.breed} • {cow.age} • {t(cow.gender, cow.gender === 'Female' ? 'பெண்' : 'ஆண்')}</p>
          </div>
        </div>

        {/* Date / Stamp Metadata */}
        <div className="flex justify-between items-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <span className="capitalize">
              {t('Report Duration', 'அறிக்கை காலம்')}: <span className="font-bold text-slate-800 dark:text-slate-200">{reportType}</span>
            </span>
          </div>
          <span>
            {t('Date Generated', 'தேதி')}: <span className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString()}</span>
          </span>
        </div>

        {/* Telemetry Summary Stats Card */}
        <div className="space-y-3.5">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('Sensor Telemetry Statistics', 'சென்சார் அளவீட்டு புள்ளிவிவரங்கள்')}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 shrink-0">
                <Heart size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t('Heart Rate (Average)', 'இதயத்துடிப்பு (சராசரி)')}</span>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">{avgHR} BPM</h4>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 shrink-0">
                <Thermometer size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t('Body Temperature (Average)', 'உடல் வெப்பநிலை (சராசரி)')}</span>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">{avgTemp}°C</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Prescription Record */}
        <div className="space-y-3.5">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">{t('Active Vet Prescriptions & Recommendations', 'கால்நடை மருத்துவரின் மருந்துச்சீட்டுகள்')}</h3>
          
          {prescription ? (
            <div className="p-5 bg-emerald-50/[0.05] dark:bg-slate-950/40 rounded-2xl border border-emerald-500/20 shadow-inner">
              <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2 mb-3">
                <span className="text-sm">👨⚕️</span>
                <div>
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Dr. Rajesh Kannan, M.V.Sc</h4>
                  <p className="text-[9px] text-slate-400 tracking-wide uppercase font-semibold">{t('Authorized Government Veterinarian', 'அரசு கால்நடை மருத்துவர்')}</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">{prescription}</p>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl text-xs font-medium">
              {t('No active prescriptions registered on consultation file.', 'மருத்துவக் குறிப்புகள் ஏதுமில்லை.')}
            </div>
          )}
        </div>

        {/* Certificate Seal Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-[8px] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-900/50">
            <ShieldCheck size={12} />
            <span>Verified System Log</span>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px]">HASH: F0982-A72183-C982</p>
            <p className="mt-0.5">{t('BioSense Automated Health Assessor', 'பயோசென்ஸ் தானியங்கி அறிக்கை மேலாளர்')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
