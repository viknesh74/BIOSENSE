import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Settings, Play, ShieldAlert, Zap, Compass, RefreshCw, X } from 'lucide-react';

export default function SimulationPanel() {
  const { simConfig, setSimConfig, activeRole, t } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  // Don't show simulation panel to guests (landing page)
  if (activeRole === 'guest') return null;

  const updateConfig = (key, value) => {
    setSimConfig((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl border border-slate-700 hover:scale-105 transition-all duration-200"
          title="Demo Simulator"
        >
          <Settings className="animate-spin-slow text-amber-400" size={20} />
        </button>
      )}

      {/* Simulator Control Box */}
      {isOpen && (
        <div className="w-80 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-850 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Play size={16} />
              <span>Collar Telemetry Sim</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Controls Body */}
          <div className="p-4 space-y-4 text-xs">
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Use these overrides to simulate live telemetry data coming from the collars of your livestock. Updates reflect in real-time.
            </p>

            {/* Heart Rate Controls */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-emerald-400" />
                <span>Heart Rate (Collar 101)</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl">
                {['normal', 'high', 'low'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateConfig('heartRateMode', mode)}
                    className={`py-1.5 rounded-lg capitalize font-bold transition-all ${
                      simConfig.heartRateMode === mode
                        ? 'bg-amber-500 text-slate-950 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Controls */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-rose-400" />
                <span>Body Temp (Collar 101)</span>
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl">
                {['normal', 'high'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateConfig('tempMode', mode)}
                    className={`py-1.5 rounded-lg capitalize font-bold transition-all ${
                      simConfig.tempMode === mode
                        ? 'bg-amber-500 text-slate-950 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'normal' ? 'Normal (~38.5°)' : 'Fever (>40.5°)'}
                  </button>
                ))}
              </div>
            </div>

            {/* GPS Geofencing Control */}
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Compass size={14} className="text-teal-400" />
                Geofence Breach (Collar 101)
              </span>
              <button
                onClick={() => updateConfig('geofenceBreach', !simConfig.geofenceBreach)}
                className={`w-12 h-6 rounded-full relative transition-all duration-350 outline-none ${
                  simConfig.geofenceBreach ? 'bg-rose-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow ${
                    simConfig.geofenceBreach ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Battery Drain Control */}
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap size={14} className="text-yellow-400" />
                Simulate Battery Drain
              </span>
              <button
                onClick={() => updateConfig('batteryDrain', !simConfig.batteryDrain)}
                className={`w-12 h-6 rounded-full relative transition-all duration-350 outline-none ${
                  simConfig.batteryDrain ? 'bg-rose-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow ${
                    simConfig.batteryDrain ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Live wander helper */}
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <RefreshCw size={14} className="text-indigo-400" />
                Live Map Wander
              </span>
              <button
                onClick={() => updateConfig('liveMapWander', !simConfig.liveMapWander)}
                className={`w-12 h-6 rounded-full relative transition-all duration-350 outline-none ${
                  simConfig.liveMapWander ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow ${
                    simConfig.liveMapWander ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            
            {/* Simulation Status Monitor */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] space-y-1">
              <p className="text-slate-500 font-bold tracking-wider uppercase">Active Telemetry Simulation</p>
              <div className="flex justify-between">
                <span className="text-slate-400">Heart Rate:</span>
                <span className={simConfig.heartRateMode !== 'normal' ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                  {simConfig.heartRateMode.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Temperature:</span>
                <span className={simConfig.tempMode !== 'normal' ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                  {simConfig.tempMode === 'high' ? 'HIGH FEVER' : 'NORMAL'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Geofence:</span>
                <span className={simConfig.geofenceBreach ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {simConfig.geofenceBreach ? 'BREACHED' : 'SAFE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
