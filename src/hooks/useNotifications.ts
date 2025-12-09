import { useState, useEffect } from 'react';
import { Notification, Alert } from '../types';
const getSafetyMessage = (species: string): string => {
  switch (species) {
    case 'ELEPHANT':
      return '⚠️ Stay indoors and keep a safe distance. Elephants can be unpredictable. Do not approach or provoke.';
    case 'GIRAFFE':
      return '🚨 DANGER: Remain indoors immediately. Lions are predators. Keep children and pets inside. Do not go outside until rangers arrive.';
    case 'RHINO':
      return '⚠️ Keep away from the area. Rhinos have poor eyesight but will charge if threatened. Stay in secure buildings.';
    case 'BUFFALO':
      return '⚠️ Buffalo can be aggressive. Stay indoors and avoid the area. Do not attempt to scare them away.';
    default:
      return '⚠️ Wildlife detected nearby. Please stay alert and follow ranger instructions.';
  }
};
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const createNotification = (alert: Alert): Notification => {
    const notification: Notification = {
      id: `notif-${alert.id}-${Date.now()}`,
      alertId: alert.id,
      title: `${alert.species} Detected`,
      message: `A ${alert.species.toLowerCase()} has been detected at ${alert.location.address || 'unknown location'} (${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}). Distance: ${alert.distance}m from nearest settlement.`,
      safetyMessage: getSafetyMessage(alert.species),
      timestamp: alert.timestamp,
      read: false,
      type: 'ALERT',
      species: alert.species,
      location: alert.location
    };
    return notification;
  };
  const addNotification = (alert: Alert) => {
    const notification = createNotification(alert);
    setNotifications(prev => [notification, ...prev]);
  };
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => notif.id === notificationId ? {
      ...notif,
      read: true
    } : notif));
  };
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({
      ...notif,
      read: true
    })));
  };
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };
  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    clearNotification,
    clearAllNotifications
  };
}