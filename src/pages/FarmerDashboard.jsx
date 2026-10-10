import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Plus, 
  ArrowRight, 
  ShieldAlert, 
  Heart, 
  Battery, 
  ChevronRight, 
  Activity, 
  Thermometer, 
  Pill, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Bell 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DropdownMenu, DropdownMenuItem } from '../components/ui/DropdownMenu';
import { CollarFormDialog } from '../components/collars/CollarFormDialog';
import { DeleteCollarDialog } from '../components/collars/DeleteCollarDialog';

export default function FarmerDashboard() {
  const { 
    cattle, 
    addCollar, 
    updateCollar, 
    removeCollar, 
    setSelectedCattleId, 
    setActiveTab, 
    notifications,
    t 
  } = useContext(AppContext);

  // Collar dialogs
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCollar, setEditingCollar] = useState(null);
  const [deletingCollar, setDeletingCollar] = useState(null);

  // Stats calculation
  const totalCount = cattle.length;
  const healthyCount = cattle.filter((c) => c.status === 'Healthy').length;
  const warningCount = cattle.filter((c) => c.status === 'Warning').length;
  const emergencyCount = cattle.filter((c) => c.status === 'Emergency').length;

  const handleCardClick = (id) => {
    setSelectedCattleId(id);
    setActiveTab('cattle-details');
  };

  const handleEditClick = (e, cow) => {
    e.stopPropagation();
    setEditingCollar(cow);
  };

  const handleDeleteClick = (e, cow) => {
    e.stopPropagation();
    setDeletingCollar(cow);
  };

  const recentAlerts = notifications.slice(0, 2);

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto pb-12">
      {/* Welcome Bar */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#103B2D] p-6 md:p-8 rounded-3xl border border-[#174D38] shadow-lg overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#4B8A64]/20 blur-2xl pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Farm Telemetry
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
              IoT Connected
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white font-display">
            {t('Welcome, Uma', 'வரவேற்கிறோம், உமா')} 🌾
          </h2>
          <p className="text-[#DDEADF]/80 text-sm mt-1 max-w-lg">
            {t("Here is the live status of your dairy farm's livestock.", 'இன்று உங்களது பண்ணை கால்நடைகளின் நேரடி உடல்நிலை விவரங்கள்.')}
          </p>
        </div>

        <div className="relative flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setActiveTab('medical-records')}
            className="text-xs font-bold bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Pill size={16} className="text-emerald-300" />
            <span>{t('Vaccines & Medical', 'தடுப்பூசி பதிவுகள்')}</span>
          </Button>

          <Button
            variant="default"
            size="md"
            onClick={() => setShowAddModal(true)}
            className="bg-[#4B8A64] hover:bg-emerald-600 text-white shadow-lg shadow-black/20 border-0"
          >
            <Plus size={18} />
            <span>{t('Add New Collar', 'புதிய காலர் சேர்')}</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div 
          onClick={() => setActiveTab('cattle-details')}
          className="bg-white dark:bg-[#0D2219] p-5 rounded-2xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs flex items-center gap-4 hover:border-[#4B8A64] dark:hover:border-[#4B8A64] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EEF5F0] dark:bg-[#174D38]/40 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            🐄
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5A7065] dark:text-[#9FB5AA] uppercase tracking-wider">{t('My Cattle', 'மொத்த மாடுகள்')}</p>
            <h4 className="text-2xl font-black text-[#103B2D] dark:text-white font-display mt-0.5">{totalCount}</h4>
          </div>
        </div>

        {/* Healthy */}
        <div className="bg-white dark:bg-[#0D2219] p-5 rounded-2xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF5F0] dark:bg-[#174D38]/40 text-[#4B8A64] flex items-center justify-center shrink-0">
            <Activity size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5A7065] dark:text-[#9FB5AA] uppercase tracking-wider">{t('Healthy', 'ஆரோக்கியம்')}</p>
            <h4 className="text-2xl font-black text-[#4B8A64] dark:text-emerald-400 font-display mt-0.5">{healthyCount}</h4>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-white dark:bg-[#0D2219] p-5 rounded-2xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-[#D89B38] flex items-center justify-center shrink-0">
            <Battery size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5A7065] dark:text-[#9FB5AA] uppercase tracking-wider">{t('Warning', 'எச்சரிக்கை')}</p>
            <h4 className="text-2xl font-black text-[#D89B38] font-display mt-0.5">{warningCount}</h4>
          </div>
        </div>

        {/* Emergency */}
        <div className="bg-white dark:bg-[#0D2219] p-5 rounded-2xl border border-[#DDEADF] dark:border-[#174D38]/60 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-[#C94C48] flex items-center justify-center shrink-0">
            <ShieldAlert size={22} className={emergencyCount > 0 ? 'animate-pulse' : ''} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5A7065] dark:text-[#9FB5AA] uppercase tracking-wider">{t('Emergency', 'அவசரநிலை')}</p>
            <h4 className="text-2xl font-black text-[#C94C48] font-display mt-0.5">{emergencyCount}</h4>
          </div>
        </div>
      </div>

      {/* Recent Alerts Feed Preview */}
      {recentAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-[#FFF8ED] dark:from-[#1A1300] dark:to-[#1A1300] p-4 md:p-5 rounded-2xl border border-[#D89B38]/30 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D89B38]/15 text-[#D89B38] flex items-center justify-center shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase text-[#D89B38] tracking-wider">
                {t('Recent Herd Telemetry Alert')}
              </p>
              <p className="text-xs font-medium text-[#103B2D] dark:text-[#DDEADF] mt-0.5">
                {recentAlerts[0]?.title}: {recentAlerts[0]?.message}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('alerts')}
            className="text-xs shrink-0 self-start sm:self-auto border-[#D89B38]/40 text-[#D89B38] hover:bg-[#D89B38]/10"
          >
            {t('View All Alerts')}
          </Button>
        </div>
      )}

      {/* Section Title */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-xl font-black text-[#103B2D] dark:text-white font-display">
            {t('Active Livestock Collars', 'செயலில் உள்ள மாடுகள்')}
          </h3>
          <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA]">{t('Live sensor broadcast updated automatically')}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedCattleId(null);
            setActiveTab('cattle-details');
          }}
          className="text-xs text-[#174D38] dark:text-emerald-400 font-bold gap-1"
        >
          <span>{t('View All in Fleet')}</span>
          <ArrowRight size={14} />
        </Button>
      </div>

      {/* Cattle Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cattle.map((cow) => {
          const isEmergency = cow.status === 'Emergency';
          const isWarning = cow.status === 'Warning';
          
          let statusBadgeColor = 'bg-[#EEF5F0] text-[#174D38] border-[#DDEADF] dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900';
          let statusLabel = t('🟢 Healthy', '🟢 நலம்');

          if (isEmergency) {
            statusBadgeColor = 'bg-rose-50 dark:bg-rose-950/30 text-[#C94C48] dark:text-rose-400 border-rose-200 dark:border-rose-900 animate-pulse';
            statusLabel = t('🔴 Emergency', '🔴 அவசரநிலை');
          } else if (isWarning) {
            statusBadgeColor = 'bg-amber-50 dark:bg-amber-950/30 text-[#D89B38] dark:text-amber-400 border-amber-200 dark:border-amber-900';
            statusLabel = t('🟡 Warning', '🟡 எச்சரிக்கை');
          }

          const batt = cow.telemetry?.battery ?? 85;

          return (
            <div
              key={cow.id}
              onClick={() => handleCardClick(cow.id)}
              className="bg-white dark:bg-[#0D2219] rounded-3xl border border-[#DDEADF] dark:border-[#174D38]/60 hover:border-[#4B8A64] dark:hover:border-[#4B8A64] shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between group relative"
            >
              {/* Card Header Info */}
              <div className="p-5 flex gap-4">
                {cow.photo ? (
                  <img
                    src={cow.photo}
                    alt={cow.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#DDEADF] dark:border-[#174D38] group-hover:scale-105 transition-transform shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#EEF5F0] dark:bg-[#174D38]/30 border border-[#DDEADF] dark:border-[#174D38] flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                    {cow.animalType === 'Sheep' ? '🐑' : cow.animalType === 'Goat' ? '🐐' : cow.animalType === 'Buffalo' ? '🐃' : '🐄'}
                  </div>
                )}
                
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#5A7065] dark:text-[#4B8A64]">Tag #{cow.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-lg uppercase tracking-wider ${statusBadgeColor}`}>
                        {statusLabel}
                      </span>
                      {/* 3-Dot Actions Menu */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu
                          trigger={
                            <button
                              type="button"
                              className="w-7 h-7 rounded-lg text-[#5A7065] hover:text-[#103B2D] dark:hover:text-white hover:bg-[#EEF5F0] dark:hover:bg-[#174D38]/40 flex items-center justify-center transition-colors"
                              title={t('Options')}
                            >
                              <MoreVertical size={15} />
                            </button>
                          }
                        >
                          <DropdownMenuItem
                            icon={Eye}
                            onClick={() => handleCardClick(cow.id)}
                          >
                            {t('View Details')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            icon={Edit}
                            onClick={(e) => handleEditClick(e, cow)}
                          >
                            {t('Edit Collar')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            destructive
                            icon={Trash2}
                            onClick={(e) => handleDeleteClick(e, cow)}
                          >
                            {t('Delete Collar')}
                          </DropdownMenuItem>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-extrabold text-lg text-[#103B2D] dark:text-white font-display group-hover:text-[#174D38] dark:group-hover:text-emerald-300 transition-colors truncate">
                    {cow.name}
                  </h3>
                  
                  <p className="text-xs text-[#5A7065] dark:text-[#9FB5AA] font-medium truncate">
                    {t(cow.animalType || 'Cow')} • {t(cow.breed)} • {cow.age} • {t(cow.gender)}
                  </p>
                </div>
              </div>

              {/* Sensor Live Feed Bar */}
              <div className="bg-[#EEF5F0]/70 dark:bg-[#103B2D]/40 border-t border-[#DDEADF] dark:border-[#174D38]/50 p-4 grid grid-cols-3 gap-2 text-center">
                {/* Heart Rate */}
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#5A7065] dark:text-[#4B8A64] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Heart size={10} className="text-[#C94C48] animate-pulse-heart" />
                    {t('Heart Rate', 'இதயத்துடிப்பு')}
                  </span>
                  <p className={`text-sm font-bold ${cow.telemetry.heartRate > 100 || cow.telemetry.heartRate < 50 ? 'text-[#C94C48]' : 'text-[#103B2D] dark:text-white'}`}>
                    {cow.telemetry.heartRate} <span className="text-[10px] font-normal text-[#5A7065]">BPM</span>
                  </p>
                </div>

                {/* Temperature */}
                <div className="space-y-0.5 border-x border-[#DDEADF] dark:border-[#174D38]/60">
                  <span className="text-[10px] text-[#5A7065] dark:text-[#4B8A64] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Thermometer size={10} className="text-[#D89B38]" />
                    {t('Temp', 'வெப்பம்')}
                  </span>
                  <p className={`text-sm font-bold ${cow.telemetry.temperature > 40.0 ? 'text-[#C94C48]' : 'text-[#103B2D] dark:text-white'}`}>
                    {cow.telemetry.temperature} <span className="text-[10px] font-normal text-[#5A7065]">°C</span>
                  </p>
                </div>

                {/* Battery / Solar */}
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#5A7065] dark:text-[#4B8A64] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Battery size={10} className={`${batt < 20 ? 'text-[#C94C48] animate-pulse' : 'text-[#4B8A64]'}`} />
                    {t('Solar', 'சூரிய')}
                  </span>
                  <p className={`text-sm font-bold ${batt < 20 ? 'text-[#C94C48] font-extrabold' : 'text-[#103B2D] dark:text-white'}`}>
                    {batt}%
                  </p>
                </div>
              </div>

              {/* Action trigger footer */}
              <div className="px-5 py-3 bg-white dark:bg-[#0D2219] border-t border-[#DDEADF] dark:border-[#174D38]/50 flex items-center justify-between text-xs font-semibold text-[#174D38] dark:text-emerald-400">
                <span>{t('View Telemetry & Health History', 'விவரங்கள் & சுகாதார வரலாறு')}</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Collar Dialog */}
      <CollarFormDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        initialData={null}
        existingCattle={cattle}
        onSubmit={addCollar}
        t={t}
      />

      {/* Edit Collar Dialog */}
      <CollarFormDialog
        open={Boolean(editingCollar)}
        onOpenChange={(open) => !open && setEditingCollar(null)}
        initialData={editingCollar}
        existingCattle={cattle}
        onSubmit={(updates) => updateCollar(editingCollar.id, updates)}
        t={t}
      />

      {/* Delete Collar Dialog */}
      <DeleteCollarDialog
        open={Boolean(deletingCollar)}
        onOpenChange={(open) => !open && setDeletingCollar(null)}
        collar={deletingCollar}
        onConfirmDelete={removeCollar}
        t={t}
      />
    </div>
  );
}
