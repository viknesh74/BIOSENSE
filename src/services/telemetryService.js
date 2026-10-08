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

  let updatedCattle = cattleList.map((cow, index) => ({
    ...cow,
    telemetry: {
      ...cow.telemetry,
      gps: cow.telemetry?.gps?.lat ? cow.telemetry.gps : STATIC_GPS_LOCATIONS[index % STATIC_GPS_LOCATIONS.length]
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

        const defaultGps = STATIC_GPS_LOCATIONS[index % STATIC_GPS_LOCATIONS.length];
        const liveGps = (validLat && validLng)
          ? { lat: Number(liveLat), lng: Number(liveLng) }
          : (cow.telemetry?.gps || defaultGps);

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

  // 2. Periodic Live Location Cycler across the 3 static GPS points
  let stepIndex = 0;
  const timer = setInterval(() => {
    stepIndex = (stepIndex + 1) % STATIC_GPS_LOCATIONS.length;
    updatedCattle = updatedCattle.map((cow, i) => {
      const nextGps = STATIC_GPS_LOCATIONS[(stepIndex + i) % STATIC_GPS_LOCATIONS.length];
      return {
        ...cow,
        telemetry: {
          ...cow.telemetry,
          gps: nextGps,
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

