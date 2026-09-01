import { create } from 'zustand';
import { apiClient } from '../api/client';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  role?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { access_token, user } = res.data;
      localStorage.setItem('access_token', access_token);
      set({ token: access_token, user });
      toast.success(`Welcome back, ${user.full_name || user.username}!`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/auth/register', data);
      const { access_token, user } = res.data;
      localStorage.setItem('access_token', access_token);
      set({ token: access_token, user });
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Registration failed.');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    const token = get().token;
    if (token) {
      apiClient.post('/auth/logout').catch(() => {/* best effort */});
    }
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
    toast.success('Logged out successfully');
  },

  loadUser: async () => {
    try {
      const res = await apiClient.get('/auth/me');
      set({ user: res.data });
    } catch {
      get().logout();
    }
  },
}));

