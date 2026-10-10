import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Activity, Thermometer, ShieldAlert, Heart, Calendar } from 'lucide-react';

export default function HealthAnalytics() {
  const { cattle, selectedCattleId, setSelectedCattleId, t } = useContext(AppContext);
  const [timeFilter, setTimeFilter] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  const cow = cattle.find((c) => String(c.id) === String(selectedCattleId)) || cattle[0];

  const defaultHeartRate = [70, 72, 71, 74, 72, 73, 72];
  const defaultTemp = [38.5, 38.6, 38.5, 38.7, 38.6, 38.6, 38.6];
  const defaultLabels = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

  const hrList = cow?.history?.heartRate?.length ? cow.history.heartRate : defaultHeartRate;
  const tempList = cow?.history?.temperature?.length ? cow.history.temperature : defaultTemp;
  const timeLabels = cow?.history?.timeLabels?.length ? cow.history.timeLabels : defaultLabels;

  // Map history to Recharts format
  const chartData = hrList.map((hr, idx) => {
    return {
      time: timeLabels[idx] || '',
      bpm: hr,
      temp: tempList[idx] || 38.6
    };
  });

  // Calculate statistics
  const avgHR = Math.round(hrList.reduce((a, b) => a + b, 0) / hrList.length);
  const maxTemp = Math.max(...tempList);
  const minTemp = Math.min(...tempList);

  return (
    <div className="space-y-6 font-sans">
      {/* Selector and Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-slate-500">{t('Livestock:', 'கால்நடை:')}</span>
          <div className="flex gap-2">
            {cattle.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCattleId(c.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  selectedCattleId === c.id
                    ? 'bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100 text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500">
            <Heart size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Average Heart Rate', 'சராசரி இதயத்துடிப்பு')}</p>
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{avgHR} BPM</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500">
            <Thermometer size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Peak Temperature', 'அதிகபட்ச வெப்பநிலை')}</p>
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{maxTemp.toFixed(1)}°C</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Stability Rating', 'சுகாதாரத் தரம்')}</p>
            <h4 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {cow.status === 'Healthy' ? '98.5% (Optimal)' : cow.status === 'Warning' ? '82.0% (Fair)' : '64.0% (Critical)'}
            </h4>
          </div>
        </div>
      </div>

      {/* Heart Rate Chart (Recharts) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
            <Heart className="text-rose-500 animate-pulse-heart" size={20} />
            <span>{t('Heart Rate Sensor Log', 'இதயத்துடிப்பு வரைபடம்')}</span>
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">{t('Live telemetry signals matched against thresholds.', 'நேரடி சென்சார் சிக்னல்கள் கணக்கீடு.')}</p>
        </div>

        <div className="h-72 w-full pr-4 text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-850" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis domain={[40, 130]} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                name={t('Heart Rate (BPM)', 'இதயத்துடிப்பு (BPM)')}
                type="monotone"
                dataKey="bpm"
                stroke="#f43f5e"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={{ stroke: '#f43f5e', strokeWidth: 2, r: 4, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Temperature Chart (Recharts) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
            <Thermometer className="text-amber-500" size={20} />
            <span>{t('Body Temperature (DS18B20 Log)', 'வெப்பநிலை வரைபடம்')}</span>
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">{t('Sub-skin probe telemetry readings in degrees Celsius.', 'டிகிரி செல்சியஸில் சென்சார் பதிவுகள்.')}</p>
        </div>

        <div className="h-72 w-full pr-4 text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-850" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis domain={[37, 43]} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                name={t('Temperature (°C)', 'வெப்பநிலை (°C)')}
                type="monotone"
                dataKey="temp"
                stroke="#eab308"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={{ stroke: '#eab308', strokeWidth: 2, r: 4, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
