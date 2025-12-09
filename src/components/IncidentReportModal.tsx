import React, { useState } from 'react';
import { Alert, IncidentStatus } from '../types';
import { Button } from './ui/Button';
import { X, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
interface IncidentReportModalProps {
  alert: Alert;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: {
    description: string;
    outcome: string;
    status: IncidentStatus;
    isFalsePositive: boolean;
  }) => void;
}
export function IncidentReportModal({
  alert,
  isOpen,
  onClose,
  onSubmit
}: IncidentReportModalProps) {
  const [description, setDescription] = useState('');
  const [outcome, setOutcome] = useState('');
  const [status, setStatus] = useState<IncidentStatus>('RESOLVED');
  const [isFalsePositive, setIsFalsePositive] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      outcome,
      status,
      isFalsePositive
    });
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Report Incident
              </h2>
              <p className="text-sm text-slate-500">
                Alert #{alert.id.toUpperCase()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* False Positive Toggle */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={isFalsePositive} onChange={e => setIsFalsePositive(e.target.checked)} className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-900">
                    Mark as False Positive
                  </span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  No wildlife detected or incorrect classification
                </p>
              </div>
            </label>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Incident Status
            </label>
            <select value={status} onChange={e => setStatus(e.target.value as IncidentStatus)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="RESOLVED">Resolved</option>
              <option value="INVESTIGATING">Still Investigating</option>
              <option value="FALSE_POSITIVE">False Positive</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Incident Description
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what happened during the response..." required rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none" />
          </div>

          {/* Outcome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Outcome / Resolution
            </label>
            <textarea value={outcome} onChange={e => setOutcome(e.target.value)} placeholder="What was the final outcome? Any actions taken?" required rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none" />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>;
}