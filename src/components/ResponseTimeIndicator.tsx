import React from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
interface ResponseTimeIndicatorProps {
  responseTime?: number; // seconds
  detectionTime: string;
  dispatchTime?: string;
}
export function ResponseTimeIndicator({
  responseTime,
  detectionTime,
  dispatchTime
}: ResponseTimeIndicatorProps) {
  const meetsSLA = responseTime !== undefined && responseTime < 30;
  const isPending = !dispatchTime;
  if (isPending) {
    return <div className="flex items-center space-x-2 text-amber-600">
        <Clock className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-medium">Awaiting dispatch...</span>
      </div>;
  }
  return <div className={`flex items-center space-x-2 ${meetsSLA ? 'text-emerald-600' : 'text-red-600'}`}>
      {meetsSLA ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      <div className="text-sm">
        <span className="font-bold">{responseTime}s</span>
        <span className="text-slate-600 ml-1">
          {meetsSLA ? '(Within SLA ✓)' : '(SLA exceeded)'}
        </span>
      </div>
    </div>;
}