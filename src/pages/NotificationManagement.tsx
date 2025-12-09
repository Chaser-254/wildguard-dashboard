import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RecipientSettings, RecipientGroup } from '../types';
import { Bell, Send, Users, Shield, Heart, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
const INITIAL_RECIPIENTS: RecipientSettings[] = [{
  group: 'KWS',
  name: 'Kenya Wildlife Service',
  enabled: true,
  autoNotify: true,
  contactInfo: '+254 700 000 000',
  notificationCount: 24
}, {
  group: 'KRCS',
  name: 'Kenya Red Cross Society',
  enabled: true,
  autoNotify: true,
  contactInfo: '+254 703 037 000',
  notificationCount: 18
}, {
  group: 'COMMUNITY',
  name: 'Local Community',
  enabled: true,
  autoNotify: true,
  contactInfo: 'Community Alert System',
  notificationCount: 45
}];
export function NotificationManagement() {
  const [recipients, setRecipients] = useState<RecipientSettings[]>(INITIAL_RECIPIENTS);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<RecipientGroup[]>([]);
  const toggleRecipient = (group: RecipientGroup) => {
    setRecipients(prev => prev.map(r => r.group === group ? {
      ...r,
      enabled: !r.enabled
    } : r));
  };
  const toggleAutoNotify = (group: RecipientGroup) => {
    setRecipients(prev => prev.map(r => r.group === group ? {
      ...r,
      autoNotify: !r.autoNotify
    } : r));
  };
  const handleSelectRecipient = (group: RecipientGroup) => {
    setSelectedRecipients(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]);
  };
  const handleSendCustomNotification = () => {
    if (customMessage && selectedRecipients.length > 0) {
      alert(`Notification sent to: ${selectedRecipients.join(', ')}\nMessage: ${customMessage}`);
      setCustomMessage('');
      setSelectedRecipients([]);
    }
  };
  const getRecipientIcon = (group: RecipientGroup) => {
    switch (group) {
      case 'KWS':
        return <Shield className="w-6 h-6" />;
      case 'KRCS':
        return <Heart className="w-6 h-6" />;
      case 'COMMUNITY':
        return <Users className="w-6 h-6" />;
    }
  };
  const getRecipientColor = (group: RecipientGroup) => {
    switch (group) {
      case 'KWS':
        return 'bg-blue-500';
      case 'KRCS':
        return 'bg-red-500';
      case 'COMMUNITY':
        return 'bg-emerald-500';
    }
  };
  return <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Notification Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage alert recipients and notification settings
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-600">
                {recipients.filter(r => r.enabled).length} active recipients
              </span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Sent (24h)</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {recipients.reduce((sum, r) => sum + r.notificationCount, 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Recipients</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {recipients.filter(r => r.enabled).length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Auto-Notify Enabled</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {recipients.filter(r => r.autoNotify).length}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recipient Groups */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Recipient Groups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recipients.map(recipient => <Card key={recipient.group} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${getRecipientColor(recipient.group)} rounded-lg text-white`}>
                      {getRecipientIcon(recipient.group)}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-xs text-slate-500">Enabled</span>
                        <input type="checkbox" checked={recipient.enabled} onChange={() => toggleRecipient(recipient.group)} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-xs text-slate-500">Auto</span>
                        <input type="checkbox" checked={recipient.autoNotify} onChange={() => toggleAutoNotify(recipient.group)} disabled={!recipient.enabled} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50" />
                      </label>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 mb-1">
                    {recipient.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    {recipient.contactInfo}
                  </p>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Notifications sent</span>
                      <span className="font-bold text-slate-900">
                        {recipient.notificationCount}
                      </span>
                    </div>
                  </div>

                  <div className={`mt-3 px-3 py-2 rounded-md text-xs font-medium ${recipient.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {recipient.enabled ? '✓ Active' : '○ Inactive'}
                  </div>
                </Card>)}
            </div>
          </div>

          {/* Send Custom Notification */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Send Custom Notification
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Recipients
                </label>
                <div className="flex flex-wrap gap-3">
                  {recipients.filter(r => r.enabled).map(recipient => <label key={recipient.group} className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${selectedRecipients.includes(recipient.group) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input type="checkbox" checked={selectedRecipients.includes(recipient.group)} onChange={() => handleSelectRecipient(recipient.group)} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                        <span className="text-sm font-medium text-slate-700">
                          {recipient.name}
                        </span>
                      </label>)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)} placeholder="Enter your custom notification message..." className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none" rows={4} />
              </div>

              <Button onClick={handleSendCustomNotification} disabled={!customMessage || selectedRecipients.length === 0} className="w-full justify-center">
                <Send className="w-4 h-4 mr-2" />
                Send Notification to {selectedRecipients.length} Recipient
                {selectedRecipients.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </Card>

          {/* Notification Log */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Recent Notifications
            </h2>
            <div className="space-y-3">
              {[{
              time: '2 mins ago',
              message: 'Elephant detected near Mtakuja Village',
              recipients: ['KWS', 'KRCS', 'COMMUNITY']
            }, {
              time: '15 mins ago',
              message: 'Lion sighting at Mtakuja Central',
              recipients: ['KWS', 'COMMUNITY']
            }, {
              time: '1 hour ago',
              message: 'Buffalo herd moving towards settlement',
              recipients: ['KWS', 'KRCS', 'COMMUNITY']
            }, {
              time: '2 hours ago',
              message: 'Rhino detected in Sanctuary Zone',
              recipients: ['KWS']
            }].map((log, index) => <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {log.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-slate-500">{log.time}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <div className="flex items-center space-x-1">
                        {log.recipients.map(recipient => <span key={recipient} className="text-xs px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                            {recipient}
                          </span>)}
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                </div>)}
            </div>
          </Card>
        </div>
      </div>
    </div>;
}