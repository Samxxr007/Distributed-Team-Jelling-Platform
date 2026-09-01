import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Team, TeamMember } from '../types';
import toast from 'react-hot-toast';

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  members: TeamMember[];
  fetchTeams: () => Promise<void>;
  selectTeam: (id: string) => void;
  createTeam: (data: any) => Promise<Team>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeam: null,
  members: [],

  fetchTeams: async () => {
    try {
      const res = await apiClient.get('/teams');
      set({ teams: res.data });
      if (res.data.length > 0 && !get().currentTeam) {
        set({ currentTeam: res.data[0] });
      }
    } catch (error) {
      toast.error('Failed to load teams');
    }
  },

  selectTeam: (id: string) => {
    const team = get().teams.find(t => t.id === id) || null;
    set({ currentTeam: team });
  },

  createTeam: async (data: any) => {
    try {
      const res = await apiClient.post('/teams', data);
      set((state) => ({ teams: [...state.teams, res.data] }));
      toast.success('Team created');
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create team');
      throw error;
    }
  }
}));
