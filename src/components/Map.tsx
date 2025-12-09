import React, { useCallback, useState, Fragment } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, Polyline, InfoWindow } from '@react-google-maps/api';
import { Detection, Alert, ResponseStation, Route, Camera } from '../types';
import { Button } from './ui/Button';
interface MapProps {
  detections: Detection[];
  alerts: Alert[];
  stations?: ResponseStation[];
  cameras?: Camera[];
  activeRoute?: Route | null;
  onAlertClick: (alert: Alert) => void;
  onClearRoute?: () => void;
}
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};
const center = {
  lat: -3.434886,
  lng: 37.783987
};
// Use plain values instead of google.maps enums to avoid "google is not defined" error
const mapOptions = {
  mapTypeId: 'satellite',
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
  zoomControl: true
};
export function Map({
  detections,
  alerts,
  stations = [],
  cameras = [],
  activeRoute,
  onAlertClick,
  onClearRoute
}: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);
  const getMarkerColor = (species: string) => {
    switch (species) {
      case 'ELEPHANT':
        return '#059669';
      case 'Girrafe':
        return '#DC2626';
      case 'Zebra':
        return '#7C3AED';
      case 'Antelope':
        return '#D97706';
      default:
        return '#64748B';
    }
  };
  // These functions now safely use google.maps because they're called after LoadScript loads
  const createMarkerIcon = (color: string, size: number = 20, isAlert: boolean = false) => {
    if (typeof google === 'undefined') return undefined;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: size / 2,
      ...(isAlert && {
        animation: google.maps.Animation.BOUNCE
      })
    };
  };
  const createStationIcon = () => {
    if (typeof google === 'undefined') return undefined;
    return {
      path: 'M12 2L2 7v9c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z',
      fillColor: '#3B82F6',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 1.2,
      anchor: new google.maps.Point(12, 12)
    };
  };
  const createCameraIcon = (status: string) => {
    if (typeof google === 'undefined') return undefined;
    const statusColor = status === 'ONLINE' ? '#10B981' : status === 'OFFLINE' ? '#EF4444' : '#F59E0B';
    return {
      path: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      fillColor: statusColor,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 0.8,
      anchor: new google.maps.Point(12, 12)
    };
  };
  return <div className="h-full w-full relative">
      <LoadScript googleMapsApiKey="AIzaSyBGUqKLnsU8o4mNzKfMvJup4MgtHW__pT0">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14} options={mapOptions} onLoad={onLoad}>
          {/* Render AI Detection Cameras */}
          {cameras.map(camera => <Marker key={camera.id} position={{
          lat: camera.location.lat,
          lng: camera.location.lng
        }} icon={createCameraIcon(camera.status)} onClick={() => setSelectedMarker(`camera-${camera.id}`)}>
              {selectedMarker === `camera-${camera.id}` && <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div className="p-2">
                    <h3 className="font-bold text-sm text-emerald-800">
                      {camera.name}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Status:{' '}
                      <span className={`font-bold ${camera.status === 'ONLINE' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {camera.status}
                      </span>
                    </p>
                    <p className="text-xs text-slate-600">
                      Detections (24h): {camera.detectionCount24h}
                    </p>
                    {camera.lastDetection && <p className="text-xs text-slate-500">
                        Last:{' '}
                        {new Date(camera.lastDetection).toLocaleTimeString()}
                      </p>}
                  </div>
                </InfoWindow>}
            </Marker>)}

          {/* Render Response Stations */}
          {stations.map(station => <Marker key={station.id} position={{
          lat: station.location.lat,
          lng: station.location.lng
        }} icon={createStationIcon()} onClick={() => setSelectedMarker(`station-${station.id}`)}>
              {selectedMarker === `station-${station.id}` && <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div className="p-2">
                    <h3 className="font-bold text-sm text-blue-800">
                      {station.name}
                    </h3>
                    <p className="text-xs text-slate-600">{station.type}</p>
                  </div>
                </InfoWindow>}
            </Marker>)}

          {/* Render Active Route */}
          {activeRoute && <Polyline path={activeRoute.coordinates.map(coord => ({
          lat: coord[0],
          lng: coord[1]
        }))} options={{
          strokeColor: '#3B82F6',
          strokeWeight: 4,
          strokeOpacity: 0.8,
          geodesic: true
        }} />}

          {/* Render regular detections */}
          {detections.map(detection => <Marker key={detection.id} position={{
          lat: detection.location.lat,
          lng: detection.location.lng
        }} icon={createMarkerIcon(getMarkerColor(detection.species), 20, false)} onClick={() => setSelectedMarker(`detection-${detection.id}`)}>
              {selectedMarker === `detection-${detection.id}` && <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div className="p-2">
                    <h3 className="font-bold text-sm">{detection.species}</h3>
                    <p className="text-xs text-slate-600">
                      Confidence: {detection.confidence}%
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(detection.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </InfoWindow>}
            </Marker>)}

          {/* Render Active Alerts */}
          {alerts.map(alert => <Fragment key={`alert-${alert.id}`}>
              <Marker position={{
            lat: alert.location.lat,
            lng: alert.location.lng
          }} icon={createMarkerIcon(getMarkerColor(alert.species), 30, true)} onClick={() => {
            setSelectedMarker(`alert-${alert.id}`);
            onAlertClick(alert);
          }}>
                {selectedMarker === `alert-${alert.id}` && <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-red-600">ACTIVE ALERT</h3>
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 rounded">
                          {alert.species}
                        </span>
                      </div>
                      <p className="text-sm mb-1">{alert.location.address}</p>
                      <p className="text-xs text-slate-600 mb-2">
                        Distance: {alert.distance}m • ETA: {alert.eta} min
                      </p>
                      <Button size="sm" className="w-full" onClick={() => onAlertClick(alert)}>
                        View Details
                      </Button>
                    </div>
                  </InfoWindow>}
              </Marker>
              <Circle center={{
            lat: alert.location.lat,
            lng: alert.location.lng
          }} radius={alert.distance} options={{
            strokeColor: getMarkerColor(alert.species),
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: getMarkerColor(alert.species),
            fillOpacity: 0.15
          }} />
            </Fragment>)}
        </GoogleMap>
      </LoadScript>

      {/* Route Info Overlay */}
      {activeRoute && onClearRoute && <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] flex items-center space-x-3">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">
              Active Route
            </p>
            <p className="text-sm font-bold text-slate-900">
              {activeRoute.distance} km • {activeRoute.duration} min
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={onClearRoute}>
            Clear
          </Button>
        </div>}

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 bg-white p-3 rounded-lg shadow-lg z-[1000] text-xs">
        <h4 className="font-bold mb-2 text-slate-700">Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-600 mr-2"></div>{' '}
            Elephant
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div> Giraffe
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-violet-600 mr-2"></div>{' '}
            Rhino
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-600 mr-2"></div>{' '}
            Buffalo
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-500 mr-2 flex items-center justify-center text-[8px] text-white font-bold">
              🛡️
            </div>{' '}
            Response Station
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-emerald-500 mr-2 flex items-center justify-center text-white">
              📷
            </div>{' '}
            AI Camera
          </div>
          <div className="flex items-center mt-2 pt-2 border-t border-slate-100">
            <div className="w-3 h-3 rounded-full border-2 border-red-500 animate-pulse mr-2"></div>{' '}
            Active Alert
          </div>
        </div>
      </div>
    </div>;
}