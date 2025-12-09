import React from 'react';
import { ResponseStatus } from '../types';
interface StatusBadgeProps {
  status: ResponseStatus;
}
export function StatusBadge({
  status
}: StatusBadgeProps) {
  const styles = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    DISPATCHED: 'bg-blue-100 text-blue-800 border-blue-200',
    RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };
  const labels = {
    PENDING: 'Pending Action',
    DISPATCHED: 'Team Dispatched',
    RESOLVED: 'Resolved'
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'PENDING' ? 'bg-amber-500' : status === 'DISPATCHED' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
      {labels[status]}
    </span>;
}