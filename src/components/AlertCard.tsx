import React from 'react';
import { Alert } from '../types';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock, Navigation, AlertTriangle } from 'lucide-react';
interface AlertCardProps {
  alert: Alert;
  onClick: () => void;
  onDispatch: (e: React.MouseEvent) => void;
}
export function AlertCard({
  alert,
  onClick,
  onDispatch
}: AlertCardProps) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hr ago`;
  };
  return <Card className={`hover:border-emerald-500 transition-colors ${alert.status === 'PENDING' ? 'border-l-4 border-l-amber-500' : ''}`} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900">{alert.species}</span>
            <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">
              {alert.confidence}% Conf.
            </span>
          </div>
          <StatusBadge status={alert.status} />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
            <span className="truncate">
              {alert.location.address || `${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}`}
            </span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Navigation className="w-4 h-4 mr-2 text-slate-400" />
            <span>
              {alert.distance}m away • Moving {alert.direction}
            </span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Clock className="w-4 h-4 mr-2 text-slate-400" />
            <span>Detected {timeAgo(alert.timestamp)}</span>
          </div>

          {alert.status === 'PENDING' && <div className="flex items-center text-sm text-amber-600 font-medium bg-amber-50 p-2 rounded">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span>ETA to community: {alert.eta} mins</span>
            </div>}
        </div>

        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={e => {
          e.stopPropagation();
          onClick();
        }}>
            Details
          </Button>
          {alert.status === 'PENDING' && <Button variant="primary" size="sm" className="flex-1" onClick={onDispatch}>
              Dispatch Team
            </Button>}
        </div>
      </CardContent>
    </Card>;
}