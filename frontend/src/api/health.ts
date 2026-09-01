import { apiClient } from './client';

export const healthApi = {
  getTeamHealth: (teamId: string) => apiClient.get(`/teams/${teamId}/health`),
  getHealthTrend: (teamId: string, days: number = 7) => apiClient.get(`/teams/${teamId}/health/trend`, { params: { days } }),
  getNudges: (teamId: string) => apiClient.get(`/teams/${teamId}/nudges`),
};
