export type Species = 'ELEPHANT' | 'GIRAFFE' | 'RHINO' | 'BUFFALO' | 'UNKNOWN';
export type ResponseStatus = 'PENDING' | 'DISPATCHED' | 'RESOLVED';
export type RecipientGroup = 'KWS' | 'KRCS' | 'COMMUNITY';
export type UserRole = 'ADMIN' | 'RANGER' | 'OBSERVER' | 'COMMUNITY';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
export type ContactStatus = 'ACTIVE' | 'INACTIVE' | 'UNVERIFIED';
export type ContactCategory = 'FARMER' | 'COMMUNITY_LEADER' | 'BUSINESS_OWNER' | 'RESIDENT' | 'OTHER';
export interface Location {
  lat: number;
  lng: number;
  address?: string;
  region?: string;
}
export interface ResponseStation {
  id: string;
  name: string;
  location: Location;
  type: 'HQ' | 'GATE' | 'STATION';
}
export interface Camera {
  id: string;
  name: string;
  location: Location;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  lastDetection?: string;
  detectionCount24h: number;
}
export interface Route {
  id: string;
  from: ResponseStation;
  to: Location;
  distance: number;
  duration: number;
  coordinates: [number, number][];
}
export interface Detection {
  id: string;
  species: Species;
  timestamp: string;
  location: Location;
  distance: number;
  confidence: number;
  imageUrl?: string;
  cameraId?: string;
  riskLevel?: RiskLevel;
  predictedTrajectory?: Location[];
}
export interface Alert extends Detection {
  eta: number;
  routeDistance: number;
  direction: string;
  status: ResponseStatus;
  dispatchedAt?: string;
  resolvedAt?: string;
  notes?: string;
  calculatedRoute?: Route;
  riskLevel: RiskLevel;
  predictedTrajectory: Location[];
  responseTime?: number;
}
export interface IncidentReport {
  id: string;
  alertId: string;
  reportedBy: string;
  reportedAt: string;
  status: IncidentStatus;
  description: string;
  outcome?: string;
  resolvedAt?: string;
  isFalsePositive: boolean;
}
export interface Notification {
  id: string;
  alertId: string;
  title: string;
  message: string;
  safetyMessage: string;
  timestamp: string;
  read: boolean;
  type: 'ALERT' | 'DISPATCH' | 'RESOLVED';
  species: Species;
  location: Location;
  sentTo: RecipientGroup[];
}
export interface RecipientSettings {
  group: RecipientGroup;
  name: string;
  enabled: boolean;
  autoNotify: boolean;
  contactInfo: string;
  notificationCount: number;
}
export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  alternatePhone?: string;
  email?: string;
  category: ContactCategory;
  village?: string;
  region: string;
  status: ContactStatus;
  receiveAlerts: boolean;
  preferredLanguage: 'en' | 'sw';
  notificationsSent: number;
  lastNotified?: string;
  addedAt: string;
  addedBy: string;
  notes?: string;
}
export interface ContactGroup {
  id: string;
  name: string;
  description: string;
  contactIds: string[];
  createdAt: string;
  createdBy: string;
}
export interface BulkImportResult {
  successful: number;
  failed: number;
  duplicates: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  avatar?: string;
  lastLogin?: string;
}
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
export interface ResponseMetrics {
  alertId: string;
  detectionTime: string;
  notificationSentTime?: string;
  dispatchTime?: string;
  responseTime?: number;
  meetsSLA: boolean;
}
export interface DailyStats {
  totalDetections: number;
  activeAlerts: number;
  avgResponseTime: number;
  speciesCount: Record<Species, number>;
}