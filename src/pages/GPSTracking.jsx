import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Compass, MapPin, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function GPSTracking() {
  const { cattle, selectedCattleId, setSelectedCattleId, centerLat, centerLng, t } = useContext(AppContext);
  const mapRef = useRef(null);

  const cow = cattle.find((c) => c.id === selectedCattleId) || cattle[0];
  const { lat, lng } = cow.telemetry.gps;

  // Calculate distance from center (approximate in meters)
  // 1 degree lat is ~111,000 meters.
  const distance = Math.round(
    Math.sqrt(Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)) * 111320
  );

  const isBreached = distance > 120; // safe zone radius: 120 meters

  // Custom marker icons using Leaflet divIcon to bypass 404 image bundle errors
  const cowIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-lg hover:scale-110 transition-transform">🐄</div>
        <div class="w-10 h-10 rounded-full bg-emerald-500/35 absolute inset-0 animate-ping radar-ring"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });

  const criticalIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-lg animate-bounce">🐄</div>
        <div class="w-10 h-10 rounded-full bg-rose-500/40 absolute inset-0 animate-ping radar-ring"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });

  const farmIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="w-10 h-10 bg-slate-900 dark:bg-slate-100 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-lg">🏡</div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });

  const activeIcon = isBreached ? criticalIcon : cowIcon;

  // Fly map viewport to cow position when telemetry moves
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 17);
    }
  }, [lat, lng]);

  const recenterMap = () => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 17);
    }
  };

  // Mock location history line points
  const historyPoints = [
    [centerLat, centerLng],
    [centerLat + 0.0001, centerLng + 0.0001],
    [centerLat + 0.0002, centerLng + 0.0001],
    [lat, lng]
  ];

  return (
    <div className="h-full flex flex-col gap-6 font-sans">
      {/* Map Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500">{t('Track Collar:', 'இருப்பிடம்:')}</span>
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
                🐄 {c.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={recenterMap}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>{t('Recenter Cattle Map', 'இருப்பிடத்தை மையமாக்கு')}</span>
        </button>
      </div>

      {/* Main Map Box */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative min-h-[400px] flex flex-col md:flex-row">
        
        {/* Leaflet Map */}
        <div className="flex-1 h-full min-h-[350px] relative">
          <MapContainer
            center={[lat, lng]}
            zoom={17}
            scrollWheelZoom={true}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Geofence safe circle (120 meters radius) */}
            <Circle
              center={[centerLat, centerLng]}
              radius={120}
              pathOptions={{
                color: isBreached ? '#ef4444' : '#10b981',
                fillColor: isBreached ? '#ef4444' : '#10b981',
                fillOpacity: 0.08,
                weight: 2,
                dashArray: '5, 8'
              }}
            />

            {/* Farm Home marker */}
            <Marker position={[centerLat, centerLng]} icon={farmIcon}>
              <Popup>
                <div className="text-center font-bold text-xs p-1">
                  <h4>🏡 Green Valley Farm</h4>
                  <p className="text-slate-400 font-normal">Geofence Center Node</p>
                </div>
              </Popup>
            </Marker>

            {/* Cow Marker */}
            <Marker position={[lat, lng]} icon={activeIcon}>
              <Popup>
                <div className="text-center font-bold text-xs p-1">
                  <h4>🐄 {cow.name}</h4>
                  <p className="text-slate-400 font-normal">Collar {cow.id}</p>
                </div>
              </Popup>
            </Marker>

            {/* Location History Trace */}
            <Polyline
              positions={historyPoints}
              pathOptions={{
                color: isBreached ? '#ef4444' : '#0ea5e9',
                weight: 3,
                dashArray: '8, 8',
                opacity: 0.7
              }}
            />
          </MapContainer>
        </div>

        {/* Navigation & Geofence Overlay Panel */}
        <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
              <Compass className="text-emerald-500 animate-spin-slow" size={20} />
              <span>{t('Tracking Panel', 'இருப்பிடக் கண்காணிப்பு')}</span>
            </h3>

            {/* Status Indicators */}
            <div className={`p-4 border rounded-2xl flex items-center gap-3 ${isBreached ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400'}`}>
              {isBreached ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {isBreached ? t('Geofence Breached', 'எல்லை மீறப்பட்டது') : t('Inside Safe Zone', 'பாதுகாப்பு எல்லைக்குள்')}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{isBreached ? t('Cow is outside limits!', 'மாடு எல்லையைத் தாண்டிவிட்டது!') : t('Cow is grazing safely.', 'மாடு பாதுகாப்பாக மேய்கிறது.')}</p>
              </div>
            </div>

            {/* Nav Stats */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{t('Safe Zone Radius', 'பாதுகாப்பான எல்லை')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">120 m</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{t('Current Distance', 'தற்போதைய தூரம்')}</span>
                <span className={`font-bold ${isBreached ? 'text-rose-500 font-black' : 'text-slate-800 dark:text-slate-200'}`}>{distance} m</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{t('Signal Strength', 'சிக்னல் வலிமை')}</span>
                <span className="font-bold text-emerald-500">92% (Excellent)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 leading-relaxed font-semibold">
            ⚡ {t('GPS coordinates are updated via NEO-6M core module connected to ESP32 board directly.', 'NEO-6M ஜிபிஎஸ் தகவல்கள் மேகக்கணி வழியாக பெறப்படுகிறது.')}
          </div>
        </div>
      </div>
    </div>
  );
}
