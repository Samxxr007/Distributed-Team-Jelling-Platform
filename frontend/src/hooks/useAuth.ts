import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const store = useAuthStore();
  
  useEffect(() => {
    if (store.token && !store.user && !store.isLoading) {
      store.loadUser();
    }
  }, [store.token, store.user, store.loadUser, store.isLoading]);

  return {
    ...store,
    isAuthenticated: !!store.user,
    isAdmin: store.user?.role === 'admin',
    isTeamLead: store.user?.role === 'team_lead' || store.user?.role === 'admin',
  };
}
