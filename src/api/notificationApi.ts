import { apiClient } from './client';
import { CollectorNotification } from '../types';

export const notificationApi = {
  getAll: async (): Promise<CollectorNotification[]> => {
    return apiClient<CollectorNotification[]>('/notifications');
  },

  markAsRead: async (id: string): Promise<{ id: string; isRead: boolean }> => {
    return apiClient<{ id: string; isRead: boolean }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  markAllAsRead: async (): Promise<{ success: boolean; count: number }> => {
    return apiClient<{ success: boolean; count: number }>('/notifications/mark-all-read', {
      method: 'POST',
    });
  },
};
