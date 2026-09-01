import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  addNotification: (n: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const res = await apiClient.get('/notifications');
      const notifications: Notification[] = res.data;
      const unreadCount = notifications.filter((n) => !n.is_read).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  },

  markRead: async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      const notifications = get().notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      set({ notifications, unreadCount: Math.max(0, get().unreadCount - 1) });
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  },

  markAllRead: async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      const notifications = get().notifications.map((n) => ({ ...n, is_read: true }));
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark all read', error);
    }
  },

  addNotification: (n) => {
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));

