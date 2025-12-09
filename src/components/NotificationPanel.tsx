import React from 'react';
import { Notification } from '../types';
import { X, Bell, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { Button } from './ui/Button';
interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: (id: string) => void;
  onClose: () => void;
}
export function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onClose
}: NotificationPanelProps) {
  const getSpeciesColor = (species: string) => {
    switch (species) {
      case 'ELEPHANT':
        return 'text-emerald-600 bg-emerald-50';
      case 'LION':
        return 'text-red-600 bg-red-50';
      case 'RHINO':
        return 'text-violet-600 bg-violet-50';
      case 'BUFFALO':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4" />;
      case 'DISPATCH':
        return <Bell className="w-4 h-4" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };
  return <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-slate-700" />
          <h3 className="font-bold text-slate-900">Notifications</h3>
          {notifications.filter(n => !n.read).length > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {notifications.filter(n => !n.read).length}
            </span>}
        </div>
        <div className="flex items-center space-x-2">
          {notifications.length > 0 && <button onClick={onMarkAllAsRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Mark all read
            </button>}
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No notifications</p>
            <p className="text-slate-400 text-xs mt-1">You're all caught up!</p>
          </div> : <div className="divide-y divide-slate-100">
            {notifications.map(notification => <div key={notification.id} className={`p-4 hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`} onClick={() => !notification.read && onMarkAsRead(notification.id)}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getSpeciesColor(notification.species)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-bold text-sm text-slate-900">
                        {notification.title}
                      </h4>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>}
                    </div>
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 mb-2">
                      {notification.safetyMessage}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <button onClick={e => {
                  e.stopPropagation();
                  onClear(notification.id);
                }} className="text-xs text-slate-400 hover:text-red-600 transition-colors">
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
}