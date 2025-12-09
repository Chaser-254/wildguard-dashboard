import React, { useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { useAlerts } from '../hooks/useAlerts';
import { useDetections } from '../hooks/useDetections';
import { useContacts } from '../hooks/useContacts';
import { TrendingUp, TrendingDown, AlertTriangle, Clock, Target, Users, Radio, Shield, Activity, Calendar, MapPin, Zap } from 'lucide-react';
type TimeRange = '7d' | '30d' | '90d';
export function Analytics() {
  const {
    alerts,
    getStats
  } = useAlerts();
  const {
    detections
  } = useDetections();
  const {
    getStats: getContactStats
  } = useContacts();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const stats = getStats();
  const contactStats = getContactStats();
  // Generate time-series data for the selected range
  const timeSeriesData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', {
        weekday: 'short'
      });
      const monthDay = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      // Simulate realistic patterns
      const baseDetections = 8 + Math.floor(Math.random() * 12);
      const baseAlerts = Math.floor(baseDetections * (0.2 + Math.random() * 0.3));
      const baseDispatched = Math.floor(baseAlerts * (0.6 + Math.random() * 0.3));
      data.push({
        date: timeRange === '7d' ? dayName : monthDay,
        detections: baseDetections,
        alerts: baseAlerts,
        dispatched: baseDispatched,
        resolved: Math.floor(baseDispatched * (0.7 + Math.random() * 0.2)),
        responseTime: 15 + Math.floor(Math.random() * 20) // 15-35 minutes
      });
    }
    return data;
  }, [timeRange]);
  // Species breakdown with realistic data
  const speciesData = useMemo(() => {
    const species = ['ELEPHANT', 'LION', 'BUFFALO', 'RHINO'];
    return species.map(s => ({
      name: s,
      value: detections.filter(d => d.species === s).length || Math.floor(Math.random() * 15) + 5,
      color: s === 'ELEPHANT' ? '#059669' : s === 'LION' ? '#DC2626' : s === 'BUFFALO' ? '#D97706' : '#7C3AED'
    }));
  }, [detections]);
  // Risk level distribution
  const riskData = useMemo(() => {
    return [{
      name: 'Critical',
      value: alerts.filter(a => a.riskLevel === 'CRITICAL').length || 2,
      color: '#DC2626'
    }, {
      name: 'High',
      value: alerts.filter(a => a.riskLevel === 'HIGH').length || 5,
      color: '#F59E0B'
    }, {
      name: 'Medium',
      value: alerts.filter(a => a.riskLevel === 'MEDIUM').length || 8,
      color: '#3B82F6'
    }, {
      name: 'Low',
      value: alerts.filter(a => a.riskLevel === 'LOW').length || 3,
      color: '#10B981'
    }];
  }, [alerts]);
  // Response time breakdown
  const responseTimeData = useMemo(() => {
    return [{
      range: '< 15 min',
      count: 12,
      target: 15,
      color: '#10B981'
    }, {
      range: '15-30 min',
      count: 8,
      target: 10,
      color: '#3B82F6'
    }, {
      range: '30-60 min',
      count: 4,
      target: 5,
      color: '#F59E0B'
    }, {
      range: '> 60 min',
      count: 1,
      target: 0,
      color: '#DC2626'
    }];
  }, []);
  // Hourly detection pattern
  const hourlyData = useMemo(() => {
    const hours = Array.from({
      length: 24
    }, (_, i) => {
      const hour = i;
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      // Simulate realistic patterns (more activity at dawn/dusk)
      let activity = 2;
      if (hour >= 5 && hour <= 8) activity = 8 + Math.floor(Math.random() * 6); // Dawn
      else if (hour >= 17 && hour <= 20) activity = 10 + Math.floor(Math.random() * 8); // Dusk
      else if (hour >= 9 && hour <= 16) activity = 3 + Math.floor(Math.random() * 4); // Day
      else activity = 5 + Math.floor(Math.random() * 5); // Night
      return {
        hour: `${displayHour}${period}`,
        detections: activity
      };
    });
    return hours;
  }, []);
  // Calculate trends
  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, d) => sum + d[key], 0) / 3;
    const previous = data.slice(-6, -3).reduce((sum, d) => sum + d[key], 0) / 3;
    return (recent - previous) / previous * 100;
  };
  const detectionTrend = calculateTrend(timeSeriesData, 'detections');
  const alertTrend = calculateTrend(timeSeriesData, 'alerts');
  const avgResponseTime = timeSeriesData.reduce((sum, d) => sum + d.responseTime, 0) / timeSeriesData.length;
  return <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Analytics & Insights
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Wildlife detection patterns, response metrics, and system
                performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                {(['7d', '30d', '90d'] as TimeRange[]).map(range => <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                    {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                  </button>)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Radio className="w-6 h-6 text-emerald-600" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${detectionTrend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {detectionTrend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(detectionTrend).toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">Total Detections</p>
              <p className="text-3xl font-bold text-slate-900">
                {timeSeriesData.reduce((sum, d) => sum + d.detections, 0)}
              </p>
              <p className="text-xs text-slate-500 mt-2">Across all cameras</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${alertTrend >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {alertTrend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(alertTrend).toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">High-Risk Alerts</p>
              <p className="text-3xl font-bold text-slate-900">
                {timeSeriesData.reduce((sum, d) => sum + d.alerts, 0)}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {stats.pending} currently active
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${avgResponseTime < 20 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  <Target className="w-4 h-4" />
                  <span>{avgResponseTime < 20 ? 'Good' : 'Fair'}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">Avg Response Time</p>
              <p className="text-3xl font-bold text-slate-900">
                {avgResponseTime.toFixed(1)} min
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Target: &lt; 20 minutes
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-medium text-emerald-600">
                  <Activity className="w-4 h-4" />
                  <span>Active</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">Alert Recipients</p>
              <p className="text-3xl font-bold text-slate-900">
                {contactStats.receiving}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                of {contactStats.total} contacts
              </p>
            </Card>
          </div>

          {/* Detection Trends */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Detection & Alert Trends
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Daily wildlife activity and response patterns
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-600">Detections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-slate-600">Alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-600">Dispatched</span>
                </div>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{
                  fill: '#64748b',
                  fontSize: 12
                }} />
                  <YAxis axisLine={false} tickLine={false} tick={{
                  fill: '#64748b',
                  fontSize: 12
                }} />
                  <Tooltip contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} />
                  <Area type="monotone" dataKey="detections" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorDetections)" />
                  <Area type="monotone" dataKey="alerts" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorAlerts)" />
                  <Line type="monotone" dataKey="dispatched" stroke="#3B82F6" strokeWidth={2} dot={{
                  r: 3
                }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Species Distribution */}
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Species Distribution
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Breakdown of detected wildlife
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={speciesData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value">
                        {speciesData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ml-8 space-y-3">
                  {speciesData.map(entry => <div key={entry.name} className="flex items-center justify-between min-w-[140px]">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{
                      backgroundColor: entry.color
                    }}></div>
                        <span className="text-sm font-medium text-slate-700">
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {entry.value}
                      </span>
                    </div>)}
                </div>
              </div>
            </Card>

            {/* Risk Level Distribution */}
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Risk Level Distribution
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Alert severity breakdown
                </p>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{
                    fill: '#64748b',
                    fontSize: 12
                  }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{
                    fill: '#64748b',
                    fontSize: 12
                  }} width={80} />
                    <Tooltip contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                      {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Hourly Activity Pattern */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                24-Hour Activity Pattern
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Wildlife detection by time of day
              </p>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{
                  fill: '#64748b',
                  fontSize: 11
                }} interval={1} />
                  <YAxis axisLine={false} tickLine={false} tick={{
                  fill: '#64748b',
                  fontSize: 12
                }} />
                  <Tooltip contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} />
                  <Bar dataKey="detections" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span>Peak: Dawn (5-8 AM) & Dusk (5-8 PM)</span>
              </div>
            </div>
          </Card>

          {/* Response Time Analysis */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Response Time Analysis
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Time from detection to ranger dispatch
              </p>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{
                  fill: '#64748b',
                  fontSize: 12
                }} />
                  <YAxis axisLine={false} tickLine={false} tick={{
                  fill: '#64748b',
                  fontSize: 12
                }} label={{
                  value: 'Number of Alerts',
                  angle: -90,
                  position: 'insideLeft',
                  style: {
                    fill: '#64748b'
                  }
                }} />
                  <Tooltip contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={60}>
                    {responseTimeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Bar>
                  <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-900">
                    Fast Response
                  </span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">80%</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Under 30 minutes
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">
                    SLA Compliance
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600">92%</p>
                <p className="text-xs text-blue-700 mt-1">Meeting targets</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
}