/**
 * Kabadiwala Connect - Type Definitions
 * Source of truth for data models and API interfaces.
 */

export type UserRole = 'COLLECTOR' | 'ADMIN' | 'USER';

export type CollectorAvailability = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type PickupStatus = 
  | 'PENDING'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'COLLECTING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
}

export interface CollectorProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  eShramId: string | null;
  vehicleNumber: string | null;
  vehicleType: string | null;
  drivingLicenseNumber: string | null;
  availability: CollectorAvailability;
  trustScore: number; // 0 to 100
  totalCompletedPickups: number;
  totalEarnings: number;
  currentZone: string;
  location?: {
    latitude: number;
    longitude: number;
    addressText: string;
    isLive: boolean;
  };
  rating: number;
  joinedDate: string;
}

export interface WasteCategoryItem {
  id: string;
  category: 'Paper' | 'Cardboard' | 'Plastic' | 'Metal' | 'E-Waste' | 'Glass' | 'Mixed Scrap';
  estimatedWeightKg: number;
  actualWeightKg?: number;
  ratePerKg: number;
}

export interface PickupRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  scheduledTime: string;
  items: WasteCategoryItem[];
  estimatedPayout: number;
  actualPayout?: number;
  status: PickupStatus;
  notes?: string;
  collectorId?: string | null;
  acceptedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface WastePassport {
  id: string;
  pickupId: string;
  collectorId: string;
  collectorName: string;
  customerId: string;
  customerName: string;
  dateGenerated: string;
  totalWeightKg: number;
  co2OffsetKg: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  breakdown: {
    category: string;
    weightKg: number;
    destinationFacility: string;
    recyclingGrade: string;
  }[];
  verificationHash: string;
  qrCodeData: string;
}

export interface Transaction {
  id: string;
  pickupId: string;
  collectorId: string;
  customerId: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  paymentMode: 'DIRECT_UPI' | 'BANK_TRANSFER' | 'CASH';
  timestamp: string;
  referenceId: string;
  description: string;
  materialsSummary: string;
}

export interface CollectorNotification {
  id: string;
  collectorId: string;
  title: string;
  message: string;
  type: 'PICKUP_NEW' | 'PICKUP_STATUS' | 'PAYMENT' | 'TRUST_SCORE' | 'SYSTEM';
  isRead: boolean;
  relatedEntityId?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  collectorId: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'pickup' | 'earnings' | 'status' | 'passport';
}

export interface DashboardMetrics {
  todaysEarnings: number;
  completedPickupsToday: number;
  trustScore: number | null;
  totalPickups: number;
  activePickupId: string | null;
  recentActivity: ActivityLog[];
}

export interface AuthResponse {
  token: string;
  user: User;
  collector: CollectorProfile;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
