import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Message } from '../types';

interface ChatState {
  messages: Message[];
  typingUsers: string[];
  fetchMessages: (teamId: string) => Promise<void>;
  addMessage: (msg: Message) => void;
  setTyping: (username: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  typingUsers: [],

  fetchMessages: async (teamId) => {
    try {
      const res = await apiClient.get(`/teams/${teamId}/messages`);
      set({ messages: res.data });
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  },

  addMessage: (msg) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  },

  setTyping: (username, isTyping) => {
    set((state) => {
      if (isTyping && !state.typingUsers.includes(username)) {
        return { typingUsers: [...state.typingUsers, username] };
      } else if (!isTyping) {
        return { typingUsers: state.typingUsers.filter(u => u !== username) };
      }
      return state;
    });
  }
}));
