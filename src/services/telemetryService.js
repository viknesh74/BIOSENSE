import { rtdb } from './firebase';
import { ref, onValue, off } from 'firebase/database';

/**
 * Subscribe to live sensor data from Firebase Realtime Database.
 * The ESP32 pushes data to: /telemetry/{collarId}
 *
 * @param {Array}    cattleList — current cattle array
 * @param {Function} onUpdate  — (updatedCattle: Array) => void
 * @returns {Function} unsubscribe
 */
export function subscribeToTelemetry(cattleList, onUpdate) {
  if (!rtdb || !cattleList || cattleList.length === 0) {
    return () => {};
  }

  const updatedCattle = [...cattleList];
  const nodeRefs = [];
  const handlers = [];

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

      updatedCattle[index] = {
        ...updatedCattle[index],
        status: newStatus,
        telemetry: {
          ...updatedCattle[index].telemetry,
          heartRate: data.heartRate ?? cow.telemetry.heartRate,
          temperature: data.temperature ?? cow.telemetry.temperature,
          battery: data.battery ?? cow.telemetry.battery,
          gps: data.gps ?? cow.telemetry.gps,
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

  return () => {
    nodeRefs.forEach((nodeRef, i) => off(nodeRef, 'value', handlers[i]));
  };
}

// Alias used by useTelemetry hook
export function subscribeToAllTelemetry(cattleList, _simConfig, onUpdate) {
  return subscribeToTelemetry(cattleList, onUpdate);
}
