import React, { useContext, useState } from 'react';
import { AppContext } from './context/AppContext';

// Component imports
import Sidebar from './components/Sidebar';
import SimulationPanel from './components/SimulationPanel';

// Page imports
import Home from './pages/Home';
import FarmerDashboard from './pages/FarmerDashboard';
import CattleDetails from './pages/CattleDetails';
import HealthAnalytics from './pages/HealthAnalytics';
import HerdAnalytics from './pages/HerdAnalytics';
import GPSTracking from './pages/GPSTracking';
import Alerts from './pages/Alerts';
import GovernmentSchemes from './pages/GovernmentSchemes';
import VeterinaryServices from './pages/VeterinaryServices';
import Chatbot from './components/Chatbot';
import DoctorDashboard from './pages/DoctorDashboard';
import Consultation from './pages/Consultation';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';

// Icon imports for top bar
import { Bell, Sun, Moon, User, Menu } from 'lucide-react';
import LanguageDropdown from './components/LanguageDropdown';

export default function App() {
  const {
    activeRole,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    notifications,
    t
  } = useContext(AppContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. GUEST LANDING VIEW
  if (activeRole === 'guest') {
    return (
      <>
        <Home />
        <SimulationPanel />
      </>
    );
  }

  // 2. ROUTING CONTROLLER
  const renderActiveTab = () => {
    switch (activeTab) {
      // Farmer routes
      case 'dashboard':
        return <FarmerDashboard />;
      case 'cattle-details':
        return <CattleDetails />;
      case 'analytics':
        return <HerdAnalytics />;
      case 'cattle-analytics':
        return <HealthAnalytics />;
      case 'gps':
        return <GPSTracking />;
      case 'alerts':
        return <Alerts />;
      case 'schemes':
        return <GovernmentSchemes />;
      case 'vet-services':
        return <VeterinaryServices />;
      case 'chatbot':
        return (
          <div className="h-[calc(100vh-180px)] min-h-[450px]">
            <Chatbot />
          </div>
        );

      // Doctor routes
      case 'doctor-dashboard':
        return <DoctorDashboard />;
      case 'doctor-consultation':
        return <Consultation />;
      case 'reports':
        return <Reports />;

      // Shared routes
      case 'profile':
        return <Profile />;
      case 'settings':
        return <SettingsPage />;

      default:
        return activeRole === 'farmer' ? <FarmerDashboard /> : <DoctorDashboard />;
    }
  };

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Navigation Top Bar - Includes pt-safe for mobile notch */}
        <header className="pt-safe shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between z-10 print:hidden h-auto min-h-16">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb Info */}
            <div>
              <span className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest block leading-none">
                {activeRole === 'farmer' ? t('Farmer Console', 'விவசாயி கட்டுப்பாட்டு அறை') : t('Veterinary Doctor Console', 'கால்நடை மருத்துவர் கட்டுப்பாட்டு அறை')}
              </span>
              <h2 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mt-1 md:mt-1 capitalize truncate max-w-[150px] sm:max-w-xs">
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>

          {/* Quick Actions Console */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Language Quick Switch */}
            <LanguageDropdown variant="default" />


            {/* Notifications Bell */}
            {activeRole === 'farmer' && (
              <button
                onClick={() => setActiveTab('alerts')}
                className="p-1.5 md:p-2 bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200/40 transition-all relative"
                title="View active alerts"
              >
                <Bell size={15} />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                )}
              </button>
            )}

            {/* Profile trigger */}
            <button
              onClick={() => setActiveTab('profile')}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shrink-0"
              title="View profile"
            >
              <User size={14} className="md:w-4 md:h-4" />
            </button>

          </div>
        </header>

        {/* Content view window container - includes pb-safe for bottom edge on mobile */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/40 pb-safe print:p-0 print:bg-white relative">
          {renderActiveTab()}
        </main>
      </div>

      {/* Real-time Telemetry Simulator Panel */}
      <SimulationPanel />
    </div>
  );
}

