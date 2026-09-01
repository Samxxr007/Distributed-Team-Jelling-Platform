import { useState, useEffect, useCallback } from 'react';
import { sentimentApi } from '../api/sentiment';
import { useTeamStore } from '../stores/teamStore';

export function useSentiment(days: number = 7) {
  const { currentTeam } = useTeamStore();
  const [sentimentSummary, setSentimentSummary] = useState<any>(null);
  const [trendData, setTrendData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSentiment = useCallback(async () => {
    if (!currentTeam?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, trendRes] = await Promise.all([
        sentimentApi.getTeamSentiment(currentTeam.id, days),
        sentimentApi.getSentimentTrend(currentTeam.id, days)
      ]);
      setSentimentSummary(summaryRes.data);
      setTrendData(trendRes.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentTeam?.id, days]);

  useEffect(() => {
    fetchSentiment();
  }, [fetchSentiment]);

  return { sentimentSummary, trendData, isLoading, error, refetch: fetchSentiment };
}
