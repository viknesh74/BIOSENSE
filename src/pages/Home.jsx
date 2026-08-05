import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Key, ArrowRight } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

export default function Home() {
  const { setActiveRole, setActiveTab, t } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLoginTab, setActiveLoginTab] = useState('farmer'); // 'farmer' | 'doctor'
  
  // Login form states
  const [userId, setUserId] = useState('FARM-101');
  const [password, setPassword] = useState('••••••••');
  const [errorMsg, setErrorMsg] = useState('');

  const openLoginModal = () => {
    setIsModalOpen(true);
    handleTabSwitch('farmer');
  };

  const handleTabSwitch = (tab) => {
    setActiveLoginTab(tab);
    setErrorMsg('');
    if (tab === 'farmer') {
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
      setErrorMsg(t('Please enter your ID', 'தயவுசெய்து உங்கள் ஐடியை உள்ளிடவும்', 'कृपया अपनी आईडी दर्ज करें'));
      return;
    }

    canvasConfetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.85 }
    });

    setActiveRole(activeLoginTab);
    setActiveTab(activeLoginTab === 'farmer' ? 'dashboard' : 'doctor-dashboard');
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
            onClick={openLoginModal}
            className="px-6 py-2.5 text-sm font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {t('Sign in', 'உள்நுழை', 'साइन इन करें')}
          </button>
        </div>
      </header>

      {/* Minimal Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
          {t('Real-Time Health Monitoring for', 'கால்நடைகளின் ஆரோக்கியத்தை', 'वास्तविक समय स्वास्थ्य निगरानी')} <br />
          <span className="text-emerald-500 dark:text-emerald-400">
            {t('Your Livestock', 'உங்கள் மாடுகளுக்கு', 'आपके पशुधन के लिए')}
          </span>
        </h2>

        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mx-auto">
          {t(
            'BioSense Collar is a smart collar system integrated with ESP32 microcontrollers and high-accuracy health sensors to monitor livestock vitals, trace GPS routes, geofence grazing zones, and connect farmers with government veterinarians in real-time.',
            'பயோசென்ஸ் காலர் என்பது ESP32 மைக்ரோகண்ட்ரோலர்கள் மற்றும் மிகத்துல்லியமான சுகாதார சென்சார்கள் மூலம் உங்கள் மாடுகளின் இதயத்துடிப்பு, வெப்பநிலை மற்றும் இருப்பிடத்தைக் கண்காணித்து, அவசர தேவைகளில் மருத்துவர்களுடன் இணைக்கும் ஒரு நவீன IoT தொழில்நுட்பமாகும்.',
            'बायोसेन्स कॉलर एक स्मार्ट कॉलर प्रणाली है जो ESP32 माइक्रोकंट्रोलर और उच्च-सटीकता स्वास्थ्य सेंसर के साथ एकीकृत है, जो पशुओं के स्वास्थ्य की निगरानी करता है, जीपीएस मार्ग का पता लगाता है, चरने वाले क्षेत्रों को जियोफेंस करता है, और वास्तविक समय में किसानों को सरकारी पशु चिकित्सकों से जोड़ता है।'
          )}
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <button
            onClick={openLoginModal}
            className="px-8 py-4 text-base font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 rounded-2xl shadow-xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
          >
            <span>{t('Get Started', 'தொடங்கவும்', 'शुरू करें')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* TABBED LOGIN MODAL BACKDROP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Floating Tabs */}
            <div className="flex gap-4 mb-0 z-10 bg-white dark:bg-slate-900 p-1.5 rounded-t-2xl border-x border-t border-slate-200 dark:border-slate-800 translate-y-2">
              <button
                onClick={() => handleTabSwitch('farmer')}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                  activeLoginTab === 'farmer' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {t('Farmer Login', 'விவசாயி', 'किसान')}
              </button>
              <button
                onClick={() => handleTabSwitch('doctor')}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                  activeLoginTab === 'doctor' 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20' 
                    : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {t('Vet Doctor Login', 'மருத்துவர்', 'पशु चिकित्सक')}
              </button>
            </div>

            {/* Main Modal Card */}
            <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 z-20">
              
              {/* Modal Title */}
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-900">
                  <Key size={22} className="rotate-45" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white font-display">
                    {activeLoginTab === 'farmer' ? t('Farmer Sign In', 'விவசாயி உள்நுழைவு', 'किसान साइन इन') : t('Veterinary Sign In', 'மருத்துவர் உள்நுழைவு', 'पशु चिकित्सक साइन इन')}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{t('Credentials pre-filled for demo ease.', 'உள்நுழைவு விவரங்கள் தானாக நிரப்பப்பட்டுள்ளன.', 'डेमो के लिए क्रेडेंशियल पहले से भरे हुए हैं।')}</p>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-5 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 flex items-center gap-2">
                  <Shield size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">{t('User ID / Email', 'பயனர் ஐடி / மின்னஞ்சல்', 'यूज़र आईडी / ईमेल')}</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-bold transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">{t('Password', 'கடவுச்சொல்', 'पासवर्ड')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-black tracking-widest transition-all shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold pt-1">
                  <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-slate-300" />
                    <span>{t('Remember Me', 'என்னை நினைவில் கொள்', 'मुझे याद रखें')}</span>
                  </label>
                  <a href="#forgot" className="text-emerald-600 dark:text-emerald-400 hover:underline">{t('Forgot Password?', 'கடவுச்சொல் மறந்ததா?', 'पासवर्ड भूल गए?')}</a>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm transition-all shadow-sm"
                  >
                    {t('Cancel', 'ரத்து', 'रद्द करें')}
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3.5 bg-emerald-600 dark:bg-emerald-500 text-white font-bold rounded-2xl text-sm hover:bg-emerald-700 dark:hover:bg-emerald-400 active:scale-95 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    {t('Sign In', 'உள்நுழை', 'साइन इन')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
