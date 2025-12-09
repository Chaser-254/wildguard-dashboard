import React, { useEffect, useState } from 'react';
import { Alert, Route } from '../types';
import { Button } from './ui/Button';
import { StatusBadge } from './StatusBadge';
import { RiskLevelBadge } from './RiskLevelBadge';
import { ResponseTimeIndicator } from './ResponseTimeIndicator';
import { IncidentReportModal } from './IncidentReportModal';
import { X, MapPin, Clock, Navigation, Shield, Phone, Radio, FileText, TrendingUp } from 'lucide-react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
interface AlertDetailModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (id: string) => void;
  onCalculateRoute: (id: string) => Route | null | Promise<Route>;
  onViewRouteOnMap: (route: Route) => void;
}
const miniMapContainerStyle = {
  width: '100%',
  height: '100%'
};
const miniMapOptions = {
  mapTypeId: 'satellite' as const,
  disableDefaultUI: true,
  zoomControl: false,
  gestureHandling: 'none' as const
};
export function AlertDetailModal({
  alert,
  isOpen,
  onClose,
  onDispatch,
  onCalculateRoute,
  onViewRouteOnMap
}: AlertDetailModalProps) {
  const [route, setRoute] = useState<Route | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showIncidentReport, setShowIncidentReport] = useState(false);
  useEffect(() => {
    setRoute(null);
    setIsCalculating(false);
  }, [alert?.id, isOpen]);
  if (!isOpen || !alert) return null;
  const handleGetDirections = async () => {
    setIsCalculating(true);
    try {
      const calculatedRoute = onCalculateRoute(alert.id);
      if (calculatedRoute instanceof Promise) {
        const resolvedRoute = await calculatedRoute;
        setRoute(resolvedRoute);
      } else {
        setRoute(calculatedRoute);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  const handleViewOnMainMap = () => {
    if (route) {
      onViewRouteOnMap(route);
      onClose();
    }
  };
  const handleIncidentReport = (report: any) => {
    console.log('Incident report submitted:', report);
    // In real app, this would save to database
  };
  const createMarkerIcon = (color: string) => {
    if (typeof google === 'undefined') return undefined;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 6
    };
  };
  return <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  WildGuard Plus Alert Details
                </h2>
                <p className="text-sm text-slate-500">
                  ID: #{alert.id.toUpperCase()}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Details */}
            <div className="space-y-6">
              {/* Risk Level */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Risk Assessment
                </h3>
                <div className="space-y-3">
                  <RiskLevelBadge riskLevel={alert.riskLevel} />
                  {alert.predictedTrajectory && alert.predictedTrajectory.length > 1 && <div className="flex items-start space-x-2 text-sm text-slate-600">
                        <TrendingUp className="w-4 h-4 mt-0.5 text-blue-500" />
                        <span>
                          Predicted trajectory: Moving {alert.direction} towards{' '}
                          {alert.predictedTrajectory[1].address}
                        </span>
                      </div>}
                </div>
              </div>

              {/* Detection Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Detection Info
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Species</span>
                    <span className="font-bold text-slate-900">
                      {alert.species}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Confidence</span>
                    <span className="font-bold text-emerald-600">
                      {alert.confidence}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Detected At</span>
                    <span className="font-medium text-slate-900">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status</span>
                    <StatusBadge status={alert.status} />
                  </div>
                </div>
              </div>

              {/* Response Time */}
              {(alert.responseTime !== undefined || alert.status === 'PENDING') && <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Response Time
                  </h3>
                  <ResponseTimeIndicator responseTime={alert.responseTime} detectionTime={alert.timestamp} dispatchTime={alert.dispatchedAt} />
                </div>}

              {/* Location & Movement */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Location & Movement
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {alert.location.address}
                      </p>
                      <p className="text-xs text-slate-500">
                        {alert.location.lat}, {alert.location.lng}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Navigation className="w-5 h-5 text-slate-400 mr-3" />
                    <span className="text-slate-700">
                      Moving{' '}
                      <span className="font-bold">{alert.direction}</span> at
                      approx. 12km/h
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-slate-400 mr-3" />
                    <span className="text-slate-700">
                      ETA to nearest village:{' '}
                      <span className="font-bold text-red-600">
                        {alert.eta} mins
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Map & Actions */}
            <div className="space-y-6 flex flex-col">
              {/* Mini Map Area */}
              <div className="flex-1 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative h-[250px]">
                {route ? <GoogleMap mapContainerStyle={miniMapContainerStyle} center={{
                lat: alert.location.lat,
                lng: alert.location.lng
              }} zoom={13} options={miniMapOptions}>
                    <Marker position={{
                  lat: route.from.location.lat,
                  lng: route.from.location.lng
                }} icon={createMarkerIcon('#3B82F6')} />
                    <Marker position={{
                  lat: alert.location.lat,
                  lng: alert.location.lng
                }} icon={createMarkerIcon('#DC2626')} />
                    <Polyline path={route.coordinates.map(coord => ({
                  lat: coord[0],
                  lng: coord[1]
                }))} options={{
                  strokeColor: '#3B82F6',
                  strokeWeight: 3,
                  strokeOpacity: 0.8,
                  geodesic: false
                }} />
                  </GoogleMap> : <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <div className="text-center p-4">
                      <Radio className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">
                        Calculate route to see path
                      </p>
                    </div>
                  </div>}

                {route && <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur p-3 border-t border-slate-200 flex justify-between items-center z-[1000]">
                    <div>
                      <p className="text-xs text-slate-500">
                        From: {route.from.name}
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {route.distance} km • {route.duration} min
                      </p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        Real-time route via roads
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleViewOnMainMap}>
                      View on Map
                    </Button>
                  </div>}
              </div>

              <div className="space-y-3">
                {!route ? <Button className="w-full justify-center" onClick={handleGetDirections} isLoading={isCalculating} variant="outline">
                    <Navigation className="w-4 h-4 mr-2" />
                    {isCalculating ? 'Calculating Route...' : 'Get Directions'}
                  </Button> : <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-md flex items-center text-sm text-emerald-800">
                    <Navigation className="w-4 h-4 mr-2" />
                    Route calculated from {route.from.name}
                  </div>}

                {alert.status === 'PENDING' ? <Button className="w-full justify-center py-3" onClick={() => onDispatch(alert.id)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Dispatch Ranger Team
                  </Button> : <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="font-bold text-blue-900">
                        Response in Progress
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Team dispatched at{' '}
                      {new Date(alert.dispatchedAt || '').toLocaleTimeString()}
                    </p>
                  </div>}

                {alert.status === 'DISPATCHED' && <Button variant="outline" className="w-full justify-center" onClick={() => setShowIncidentReport(true)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Report Incident
                  </Button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Report Modal */}
      <IncidentReportModal alert={alert} isOpen={showIncidentReport} onClose={() => setShowIncidentReport(false)} onSubmit={handleIncidentReport} />
    </>;
}