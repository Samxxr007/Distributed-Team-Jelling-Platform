import { apiClient } from './client';

export const teamApi = {
  getTeams: () => apiClient.get('/teams'),
  getTeam: (id: string) => apiClient.get(`/teams/${id}`),
  createTeam: (data: any) => apiClient.post('/teams', data),
  joinTeam: (inviteCode: string) => apiClient.post('/teams/join', { inviteCode }),
  getInviteLink: (teamId: string) => apiClient.post(`/teams/${teamId}/invite`),
  getMembers: (teamId: string) => apiClient.get(`/teams/${teamId}/members`),
  leaveTeam: (teamId: string) => apiClient.delete(`/teams/${teamId}/leave`),
  updateMemberRole: (teamId: string, userId: string, role: string) => apiClient.put(`/teams/${teamId}/members/${userId}`, { role }),
};
