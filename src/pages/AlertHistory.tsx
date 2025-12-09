import React, { useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAlerts } from '../hooks/useAlerts';
import { StatusBadge } from '../components/StatusBadge';
import { RiskLevelBadge } from '../components/RiskLevelBadge';
import { ResponseTimeIndicator } from '../components/ResponseTimeIndicator';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Search, Filter, Download, Calendar, MapPin, Clock, TrendingUp, AlertTriangle, CheckCircle, Eye, ChevronDown, X, Radio, Navigation } from 'lucide-react';
import { ResponseStatus, RiskLevel } from '../types';
type ViewMode = 'cards' | 'timeline' | 'table';
type FilterStatus = ResponseStatus | 'ALL';
type FilterRisk = RiskLevel | 'ALL';
export function AlertHistory() {
  const {
    alerts
  } = useAlerts();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [filterRisk, setFilterRisk] = useState<FilterRisk>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  // Generate more historical alerts for demo
  const historicalAlerts = useMemo(() => {
    const species = ['ELEPHANT', 'LION', 'BUFFALO', 'RHINO'] as const;
    const statuses: ResponseStatus[] = ['PENDING', 'DISPATCHED', 'RESOLVED'];
    const risks: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const villages = ['Mtakuja Village', 'Kimana', 'Kuku', 'Rombo'];
    const historical = [...alerts];
    // Add 20 more historical alerts
    for (let i = 0; i < 20; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const dispatchedAt = status !== 'PENDING' ? new Date(timestamp.getTime() + Math.random() * 30 * 60 * 1000).toISOString() : undefined;
      historical.push({
        id: `hist-${i}`,
        species: species[Math.floor(Math.random() * species.length)],
        timestamp: timestamp.toISOString(),
        location: {
          lat: -3.434886 + (Math.random() - 0.5) * 0.02,
          lng: 37.783987 + (Math.random() - 0.5) * 0.02,
          region: 'Kajiado County',
          address: `Near ${villages[Math.floor(Math.random() * villages.length)]}`
        },
        distance: Math.floor(Math.random() * 800) + 100,
        confidence: Math.floor(Math.random() * 20) + 80,
        eta: Math.floor(Math.random() * 30) + 5,
        routeDistance: Math.floor(Math.random() * 10) + 2,
        direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        status,
        dispatchedAt,
        resolvedAt: status === 'RESOLVED' ? new Date(timestamp.getTime() + Math.random() * 120 * 60 * 1000).toISOString() : undefined,
        riskLevel: risks[Math.floor(Math.random() * risks.length)],
        predictedTrajectory: [],
        responseTime: dispatchedAt ? Math.floor(Math.random() * 40) + 10 : undefined
      });
    }
    return historical.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts]);
  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return historicalAlerts.filter(alert => {
      const matchesSearch = searchTerm === '' || alert.species.toLowerCase().includes(searchTerm.toLowerCase()) || alert.location.address?.toLowerCase().includes(searchTerm.toLowerCase()) || alert.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || alert.status === filterStatus;
      const matchesRisk = filterRisk === 'ALL' || alert.riskLevel === filterRisk;
      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [historicalAlerts, searchTerm, filterStatus, filterRisk]);
  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: filteredAlerts.length,
      pending: filteredAlerts.filter(a => a.status === 'PENDING').length,
      dispatched: filteredAlerts.filter(a => a.status === 'DISPATCHED').length,
      resolved: filteredAlerts.filter(a => a.status === 'RESOLVED').length,
      avgResponseTime: filteredAlerts.filter(a => a.responseTime).reduce((sum, a) => sum + (a.responseTime || 0), 0) / filteredAlerts.filter(a => a.responseTime).length || 0
    };
  }, [filteredAlerts]);
  const getSpeciesIcon = (species: string) => {
    const icons: Record<string, string> = {
      ELEPHANT: '🐘',
      LION: '🦁',
      BUFFALO: '🐃',
      RHINO: '🦏'
    };
    return icons[species] || '🦁';
  };
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  return <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Alert History
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Complete record of wildlife detections and responses
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search by species, location, or ID..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 border rounded-lg flex items-center space-x-2 transition-colors ${showFilters ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {(filterStatus !== 'ALL' || filterRisk !== 'ALL') && <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>}
            </button>

            <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
              <button onClick={() => setViewMode('cards')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                Cards
              </button>
              <button onClick={() => setViewMode('timeline')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'timeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                Timeline
              </button>
              <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                Table
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">
                  Filter Alerts
                </h3>
                <button onClick={() => {
              setFilterStatus('ALL');
              setFilterRisk('ALL');
            }} className="text-xs text-slate-500 hover:text-slate-700">
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Status
                  </label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as FilterStatus)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="DISPATCHED">Dispatched</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Risk Level
                  </label>
                  <select value={filterRisk} onChange={e => setFilterRisk(e.target.value as FilterRisk)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="ALL">All Risk Levels</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
            </div>}
        </header>

        <div className="p-6 space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Alerts</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {stats.pending}
                  </p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Dispatched</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.dispatched}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Navigation className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Resolved</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {stats.resolved}
                  </p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Avg Response</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.avgResponseTime > 0 ? `${stats.avgResponseTime.toFixed(0)}m` : 'N/A'}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Cards View */}
          {viewMode === 'cards' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAlerts.map(alert => <Card key={alert.id} className="p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">
                        {getSpeciesIcon(alert.species)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {alert.species}
                        </h3>
                        <p className="text-xs text-slate-500">
                          ID: #{alert.id.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <StatusBadge status={alert.status} />
                      <RiskLevelBadge riskLevel={alert.riskLevel} showIcon={false} />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      <span className="ml-2 text-xs text-slate-400">
                        ({formatTimeAgo(alert.timestamp)})
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="truncate">{alert.location.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Radio className="w-4 h-4 mr-2 text-slate-400" />
                      <span>Confidence: {alert.confidence}%</span>
                      <span className="mx-2">•</span>
                      <span>Distance: {alert.distance}m</span>
                    </div>
                  </div>

                  {alert.responseTime && <div className="mb-4">
                      <ResponseTimeIndicator responseTime={alert.responseTime} detectionTime={alert.timestamp} dispatchTime={alert.dispatchedAt} />
                    </div>}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      {alert.status === 'RESOLVED' && alert.resolvedAt && <span>Resolved {formatTimeAgo(alert.resolvedAt)}</span>}
                      {alert.status === 'DISPATCHED' && alert.dispatchedAt && <span>
                          Dispatched {formatTimeAgo(alert.dispatchedAt)}
                        </span>}
                      {alert.status === 'PENDING' && <span>Awaiting response</span>}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </Card>)}
            </div>}

          {/* Timeline View */}
          {viewMode === 'timeline' && <div className="space-y-4">
              {filteredAlerts.map((alert, index) => <div key={alert.id} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.status === 'RESOLVED' ? 'bg-emerald-100' : alert.status === 'DISPATCHED' ? 'bg-blue-100' : 'bg-amber-100'}`}>
                      <span className="text-lg">
                        {getSpeciesIcon(alert.species)}
                      </span>
                    </div>
                    {index < filteredAlerts.length - 1 && <div className="w-0.5 h-full bg-slate-200 mt-2"></div>}
                  </div>
                  <Card className="flex-1 p-4 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {alert.species}
                          </h3>
                          <StatusBadge status={alert.status} />
                          <RiskLevelBadge riskLevel={alert.riskLevel} showIcon={false} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Time</p>
                            <p className="font-medium text-slate-900">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Location</p>
                            <p className="font-medium text-slate-900">
                              {alert.location.address}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Confidence</p>
                            <p className="font-medium text-slate-900">
                              {alert.confidence}%
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Distance</p>
                            <p className="font-medium text-slate-900">
                              {alert.distance}m
                            </p>
                          </div>
                        </div>
                        {alert.responseTime && <div className="mt-3">
                            <ResponseTimeIndicator responseTime={alert.responseTime} detectionTime={alert.timestamp} dispatchTime={alert.dispatchedAt} />
                          </div>}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </div>)}
            </div>}

          {/* Table View */}
          {viewMode === 'table' && <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Species
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Risk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Response
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredAlerts.map(alert => <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-slate-500">
                          #{alert.id.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          <div>
                            {new Date(alert.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {getSpeciesIcon(alert.species)}
                            </span>
                            <span className="text-sm font-medium text-slate-900">
                              {alert.species}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                          {alert.location.address}
                        </td>
                        <td className="px-6 py-4">
                          <RiskLevelBadge riskLevel={alert.riskLevel} showIcon={false} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={alert.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {alert.responseTime ? `${alert.responseTime}s` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </Card>}

          {/* Empty State */}
          {filteredAlerts.length === 0 && <Card className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No alerts found
              </h3>
              <p className="text-slate-500">
                {searchTerm || filterStatus !== 'ALL' || filterRisk !== 'ALL' ? 'Try adjusting your filters or search terms' : 'No alert history available yet'}
              </p>
            </Card>}
        </div>
      </div>
    </div>;
}