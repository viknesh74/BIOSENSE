import React, { useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  Polyline,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import {
  Compass,
  MapPin,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Search,
  Plus,
  Trash2,
  Save,
  Volume2,
  VolumeX,
  Battery,
  Activity,
  Play,
  Pause,
  Copy,
  Check,
  Radio,
  Edit3,
  Building,
  Map
} from 'lucide-react';
import { pushAlert } from '../services/alertService';
import { rtdb } from '../services/firebase';
import { ref, get } from 'firebase/database';

// ─── Mathematical Geofencing Utilities ───────────────────────────────────────

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function isPointInPolygon(point, polygon) {
  if (!point || !polygon || polygon.length < 3) return true;
  const [lat, lng] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect =
      yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distToSegmentMeters(p, p1, p2) {
  const midLat = (p[0] + p1[0] + p2[0]) / 3;
  const kx = 111320 * Math.cos((midLat * Math.PI) / 180);
  const ky = 111320;

  const px = p[1] * kx;
  const py = p[0] * ky;
  const x1 = p1[1] * kx;
  const y1 = p1[0] * ky;
  const x2 = p2[1] * kx;
  const y2 = p2[0] * ky;

  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) {
    return Math.hypot(px - x1, py - y1);
  }
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function distToPolygonPerimeter(point, polygon) {
  if (!point || !polygon || polygon.length < 2) return 0;
  let minDist = Infinity;
  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    const d = distToSegmentMeters(point, p1, p2);
    if (d < minDist) minDist = d;
  }
  return Math.round(minDist);
}

function calculatePolygonMetrics(polygon) {
  if (!polygon || polygon.length < 3) return { sqMeters: 0, acres: 0, perimeter: 0 };
  const midLat = polygon.reduce((sum, p) => sum + p[0], 0) / polygon.length;
  const kx = 111320 * Math.cos((midLat * Math.PI) / 180);
  const ky = 111320;

  let area = 0;
  let perimeter = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const xi = polygon[i][1] * kx;
    const yi = polygon[i][0] * ky;
    const xj = polygon[j][1] * kx;
    const yj = polygon[j][0] * ky;
    area += xi * yj - xj * yi;

    const p1 = polygon[i];
    const p2 = polygon[j];
    perimeter += getDistanceMeters(p1[0], p1[1], p2[0], p2[1]);
  }
  const sqMeters = Math.abs(Math.round(area / 2));
  const acres = Number((sqMeters / 4046.86).toFixed(2));
  return { sqMeters, acres, perimeter };
}

// ─── Preset Indian Agricultural Regions with State & District Details ────────
const INDIA_PRESETS = [
  {
    name: 'Kongu Farmland',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    area: 'Sulur / KPR Agricultural Belt',
    pincode: '641407',
    center: [11.0778, 77.1428],
    zoom: 17,
    polygon: [
      [11.0792, 77.1415],
      [11.0793, 77.1442],
      [11.0768, 77.1445],
      [11.0766, 77.1418]
    ]
  },
  {
    name: 'Pollachi Coconut & Cattle Grove',
    state: 'Tamil Nadu',
    district: 'Coimbatore / Pollachi',
    area: 'Anamalai Foothills, Pollachi South',
    pincode: '642001',
    center: [10.6588, 77.0084],
    zoom: 17,
    polygon: [
      [10.6602, 77.0070],
      [10.6604, 77.0098],
      [10.6575, 77.0101],
      [10.6573, 77.0073]
    ]
  },
  {
    name: 'Thanjavur Delta Pasture',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    area: 'Kaveri Delta Agricultural Basin',
    pincode: '613001',
    center: [10.7870, 79.1378],
    zoom: 17,
    polygon: [
      [10.7885, 79.1365],
      [10.7886, 79.1392],
      [10.7858, 79.1395],
      [10.7856, 79.1367]
    ]
  },
  {
    name: 'Anand Dairy Pastures',
    state: 'Gujarat',
    district: 'Anand',
    area: 'Amul Co-op Grazing Paddock',
    pincode: '388001',
    center: [22.5645, 72.9289],
    zoom: 17,
    polygon: [
      [22.5660, 72.9275],
      [22.5662, 72.9305],
      [22.5630, 72.9308],
      [22.5628, 72.9278]
    ]
  },
  {
    name: 'Karnal Wheat & Dairy Belt',
    state: 'Haryana',
    district: 'Karnal',
    area: 'NDRI Farmland & GT Road Belt',
    pincode: '132001',
    center: [29.6857, 76.9905],
    zoom: 17,
    polygon: [
      [29.6872, 76.9890],
      [29.6874, 76.9922],
      [29.6843, 76.9925],
      [29.6841, 76.9893]
    ]
  },
  {
    name: 'Mysuru Kaveri Pasture',
    state: 'Karnataka',
    district: 'Mysuru',
    area: 'Srirangapatna / Kaveri Basin',
    pincode: '570001',
    center: [12.2958, 76.6394],
    zoom: 17,
    polygon: [
      [12.2974, 76.6380],
      [12.2976, 76.6410],
      [12.2942, 76.6413],
      [12.2940, 76.6382]
    ]
  },
  {
    name: 'Baramati Dairy Pasture',
    state: 'Maharashtra',
    district: 'Pune',
    area: 'Baramati Agriculture Development Trust',
    pincode: '413102',
    center: [18.1519, 74.5770],
    zoom: 17,
    polygon: [
      [18.1534, 74.5755],
      [18.1536, 74.5786],
      [18.1503, 74.5789],
      [18.1501, 74.5758]
    ]
  }
];

const INDIA_BOUNDS = [
  [8.0, 68.0],
  [36.0, 97.5]
];

// ─── Leaflet Map Controllers ─────────────────────────────────────────────────

function MapViewController({ viewTarget }) {
  const map = useMap();
  useEffect(() => {
    if (!viewTarget) return;
    if (viewTarget.type === 'bounds') {
      map.fitBounds(viewTarget.bounds, { padding: [40, 40], maxZoom: 6 });
    } else if (viewTarget.type === 'center') {
      map.flyTo(viewTarget.center, viewTarget.zoom || map.getZoom(), {
        duration: 1.2
      });
    }
  }, [viewTarget, map]);
  return null;
}

