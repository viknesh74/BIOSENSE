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
  Pill,
  Camera,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sun,
  Moon,
  X
} from 'lucide-react';
import LanguageDropdown from './LanguageDropdown';
import Logo from './Logo';

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
    { id: 'medical-records', label: t('Vaccines & Medical', 'தடுப்பூசி & மருத்துவம்', 'टीकाकरण और चिकित्सा'), icon: Pill },
    { id: 'analytics', label: t('Health Analytics', 'சுகாதார பகுப்பாய்வு'), icon: Activity },
    { id: 'gps', label: t('Live GPS Tracking', 'ஜிபிஎஸ் கண்காணிப்பு'), icon: MapPin },
    { id: 'alerts', label: t('Alerts & Notifications', 'எச்சரிக்கைகள்'), icon: AlertTriangle, badge: unreadAlertsCount },
    { id: 'schemes', label: t('Govt Schemes', 'அரசு திட்டங்கள்'), icon: FileText },
    { id: 'vet-services', label: t('Nearby Vets', 'அருகிலுள்ள கால்நடை'), icon: Stethoscope },
    { id: 'cattle-care-ai', label: t('CattleCare AI', 'CattleCare AI', 'CattleCare AI'), icon: Camera },
    { id: 'chatbot', label: t('AI Voice Chatbot', 'AI குரல் சாட்பாட்'), icon: Bot },
    { id: 'profile', label: t('My Profile', 'எனது சுயவிவரம்'), icon: User },
    { id: 'settings', label: t('Settings', 'அமைப்புகள்'), icon: Settings }
  ];

  const doctorNavItems = [
    { id: 'doctor-dashboard', label: t('Doctor Dashboard', 'மருத்துவர் பக்கம்'), icon: LayoutDashboard },
    { id: 'doctor-consultation', label: t('Consultation Room', 'ஆலோசனை அறை'), icon: Stethoscope },
    { id: 'reports', label: t('Health Reports', 'சுகாதார அறிக்கைகள்'), icon: FileText },
    { id: 'cattle-care-ai', label: t('CattleCare AI', 'CattleCare AI', 'CattleCare AI'), icon: Camera },
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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#F7F6F0] dark:bg-[#0D2219] text-[#20312A] dark:text-[#DDEADF] border-r border-[#DDEADF] dark:border-[#174D38]/60 transition-transform duration-300 transform md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl shadow-black/10' : '-translate-x-full'
        } ${collapsed ? 'md:w-20' : 'w-72 md:w-72'} pb-safe pt-safe h-full shrink-0`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#DDEADF] dark:border-[#174D38]/60 shrink-0">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Logo className="text-xl" />
              </div>
            )}
            {collapsed && <Activity className="mx-auto hidden md:block text-[#4B8A64]" size={22} />}
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-1.5 rounded-lg bg-[#DDEADF]/60 dark:bg-[#174D38]/40 text-[#5A7065] dark:text-[#9FB5AA] hover:text-[#103B2D] dark:hover:text-white transition-colors ml-auto"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            
            {/* Mobile Close Toggle */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-[#DDEADF]/60 dark:bg-[#174D38]/40 text-[#5A7065] dark:text-[#9FB5AA] hover:text-[#103B2D] dark:hover:text-white transition-colors"
            >
              <X size={16} />
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm group relative ${
                      isActive
                        ? 'bg-[#174D38] text-white shadow-md shadow-[#174D38]/30'
                        : 'text-[#5A7065] dark:text-[#9FB5AA] hover:bg-[#DDEADF]/70 dark:hover:bg-[#174D38]/30 hover:text-[#103B2D] dark:hover:text-white'
                    }`}
                  >
                    <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-[#4B8A64] dark:text-[#4B8A64] group-hover:text-[#174D38] dark:group-hover:text-emerald-300'}`} />
                    {!collapsed && <span className="truncate text-xs font-semibold">{item.label}</span>}
                    {item.badge > 0 && (
                      <span className={`absolute ${collapsed ? 'top-1 right-2 hidden md:block' : 'right-3'} px-1.5 py-0.5 text-[10px] font-bold bg-[#C94C48] text-white rounded-full`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer (Logout) */}
          <div className="p-4 border-t border-[#DDEADF] dark:border-[#174D38]/60 shrink-0">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white/80 dark:bg-[#103B2D]/60 hover:bg-[#C94C48]/10 dark:hover:bg-[#C94C48]/20 text-[#5A7065] dark:text-[#9FB5AA] hover:text-[#C94C48] dark:hover:text-rose-300 border border-[#DDEADF] dark:border-[#174D38]/60 hover:border-[#C94C48]/40 rounded-xl transition-all text-xs font-semibold ${
                collapsed ? 'md:px-0' : ''
              }`}
            >
              <LogOut size={15} className="shrink-0" />
              {(!collapsed) && <span>{t('Logout', 'வெளியேறு')}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
