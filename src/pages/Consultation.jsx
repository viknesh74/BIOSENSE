import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { MessageSquare, Video, Send, FileText, Phone, Activity, Thermometer, ShieldAlert, X, Mic, MicOff, VideoOff, Check, Heart } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

export default function Consultation() {
  const { cattle, selectedCattleId, setSelectedCattleId, consultations, sendConsultationMessage, prescribe, t } = useContext(AppContext);
  const [chatInput, setChatInput] = useState('');
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  
  // Prescription Form states
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptionText, setPrescriptionText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const chatEndRef = useRef(null);

  // Default to first cow if none selected
  const activeCow = cattle.find((c) => c.id === selectedCattleId) || cattle[0];
  const consult = consultations.find((c) => c.collarId === activeCow.id) || consultations[0];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consult?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Send doctor message
    sendConsultationMessage(consult.id, 'doctor', chatInput);
    const sentText = chatInput;
    setChatInput('');

    // Simulated Farmer automated response to make the demo feel alive
    setTimeout(() => {
      let reply = "Understood, Doctor. I will check the cattle vitals again.";
      if (sentText.toLowerCase().includes('medicine') || sentText.toLowerCase().includes('presc') || sentText.toLowerCase().includes('give')) {
        reply = "Okay, Doctor. I see the digital prescription on my dashboard. I will buy the medicines immediately. Thank you!";
      } else if (sentText.toLowerCase().includes('hello') || sentText.toLowerCase().includes('hi')) {
        reply = "Hello Dr. Rajesh. Yes, I am worried about the temperature fluctuations showing on the BioSense collar.";
      }
      sendConsultationMessage(consult.id, 'farmer', reply);
    }, 1000);
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (!prescriptionText.trim()) return;

    prescribe(consult.id, `${diagnosis ? 'DIAGNOSIS: ' + diagnosis + '\n' : ''}RECOMMENDATION: ${prescriptionText}`);
    
    // Confetti
    canvasConfetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 }
    });

    setSuccessMsg(t('Prescription submitted & synced to Farmer Uma!', 'மருந்துச்சீட்டு விவசாயிக்கு அனுப்பப்பட்டது!'));
    setDiagnosis('');
    setPrescriptionText('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 font-sans">
      
      {/* LEFT COLUMN: Chat & Video Consultation */}
      <div className="flex-1 flex flex-col gap-6 min-h-[500px]">
        {/* consultation title card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👨⚕️</span>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight font-display">
                {t('Consultation Portal', 'மருத்துவ ஆலோசனை')}
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                {t('Patient:', 'நோயாளி:')} 🐄 {activeCow.name} (Collar {activeCow.id}) • {t('Farmer:', 'விவசாயி:')} {consult.farmerName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVideoActive(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow hover:shadow-lg active:scale-98 transition-all cursor-pointer"
          >
            <Video size={14} className="animate-pulse" />
            <span>{t('Start Video consultation', 'வீடியோ அழைப்பு')}</span>
          </button>
        </div>

        {/* Chat window */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm min-h-[300px]">
          {/* Messages container */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
            {consult.messages.map((msg, idx) => {
              const isDoctor = msg.sender === 'doctor';
              return (
                <div key={idx} className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%] flex gap-2.5 items-start">
                    {!isDoctor && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm border border-slate-200 dark:border-slate-700/60 shrink-0">
                        👨🌾
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xxs ${
                        isDoctor
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-200 border border-slate-200 dark:border-slate-750 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[8px] block text-right mt-1.5 font-bold ${isDoctor ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Messages Console input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t('Type medical advice or query...', 'மருத்துவ ஆலோசனைகளை எழுதவும்...')}
              className="flex-1 bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-750 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl shadow transition-all cursor-pointer hover:bg-slate-800"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Vitals & Prescription */}
      <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
        
        {/* Live Cattle Vitals Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 font-display flex items-center gap-2">
            <Activity className="text-emerald-500" size={18} />
            <span>{t('Patient Live Vitals Monitor', 'மாட்டின் நேரடி உடல்நிலை')}</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center gap-3">
              <Heart className="text-rose-500 animate-pulse-heart" size={20} />
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase">{t('Pulse Rate', 'துடிப்பு')}</span>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{activeCow.telemetry.heartRate} BPM</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center gap-3">
              <Thermometer className="text-amber-500" size={20} />
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase">{t('Temp', 'வெப்பநிலை')}</span>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{activeCow.telemetry.temperature}°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prescription form card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 font-display flex items-center gap-2">
            <FileText size={18} className="text-emerald-500" />
            <span>{t('Digital Rx Prescription', 'டிஜிட்டல் மருந்துச்சீட்டு')}</span>
          </h3>

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 text-xxs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
              <Check size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handlePrescriptionSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Diagnosis', 'நோய் கண்டறிதல்')}</label>
              <input
                type="text"
                placeholder="e.g. Mild Heat stress / Fever"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Medication & Guidelines (Rx)', 'மருந்துகள் & வழிமுறைகள்')}</label>
              <textarea
                placeholder="e.g. Paracetamol Bolus 1.5g - Twice daily for 3 days; plenty of shade."
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                rows="4"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 font-semibold resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>{t('Issue Prescription', 'மருந்துச்சீட்டு வழங்கு')}</span>
            </button>
          </form>
        </div>
      </div>

      {/* VIDEO CONSULTATION DIALOG OVERLAY */}
      {isVideoActive && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[550px] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            {/* Top Bar controls */}
            <div className="px-5 py-4 bg-slate-950/60 border-b border-slate-800/80 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h4 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                  {t('Live Tele-Medicine Session', 'நேரடி வீடியோ ஆலோசனைக் கூட்டம்')}
                </h4>
              </div>
              <button
                onClick={() => setIsVideoActive(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Streams Container Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 p-5 gap-4 bg-slate-950/20 relative z-10">
              {/* Farmer Feed (cow in barn) */}
              <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden relative flex flex-col justify-center items-center group">
                {isVideoMuted ? (
                  <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
                    <VideoOff size={32} />
                    <span>{t('Farmer Video Muted', 'விவசாயி வீடியோ நிறுத்தப்பட்டது')}</span>
                  </div>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=700&auto=format&fit=crop&q=80"
                    alt="Farmer Cow Barn feed"
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Farmer identity flag */}
                <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-xxs font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{t('Farmer Uma (Ganga)', 'விவசாயி உமா (கங்கா)')}</span>
                </div>
              </div>

              {/* Doctor own camera feed preview */}
              <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden relative flex flex-col justify-center items-center">
                <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-4xl shadow-xl shadow-slate-950 animate-pulse-heart">
                  👨⚕️
                </div>
                <h4 className="text-xs text-slate-400 font-bold mt-4">Dr. Rajesh Kannan</h4>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{t('District Vet Specialist', 'மாவட்ட கால்நடை நிபுணர்')}</p>

                {/* Doctor identity flag */}
                <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-xxs font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{t('Doctor राजेश (You)', 'டாக்டர் ராஜேஷ் (நீ)')}</span>
                </div>
              </div>
            </div>

            {/* Video Action console bottom bar */}
            <div className="px-5 py-4 bg-slate-950 border-t border-slate-850 flex justify-center items-center gap-4 relative z-10">
              {/* Mic toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full hover:scale-105 active:scale-95 transition-all ${
                  isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* Stop video toggle */}
              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className={`p-3 rounded-full hover:scale-105 active:scale-95 transition-all ${
                  isVideoMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={isVideoMuted ? "Start Camera Feed" : "Stop Camera Feed"}
              >
                {isVideoMuted ? <VideoOff size={18} /> : <Video size={18} />}
              </button>

              {/* Disconnect button */}
              <button
                onClick={() => setIsVideoActive(false)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {t('Disconnect Session', 'அழைப்பைத் துண்டி')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
