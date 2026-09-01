import { apiClient } from './client';

export const pollApi = {
  getPolls: (teamId: string) => apiClient.get(`/teams/${teamId}/polls`),
  createPoll: (teamId: string, data: any) => apiClient.post(`/teams/${teamId}/polls`, data),
  vote: (pollId: string, optionIndex: number) => apiClient.post(`/polls/${pollId}/vote`, { optionIndex }),
  getResults: (pollId: string) => apiClient.get(`/polls/${pollId}/results`),
};
