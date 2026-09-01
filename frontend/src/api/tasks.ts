import { apiClient } from './client';

export const taskApi = {
  getTasks: (teamId: string, params?: any) => apiClient.get(`/teams/${teamId}/tasks`, { params }),
  createTask: (teamId: string, data: any) => apiClient.post(`/teams/${teamId}/tasks`, data),
  updateTask: (taskId: string, data: any) => apiClient.put(`/tasks/${taskId}`, data),
  updateTaskStatus: (taskId: string, status: string) => apiClient.patch(`/tasks/${taskId}/status`, { status }),
  deleteTask: (taskId: string) => apiClient.delete(`/tasks/${taskId}`),
};
