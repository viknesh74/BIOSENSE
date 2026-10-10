import { rtdb } from './firebase';
import { ref, onValue, off } from 'firebase/database';
import { STATIC_GPS_LOCATIONS } from './mockData';

export { STATIC_GPS_LOCATIONS };

/**
 * Subscribe to live sensor data from Firebase Realtime Database.
 * The ESP32 pushes data to: /telemetry/{collarId}
 *
 * @param {Array}    cattleList — current cattle array
 * @param {Function} onUpdate  — (updatedCattle: Array) => void
 * @param {Object}   simConfig — simulation configuration
 * @returns {Function} unsubscribe
 */
export function subscribeToTelemetry(cattleList, onUpdate, simConfig = {}) {
  if (!cattleList || cattleList.length === 0) {
    return () => {};
  }

  let updatedCattle = cattleList.map((cow) => ({
    ...cow,
    telemetry: {
      ...cow.telemetry,
      gps: cow.telemetry?.gps?.lat ? cow.telemetry.gps : null
    }
  }));

  const nodeRefs = [];
  const handlers = [];

  // 1. If RTDB is available, listen to real-time events
  if (rtdb) {
    cattleList.forEach((cow, index) => {
      const nodeRef = ref(rtdb, `telemetry/${cow.id}`);
      nodeRefs.push(nodeRef);

      const handler = (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        let newStatus = 'Healthy';
        if (data.heartRate > 100 || data.temperature > 40) {
          newStatus = 'Emergency';
        } else if (data.heartRate > 85 || data.temperature > 39.2 || data.battery < 20) {
          newStatus = 'Warning';
        }

        // Robust GPS parsing across all payload formats
        let liveLat = null;
        let liveLng = null;

        if (data.gps && typeof data.gps === 'object') {
          liveLat = data.gps.lat ?? data.gps.latitude ?? data.gps.Lat;
          liveLng = data.gps.lng ?? data.gps.longitude ?? data.gps.Lng ?? data.gps.lon;
        }
        if (liveLat === null || liveLat === undefined) {
          liveLat = data.lat ?? data.latitude ?? data['gps/lat'] ?? data.Lat;
        }
        if (liveLng === null || liveLng === undefined) {
          liveLng = data.lng ?? data.longitude ?? data['gps/lng'] ?? data.Lng ?? data.lon;
        }

        const validLat = liveLat !== null && liveLat !== undefined && !isNaN(Number(liveLat)) && Number(liveLat) !== 0;
        const validLng = liveLng !== null && liveLng !== undefined && !isNaN(Number(liveLng)) && Number(liveLng) !== 0;

        const liveGps = (validLat && validLng)
          ? { lat: Number(liveLat), lng: Number(liveLng), isHardwareLive: true, lastHardwarePing: Date.now() }
          : (cow.telemetry?.gps || null);

        console.log(`📡 RTDB Telemetry received for Collar ${cow.id}:`, {
          heartRate: data.heartRate,
          temperature: data.temperature,
          gps: liveGps,
          rawGps: data.gps || { lat: data.lat, lng: data.lng }
        });

        updatedCattle[index] = {
          ...updatedCattle[index],
          status: newStatus,
          telemetry: {
            ...updatedCattle[index].telemetry,
            heartRate: data.heartRate !== undefined ? Math.round(Number(data.heartRate)) : cow.telemetry.heartRate,
            temperature: data.temperature !== undefined ? Number(Number(data.temperature).toFixed(1)) : cow.telemetry.temperature,
            battery: data.battery !== undefined ? Math.round(Number(data.battery)) : cow.telemetry.battery,
            gps: liveGps,
            lastUpdated: 'Live ⚡'
          }
        };
        onUpdate([...updatedCattle]);
      };

      handlers.push(handler);
      onValue(nodeRef, handler, (error) => {
        console.warn(`RTDB error for collar ${cow.id}:`, error.message);
      });
    });
  }

  // 2. Subtle periodic micro-movement ONLY if active live GPS is present
  let stepIndex = 0;
  const timer = setInterval(() => {
    stepIndex = (stepIndex + 1) % 100;
    updatedCattle = updatedCattle.map((cow, i) => {
      // Do not invent static GPS locations if hardware has not sent a fix
      if (!cow.telemetry?.gps?.lat) return cow;
      const curGps = cow.telemetry.gps;
      const dLat = Math.sin((stepIndex + i) * 0.7) * 0.000015;
      const dLng = Math.cos((stepIndex + i) * 0.7) * 0.000015;
      return {
        ...cow,
        telemetry: {
          ...cow.telemetry,
          gps: {
            ...curGps,
            lat: Number((curGps.lat + dLat).toFixed(6)),
            lng: Number((curGps.lng + dLng).toFixed(6))
          },
          lastUpdated: 'Live ⚡'
        }
      };
    });
    onUpdate([...updatedCattle]);
  }, 6000);

  return () => {
    clearInterval(timer);
    nodeRefs.forEach((nodeRef, i) => off(nodeRef, 'value', handlers[i]));
  };
}

// Alias used by useTelemetry hook
export function subscribeToAllTelemetry(cattleList, simConfig, onUpdate) {
  return subscribeToTelemetry(cattleList, onUpdate, simConfig);
}

