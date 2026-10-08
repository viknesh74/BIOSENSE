import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  ShieldAlert, 
  Stethoscope, 
  Users, 
  Phone, 
  ArrowRight, 
  Activity, 
  Thermometer, 
  FileText, 
  CheckCircle, 
  Building2, 
  Sparkles, 
  AlertTriangle,
  Pill,
  Download,
  Calendar,
  Clock,
  User,
  Check,
  X,
  MessageSquare
} from 'lucide-react';

export default function DoctorDashboard() {
  const { 
    cattle, 
    consultations, 
    appointments, 
    updateAppointmentStatus, 
    doctorProfile, 
    setActiveTab, 
    setSelectedCattleId, 
    t 
  } = useContext(AppContext);

  // Filter emergency cattle across all farms
  const emergencyCattle = cattle.filter((c) => c.status === 'Emergency');
  const warningCattle = cattle.filter((c) => c.status === 'Warning');
  const activeConsultCount = consultations.filter((c) => c.status === 'Consulting').length;
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending');

  const handleConsultClick = (collarId) => {
    setSelectedCattleId(collarId);
    setActiveTab('doctor-consultation');
  };

  const handleViewReports = () => {
    setActiveTab('reports');
  };

  const handleOpenAiTool = () => {
    setActiveTab('cattle-care-ai');
  };

  const handleConfirmAppointment = async (id) => {
    await updateAppointmentStatus(id, 'Confirmed', 'Confirmed by Doctor. Doctor will attend as scheduled.');
  };

  const handleCompleteAppointment = async (id) => {
    await updateAppointmentStatus(id, 'Completed', 'Clinical checkup/visit completed successfully.');
  };

  return (
    <div className="space-y-6 font-sans pb-12 max-w-7xl mx-auto">
      
      {/* Welcome Doctor Banner with VCI & Hospital Details */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-teal-500/30 border border-teal-400/40 rounded-full text-xs font-black uppercase tracking-widest text-teal-200 flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-400" />
              {doctorProfile?.vciNumber || 'VCI-TN-2024-8842'} (Verified)
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-slate-300">
              {doctorProfile?.qualification || 'M.V.Sc (Animal Husbandry)'}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white font-display">
            {t(`Welcome, ${doctorProfile?.name || 'Dr. Rajesh Kannan'}`, `வரவேற்கிறோம், ${doctorProfile?.name || 'டாக்டர் ராஜேஷ் கண்ணன்'}`)} 🩺
          </h2>

          <p className="text-slate-300 text-xs md:text-sm flex items-center gap-1.5">
            <Building2 size={15} className="text-teal-400 shrink-0" />
            <span>{doctorProfile?.hospital || 'Madurai East Government Veterinary Hospital'}</span>
          </p>
        </div>

        {/* Quick Duty Action Buttons */}
        <div className="flex flex-wrap gap-2.5 z-10 shrink-0">
          <button
            onClick={handleOpenAiTool}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles size={15} />
            <span>{t('AI Diagnostic Scan', 'AI நோய் ஸ்கேன்', 'एआई डायग्नोस्टिक')}</span>
          </button>

          <button
            onClick={handleViewReports}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all backdrop-blur-md border border-white/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <FileText size={15} />
            <span>{t('Clinical Reports PDF', 'மருத்துவ அறிக்கைகள்', 'क्लीनिकल रिपोर्ट')}</span>
          </button>
        </div>
      </div>

      {/* Vet Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {/* Emergencies */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            emergencyCattle.length > 0 
              ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500 animate-pulse' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Emergency Cases', 'அவசர வழக்குகள்', 'आपातकालीन मामले')}</p>
            <h4 className={`text-2xl font-black font-display mt-0.5 ${emergencyCattle.length > 0 ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>
              {emergencyCattle.length}
            </h4>
          </div>
        </div>

        {/* Booked Appointments Queue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Booked Appointments', 'முன்பதிவுகள்', 'अपॉइंटमेंट')}</p>
            <h4 className="text-2xl font-black text-amber-500 font-display mt-0.5">{appointments.length}</h4>
          </div>
        </div>

        {/* Consulting queue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Stethoscope size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Live Consultations', 'நேரலை ஆலோசனை', 'लाइव परामर्श')}</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white font-display mt-0.5">{activeConsultCount}</h4>
          </div>
        </div>

        {/* Monitored Herd Total */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Assigned Livestock', 'கண்காணிக்கப்படும் மாடுகள்', 'निगरानी किए गए पशु')}</p>
            <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display mt-0.5">{cattle.length} Nodes</h4>
          </div>
        </div>
      </div>

      {/* ─── SECTION: FARMER BOOKED APPOINTMENTS & FIELD VISITS QUEUE ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
                {t('Booked Farmer Appointments & Field Visit Requests', 'விவசாயிகளின் சந்திப்பு முன்பதிவுகள் & கள வருகை கோரிக்கைகள்', 'बुक किए गए किसान अपॉइंटमेंट')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('Real-time appointment requests sent from nearby farmers via GPS services.', 'விவசாயிகளிடமிருந்து நேரடியாக வரப்பெற்ற சந்திப்பு கோரிக்கைகள்.')}
              </p>
            </div>
          </div>
          
          <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            {pendingAppointments.length} {t('Pending Confirmation', 'உறுதிப்படுத்தல் நிலுவை')}
          </span>
        </div>

        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3.5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">{apt.preferredDate}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-bold">{apt.preferredTimeSlot}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white font-display mt-1">
                        {apt.appointmentType}
                      </h4>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                      apt.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300'
                        : apt.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300 animate-pulse'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                    }`}>
                      {apt.status === 'Confirmed' ? t('Confirmed ✓', 'உறுதியானது ✓') : 
                       apt.status === 'Pending' ? t('Needs Confirmation ⏳', 'உறுதி தேவை ⏳') : 
                       apt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200/60 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Farmer & Contact', 'விவசாயி')}</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">👨🌾 {apt.farmerName} ({apt.farmerPhone || '+91 98765 43210'})</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Patient Cattle', 'நோயாளி மாடு')}</span>
                      <p className="font-bold text-teal-600 dark:text-teal-400">🐄 {apt.animalName} (Collar {apt.collarId})</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="font-semibold"><strong>{t('Farmer Reason:', 'காரணம்:')}</strong> "{apt.reason}"</p>
                    {apt.doctorNotes && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 italic">
                        <strong>{t('Your Note:', 'உங்கள் குறிப்பு:')}</strong> {apt.doctorNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Doctor Decision Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                  {apt.status === 'Pending' && (
                    <button
                      onClick={() => handleConfirmAppointment(apt.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Check size={14} />
                      <span>{t('Confirm Appointment', 'சந்திப்பை உறுதிசெய்')}</span>
                    </button>
                  )}

                  {apt.status === 'Confirmed' && (
                    <button
                      onClick={() => handleCompleteAppointment(apt.id)}
                      className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={14} />
                      <span>{t('Mark Completed', 'முடிக்கப்பட்டது')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleConsultClick(apt.collarId)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare size={13} />
                    <span>{t('Chat / Prescribe', 'ஆலோசனை')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Calendar className="mx-auto mb-2 text-slate-300" size={28} />
            <p className="text-xs font-semibold">{t('No booked appointments in queue.', 'முன்பதிவு செய்யப்பட்ட சந்திப்புகள் ஏதுமில்லை.')}</p>
          </div>
        )}
      </div>

      {/* Main Split Sections: Emergency Queue & Active Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EMERGENCY ALERTS LOG */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-500" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {t('Emergency Telemetry Cases Queue', 'அவசர சிகிச்சை தேவைப்படுபவை', 'आपातकालीन मामले')}
              </h3>
            </div>
            <span className="text-[10px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-full">
              Live Alerts
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 min-h-[220px]">
            {emergencyCattle.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <span className="text-3xl">🛡️</span>
                <p className="text-xs font-bold">{t('Zero active distress telemetry signals in the district.', 'தற்போது எந்த அவசர வழக்குகளும் இல்லை.', 'वर्तमान में कोई आपातकालीन संकेत नहीं हैं।')}</p>
                <p className="text-[11px] text-slate-400">{t('All live collar vital streams within safe parameters.', 'அனைத்து அளவீடுகளும் சீராக உள்ளன.')}</p>
              </div>
            ) : (
              emergencyCattle.map((cow) => (
                <div key={cow.id} className="p-5 space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">🐄 {cow.name} (Collar {cow.id})</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{t('Farmer:', 'பயனர்:')} Uma • Madurai East Farm</p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-black bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-md animate-pulse">
                      CRITICAL VITALS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-rose-500 animate-pulse" />
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">{t('Pulse Rate', 'இதயத்துடிப்பு')}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{cow.telemetry?.heartRate} BPM</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer size={16} className="text-amber-500" />
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">{t('Temperature', 'வெப்பநிலை')}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{cow.telemetry?.temperature}°C</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConsultClick(cow.id)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/10 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t('Open Emergency Consultation Room', 'அவசர ஆலோசனையைத் தொடங்கு')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ACTIVE CONSULTATION CASES LIST */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope size={18} className="text-teal-500" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {t('Active Consultations Queue', 'ஆலோசனை வேண்டுகோள்கள்', 'परामर्श कतार')}
              </h3>
            </div>
            <span className="text-[10px] font-black bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 px-2 py-0.5 rounded-full">
              {consultations.length} Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 min-h-[220px]">
            {consultations.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <span className="text-3xl">💬</span>
                <p className="text-xs font-bold">{t('No consultation requests pending right now.', 'ஆலோசனை கோரிக்கைகள் ஏதுமில்லை.')}</p>
              </div>
            ) : (
              consultations.map((consult) => (
                <div key={consult.id} className="p-5 space-y-3.5">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">👨🌾 {consult.farmerName} • {consult.animalName} (Collar {consult.collarId})</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase">{t('Reported Symptoms:', 'அறிகுறிகள்:')}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal mt-0.5 italic bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      "{consult.symptoms}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Status: <span className={consult.status === 'Consulting' ? 'text-teal-500 font-extrabold' : 'text-emerald-500 font-extrabold'}>{consult.status.toUpperCase()}</span>
                    </span>
                    
                    <button
                      onClick={() => handleConsultClick(consult.collarId)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <span>{t('Go to Chat & Prescribe', 'அரட்டை மற்றும் மருந்து பரிந்துரை')}</span>
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
