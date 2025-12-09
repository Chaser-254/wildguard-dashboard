import { useState } from 'react';
import { Alert, ResponseStatus, ResponseStation, Route, Location, Camera, RiskLevel } from '../types';
import { calculateRiskLevel, predictTrajectory, calculateResponseTime } from '../utils/riskAssessment';
export const CAMERAS: Camera[] = [{
  id: 'cam1',
  name: 'Camera West-01',
  location: {
    lat: -3.4362,
    lng: 37.7801,
    region: 'Mtakuja Area'
  },
  status: 'ONLINE',
  lastDetection: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  detectionCount24h: 12
}, {
  id: 'cam2',
  name: 'Camera Central-02',
  location: {
    lat: -3.43365,
    lng: 37.782,
    region: 'Mtakuja Area'
  },
  status: 'ONLINE',
  lastDetection: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  detectionCount24h: 8
}, {
  id: 'cam3',
  name: 'Camera East-03',
  location: {
    lat: -3.43495,
    lng: 37.7841,
    region: 'Mtakuja Area'
  },
  status: 'ONLINE',
  lastDetection: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  detectionCount24h: 15
}];
export const RESPONSE_STATIONS: ResponseStation[] = [{
  id: 's1',
  name: 'Response Team Alpha',
  location: {
    lat: -3.39642,
    lng: 37.676531
  },
  type: 'HQ'
}, {
  id: 's2',
  name: 'Response Team Bravo',
  location: {
    lat: -3.39764,
    lng: 37.676841
  },
  type: 'STATION'
}];

// Create alerts with risk levels and predicted trajectories
const createMockAlert = (id: string, species: Alert['species'], timestamp: string, location: Location, distance: number, confidence: number, direction: string, status: ResponseStatus, dispatchedAt?: string): Alert => {
  const hour = new Date(timestamp).getHours();
  const timeOfDay = hour >= 6 && hour < 18 ? 'day' : 'night';
  const riskLevel = calculateRiskLevel(species, distance, confidence, timeOfDay);
  const predictedTrajectory = predictTrajectory(location, direction);
  let responseTime: number | undefined;
  if (dispatchedAt) {
    responseTime = calculateResponseTime(timestamp, dispatchedAt);
  }
  return {
    id,
    species,
    timestamp,
    location,
    distance,
    confidence,
    eta: Math.ceil(distance / 200),
    // rough ETA calculation
    routeDistance: distance * 1.3,
    direction,
    status,
    dispatchedAt,
    cameraId: 'cam1',
    riskLevel,
    predictedTrajectory,
    responseTime
  };
};
const MOCK_ALERTS: Alert[] = [createMockAlert('a1', 'ELEPHANT', new Date(Date.now() - 1000 * 60 * 8).toISOString(), {
  lat: -3.436096,
  lng: 37.780275,
  region: 'Mtakuja Area',
  address: 'Near Mtakuja Village, Western Sector'
}, 350, 92, 'NE', 'PENDING'), createMockAlert('a2', 'BUFFALO', new Date(Date.now() - 1000 * 60 * 20).toISOString(), {
  lat: -3.433762,
  lng: 37.782142,
  region: 'Mtakuja Area',
  address: 'Mtakuja Central, Near Waterhole'
}, 180, 88, 'S', 'DISPATCHED', new Date(Date.now() - 1000 * 60 * 19).toISOString() // 1 minute response time
), createMockAlert('a3', 'LION', new Date(Date.now() - 1000 * 60 * 3).toISOString(), {
  lat: -3.434886,
  lng: 37.783987,
  region: 'Mtakuja Area',
  address: 'Mtakuja East, Community Boundary'
}, 520, 95, 'W', 'PENDING')];
const getDistance = (loc1: Location, loc2: Location) => {
  const R = 6371;
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const updateAlertStatus = (id: string, newStatus: ResponseStatus) => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === id) {
        const dispatchedAt = newStatus === 'DISPATCHED' ? new Date().toISOString() : alert.dispatchedAt;
        const responseTime = dispatchedAt && !alert.dispatchedAt ? calculateResponseTime(alert.timestamp, dispatchedAt) : alert.responseTime;
        return {
          ...alert,
          status: newStatus,
          dispatchedAt,
          responseTime,
          resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : alert.resolvedAt
        };
      }
      return alert;
    }));
  };
  const calculateRoute = (alertId: string): Route | null => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return null;
    let nearestStation = RESPONSE_STATIONS[0];
    let minDistance = Infinity;
    RESPONSE_STATIONS.forEach(station => {
      const dist = getDistance(station.location, alert.location);
      if (dist < minDistance) {
        minDistance = dist;
        nearestStation = station;
      }
    });
    if (typeof google !== 'undefined' && google.maps && google.maps.DirectionsService) {
      const directionsService = new google.maps.DirectionsService();
      return new Promise<Route>(resolve => {
        directionsService.route({
          origin: new google.maps.LatLng(nearestStation.location.lat, nearestStation.location.lng),
          destination: new google.maps.LatLng(alert.location.lat, alert.location.lng),
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS
          }
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const route = result.routes[0];
            const leg = route.legs[0];
            const pathCoordinates: [number, number][] = [];
            route.overview_path.forEach(point => {
              pathCoordinates.push([point.lat(), point.lng()]);
            });
            const routeData: Route = {
              id: `route-${Date.now()}`,
              from: nearestStation,
              to: alert.location,
              distance: parseFloat((leg.distance!.value / 1000).toFixed(1)),
              duration: Math.ceil(leg.duration!.value / 60),
              coordinates: pathCoordinates
            };
            resolve(routeData);
          } else {
            const fallbackRoute: Route = {
              id: `route-${Date.now()}`,
              from: nearestStation,
              to: alert.location,
              distance: parseFloat((minDistance * 1.3).toFixed(1)),
              duration: Math.ceil(minDistance * 1.3 / 40 * 60),
              coordinates: [[nearestStation.location.lat, nearestStation.location.lng], [alert.location.lat, alert.location.lng]]
            };
            resolve(fallbackRoute);
          }
        });
      }) as any;
    }
    return {
      id: `route-${Date.now()}`,
      from: nearestStation,
      to: alert.location,
      distance: parseFloat((minDistance * 1.3).toFixed(1)),
      duration: Math.ceil(minDistance * 1.3 / 40 * 60),
      coordinates: [[nearestStation.location.lat, nearestStation.location.lng], [alert.location.lat, alert.location.lng]]
    };
  };
  const getActiveAlerts = () => {
    return alerts.filter(a => a.status !== 'RESOLVED');
  };
  const getStats = () => {
    return {
      total: alerts.length,
      pending: alerts.filter(a => a.status === 'PENDING').length,
      dispatched: alerts.filter(a => a.status === 'DISPATCHED').length,
      resolved: alerts.filter(a => a.status === 'RESOLVED').length
    };
  };
  return {
    alerts,
    updateAlertStatus,
    getActiveAlerts,
    getStats,
    calculateRoute,
    stations: RESPONSE_STATIONS,
    cameras: CAMERAS
  };
}