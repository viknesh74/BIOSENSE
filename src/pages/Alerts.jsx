import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertTriangle, ShieldAlert, Bell, Check, Trash2, ShieldCheck } from 'lucide-react';

export default function Alerts() {
  const { notifications, markRead, markAllRead, clearAlerts, t } = useContext(AppContext);
  const [filter, setFilter] = useState('all'); // 'all' | 'warning' | 'emergency'

  const filteredAlerts = notifications.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const handleMarkAllAsRead = () => {
    markAllRead();
  };

  const handleClearAlerts = () => {
    clearAlerts();
  };

  const toggleRead = (id) => {
    markRead(id);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
            <Bell size={24} className="text-amber-500 animate-swing" />
            <span>{t('Alerts & Notifications Hub', 'பாதுகாப்பு எச்சரிக்கைகள்')}</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {t('Real-time push warning records logs.', 'காலர்களில் இருந்து பெறப்பட்ட அவசர அறிவிப்புகள்.')}
          </p>
        </div>

        <div className="flex gap-2 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-355 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all cursor-pointer"
          >
            <Check size={14} className="text-emerald-500" />
            <span>{t('Mark All Read', 'அனைத்தும் படித்தவை')}</span>
          </button>
          
          <button
            onClick={handleClearAlerts}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-rose-50 dark:bg-slate-850 dark:hover:bg-rose-950/20 text-slate-600 hover:text-rose-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 size={14} className="text-rose-500" />
            <span>{t('Clear Log', 'அழித்துவிடு')}</span>
          </button>
        </div>
      </div>

      {/* Filters & Items */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-4 py-3 gap-2">
          {['all', 'warning', 'emergency'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize border ${
                filter === f
                  ? 'bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? t('All Alerts', 'அனைத்தும்') : t(f, f === 'warning' ? 'எச்சரிக்கை' : 'அவசரநிலை')}
            </button>
          ))}
        </div>

        {/* Alert Items List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-3xl mx-auto border border-slate-100 dark:border-slate-850">
                🔔
              </div>
              <p className="text-sm font-semibold">{t('No notifications found.', 'அறிவிப்புகள் ஏதுமில்லை.')}</p>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isEmerg = item.type === 'emergency';
              
              return (
                <div
                  key={item.id}
                  onClick={() => toggleRead(item.id)}
                  className={`p-5 flex gap-4 hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors cursor-pointer ${
                    !item.read ? 'bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]' : ''
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isEmerg ? (
                      <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 border border-rose-100 dark:border-rose-900/60 animate-pulse">
                        <ShieldAlert size={20} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-900/60">
                        <AlertTriangle size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold leading-snug font-display ${!item.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                        {t(item.title)}
                        {!item.read && (
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ml-2" />
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        {typeof item.timestamp === 'number' ? new Date(item.timestamp).toLocaleString() : item.timestamp}
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${!item.read ? 'text-slate-700 dark:text-slate-350 font-medium' : 'text-slate-500 dark:text-slate-450'}`}>
                      {t(item.message)}
                    </p>

                    <div className="flex justify-between items-center pt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{t('Collar ID')}: {item.collarId}</span>
                      <span>{item.read ? t('Read', 'படித்தது') : t('Mark Read', 'படிக்காதது')}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
