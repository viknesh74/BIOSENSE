import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageDropdown({ variant = 'default' }) {
  const { language, setLanguage } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // ── Variant Styles ──────────────────────────────────────────────────────────
  let buttonStyle = "";
  let iconSize = 14;
  
  if (variant === 'sidebar') {
    buttonStyle = "flex items-center justify-between w-full gap-1 font-bold text-teal-400 bg-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-700 transition-colors";
    iconSize = 14;
  } else if (variant === 'sidebar-icon') {
    buttonStyle = "p-1.5 bg-slate-800 text-teal-400 rounded-lg hover:bg-slate-700 transition-colors flex justify-center w-full";
    iconSize = 16;
  } else if (variant === 'settings') {
    buttonStyle = "flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-100 dark:border-emerald-800/30";
    iconSize = 16;
  } else {
    // Default (Header App.jsx & Home.jsx)
    buttonStyle = "flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200/40 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300 text-xs font-medium";
    iconSize = 14;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyle}
        title="Change language"
      >
        <div className="flex items-center gap-1.5">
          <Globe size={iconSize} className={variant === 'settings' ? '' : 'opacity-70'} />
          {variant !== 'sidebar-icon' && (
            <span className={variant === 'settings' ? 'text-sm' : 'text-xs'}>
              {variant === 'settings' 
                ? `${currentLang.native} (${currentLang.label})` 
                : currentLang.native}
            </span>
          )}
        </div>
        {variant !== 'sidebar-icon' && (
          <ChevronDown size={14} className={`opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden min-w-[120px] ${
          variant === 'sidebar' ? 'bottom-full mb-2 left-0' : 
          variant === 'sidebar-icon' ? 'bottom-full mb-2 left-0' :
          'top-full right-0'
        }`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between
                ${language === lang.code 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }
              `}
            >
              <span>{lang.native}</span>
              {lang.native !== lang.label && (
                <span className="text-xs opacity-50 font-normal">{lang.label}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
