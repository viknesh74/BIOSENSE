import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import LanguageDropdown from '../components/LanguageDropdown';
import { Settings, Globe, Moon, Sun, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { language, setLanguage, darkMode, setDarkMode, t } = useContext(AppContext);

  return (
    <div className="space-y-6 font-sans max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
          <Settings size={24} className="text-emerald-500" />
          <span>{t('System Settings', 'அமைப்புகள்')}</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {t('Configure UI modes, notification preferences, and system language.', 'வலைத்தளத்தின் மொழி, தோற்றம் மற்றும் அறிவிப்புகளை மாற்றி அமைக்கவும்.')}
        </p>
      </div>

      {/* Options Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
        {/* Language Toggler */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-3">
            <Globe className="text-emerald-500" size={20} />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('System Language', 'வலைத்தள மொழி')}</h3>
              <p className="text-slate-400 text-xxs mt-0.5">{t('Select English or Tamil text localization.', 'தமிழ் அல்லது ஆங்கில மொழியைத் தேர்ந்தெடுக்கவும்.')}</p>
            </div>
          </div>

            <LanguageDropdown variant="settings" />
        </div>

        {/* Dark Mode Toggler */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-3">
            {darkMode ? <Sun className="text-amber-400" size={20} /> : <Moon className="text-indigo-400" size={20} />}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('Dark Mode Presentation', 'இரவு நேர தோற்றம்')}</h3>
              <p className="text-slate-400 text-xxs mt-0.5">{t('Toggle clean dark theme presentation.', 'கருப்பு நிற தோற்றத்தை மாற்றவும்.')}</p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Alert Preferences */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bell size={14} className="text-teal-500" />
            <span>{t('Push Notification Triggers', 'பாதுகாப்பு அறிவிப்புகள் அமைப்புகள்')}</span>
          </h3>

          <div className="space-y-3">
            {[
              t('Emergency vital signs warning sounds (Heart Rate/Fever)', 'அவசர உடலியல் மாற்றங்களின் போது ஒலி எழுப்புதல் (இதயத்துடிப்பு/காய்ச்சல்)'),
              t('Out-of-boundary GPS geofencing instant push emails', 'பாதுகாப்பு எல்லை மீறப்பட்டால் உடனடியாக மின்னஞ்சல் அனுப்புதல்'),
              t('Low Collar battery alerts alerts under 20%', 'காலர் பேட்டரி 20%க்குக் கீழே குறையும் போது எச்சரிக்கை செய்தல்'),
              t('Veterinary Doctor Prescription sync alerts', 'மருத்துவரின் மருந்துச்சீட்டு வந்தவுடன் அறிவிப்பு வெளியிடுதல்')
            ].map((pref, idx) => (
              <label key={idx} className="flex items-start gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 rounded border-slate-350 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{pref}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
