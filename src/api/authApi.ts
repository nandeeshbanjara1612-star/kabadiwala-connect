import { apiClient } from './client';
import { AuthResponse, User, CollectorProfile } from '../types';

export interface LoginPayload {
  phoneOrEmail: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  vehicleNumber?: string;
  vehicleType?: string;
  eShramId?: string;
  drivingLicenseNumber?: string;
  currentZone?: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMe: async (): Promise<{ user: User; collector: CollectorProfile }> => {
    return apiClient<{ user: User; collector: CollectorProfile }>('/auth/me');
  },

  logout: async (): Promise<{ success: boolean }> => {
    return apiClient<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    });
  },
};