function MapClickHandler({ isDrawing, onAddPoint }) {
  useMapEvents({
    click(e) {
      if (isDrawing && onAddPoint) {
        onAddPoint([e.latlng.lat, e.latlng.lng]);
      }
    }
  });
  return null;
}

// ─── Main GPSTracking Component ──────────────────────────────────────────────

export default function GPSTracking() {
  const { cattle, selectedCattleId, setSelectedCattleId, centerLat, centerLng, t, farmerId } =
    useContext(AppContext);

  // Active cattle selection
  const activeCow = cattle.find((c) => c.id === selectedCattleId) || cattle[0] || {
    id: '101',
    name: 'Meenu',
    breed: 'Gir (Desi)',
    animalType: 'Cow',
    telemetry: { gps: null }
  };

  const initialLat = centerLat || 11.077809;
  const initialLng = centerLng || 77.142879;

  // ─── State, District, and Area Details ──────────────────────────────────────
  const [landDetails, setLandDetails] = useState(() => {
    const saved = localStorage.getItem('biosense_land_details');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      state: 'Tamil Nadu',
      district: 'Coimbatore',
      area: 'Kongu Farmland / Sulur Taluk',
      pincode: '641407'
    };
  });

  const [farmName, setFarmName] = useState(() => {
    return localStorage.getItem('biosense_farm_name') || 'Kongu Farmland';
  });

  const [showEditLandModal, setShowEditLandModal] = useState(false);
  const [editState, setEditState] = useState(landDetails.state);
  const [editDistrict, setEditDistrict] = useState(landDetails.district);
  const [editArea, setEditArea] = useState(landDetails.area);
  const [editPincode, setEditPincode] = useState(landDetails.pincode);

  // ─── Persistent Boundary State ─────────────────────────────────────────────
  const [boundaryType, setBoundaryType] = useState(() => {
    return localStorage.getItem('biosense_boundary_type') || 'polygon';
  });

  const [farmCenter, setFarmCenter] = useState(() => {
    const saved = localStorage.getItem('biosense_farm_center');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return [initialLat, initialLng];
  });

  const [circleRadius, setCircleRadius] = useState(() => {
    const saved = localStorage.getItem('biosense_circle_radius');
    return saved ? Number(saved) : 150;
  });

  const [boundaryPolygon, setBoundaryPolygon] = useState(() => {
    const saved = localStorage.getItem('biosense_boundary_polygon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
      } catch (_) {}
    }
    return [
      [initialLat + 0.0014, initialLng - 0.0013],
      [initialLat + 0.0015, initialLng + 0.0014],
      [initialLat - 0.0010, initialLng + 0.0017],
      [initialLat - 0.0012, initialLng - 0.0010]
    ];
  });

  // ─── Map View & Layer State ────────────────────────────────────────────────
  const [mapLayer, setMapLayer] = useState('satellite'); // 'satellite', 'hybrid', 'street'
  const [viewTarget, setViewTarget] = useState(null);

  // ─── Drawing Mode State ───────────────────────────────────────────────────
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftPoints, setDraftPoints] = useState([]);

  // ─── Simulation / Test Mode ────────────────────────────────────────────────
  const [simulationActive, setSimulationActive] = useState(false);
  const [simScenario, setSimScenario] = useState('safe');

  // ─── Hardware GPS State (ONLY display when fetched/streamed from hardware) ─
  const [collarPos, setCollarPos] = useState(() => {
    // If telemetry already contains a live hardware GPS fix, use it; otherwise null
    if (activeCow?.telemetry?.gps?.lat && activeCow?.telemetry?.gps?.lng) {
      return [activeCow.telemetry.gps.lat, activeCow.telemetry.gps.lng];
    }
    return null; // NO static coordinates by default!
  });

  const [locationTrail, setLocationTrail] = useState([]);
  const [isFetchingHardware, setIsFetchingHardware] = useState(false);
  const [hardwareStatusMessage, setHardwareStatusMessage] = useState('');

  // Keep collar in sync if activeCow receives live hardware updates via RTDB or when switching cattle
  useEffect(() => {
    if (activeCow?.telemetry?.gps?.lat && activeCow?.telemetry?.gps?.lng) {
      const liveLat = activeCow.telemetry.gps.lat;
      const liveLng = activeCow.telemetry.gps.lng;
      setCollarPos([liveLat, liveLng]);
      setLocationTrail((trail) => [...trail.slice(-15), [liveLat, liveLng]]);
    } else if (!simulationActive) {
      setCollarPos(null);
      setLocationTrail([]);
    }
  }, [activeCow?.id, activeCow?.telemetry?.gps?.lat, activeCow?.telemetry?.gps?.lng, simulationActive]);

  // ─── Alerting & Siren Sound ────────────────────────────────────────────────
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastDispatchedTime, setLastDispatchedTime] = useState(null);
  const [dispatchLog, setDispatchLog] = useState(null);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const audioContextRef = useRef(null);
  const lastAlertTimestampRef = useRef(0);

  // ─── Search Across India ───────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // ─── Geofencing Calculations ───────────────────────────────────────────────
  const currentPolygon = isDrawing ? draftPoints : boundaryPolygon;
  const hasHardwareGps = Boolean(collarPos && collarPos[0] && collarPos[1]);

  const isBreached = useMemo(() => {
    if (!hasHardwareGps) return false; // NO breach if collar location has not been fetched yet!
    if (boundaryType === 'circle') {
      const dist = getDistanceMeters(farmCenter[0], farmCenter[1], collarPos[0], collarPos[1]);
      return dist > circleRadius;
    } else {
      if (!currentPolygon || currentPolygon.length < 3) return false;
      return !isPointInPolygon(collarPos, currentPolygon);
    }
  }, [hasHardwareGps, boundaryType, farmCenter, circleRadius, collarPos, currentPolygon]);

  const fenceDistanceInfo = useMemo(() => {
    if (!hasHardwareGps) {
      return { distanceToFence: 0, isOutside: false, centerDistance: 0 };
    }
    if (boundaryType === 'circle') {
      const distCenter = getDistanceMeters(farmCenter[0], farmCenter[1], collarPos[0], collarPos[1]);
      const diff = distCenter - circleRadius;
      return {
        distanceToFence: Math.abs(diff),
        isOutside: diff > 0,
        centerDistance: distCenter
      };
    } else {
      const distToFence = distToPolygonPerimeter(collarPos, currentPolygon);
      return {
        distanceToFence: distToFence,
        isOutside: isBreached,
        centerDistance: getDistanceMeters(farmCenter[0], farmCenter[1], collarPos[0], collarPos[1])
      };
    }
  }, [hasHardwareGps, boundaryType, farmCenter, circleRadius, collarPos, currentPolygon, isBreached]);

  const metrics = useMemo(() => {
    return calculatePolygonMetrics(boundaryPolygon);
  }, [boundaryPolygon]);

  // ─── Emergency Siren Sound Effect (Web Audio API) ──────────────────────────
  const playSiren = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (_) {}
  }, [soundEnabled]);

  // ─── Automated Real-time Alerting When Collar Breaches ──────────────────────
  useEffect(() => {
    if (hasHardwareGps && isBreached) {
      playSiren();
      const now = Date.now();
      if (now - lastAlertTimestampRef.current > 20000) {
        lastAlertTimestampRef.current = now;
        const timeStr = new Date().toLocaleTimeString();
        setLastDispatchedTime(timeStr);

        const alertPayload = {
          farmerId: farmerId || 'farmer-uma',
          collarId: activeCow.id,
          title: `🚨 GEOFENCE BREACH: ${activeCow.name}`,
          message: `${activeCow.name} (#${activeCow.id}) crossed pasture fence in ${landDetails.district}, ${landDetails.state}! Currently ${fenceDistanceInfo.distanceToFence}m outside boundaries. Automated SMS sent.`,
          type: 'emergency'
        };

        pushAlert(alertPayload);

        setDispatchLog({
          time: timeStr,
          cowName: activeCow.name,
          collarId: activeCow.id,
          phone: '+91 98765 43210',
          lat: collarPos[0].toFixed(5),
          lng: collarPos[1].toFixed(5),
          district: landDetails.district,
          state: landDetails.state,
          distance: fenceDistanceInfo.distanceToFence
        });
      }
    }
  }, [hasHardwareGps, isBreached, playSiren, activeCow, fenceDistanceInfo, collarPos, farmerId, landDetails]);

  // ─── Live Simulation Loop (Safe on Farm, Near Fence, or Test Breach) ───────
  useEffect(() => {
    if (!simulationActive) return;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCollarPos(() => {
        let targetLat = farmCenter[0];
        let targetLng = farmCenter[1];

        if (simScenario === 'safe') {
          targetLat += Math.sin(step * 0.4) * 0.0003;
          targetLng += Math.cos(step * 0.4) * 0.0003;
        } else if (simScenario === 'near') {
          targetLat += Math.sin(step * 0.3) * 0.0009;
          targetLng += Math.cos(step * 0.3) * 0.0010;
        } else if (simScenario === 'breach') {
          targetLat += 0.0018 + Math.sin(step * 0.2) * 0.0003;
          targetLng += 0.0019 + Math.cos(step * 0.2) * 0.0003;
        }

        const newPos = [Number(targetLat.toFixed(6)), Number(targetLng.toFixed(6))];
        setLocationTrail((trail) => [...trail.slice(-15), newPos]);
        return newPos;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [simulationActive, simScenario, farmCenter]);

  // ─── Manual Collar Movement / Drag Handler ─────────────────────────────────
  const handleCollarDrag = (e) => {
    const marker = e.target;
    const position = marker.getLatLng();
    const newPos = [Number(position.lat.toFixed(6)), Number(position.lng.toFixed(6))];
    setCollarPos(newPos);
    setLocationTrail((trail) => [...trail.slice(-15), newPos]);
  };

  // ─── Hardware GPS Fetch Action (From Hardware ESP32 RTDB Stream) ───────────
  const handleFetchHardwareGps = async () => {
    setIsFetchingHardware(true);
    setHardwareStatusMessage('Connecting to ESP32 collar...');

    try {
      if (rtdb) {
        const nodeRef = ref(rtdb, `telemetry/${activeCow.id}`);
        const snapshot = await get(nodeRef);
        const data = snapshot.val();
        if (data && (data.gps?.lat || data.lat)) {
          const liveLat = Number(data.gps?.lat ?? data.lat);
          const liveLng = Number(data.gps?.lng ?? data.lng);
          if (!isNaN(liveLat) && !isNaN(liveLng) && liveLat !== 0) {
            setCollarPos([liveLat, liveLng]);
            setLocationTrail([[liveLat, liveLng]]);
            setHardwareStatusMessage(`✅ Live Hardware GPS locked: ${liveLat.toFixed(5)}, ${liveLng.toFixed(5)}`);
            setIsFetchingHardware(false);
            return;
          }
        }
      }

      // If physical hardware is currently idle or disconnected in demo:
      setTimeout(() => {
        setHardwareStatusMessage('📡 No physical ESP32 signal. Tap "Test on My Land" to test geofencing.');
        setIsFetchingHardware(false);
      }, 1000);
    } catch (_) {
      setHardwareStatusMessage('Hardware offline. Tap "Test on My Land" to simulate.');
      setIsFetchingHardware(false);
    }
  };

  // ─── Place Collar Safely on Farm for Testing ───────────────────────────────
  const handleTestOnMyLand = (scenario = 'safe') => {
    setSimScenario(scenario);
    setSimulationActive(true);
    let startLat = farmCenter[0];
    let startLng = farmCenter[1];
    if (scenario === 'breach') {
      startLat += 0.0018;
      startLng += 0.0019;
    } else if (scenario === 'near') {
      startLat += 0.0009;
      startLng += 0.0009;
    }
    const initialPos = [Number(startLat.toFixed(6)), Number(startLng.toFixed(6))];
    setCollarPos(initialPos);
    setLocationTrail([initialPos]);
    setHardwareStatusMessage('🧪 Test simulation active on current farmland.');
  };

  const handleStopHardwareSimulation = () => {
    setSimulationActive(false);
    setCollarPos(null);
    setLocationTrail([]);
    setHardwareStatusMessage('Hardware GPS standby (No static mock position).');
  };

  // ─── Reverse Geocoding Helper (Extracts State, District, Area) ─────────────
  const fetchReverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const state = addr.state || 'Tamil Nadu';
        const district = addr.state_district || addr.county || addr.city_district || addr.city || 'District';
        const area = addr.suburb || addr.village || addr.town || addr.hamlet || addr.road || 'Agricultural Belt';
        const pincode = addr.postcode || '';
        const details = { state, district, area, pincode };
        setLandDetails(details);
        localStorage.setItem('biosense_land_details', JSON.stringify(details));
      }
    } catch (_) {}
  };

  // ─── Preset Selection Handlers ─────────────────────────────────────────────
  const handleSelectPreset = (preset) => {
    setFarmCenter(preset.center);
    setBoundaryPolygon(preset.polygon);
    setBoundaryType('polygon');
    setFarmName(preset.name);
    const details = {
      state: preset.state,
      district: preset.district,
      area: preset.area,
      pincode: preset.pincode
    };
    setLandDetails(details);

    // If simulation was running, cleanly move the cow to the new farm center (avoids cross-state false alarm)
    if (collarPos) {
      setCollarPos(preset.center);
      setLocationTrail([preset.center]);
    }

    setViewTarget({ type: 'center', center: preset.center, zoom: preset.zoom });
    localStorage.setItem('biosense_farm_center', JSON.stringify(preset.center));
    localStorage.setItem('biosense_boundary_polygon', JSON.stringify(preset.polygon));
    localStorage.setItem('biosense_farm_name', preset.name);
    localStorage.setItem('biosense_land_details', JSON.stringify(details));
  };

  // ─── India Search & Geocoding ──────────────────────────────────────────────
  const handleSearchIndia = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchError('');
    setIsSearching(true);

    const coordMatch = searchQuery.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setFarmCenter([lat, lng]);
        if (collarPos) {
          setCollarPos([lat, lng]);
          setLocationTrail([[lat, lng]]);
        }
        setViewTarget({ type: 'center', center: [lat, lng], zoom: 17 });
        fetchReverseGeocode(lat, lng);
        setIsSearching(false);
        return;
      }
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const top = data[0];
        const lat = parseFloat(top.lat);
        const lon = parseFloat(top.lon);
        setFarmCenter([lat, lon]);
        if (collarPos) {
          setCollarPos([lat, lon]);
          setLocationTrail([[lat, lon]]);
        }
        setViewTarget({ type: 'center', center: [lat, lon], zoom: 17 });
        fetchReverseGeocode(lat, lon);
      } else {
        setSearchError('No places found in India with that name. Try town or district.');
      }
    } catch (_) {
      setSearchError('Search service temporary offline.');
    } finally {
      setIsSearching(false);
    }
  };

  // ─── Drawing Boundary Handlers ─────────────────────────────────────────────
  const handleAddDraftPoint = (latlng) => {
    setDraftPoints((prev) => [...prev, latlng]);
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setDraftPoints([]);
  };

  const handleSaveDraftBoundary = () => {
    if (draftPoints.length < 3) {
      alert('Please place at least 3 fence posts to enclose your farmland.');
      return;
    }
    setBoundaryPolygon(draftPoints);
    setBoundaryType('polygon');
    setIsDrawing(false);
    localStorage.setItem('biosense_boundary_polygon', JSON.stringify(draftPoints));
    localStorage.setItem('biosense_boundary_type', 'polygon');
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setDraftPoints([]);
  };

  const handleUndoLastPoint = () => {
    setDraftPoints((prev) => prev.slice(0, -1));
  };

  const handleSaveRadius = (newRadius) => {
    setCircleRadius(newRadius);
    setBoundaryType('circle');
    localStorage.setItem('biosense_circle_radius', String(newRadius));
    localStorage.setItem('biosense_boundary_type', 'circle');
  };

  const handleSaveCustomLandDetails = (e) => {
    e.preventDefault();
    const updated = {
      state: editState,
      district: editDistrict,
      area: editArea,
      pincode: editPincode
    };
    setLandDetails(updated);
    localStorage.setItem('biosense_land_details', JSON.stringify(updated));
    setShowEditLandModal(false);
  };

  const copyCoordinates = () => {
    if (!collarPos) return;
    navigator.clipboard?.writeText(`${collarPos[0].toFixed(6)}, ${collarPos[1].toFixed(6)}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // ─── Custom Leaflet Icons ──────────────────────────────────────────────────
  const animalEmoji =
    activeCow.animalType === 'Sheep'
      ? '🐑'
      : activeCow.animalType === 'Goat'
      ? '🐐'
      : activeCow.animalType === 'Buffalo'
      ? '🐃'
      : '🐄';

  const normalCowIcon = L.divIcon({
    className: 'custom-cow-icon',
    html: `
      <div class="relative flex items-center justify-center cursor-grab active:cursor-grabbing group">
        <div class="w-11 h-11 bg-emerald-600 dark:bg-emerald-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110">
          ${animalEmoji}
        </div>
        <div class="w-12 h-12 rounded-full bg-emerald-400/40 absolute -inset-0.5 animate-ping radar-ring pointer-events-none"></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24]
  });

  const breachedCowIcon = L.divIcon({
    className: 'custom-cow-breached',
    html: `
      <div class="relative flex items-center justify-center cursor-grab active:cursor-grabbing group">
        <div class="w-12 h-12 bg-rose-600 rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-xl animate-bounce">
          ${animalEmoji}
        </div>
        <div class="w-14 h-14 rounded-full bg-rose-500/50 absolute -inset-1 animate-ping pointer-events-none"></div>
        <div class="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-white">
          ALERT
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -26]
  });

  const farmIcon = L.divIcon({
    className: 'custom-farm-icon',
    html: `
      <div class="w-10 h-10 bg-slate-900 dark:bg-slate-100 rounded-full border-2 border-amber-400 shadow-xl flex items-center justify-center text-lg">
        🏡
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });

  const makeFencePostIcon = (index) =>
    L.divIcon({
      className: 'custom-fence-post',
      html: `
        <div class="w-7 h-7 bg-amber-500 text-slate-950 font-bold rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs">
          ${index + 1}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

  return (
    <div className="h-full flex flex-col gap-3.5 font-sans max-w-full overflow-hidden">
      {/* ─── Top Control Toolbar ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs shrink-0 flex flex-col gap-3">
        {/* Row 1: Cattle Selector, India Search, and Quick Views */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Active Cattle Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
              {t('Livestock:', 'கால்நடை:')}
            </span>
            <div className="flex gap-2">
              {cattle.map((c) => {
                const isSelected = activeCow.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCattleId(c.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{animalEmoji}</span>
                    <span>{c.name}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        !hasHardwareGps
                          ? 'bg-amber-400'
                          : isBreached
                          ? 'bg-rose-500 animate-ping'
                          : 'bg-emerald-400'
                      }`}
                      title={!hasHardwareGps ? 'Awaiting Hardware' : isBreached ? 'Breached' : 'Safe'}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* India Location Search Bar */}
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <form onSubmit={handleSearchIndia} className="relative flex-1">
              <input
                type="text"
                placeholder={t(
                  'Search Indian town, district, village or Lat, Lng...',
                  'கிராமம், மாவட்டம் அல்லது அட்சரேகை தேடுக...'
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-20 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSearching ? '...' : t('Find', 'தேடு')}
              </button>
            </form>
          </div>

          {/* Quick View Navigation Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setViewTarget({ type: 'bounds', bounds: INDIA_BOUNDS })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title="Overview of India"
            >
              <Globe size={13} className="text-amber-500" />
              <span>{t('All India', 'முழு இந்தியா')}</span>
            </button>

            <button
              onClick={() => setViewTarget({ type: 'center', center: farmCenter, zoom: 17 })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title="Zoom to Farm Pasture"
            >
              <MapPin size={13} className="text-emerald-500" />
              <span>{t('My Farm', 'என் பண்ணை')}</span>
            </button>

            {hasHardwareGps && (
              <button
                onClick={() => setViewTarget({ type: 'center', center: collarPos, zoom: 18 })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer"
                title="Center on Cattle"
              >
                <RefreshCw size={13} className="animate-spin-slow" />
                <span>{t('Track Cattle', 'மாட்டைப் பின்தொடர்')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Indian State/District Badge + Presets + Map Style */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          {/* Prominent State, District & Area Header Banner */}
          <div className="flex items-center gap-2 bg-emerald-50/80 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
            <MapPin size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {landDetails.area}
              </span>
              <span className="text-slate-400 dark:text-slate-500 mx-1.5">•</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                {landDetails.district} Dist, {landDetails.state}
              </span>
              {landDetails.pincode && (
                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                  ({landDetails.pincode})
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setEditState(landDetails.state);
                setEditDistrict(landDetails.district);
                setEditArea(landDetails.area);
                setEditPincode(landDetails.pincode);
                setShowEditLandModal(true);
              }}
              className="ml-1 p-1 hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 rounded-md text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
              title="Edit State/District/Area Details"
            >
              <Edit3 size={11} />
            </button>
          </div>

          {/* Quick Indian Agricultural Belts */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">
              {t('Indian Belts:', 'மண்டலங்கள்:')}
            </span>
            {INDIA_PRESETS.slice(0, 4).map((p) => {
              const isSelected = farmName === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => handleSelectPreset(p)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  📍 {p.name} ({p.district})
                </button>
              );
            })}
          </div>

          {/* Map Layer Mode & Siren */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setMapLayer('satellite')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mapLayer === 'satellite'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🛰️ {t('Satellite Land', 'செயற்கைக்கோள்')}
              </button>
              <button
                onClick={() => setMapLayer('hybrid')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mapLayer === 'hybrid'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🌾 {t('Hybrid + Labels', 'கலப்பு பார்வை')}
              </button>
              <button
                onClick={() => setMapLayer('street')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mapLayer === 'street'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🗺️ {t('Street Map', 'வரைபடம்')}
              </button>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{soundEnabled ? t('Siren On', 'சைரன் ஒலி') : t('Muted', 'ஒலியடக்கு')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Geofence Breach Emergency Alert Banner (ONLY if live collar breached) ─ */}
      {hasHardwareGps && isBreached && (
        <div className="bg-rose-500 text-white p-3.5 rounded-2xl shadow-lg border border-rose-600 animate-pulse flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert size={22} className="animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <span>{t('CRITICAL GEOFENCE BREACH!', 'எல்லை மீறல் எச்சரிக்கை!')}</span>
                <span className="text-[10px] bg-white text-rose-700 px-2 py-0.5 rounded-md font-extrabold">
                  {fenceDistanceInfo.distanceToFence}m OUTSIDE
                </span>
              </h4>
              <p className="text-[11px] text-rose-100 mt-0.5 font-medium">
                {activeCow.name} has crossed pasture boundaries in {landDetails.area}, {landDetails.district} ({landDetails.state}).
                {lastDispatchedTime && ` • Automated SMS alert dispatched at ${lastDispatchedTime}.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewTarget({ type: 'center', center: collarPos, zoom: 18 })}
            className="px-3 py-1.5 bg-white text-rose-700 hover:bg-rose-50 text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
          >
            {t('Locate Cattle', 'மாட்டின் இடம்')}
          </button>
        </div>
      )}

      {/* ─── Hardware Standby Info Bar (When Collar GPS is not yet streaming) ──── */}
      {!hasHardwareGps && (
        <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 px-4 py-3 rounded-2xl border border-blue-200 dark:border-blue-800/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <Radio size={16} className="text-blue-500 animate-pulse shrink-0" />
            <div className="text-xs">
              <span className="font-bold">
                {t('Collar Standby:', 'காலர் தயார்நிலை:')}
              </span>{' '}
              <span className="text-blue-700 dark:text-blue-300">
                {hardwareStatusMessage ||
                  t(
                    'No static coordinates displayed. Cow location will appear on map when streamed from hardware ESP32.',
                    'நிலையான இருப்பிடம் நீக்கப்பட்டது. வன்பொருள் இயங்கும்போது மட்டுமே மாடு தெரியும்.'
                  )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchHardwareGps}
              disabled={isFetchingHardware}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-xs"
            >
              <RefreshCw size={12} className={isFetchingHardware ? 'animate-spin' : ''} />
              <span>{isFetchingHardware ? t('Connecting...', 'இணைகிறது...') : t('Fetch Hardware GPS', 'வன்பொருள் ஜிபிஎஸ் பெறு')}</span>
            </button>

            <button
              onClick={() => handleTestOnMyLand('safe')}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold rounded-xl border border-blue-300 dark:border-blue-700 cursor-pointer transition-all"
            >
              🧪 {t('Test on My Land', 'என் நிலத்தில் சோதி')}
            </button>
          </div>
        </div>
      )}

      {/* ─── Drawing Instruction Banner (When Active) ──────────────────────── */}
      {isDrawing && (
        <div className="bg-amber-500 text-slate-950 p-3 rounded-2xl shadow-md border border-amber-600 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/30 rounded-lg flex items-center justify-center font-bold text-xs">
              ✏️
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-wide">
                {t('Boundary Drawing Mode Active', 'எல்லை வரையும் முறை')}
              </h5>
              <p className="text-[11px] font-medium text-amber-950">
                {t('Click on the satellite farmland to plant fence posts (Corners 1, 2, 3...).', 'செயற்கைக்கோள் படத்தில் கிளிக் செய்து எல்லை தூண்களை நடவும்.')}{' '}
                (Posts placed: {draftPoints.length})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndoLastPoint}
              disabled={draftPoints.length === 0}
              className="px-3 py-1 bg-white/80 hover:bg-white text-slate-900 text-xs font-bold rounded-lg cursor-pointer disabled:opacity-40"
            >
              {t('Undo Post', 'முந்தைய நீக்கு')}
            </button>
            <button
              onClick={handleSaveDraftBoundary}
              disabled={draftPoints.length < 3}
              className="px-3.5 py-1 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-lg cursor-pointer disabled:opacity-40"
            >
              💾 {t('Save Farm Fence', 'எல்லையை சேமி')}
            </button>
            <button
              onClick={handleCancelDrawing}
              className="px-2.5 py-1 bg-white/40 hover:bg-white/60 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              ✕ {t('Cancel', 'ரத்து')}
            </button>
          </div>
        </div>
      )}

      {/* ─── Main Map & Tracking Workspace Frame ─────────────────────────── */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative min-h-[460px] flex flex-col lg:flex-row">
        {/* Map Container Area */}
        <div className="flex-1 h-full min-h-[380px] relative">
          <MapContainer
            center={farmCenter}
            zoom={17}
            scrollWheelZoom={true}
            className="w-full h-full"
            style={{ height: '100%', minHeight: '380px' }}
          >
            <MapViewController viewTarget={viewTarget} />
            <MapClickHandler isDrawing={isDrawing} onAddPoint={handleAddDraftPoint} />

            {/* 🛰️ Tile Layer 1: Esri High-Resolution World Imagery */}
            {(mapLayer === 'satellite' || mapLayer === 'hybrid') && (
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; High Resolution Earth Imagery"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            )}

            {/* 🌾 Tile Layer Overlay: Road & Land Boundary Labels for Hybrid mode */}
            {mapLayer === 'hybrid' && (
              <TileLayer
                attribution="&copy; Esri Reference Places"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            )}

            {/* 🗺️ Tile Layer 3: Standard OpenStreetMap Streets */}
            {mapLayer === 'street' && (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            )}

            {/* Custom Polygon Boundary (Enclosed Farmland) */}
            {boundaryType === 'polygon' && currentPolygon.length >= 3 && (
              <Polygon
                positions={currentPolygon}
                pathOptions={{
                  color: isBreached ? '#ef4444' : '#10b981',
                  fillColor: isBreached ? '#ef4444' : '#10b981',
                  fillOpacity: isBreached ? 0.15 : 0.12,
                  weight: 3,
                  dashArray: '6, 8',
                  lineJoin: 'round'
                }}
              >
                <Popup>
                  <div className="p-1 font-sans text-xs">
                    <p className="font-bold text-slate-900">{farmName}</p>
                    <p className="text-emerald-700 font-semibold">
                      {landDetails.area}, {landDetails.district} ({landDetails.state})
                    </p>
                    <p className="text-slate-500 mt-1">
                      Area: {metrics.acres} Acres ({metrics.sqMeters.toLocaleString()} m²)
                    </p>
                    <p className="text-slate-500">Perimeter: {metrics.perimeter} m</p>
                  </div>
                </Popup>
              </Polygon>
            )}

            {/* Circular Safe Zone Radius */}
            {boundaryType === 'circle' && (
              <Circle
                center={farmCenter}
                radius={circleRadius}
                pathOptions={{
                  color: isBreached ? '#ef4444' : '#10b981',
                  fillColor: isBreached ? '#ef4444' : '#10b981',
                  fillOpacity: isBreached ? 0.16 : 0.12,
                  weight: 3,
                  dashArray: '8, 8'
                }}
              >
                <Popup>
                  <div className="p-1 font-sans text-xs">
                    <p className="font-bold text-slate-900">{farmName}</p>
                    <p className="text-emerald-700 font-semibold">
                      {landDetails.district}, {landDetails.state}
                    </p>
                    <p className="text-slate-500">Radius: {circleRadius} meters</p>
                  </div>
                </Popup>
              </Circle>
            )}

            {/* Farm Barn / Center Pin */}
            <Marker position={farmCenter} icon={farmIcon}>
              <Popup>
                <div className="p-1 font-sans text-xs text-center">
                  <h4 className="font-black text-slate-900">{farmName}</h4>
                  <p className="text-emerald-600 font-semibold">{landDetails.area}</p>
                  <p className="text-slate-500 font-normal">
                    {landDetails.district} Dist, {landDetails.state}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {farmCenter[0].toFixed(5)}, {farmCenter[1].toFixed(5)}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* 🐄 Live Cow Marker — ONLY rendered when Hardware GPS is actually present */}
            {hasHardwareGps && (
              <Marker
                position={collarPos}
                icon={isBreached ? breachedCowIcon : normalCowIcon}
                draggable={true}
                eventHandlers={{ dragend: handleCollarDrag }}
              >
                <Popup>
                  <div className="p-1.5 font-sans text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{animalEmoji}</span>
                      <h4 className="font-bold text-slate-900">{activeCow.name}</h4>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">Collar #{activeCow.id}</p>
                    <div className="mt-2 pt-1 border-t border-slate-200 text-[10px] space-y-0.5">
                      <p className="text-slate-600">
                        <strong>GPS:</strong> {collarPos[0].toFixed(5)}, {collarPos[1].toFixed(5)}
                      </p>
                      <p className={isBreached ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                        {isBreached ? '⚠️ OUTSIDE PASTURE!' : '✅ Grazing Safely inside'}
                      </p>
                      <p className="text-slate-400 italic">Drag this marker anywhere to test boundaries!</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Breadcrumb Trail — ONLY rendered if Live Collar GPS is present */}
            {hasHardwareGps && locationTrail.length > 1 && (
              <Polyline
                positions={locationTrail}
                pathOptions={{
                  color: isBreached ? '#ef4444' : '#0284c7',
                  weight: 3,
                  dashArray: '6, 6',
                  opacity: 0.8
                }}
              />
            )}

            {/* Draft Boundary Markers when User is Drawing on Map */}
            {isDrawing &&
              draftPoints.map((pt, idx) => (
                <Marker key={`draft-${idx}`} position={pt} icon={makeFencePostIcon(idx)} />
              ))}

            {isDrawing && draftPoints.length > 1 && (
              <Polyline
                positions={draftPoints}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 3,
                  dashArray: '4, 4'
                }}
              />
            )}
          </MapContainer>

          {/* Floating On-Map Boundary Quick Tools Bar */}
          <div className="absolute top-4 left-4 z-400 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-wrap items-center gap-2 max-w-[calc(100%-2rem)]">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('Pasture Fence:', 'வேலி எல்லை:')}
            </span>

            <button
              onClick={handleStartDrawing}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                isDrawing
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-black'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>✏️</span>
              <span>{t('Draw Farm Fence', 'வேலி வரை')}</span>
            </button>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400">⭕</span>
              <button
                onClick={() => handleSaveRadius(100)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-lg cursor-pointer ${
                  boundaryType === 'circle' && circleRadius === 100
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                100m
              </button>
              <button
                onClick={() => handleSaveRadius(150)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-lg cursor-pointer ${
                  boundaryType === 'circle' && circleRadius === 150
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                150m
              </button>
              <button
                onClick={() => handleSaveRadius(300)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-lg cursor-pointer ${
                  boundaryType === 'circle' && circleRadius === 300
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                300m
              </button>
            </div>
          </div>
        </div>

        {/* ─── Right Side Tracking & Telemetry Panel ───────────────────────── */}
        <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-4">
            {/* Panel Title */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Compass className="text-emerald-500 animate-spin-slow" size={20} />
                <span>{t('Live Tracking Console', 'நேரடி கண்காணிப்பு மையம்')}</span>
              </h3>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                hasHardwareGps
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
              }`}>
                {hasHardwareGps ? '⚡ Hardware Live' : '⏳ Awaiting Fix'}
              </span>
            </div>

            {/* Geofence Status Card */}
            <div
              className={`p-4 border rounded-2xl flex items-start gap-3 transition-colors ${
                !hasHardwareGps
                  ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  : isBreached
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  !hasHardwareGps
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                    : isBreached
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {!hasHardwareGps ? (
                  <Radio size={18} />
                ) : isBreached ? (
                  <AlertTriangle size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black uppercase tracking-wider">
                  {!hasHardwareGps
                    ? t('Hardware Standby', 'வன்பொருள் தயார்நிலை')
                    : isBreached
                    ? t('Geofence Breached!', 'எல்லை மீறப்பட்டது!')
                    : t('Inside Safe Pasture', 'பாதுகாப்பு எல்லைக்குள்')}
                </h4>
                <p className="text-[11px] mt-0.5 opacity-90 font-medium">
                  {!hasHardwareGps
                    ? t(
                        'Static mock coordinates removed. Location will appear when streamed from collar.',
                        'காலரிலிருந்து தரவு வரும்போது மட்டுமே மாடு தெரியும்.'
                      )
                    : isBreached
                    ? t(
                        `Cow has escaped! ${fenceDistanceInfo.distanceToFence} m past the boundary.`,
                        `மாடு எல்லையைத் தாண்டி ${fenceDistanceInfo.distanceToFence} மீ தூரத்தில் உள்ளது.`
                      )
                    : t(
                        `Grazing safely (${fenceDistanceInfo.distanceToFence} m inside fence line).`,
                        `பாதுகாப்பாக மேய்கிறது (வேலிக்குள் ${fenceDistanceInfo.distanceToFence} மீ).`
                      )}
                </p>
              </div>
            </div>

            {/* ─── STATE, DISTRICT & AREA DETAILS CARD ─────────────────────── */}
            <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-100">
                  <Building size={14} className="text-emerald-500" />
                  <span>{t('Land & Administrative Details', 'நிலம் மற்றும் நிர்வாக விவரங்கள்')}</span>
                </div>
                <button
                  onClick={() => setShowEditLandModal(true)}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  {t('Edit', 'மாற்று')}
                </button>
              </div>

              {/* State Detail */}
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">{t('State', 'மாநிலம்')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {landDetails.state}
                </span>
              </div>

              {/* District Detail */}
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">{t('District', 'மாவட்டம்')}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {landDetails.district}
                </span>
              </div>

              {/* Area / Taluk Detail */}
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">{t('Area / Taluk', 'வட்டம் / பகுதி')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]" title={landDetails.area}>
                  {landDetails.area}
                </span>
              </div>

              {/* Pincode */}
              {landDetails.pincode && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{t('Pincode', 'அஞ்சல் குறியீடு')}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {landDetails.pincode}
                  </span>
                </div>
              )}

              {/* Pasture Land Area Metrics */}
              {boundaryType === 'polygon' ? (
                <>
                  <div className="flex justify-between text-xs pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                    <span className="text-slate-500 dark:text-slate-400">{t('Pasture Land Area', 'நிலப் பரப்பளவு')}</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {metrics.acres} {t('Acres', 'ஏக்கர்')} ({metrics.sqMeters.toLocaleString()} m²)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{t('Fence Perimeter', 'சுற்றளவு')}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {metrics.perimeter} m
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-xs pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400">{t('Fence Radius', 'வேலி ஆரம்')}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {circleRadius} m
                  </span>
                </div>
              )}
            </div>

            {/* Hardware Telemetry Card */}
            <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {t('Hardware Collar Telemetry', 'வன்பொருள் தகவல்')}
                </span>
                {hasHardwareGps && (
                  <button
                    onClick={copyCoordinates}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    {copiedCoords ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedCoords ? t('Copied!', 'நகலெடுக்கப்பட்டது') : t('Copy GPS', 'ஜிபிஎஸ் நகல்')}</span>
                  </button>
                )}
              </div>

              {hasHardwareGps ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{t('Latitude, Longitude', 'அட்சரேகை, தீர்க்கரேகை')}</span>
                    <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      {collarPos[0].toFixed(5)}, {collarPos[1].toFixed(5)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{t('Distance from Fence', 'வேலியில் இருந்து தூரம்')}</span>
                    <span
                      className={`font-black ${
                        isBreached ? 'text-rose-500 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {fenceDistanceInfo.distanceToFence} m {isBreached ? '(OUTSIDE)' : '(SAFE)'}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{t('Collar Battery', 'பேட்டரி')}</span>
                    <span className="font-bold text-emerald-500 flex items-center gap-1">
                      <Battery size={13} />
                      <span>88% (Solar Charging)</span>
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{t('Satellite Fix', 'சிக்னல் தரம்')}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      96% (14 Satellites Locked)
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-2 text-center text-xs text-slate-500 space-y-2">
                  <p>⏳ Awaiting GPS stream from NEO-6M core module...</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleFetchHardwareGps}
                      disabled={isFetchingHardware}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                    >
                      {isFetchingHardware ? 'Connecting...' : 'Fetch Hardware'}
                    </button>
                    <button
                      onClick={() => handleTestOnMyLand('safe')}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Test on My Land
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Automated Dispatch Notification Card */}
            {dispatchLog && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <span>📱</span>
                  <span>{t('Automated SMS & WhatsApp Sent', 'தானியங்கி செய்தி அனுப்பப்பட்டது')}</span>
                </div>
                <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  Sent to {dispatchLog.phone} at {dispatchLog.time}: &quot;🚨 BioSense Alert: {dispatchLog.cowName} crossed boundary in {dispatchLog.district}, {dispatchLog.state}! Live GPS: {dispatchLog.lat}, {dispatchLog.lng}&quot;
                </p>
              </div>
            )}

            {/* ─── Simulation & Testing Controller (Farmer Convenience) ──── */}
            <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-500" />
                  <span>{t('Simulation & Test Mode', 'சோதனை முறை')}</span>
                </span>
                {simulationActive && (
                  <button
                    onClick={handleStopHardwareSimulation}
                    className="px-2.5 py-1 text-[11px] font-black rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  >
                    Reset
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-400">
                {t(
                  'Test boundary alerts safely inside your designated farmland:',
                  'உங்கள் நிலப்பரப்பில் சோதிக்க கீழே உள்ள பொத்தான்களை அழுத்தவும்:'
                )}
              </p>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleTestOnMyLand('safe')}
                  className={`p-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    simScenario === 'safe' && simulationActive
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🌿 {t('Safe Grazing', 'பாதுகாப்பு')}
                </button>

                <button
                  onClick={() => handleTestOnMyLand('near')}
                  className={`p-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    simScenario === 'near' && simulationActive
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ⚠️ {t('Near Fence', 'வேலி அருகே')}
                </button>

                <button
                  onClick={() => handleTestOnMyLand('breach')}
                  className={`p-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    simScenario === 'breach' && simulationActive
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  🚨 {t('Breach Pasture', 'எல்லை மீறல்')}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 leading-relaxed font-semibold">
            ⚡{' '}
            {t(
              'Real-time GPS telemetry from NEO-6M core module connected to ESP32 board directly.',
              'NEO-6M ஜிபிஎஸ் தகவல்கள் மேகக்கணி வழியாக நேரடியாக பெறப்படுகிறது.'
            )}
          </div>
        </div>
      </div>

      {/* ─── Edit Land, State, District & Area Modal ──────────────────────── */}
      {showEditLandModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <MapPin className="text-emerald-500" size={16} />
                <span>{t('Edit Farmland & Location Details', 'நில விவரங்களை மாற்றவும்')}</span>
              </h4>
              <button
                onClick={() => setShowEditLandModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomLandDetails} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {t('State (மாநிலம்)', 'மாநிலம்')}
                </label>
                <input
                  type="text"
                  value={editState}
                  onChange={(e) => setEditState(e.target.value)}
                  placeholder="e.g. Tamil Nadu, Gujarat, Karnataka..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {t('District (மாவட்டம்)', 'மாவட்டம்')}
                </label>
                <input
                  type="text"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  placeholder="e.g. Coimbatore, Thanjavur, Anand..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {t('Area / Taluk / Village (வட்டம் / கிராமம்)', 'பகுதி')}
                </label>
                <input
                  type="text"
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  placeholder="e.g. Kaveri Delta Pasture, Sulur Taluk..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {t('Pincode (அஞ்சல் குறியீடு)', 'பின்கோடு')}
                </label>
                <input
                  type="text"
                  value={editPincode}
                  onChange={(e) => setEditPincode(e.target.value)}
                  placeholder="e.g. 641407, 613001..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditLandModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  {t('Cancel', 'ரத்து')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  {t('Save Details', 'சேமி')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
