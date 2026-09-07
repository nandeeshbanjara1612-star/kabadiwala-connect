import { apiClient } from './client';
import { WastePassport } from '../types';

export const passportApi = {
  getAll: async (): Promise<WastePassport[]> => {
    return apiClient<WastePassport[]>('/passports');
  },

  getById: async (id: string): Promise<WastePassport> => {
    return apiClient<WastePassport>(`/passports/${id}`);
  },
};
