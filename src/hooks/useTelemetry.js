/**
 * useTelemetry.js — Custom hook for live sensor telemetry
 *
 * Manages the telemetry subscription lifecycle (setup on mount, cleanup on unmount).
 * When simConfig changes, the subscription is torn down and restarted.
 *
 * Usage:
 *   const { } = useTelemetry({ cattle, simConfig, onCattleUpdate, onAlert });
 */

import { useEffect, useRef } from 'react';
import { subscribeToAllTelemetry } from '../services/telemetryService';
import { pushAlert } from '../services/alertService';

// Throttle duplicate alerts: don't fire the same alert type for the same collar
// more than once every 15 seconds.
const ALERT_THROTTLE_MS = 15000;

/**
 * @param {Object}   params
 * @param {Array}    params.cattle          — current cattle array (from useCattle)
 * @param {Object}   params.simConfig       — simulation configuration
 * @param {Function} params.onCattleUpdate  — (updatedCattle: Array) => void
 * @param {string}   params.farmerId        — for tagging alerts
 */
export function useTelemetry({ cattle, simConfig, onCattleUpdate, farmerId = 'farmer-uma' }) {
  const lastAlertTimesRef = useRef({});
  const cattleRef = useRef(cattle);

  // Keep cattleRef in sync so the subscription always sees latest cattle
  useEffect(() => {
    cattleRef.current = cattle;
  }, [cattle]);

  useEffect(() => {
    // Don't start if cattle not loaded yet
    if (!cattle || cattle.length === 0) return;

    const unsubscribe = subscribeToAllTelemetry(
      cattleRef.current,
      simConfig,
      (updatedCattle) => {
        // Check each cattle for new alerts to push
        updatedCattle.forEach((cow) => {
          const prevCow = cattleRef.current.find((c) => c.id === cow.id);
          if (!prevCow) return;

          // If the status worsened, check if we need to fire an alert
          const statusWorsened =
            (cow.status === 'Emergency' && prevCow.status !== 'Emergency') ||
            (cow.status === 'Warning' && prevCow.status === 'Healthy');

          if (statusWorsened) {
            const alertKey = `${cow.id}-${cow.status}`;
            const now = Date.now();
            const lastTime = lastAlertTimesRef.current[alertKey] || 0;

            if (now - lastTime > ALERT_THROTTLE_MS) {
              lastAlertTimesRef.current[alertKey] = now;

              // Determine alert content based on status
              let title = 'Health Alert';
              let message = `Collar ${cow.id} (${cow.name}) status changed to ${cow.status}.`;
              let type = cow.status === 'Emergency' ? 'emergency' : 'warning';

              // More specific messages based on vitals
              const { heartRate: hr, temperature: temp, battery: batt } = cow.telemetry;
              if (hr > 105) {
                title = 'High Heart Rate';
                message = `Collar ${cow.id} (${cow.name}) HR at ${hr} BPM. Urgent checkup required.`;
              } else if (hr < 50) {
                title = 'Low Heart Rate';
                message = `Collar ${cow.id} (${cow.name}) HR dropped to ${hr} BPM. Emergency care needed.`;
              } else if (temp > 40.0) {
                title = 'High Temperature (Fever)';
                message = `Collar ${cow.id} (${cow.name}) has fever of ${temp}°C.`;
              } else if (batt < 20) {
                title = 'Low Battery Alert';
                message = `Collar ${cow.id} (${cow.name}) battery at ${batt}%.`;
                type = 'warning';
              }

              // Push to alert service (persists to Firestore when activated)
              pushAlert({ collarId: cow.id, farmerId, title, message, type });
            }
          }
        });

        onCattleUpdate(updatedCattle);
      }
    );

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simConfig, farmerId]);
}
