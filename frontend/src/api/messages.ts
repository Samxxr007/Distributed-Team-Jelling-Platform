import { apiClient } from './client';

export const messageApi = {
  getMessages: (teamId: string, params?: any) => apiClient.get(`/teams/${teamId}/messages`, { params }),
  sendMessage: (data: any) => apiClient.post('/messages', data),
  addReaction: (messageId: string, emoji: string) => apiClient.post(`/messages/${messageId}/reactions`, { emoji }),
  getDMs: (userId: string) => apiClient.get(`/dm/${userId}`),
};
