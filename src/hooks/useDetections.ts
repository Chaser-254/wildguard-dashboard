import { useState } from 'react';
import { Detection } from '../types';

// Generate detections around the Mtakuja area only
const generateDetections = (count: number): Detection[] => {
  const baseLat = -3.434886; // Mtakuja area center
  const baseLng = 37.783987;
  const detections: Detection[] = [];
  const speciesList = ['ELEPHANT', 'LION', 'RHINO', 'BUFFALO'] as const;
  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 0.015; // Smaller range for focused area
    const lngOffset = (Math.random() - 0.5) * 0.015;
    detections.push({
      id: `d${i}`,
      species: speciesList[Math.floor(Math.random() * speciesList.length)],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      location: {
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset,
        region: 'Mtakuja Area'
      },
      distance: Math.floor(Math.random() * 1000) + 100,
      confidence: Math.floor(Math.random() * 20) + 80
    });
  }
  return detections;
};
const MOCK_DETECTIONS = generateDetections(15); // Reduced count for focused area

export function useDetections() {
  const [detections] = useState<Detection[]>(MOCK_DETECTIONS);
  const getRecentDetections = (hours: number = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).getTime();
    return detections.filter(d => new Date(d.timestamp).getTime() > cutoff);
  };
  return {
    detections,
    getRecentDetections
  };
}