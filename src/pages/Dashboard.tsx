import React, { useEffect, useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { useDetections } from '../hooks/useDetections';
import { useNotifications } from '../hooks/useNotifications';
import { Sidebar } from '../components/Sidebar';
import { Map } from '../components/Map';
import { AlertList } from '../components/AlertList';
import { AlertDetailModal } from '../components/AlertDetailModal';
import { NotificationPanel } from '../components/NotificationPanel';
import { UserMenu } from '../components/UserMenu';
import { StatCard } from '../components/StatCard';
import { Alert, Route } from '../types';
import { AlertTriangle, Radio, Activity, Users, Bell } from 'lucide-react';
export function Dashboard() {
  const {
    alerts,
    updateAlertStatus,
    getStats,
    calculateRoute,
    stations,
    cameras
  } = useAlerts();
  const {
    detections
  } = useDetections();
  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    clearNotification
  } = useNotifications();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [processedAlerts, setProcessedAlerts] = useState<Set<string>>(new Set());
  const stats = getStats();
  // Generate notifications for new alerts
  useEffect(() => {
    alerts.forEach(alert => {
      if (!processedAlerts.has(alert.id)) {
        addNotification(alert);
        setProcessedAlerts(prev => new Set(prev).add(alert.id));
      }
    });
  }, [alerts]);
  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };
  const handleDispatch = (id: string) => {
    updateAlertStatus(id, 'DISPATCHED');
    if (selectedAlert?.id === id) {
      setSelectedAlert(prev => prev ? {
        ...prev,
        status: 'DISPATCHED',
        dispatchedAt: new Date().toISOString()
      } : null);
    }
  };
  const handleViewRouteOnMap = (route: Route) => {
    setActiveRoute(route);
  };
  const handleClearRoute = () => {
    setActiveRoute(null);
  };
  return <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10">
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>

            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                {getUnreadCount() > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {getUnreadCount()}
                  </span>}
              </button>

              {showNotifications && <NotificationPanel notifications={notifications} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} onClear={clearNotification} onClose={() => setShowNotifications(false)} />}
            </div>

            {/* User Menu */}
            <UserMenu />
          </div>
        </header>

        {/* Stats Row */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Active Alerts" value={stats.pending} icon={AlertTriangle} color="amber" />
          <StatCard label="Detections (24h)" value={detections.length} icon={Radio} color="emerald" trend={{
          value: 12,
          isPositive: true
        }} />
          <StatCard label="Response Teams" value={stats.dispatched} icon={Users} color="blue" />
          <StatCard label="System Health" value="98.5%" icon={Activity} color="slate" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-6">
          {/* Map Container */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            <Map detections={detections} alerts={alerts} stations={stations} cameras={cameras} activeRoute={activeRoute} onAlertClick={handleAlertClick} onClearRoute={handleClearRoute} />
          </div>

          {/* Right Sidebar: Alert List */}
          <div className="w-96 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <AlertList alerts={alerts} onAlertClick={handleAlertClick} onDispatch={handleDispatch} />
          </div>
        </div>
      </div>

      <AlertDetailModal alert={selectedAlert} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onDispatch={handleDispatch} onCalculateRoute={calculateRoute} onViewRouteOnMap={handleViewRouteOnMap} />
    </div>;
}