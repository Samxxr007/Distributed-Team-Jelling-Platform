import { apiClient } from './client';

export const sentimentApi = {
  analyzeSentiment: (text: string) => apiClient.post('/sentiment/analyze', { text }),
  getTeamSentiment: (teamId: string, days: number = 7) => apiClient.get(`/teams/${teamId}/sentiment`, { params: { days } }),
  getSentimentTrend: (teamId: string, days: number = 7) => apiClient.get(`/teams/${teamId}/sentiment/trend`, { params: { days } }),
};
