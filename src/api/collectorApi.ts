import { apiClient } from './client';
import { CollectorProfile, DashboardMetrics, CollectorAvailability, PickupRequest } from '../types';

export const collectorApi = {
  getProfile: async (): Promise<CollectorProfile> => {
    return apiClient<CollectorProfile>('/collectors/me');
  },

  updateProfile: async (payload: Partial<CollectorProfile>): Promise<CollectorProfile> => {
    return apiClient<CollectorProfile>('/collectors/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    return apiClient<DashboardMetrics>('/collectors/me/dashboard');
  },

  getActivePickup: async (): Promise<{ activePickup: PickupRequest | null }> => {
    return apiClient<{ activePickup: PickupRequest | null }>('/collectors/me/active-pickup');
  },

  updateAvailability: async (availability: CollectorAvailability): Promise<{ availability: CollectorAvailability }> => {
    return apiClient<{ availability: CollectorAvailability }>('/collectors/me/availability', {
      method: 'PATCH',
      body: JSON.stringify({ availability }),
    });
  },
};
