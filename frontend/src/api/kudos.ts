import { apiClient } from './client';

export const kudosApi = {
  sendKudos: (data: any) => apiClient.post('/kudos', data),
  getTeamKudos: (teamId: string) => apiClient.get(`/teams/${teamId}/kudos`),
  getUserKudos: (userId: string) => apiClient.get(`/users/${userId}/kudos`),
};
