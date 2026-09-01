import { apiClient } from './client';

export const activityApi = {
  getActivities: (teamId: string) => apiClient.get(`/teams/${teamId}/activities`),
  createActivity: (teamId: string, data: any) => apiClient.post(`/teams/${teamId}/activities`, data),
  joinActivity: (activityId: string) => apiClient.post(`/activities/${activityId}/join`),
  getIcebreakers: (teamId: string) => apiClient.get(`/teams/${teamId}/icebreakers`),
};
