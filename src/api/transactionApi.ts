import { apiClient } from './client';
import { Transaction } from '../types';

export const transactionApi = {
  getAll: async (): Promise<Transaction[]> => {
    return apiClient<Transaction[]>('/transactions');
  },

  getById: async (id: string): Promise<Transaction> => {
    return apiClient<Transaction>(`/transactions/${id}`);
  },
};
