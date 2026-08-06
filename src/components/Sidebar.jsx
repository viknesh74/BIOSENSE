import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  AlertTriangle,
  FileText,
  User,
  Settings,
  LogOut,
  Sparkles,
  Bot,
  Stethoscope,
  Heart,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sun,
  Moon,
  X
} from 'lucide-react';
import LanguageDropdown from './LanguageDropdown';

export default function Sidebar({ isOpen, setIsOpen }) {
  const {
    activeRole,
    setActiveRole,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    notifications,
    setSelectedCattleId,
    t
  } = useContext(AppContext);

  const [collapsed, setCollapsed] = useState(false);

  // If guest, do not render sidebar (Guest Home has its own navbar)
  if (activeRole === 'guest') return null;

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  const farmerNavItems = [
    { id: 'dashboard', label: t('Dashboard', 'கட்டுப்பாட்டு அறை'), icon: LayoutDashboard },
    { id: 'cattle-details', label: t('Cattle Details', 'மாட்டின் விவரங்கள்'), icon: Heart },
    { id: 'analytics', label: t('Health Analytics', 'சுகாதார பகுப்பாய்வு'), icon: Activity },
    { id: 'gps', label: t('Live GPS Tracking', 'ஜிபிஎஸ் கண்காணிப்பு'), icon: MapPin },
    { id: 'alerts', label: t('Alerts & Notifications', 'எச்சரிக்கைகள்'), icon: AlertTriangle, badge: unreadAlertsCount },
    { id: 'schemes', label: t('Govt Schemes', 'அரசு திட்டங்கள்'), icon: FileText },
    { id: 'vet-services', label: t('Nearby Vets', 'அருகிலுள்ள கால்நடை'), icon: Stethoscope },
    { id: 'chatbot', label: t('AI Voice Chatbot', 'AI குரல் சாட்பாட்'), icon: Bot },
    { id: 'profile', label: t('My Profile', 'எனது சுயவிவரம்'), icon: User },
    { id: 'settings', label: t('Settings', 'அமைப்புகள்'), icon: Settings }
  ];

  const doctorNavItems = [
    { id: 'doctor-dashboard', label: t('Doctor Dashboard', 'மருத்துவர் பக்கம்'), icon: LayoutDashboard },
    { id: 'doctor-consultation', label: t('Consultation Room', 'ஆலோசனை அறை'), icon: Stethoscope },
    { id: 'reports', label: t('Health Reports', 'சுகாதார அறிக்கைகள்'), icon: FileText },
    { id: 'profile', label: t('Doctor Profile', 'சுயவிவரம்'), icon: User },
    { id: 'settings', label: t('Settings', 'அமைப்புகள்'), icon: Settings }
  ];

  const navItems = activeRole === 'farmer' ? farmerNavItems : doctorNavItems;

  const handleLogout = () => {
    setActiveRole('guest');
    setActiveTab('home');
    if (setIsOpen) setIsOpen(false);
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (id === 'cattle-details') {
      setSelectedCattleId(null);
    }
    if (setIsOpen) setIsOpen(false); // Close drawer on mobile after clicking
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50' : '-translate-x-full'
        } ${collapsed ? 'md:w-20' : 'w-72 md:w-72'} pb-safe pt-safe h-full shrink-0`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐄</span>
                <div>
                  <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 text-lg leading-tight font-display tracking-wide">
                    BioSense
                  </h1>
                  <span className="text-[10px] text-slate-400 font-medium tracking-widest block uppercase">Collar System</span>
                </div>
              </div>
            )}
            {collapsed && <span className="text-2xl mx-auto hidden md:block">🐄</span>}
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors ml-auto"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            
            {/* Mobile Close Toggle */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">

            {/* Navigation Options */}
            <nav className="mt-2 md:mt-4 px-3 space-y-1 pb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 rounded-xl transition-all font-medium text-sm group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {item.badge > 0 && (
                      <span className={`absolute ${collapsed ? 'top-1 right-2 hidden md:block' : 'right-4'} px-2 py-0.5 text-xxs font-bold bg-rose-500 text-white rounded-full`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer (Toggles & Logout) */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 shrink-0">

            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-200 border border-slate-200 dark:border-slate-700/50 hover:border-rose-200 dark:hover:border-rose-900/50 rounded-xl transition-all text-xs font-semibold ${
                collapsed ? 'md:px-0' : ''
              }`}
            >
              <LogOut size={16} className="shrink-0" />
              {(!collapsed) && <span>{t('Logout', 'வெளியேறு')}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
