import { formatDistanceToNow, format, parseISO } from 'date-fns';

export function formatRelativeTime(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function formatTime(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm');
}

export function formatHealthScore(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Healthy', color: 'text-green-500' };
  if (score >= 60) return { label: 'Stable', color: 'text-blue-500' };
  if (score >= 40) return { label: 'Needs Attention', color: 'text-amber-500' };
  return { label: 'Critical', color: 'text-red-500' };
}

export function formatSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'positive': return 'bg-green-500';
    case 'neutral': return 'bg-slate-400';
    case 'stressed': return 'bg-orange-500';
    case 'frustrated': return 'bg-red-400';
    case 'negative': return 'bg-red-600';
    default: return 'bg-slate-300';
  }
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}
