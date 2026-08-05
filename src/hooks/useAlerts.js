/**
 * useAlerts.js — Custom hook for notifications/alerts
 *
 * Wraps alertService and provides reactive notifications state.
 *
 * Usage:
 *   const { notifications, markRead, markAllRead } = useAlerts(farmerId);
 */

import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToAlerts,
  markAlertRead,
  markAllAlertsRead
} from '../services/alertService';

/**
 * @param {string} farmerId  — e.g. 'farmer-uma'
 */
export function useAlerts(farmerId = 'farmer-uma') {
  const [notifications, setNotifications] = useState([]);

  // Subscribe to real-time alerts
  useEffect(() => {
    const unsubscribe = subscribeToAlerts(farmerId, (data) => {
      setNotifications(data);
    });
    return unsubscribe;
  }, [farmerId]);

  /**
   * Mark a single alert as read.
   * @param {string|number} alertId
   */
  const markRead = useCallback(async (alertId) => {
    await markAlertRead(alertId);
  }, []);

  /**
   * Mark all alerts as read.
   */
  const markAllRead = useCallback(async () => {
    await markAllAlertsRead(farmerId);
  }, [farmerId]);

  return { notifications, markRead, markAllRead };
}
