import { Species, RiskLevel, Location } from '../types';

/**
 * Calculate risk level based on species, distance to settlement, and confidence
 * Implements the "Calculate Risk Level" step from sequence diagram
 */
export function calculateRiskLevel(species: Species, distanceToSettlement: number,
// meters
confidence: number,
// 0-100
timeOfDay: 'day' | 'night' = 'day'): RiskLevel {
  let riskScore = 0;

  // Species risk factor (based on danger level)
  const speciesRisk: Record<Species, number> = {
    LION: 40,
    ELEPHANT: 35,
    RHINO: 30,
    BUFFALO: 25,
    UNKNOWN: 10
  };
  riskScore += speciesRisk[species] || 10;

  // Distance factor (closer = higher risk)
  if (distanceToSettlement < 100) riskScore += 40;else if (distanceToSettlement < 300) riskScore += 30;else if (distanceToSettlement < 500) riskScore += 20;else if (distanceToSettlement < 1000) riskScore += 10;else riskScore += 5;

  // Confidence factor
  if (confidence >= 90) riskScore += 15;else if (confidence >= 80) riskScore += 10;else if (confidence >= 70) riskScore += 5;

  // Time of day factor (night is more dangerous)
  if (timeOfDay === 'night') riskScore += 10;

  // Determine risk level
  if (riskScore >= 80) return 'CRITICAL';
  if (riskScore >= 60) return 'HIGH';
  if (riskScore >= 40) return 'MEDIUM';
  return 'LOW';
}

/**
 * Predict animal trajectory based on current location and direction
 * Implements the "Predict Trajectory" step from sequence diagram
 */
export function predictTrajectory(currentLocation: Location, direction: string, speed: number = 12 // km/h default elephant speed
): Location[] {
  const trajectory: Location[] = [currentLocation];

  // Convert direction to angle
  const directionAngles: Record<string, number> = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315
  };
  const angle = directionAngles[direction] || 0;
  const angleRad = angle * Math.PI / 180;

  // Predict positions for next 30, 60, 90 minutes
  const timeIntervals = [30, 60, 90]; // minutes

  timeIntervals.forEach(minutes => {
    const distanceKm = speed * minutes / 60;
    const distanceDeg = distanceKm / 111; // rough conversion to degrees

    const newLat = currentLocation.lat + distanceDeg * Math.cos(angleRad);
    const newLng = currentLocation.lng + distanceDeg * Math.sin(angleRad);
    trajectory.push({
      lat: newLat,
      lng: newLng,
      address: `Predicted position (${minutes} min)`
    });
  });
  return trajectory;
}

/**
 * Calculate response time in seconds
 * Monitors the "Response Time: < 30 seconds" SLA from diagram
 */
export function calculateResponseTime(detectionTime: string, dispatchTime: string): number {
  const detection = new Date(detectionTime).getTime();
  const dispatch = new Date(dispatchTime).getTime();
  return Math.floor((dispatch - detection) / 1000); // seconds
}

/**
 * Check if response meets SLA (< 30 seconds)
 */
export function meetsResponseSLA(responseTimeSeconds: number): boolean {
  return responseTimeSeconds < 30;
}

/**
 * Get risk level color for UI
 */
export function getRiskLevelColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'CRITICAL':
      return 'bg-red-600 text-white';
    case 'HIGH':
      return 'bg-orange-500 text-white';
    case 'MEDIUM':
      return 'bg-yellow-500 text-white';
    case 'LOW':
      return 'bg-green-500 text-white';
  }
}

/**
 * Get risk level badge text
 */
export function getRiskLevelText(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'CRITICAL':
      return '🚨 CRITICAL RISK';
    case 'HIGH':
      return '⚠️ HIGH RISK';
    case 'MEDIUM':
      return '⚡ MEDIUM RISK';
    case 'LOW':
      return '✓ LOW RISK';
  }
}