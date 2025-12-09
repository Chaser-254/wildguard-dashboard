import React, { useState } from 'react';
import { Alert, ResponseStatus } from '../types';
import { AlertCard } from './AlertCard';
interface AlertListProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  onDispatch: (alertId: string) => void;
}
export function AlertList({
  alerts,
  onAlertClick,
  onDispatch
}: AlertListProps) {
  const [filter, setFilter] = useState<ResponseStatus | 'ALL'>('ALL');
  const filteredAlerts = filter === 'ALL' ? alerts : alerts.filter(a => a.status === filter);
  const tabs = [{
    id: 'ALL',
    label: 'All'
  }, {
    id: 'PENDING',
    label: 'Pending'
  }, {
    id: 'DISPATCHED',
    label: 'Dispatched'
  }, {
    id: 'RESOLVED',
    label: 'Resolved'
  }] as const;
  return <div className="h-full flex flex-col bg-slate-50 border-l border-slate-200">
      <div className="p-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Active Alerts
        </h2>
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          {tabs.map(tab => <button key={tab.id} onClick={() => setFilter(tab.id)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${filter === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {tab.label}
            </button>)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredAlerts.length === 0 ? <div className="text-center py-12">
            <p className="text-slate-500 text-sm">
              No alerts found in this category.
            </p>
          </div> : filteredAlerts.map(alert => <AlertCard key={alert.id} alert={alert} onClick={() => onAlertClick(alert)} onDispatch={e => {
        e.stopPropagation();
        onDispatch(alert.id);
      }} />)}
      </div>
    </div>;
}