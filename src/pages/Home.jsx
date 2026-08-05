import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Activity, MapPin, FileText, ArrowRight, UserCheck, Bot, Key, Sparkles } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

export default function Home() {
  const { setActiveRole, setActiveTab, t } = useContext(AppContext);
  const [loginRole, setLoginRole] = useState(null); // 'farmer' | 'doctor' | null
  
  // Login form states
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const triggerLogin = (role) => {
    setLoginRole(role);
    setErrorMsg('');
    if (role === 'farmer') {
      setUserId('FARM-101');
      setPassword('••••••••');
    } else {
      setUserId('VET-202');
      setPassword('••••••••');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setErrorMsg(t('Please enter your ID', 'தயவுசெய்து உங்கள் ஐடியை உள்ளிடவும்'));
      return;
    }

    canvasConfetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.85 }
    });

    setActiveRole(loginRole);
    setActiveTab(loginRole === 'farmer' ? 'dashboard' : 'doctor-dashboard');
    setLoginRole(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Header Navigation */}
      <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐄</span>
          <div>
            <h1 className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 font-display">
              BioSense Collar
            </h1>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest block uppercase">Livestock Telemetry Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => triggerLogin('farmer')}
            className="px-4 py-2 text-sm font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer"
          >
            {t('Farmer Login', 'விவசாயி உள்நுழைவு')}
          </button>
          <button
            onClick={() => triggerLogin('doctor')}
            className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-md shadow-emerald-700/10 hover:shadow-lg hover:shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
          >
            {t('Vet Doctor Login', 'மருத்துவர் உள்நுழைவு')}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 text-center max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 rounded-full text-xs font-semibold mb-6 animate-pulse-heart">
          <Sparkles size={14} />
          <span>{t('Smart Agriculture IoT Award 2026', 'ஸ்மார்ட் விவசாயம் IoT விருது 2026')}</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
          {t('Real-Time Health Monitoring for', 'கால்நடைகளின் ஆரோக்கியத்தை')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
            {t('Your Livestock', 'நொடியில் கண்காணிக்கும் புதிய வழி')}
          </span>
        </h2>

        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {t(
            'BioSense Collar is a smart collar system integrated with ESP32 microcontrollers and high-accuracy health sensors to monitor livestock vitals, trace GPS routes, geofence grazing zones, and connect farmers with government veterinarians in real-time.',
            'பயோசென்ஸ் காலர் என்பது ESP32 மைக்ரோகண்ட்ரோலர்கள் மற்றும் மிகத்துல்லியமான சுகாதார சென்சார்கள் மூலம் உங்கள் மாடுகளின் இதயத்துடிப்பு, வெப்பநிலை மற்றும் இருப்பிடத்தைக் கண்காணித்து, அவசர தேவைகளில் மருத்துவர்களுடன் இணைக்கும் ஒரு நவீன IoT தொழில்நுட்பமாகும்.'
          )}
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => triggerLogin('farmer')}
            className="px-6 py-3.5 text-base font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 rounded-2xl shadow-xl flex items-center gap-2 hover:scale-102 transition-all cursor-pointer"
          >
            <span>{t('Get Started', 'தொடங்கவும்')}</span>
            <ArrowRight size={18} />
          </button>
          <a
            href="#hardware"
            className="px-6 py-3.5 text-base font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all"
          >
            {t('Explore Hardware System', 'ஹார்டுவேர் சிஸ்டம்')}
          </a>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-850 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-4xl font-extrabold font-display">{t('System Pillars', 'முக்கிய அம்சங்கள்')}</h3>
            <p className="text-slate-500 mt-2">{t('End-to-end features designed for modern dairy farmers.', 'நவீன பால் பண்ணையாளர்களுக்காக வடிவமைக்கப்பட்ட தொழில்நுட்பங்கள்.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vitals Monitoring */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Activity size={24} />
              </div>
              <h4 className="text-lg font-bold mt-4 font-display">{t('Vitals Telemetry', 'உடல்நிலை தரவுகள்')}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {t('Live acquisition of Heart Rate (BPM) and Body Temperature (Celsius) directly through the MAX30102 and DS18B20 health probes.', 'MAX30102 மற்றும் DS18B20 சென்சார்கள் மூலம் மாட்டின் இதயத்துடிப்பு மற்றும் உடல் வெப்பநிலையை நொடிக்கு நொடி துல்லியமாக கண்காணிக்கிறது.')}
              </p>
            </div>

            {/* Live GPS & Geofencing */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <h4 className="text-lg font-bold mt-4 font-display">{t('Geofenced GPS Tracking', 'ஜிபிஎஸ் & பாதுகாப்பு எல்லை')}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {t('Track live locations via NEO-6M GPS. Establish a circular geofence boundary and receive immediate alerts if your cattle stray away.', 'NEO-6M ஜிபிஎஸ் கொண்டு இருப்பிடத்தை கண்டறிந்து, பாதுகாப்பான எல்லையை அமைத்து, மாடு எல்லையைத் தாண்டினால் எச்சரிக்கைகளைப் பெறலாம்.')}
              </p>
            </div>

            {/* AI Assistant */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Bot size={24} />
              </div>
              <h4 className="text-lg font-bold mt-4 font-display">{t('AI Voice Chatbot', 'AI குரல் சாட்பாட்')}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {t('Speak directly in English or Tamil. Ask the AI assistant about cattle telemetry reports, diagnoses, and first-aid recommendations.', 'ஆங்கிலம் மற்றும் தமிழ் மொழியில் நேரடியாக பேசலாம். நோய்கான முதலுதவி குறிப்புகள் மற்றும் மாடுகளின் தகவல்களை கேட்டுத் தெரிந்துகொள்ளலாம்.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Connection Flow Diagram */}
      <section id="hardware" className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-4xl font-extrabold font-display">{t('BioSense IoT Hardware Architecture', 'பயோசென்ஸ் IoT வன்பொருள் கட்டமைப்பு')}</h3>
          <p className="text-slate-500 mt-2">{t('Schematic block diagram of physical sensors connecting to the Firebase Cloud system.', 'வன்பொருள் சென்சார்கள் மேகக்கணித் தளத்துடன் இணையும் வழிமுறைப்படம்.')}</p>
        </div>

        <div className="p-8 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center relative z-10">
            {/* Sensor nodes */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
              <div className="px-2.5 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xxs font-bold uppercase rounded-lg tracking-wider">COLLAR SENSORS</div>
              <div className="space-y-3.5">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-xs">❤️ MAX30102</span>
                  <span className="text-xxs text-emerald-400">Heart Rate</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-xs">🌡️ DS18B20</span>
                  <span className="text-xxs text-amber-400">Temperature</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-xs">📍 NEO-6M GPS</span>
                  <span className="text-xxs text-teal-400">Coordinates</span>
                </div>
              </div>
            </div>

            {/* Microcontroller Arrow */}
            <div className="hidden md:flex flex-col items-center text-slate-500">
              <span className="text-xs font-mono">Analog/I2C</span>
              <div className="w-12 h-0.5 bg-slate-850 my-1 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-500 rounded-full" />
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">SPI Bus</span>
            </div>

            {/* ESP32 Core */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 flex flex-col items-center justify-center shadow-lg min-h-[220px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-2xl mb-4 font-display">
                ESP32
              </div>
              <h4 className="font-bold text-sm">ESP-WROOM-32</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Processes vital telemetries, filters noise and formats coordinates, broadcasting packets over local network hotspots.
              </p>
              <div className="mt-3 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md text-[10px] font-mono">Wi-Fi Client</div>
            </div>

            {/* Cloud Storage */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-teal-500/30 flex flex-col items-center justify-center shadow-lg min-h-[220px]">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center text-2xl mb-4">
                🔥
              </div>
              <h4 className="font-bold text-sm">Firebase Cloud</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Receives incoming JSON arrays, archives histories, updates Firestore collections, and coordinates socket events.
              </p>
              <div className="mt-3 px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded-md text-[10px] font-mono">Real-Time DB</div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGIN MODAL BACKDROP */}
      {loginRole && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Sparkle background elements */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
            
            {/* Modal Title */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Key size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">
                  {loginRole === 'farmer' ? t('Farmer Sign In', 'விவசாயி உள்நுழைவு') : t('Veterinary Doctor Sign In', 'கால்நடை மருத்துவர் உள்நுழைவு')}
                </h3>
                <p className="text-xs text-slate-400">{t('Credentials pre-filled for demo ease.', 'உள்நுழைவு விவரங்கள் தானாக நிரப்பப்பட்டுள்ளன.')}</p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 flex items-center gap-2">
                <Shield size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('User ID / Email', 'பயனர் ஐடி / மின்னஞ்சல்')}</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Password', 'கடவுச்சொல்')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center gap-1.5 text-slate-500 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 dark:border-slate-700 text-emerald-500" />
                  <span>{t('Remember Me', 'என்னை நினைவில் கொள்')}</span>
                </label>
                <a href="#forgot" className="text-emerald-600 dark:text-emerald-400 hover:underline">{t('Forgot Password?', 'கடவுச்சொல் மறந்ததா?')}</a>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setLoginRole(null)}
                  className="w-1/2 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm transition-all"
                >
                  {t('Cancel', 'ரத்து செய்')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl text-sm hover:shadow-lg hover:shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer"
                >
                  {t('Sign In', 'உள்நுழை')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-850 py-8 text-center text-xs text-slate-400 font-medium">
        <p>&copy; {new Date().getFullYear()} BioSense Collar System. Designed for Livestock Vitals IoT Hackathon.</p>
      </footer>
    </div>
  );
}
