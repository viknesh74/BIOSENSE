import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Activity, Thermometer, ShieldAlert, Heart, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function HerdAnalytics() {
  const { cattle, t } = useContext(AppContext);
  const [timeFilter, setTimeFilter] = useState('daily');

  // Aggregate stats
  const totalCattle = cattle.length;
  const healthyCount = cattle.filter(c => c.status === 'Healthy').length;
  const warningCount = cattle.filter(c => c.status === 'Warning').length;
  const emergencyCount = cattle.filter(c => c.status === 'Emergency').length;

  // Aggregate history data (assuming all cattle have same timeLabels in this simulation)
  const chartData = useMemo(() => {
    if (!cattle || cattle.length === 0) return [];
    const timeLabels = cattle[0].history.timeLabels || [];
    
    return timeLabels.map((time, idx) => {
      let totalHr = 0;
      let totalTemp = 0;
      let validHrCount = 0;
      let validTempCount = 0;
      
      cattle.forEach(cow => {
        if (cow.history.heartRate && cow.history.heartRate[idx]) {
          totalHr += cow.history.heartRate[idx];
          validHrCount++;
        }
        if (cow.history.temperature && cow.history.temperature[idx]) {
          totalTemp += cow.history.temperature[idx];
          validTempCount++;
        }
      });

      return {
        time,
        avgHr: validHrCount ? Math.round(totalHr / validHrCount) : 0,
        avgTemp: validTempCount ? Number((totalTemp / validTempCount).toFixed(1)) : 0
      };
    });
  }, [cattle]);

  const pieData = [
    { name: t('Healthy', 'ஆரோக்கியம்', 'स्वस्थ'), value: healthyCount, color: '#10b981' },
    { name: t('Warning', 'எச்சரிக்கை', 'चेतावनी'), value: warningCount, color: '#f59e0b' },
    { name: t('Emergency', 'அவசரம்', 'आपातकाल'), value: emergencyCount, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
            {t('Herd Health Overview', 'மந்தை சுகாதார கண்ணோட்டம்', 'झुंड स्वास्थ्य अवलोकन')}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {t('Overall statistics and aggregated vitals for all registered cattle.', 'அனைத்து மாடுகளின் ஒட்டுமொத்த சுகாதார புள்ளிவிவரங்கள்.', 'सभी पंजीकृत मवेशियों के लिए समग्र आंकड़े और महत्वपूर्ण अंग।')}
          </p>
        </div>

        {/* Daily/Weekly/Monthly Toggle */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl max-w-xs self-start lg:self-auto border border-slate-250/20">
          {['daily', 'weekly', 'monthly'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                timeFilter === filter
                  ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
              }`}
            >
              {t(`${filter} Summary`, `${filter === 'daily' ? 'தினசரி' : filter === 'weekly' ? 'வாராந்திர' : 'மாதாந்திர'} சுருக்கம்`)}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-500">
            <Info size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Total Cattle', 'மொத்த மாடுகள்')}</p>
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{totalCattle}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Healthy', 'ஆரோக்கியம்')}</p>
            <h4 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{healthyCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Warning', 'எச்சரிக்கை')}</p>
            <h4 className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{warningCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Emergency', 'அவசரம்')}</p>
            <h4 className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">{emergencyCount}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-1 flex flex-col">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Activity className="text-indigo-500" size={20} />
              <span>{t('Herd Status Distribution', 'சுகாதார நிலை')}</span>
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">{t('Current health states across all livestock.', 'தற்போதைய சுகாதார நிலை.')}</p>
          </div>
          <div className="flex-1 min-h-[250px] w-full mt-4 text-xs flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aggregated HR/Temp Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Heart className="text-rose-500 animate-pulse-heart" size={20} />
              <span>{t('Average Herd Vitals Trend', 'சராசரி சுகாதார போக்கு')}</span>
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">{t('Aggregated telemetry data for the entire herd over time.', 'அனைத்து மாடுகளின் சராசரி தரவுகள்.')}</p>
          </div>

          <div className="h-72 w-full pr-4 text-xs mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-850" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis yAxisId="left" orientation="left" stroke="#f43f5e" domain={[50, 110]} />
                <YAxis yAxisId="right" orientation="right" stroke="#eab308" domain={[37, 42]} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  name={t('Avg Heart Rate (BPM)', 'சராசரி இதயத்துடிப்பு')} 
                  dataKey="avgHr" 
                  fill="#f43f5e" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar 
                  yAxisId="right" 
                  name={t('Avg Temp (°C)', 'சராசரி வெப்பநிலை')} 
                  dataKey="avgTemp" 
                  fill="#eab308" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
