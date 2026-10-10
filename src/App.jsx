import React, { useContext, useState } from 'react';
import { AppContext } from './context/AppContext';

// Component imports
import Sidebar from './components/Sidebar';

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
import MedicalRecords from './pages/MedicalRecords';
import Chatbot from './components/Chatbot';
import DoctorDashboard from './pages/DoctorDashboard';
import Consultation from './pages/Consultation';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import CattleCareAI from './pages/CattleCareAI';

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
      case 'medical-records':
        return <MedicalRecords />;
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
      case 'cattle-care-ai':
        return <CattleCareAI />;
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
    <div className="flex h-screen w-full bg-[#F7F6F0] dark:bg-[#0A1612] dark:text-[#DDEADF] transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Navigation Top Bar */}
        <header className="pt-safe shrink-0 bg-white dark:bg-[#0D2219] border-b border-[#DDEADF] dark:border-[#174D38]/60 px-4 md:px-6 py-3 flex items-center justify-between z-10 print:hidden h-auto min-h-16 shadow-xs">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl bg-[#EEF5F0] dark:bg-[#174D38]/40 text-[#5A7065] dark:text-[#9FB5AA] hover:text-[#103B2D] dark:hover:text-white transition-colors"
            >
              <Menu size={18} />
            </button>

            <div>
              <span className="text-[9px] md:text-[10px] text-[#5A7065] dark:text-[#4B8A64] font-bold uppercase tracking-widest block leading-none">
                {activeRole === 'farmer' ? t('Farmer Console', 'விவசாயி கட்டுப்பாட்டு அறை') : t('Veterinary Doctor Console', 'கால்நடை மருத்துவர் கட்டுப்பாட்டு அறை')}
              </span>
              <h2 className="text-xs md:text-sm font-bold text-[#103B2D] dark:text-[#EEF5F0] uppercase tracking-wider mt-0.5 capitalize truncate max-w-[150px] sm:max-w-xs">
                {t(activeTab === 'dashboard' ? 'Dashboard' :
                   activeTab === 'cattle-details' ? 'Cattle Details' :
                   activeTab === 'analytics' ? 'Herd Analytics' :
                   activeTab === 'cattle-analytics' ? 'Health Analytics' :
                   activeTab === 'gps' ? 'Live GPS Tracking' :
                   activeTab === 'alerts' ? 'Alerts & Notifications' :
                   activeTab === 'schemes' ? 'Govt Schemes' :
                   activeTab === 'cattle-care-ai' ? 'CattleCare AI' :
                   activeTab === 'vet-services' ? 'Nearby Vets' :
                   activeTab === 'chatbot' ? 'AI Voice Chatbot' :
                   activeTab === 'doctor-dashboard' ? 'Doctor Dashboard' :
                   activeTab === 'doctor-consultation' ? 'Consultation Room' :
                   activeTab === 'reports' ? 'Health Reports' :
                   activeTab === 'profile' ? 'My Profile' :
                   activeTab === 'settings' ? 'Settings' : activeTab.replace('-', ' '))}
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
                className="p-1.5 md:p-2 bg-[#EEF5F0] dark:bg-[#174D38]/40 text-[#5A7065] dark:text-[#9FB5AA] hover:text-[#103B2D] dark:hover:text-white rounded-xl border border-[#DDEADF] dark:border-[#174D38]/60 transition-all relative"
                title="View active alerts"
              >
                <Bell size={15} />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#C94C48] rounded-full animate-ping" />
                )}
              </button>
            )}

            {/* Profile trigger */}
            <button
              onClick={() => setActiveTab('profile')}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#174D38] text-white border-2 border-[#4B8A64]/50 flex items-center justify-center hover:bg-[#103B2D] transition-all shrink-0 text-xs font-black"
              title="View profile"
            >
              <User size={13} />
            </button>

          </div>
        </header>

        {/* Content view window container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-[#F7F6F0] dark:bg-[#0A1612] pb-safe print:p-0 print:bg-white relative">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

