import { useEffect } from 'react';
import { useTeamStore } from '../stores/teamStore';
import { useParams } from 'react-router-dom';

export function useTeam() {
  const store = useTeamStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (store.teams.length === 0) {
      store.fetchTeams();
    }
  }, [store.fetchTeams]);

  useEffect(() => {
    if (id && store.teams.length > 0) {
      store.selectTeam(id);
    }
  }, [id, store.teams, store.selectTeam]);

  return {
    ...store,
    isLoading: store.teams.length === 0 && !store.currentTeam,
  };
}
