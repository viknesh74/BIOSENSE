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
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('System Language')}</h3>
              <p className="text-slate-400 text-xxs mt-0.5">{t('Select your preferred language for the interface.')}</p>
            </div>
          </div>

            <LanguageDropdown variant="settings" />
        </div>


        {/* Alert Preferences */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bell size={14} className="text-teal-500" />
            <span>{t('Push Notification Triggers', 'பாதுகாப்பு அறிவிப்புகள் அமைப்புகள்')}</span>
          </h3>

          <div className="space-y-3">
            {[
              t('Emergency vital signs warning sounds (Heart Rate/Fever)'),
              t('Out-of-boundary GPS geofencing instant push emails'),
              t('Low Collar battery alerts alerts under 20%'),
              t('Veterinary Doctor Prescription sync alerts')
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
