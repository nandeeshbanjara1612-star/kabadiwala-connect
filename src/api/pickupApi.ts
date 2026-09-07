import { apiClient } from './client';
import { PickupRequest, PickupStatus, WasteCategoryItem } from '../types';

export interface CompletePickupPayload {
  collectedItems: WasteCategoryItem[];
  actualPayout: number;
  notes?: string;
}

export const pickupApi = {
  getNearby: async (params?: { zone?: string; radiusKm?: number }): Promise<PickupRequest[]> => {
    return apiClient<PickupRequest[]>('/pickups/nearby', { params });
  },

  getMyPickups: async (status?: PickupStatus): Promise<PickupRequest[]> => {
    return apiClient<PickupRequest[]>('/pickups/my', { params: { status } });
  },

  getById: async (id: string): Promise<PickupRequest> => {
    return apiClient<PickupRequest>(`/pickups/${id}`);
  },

  accept: async (id: string): Promise<PickupRequest> => {
    return apiClient<PickupRequest>(`/pickups/${id}/accept`, {
      method: 'POST',
    });
  },

  reject: async (id: string, reason?: string): Promise<{ success: boolean; id: string }> => {
    return apiClient<{ success: boolean; id: string }>(`/pickups/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  updateStatus: async (id: string, status: PickupStatus): Promise<PickupRequest> => {
    return apiClient<PickupRequest>(`/pickups/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  complete: async (id: string, payload: CompletePickupPayload): Promise<{
    pickup: PickupRequest;
    wastePassportId: string;
    transactionId: string;
  }> => {
    return apiClient<{
      pickup: PickupRequest;
      wastePassportId: string;
      transactionId: string;
    }>(`/pickups/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
