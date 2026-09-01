// ── Auth ──────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  role: 'employee' | 'team_lead' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Teams ─────────────────────────────────────────────────────────────────────
export interface Team {
  id: string;
  name: string;
  description?: string;
  invite_code: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  health_score?: number;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  user: User;
  role: 'member' | 'lead' | 'admin';
  joined_at: string;
}

// ── Messages ──────────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  team_id?: string;
  sender_id: string;
  recipient_id?: string;
  sender?: User;
  content: string;
  message_type: 'team' | 'direct';
  reply_to_id?: string;
  created_at: string;
  updated_at: string;
  reactions?: MessageReaction[];
  sentiment?: MessageSentiment;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

// ── Sentiment ─────────────────────────────────────────────────────────────────
export type SentimentLabel = 'positive' | 'neutral' | 'stressed' | 'frustrated' | 'negative';

export interface MessageSentiment {
  id: string;
  message_id: string;
  sentiment: SentimentLabel;
  confidence: number;
  model_version: string;
  created_at: string;
}

export interface SentimentSummary {
  positive_count: number;
  neutral_count: number;
  stressed_count: number;
  frustrated_count: number;
  negative_count: number;
  total_analyzed: number;
  positive_ratio: number;
  stressed_ratio: number;
  frustration_ratio: number;
}

export interface SentimentTrendPoint {
  date: string;
  positive: number;
  neutral: number;
  stressed: number;
  frustrated: number;
  negative: number;
  total: number;
}

// ── Team Health ───────────────────────────────────────────────────────────────
export interface TeamHealth {
  id: string;
  team_id: string;
  date: string;
  health_score: number;
  sentiment_score: number;
  engagement_score: number;
  activity_score: number;
  stress_ratio: number;
  frustration_ratio: number;
  message_count: number;
  active_members: number;
  created_at: string;
}

export interface Nudge {
  type: 'info' | 'warning' | 'alert';
  message: string;
  icon: string;
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export interface Task {
  id: string;
  team_id: string;
  created_by: string;
  assigned_to?: string;
  assignee?: User;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// ── Polls ─────────────────────────────────────────────────────────────────────
export interface Poll {
  id: string;
  team_id: string;
  created_by: string;
  question: string;
  options: string[];
  is_active: boolean;
  ends_at?: string;
  created_at: string;
  votes?: PollVote[];
  user_vote?: number;
}

export interface PollVote {
  option_index: number;
  count: number;
}

// ── Kudos ─────────────────────────────────────────────────────────────────────
export interface Kudos {
  id: string;
  team_id: string;
  from_user_id: string;
  to_user_id: string;
  from_user?: User;
  to_user?: User;
  message: string;
  emoji: string;
  created_at: string;
}

// ── Activities ────────────────────────────────────────────────────────────────
export type ActivityType = 'coffee_chat' | 'game' | 'celebration' | 'knowledge_share' | 'icebreaker';

export interface Activity {
  id: string;
  team_id: string;
  created_by: string;
  title: string;
  description?: string;
  activity_type: ActivityType;
  scheduled_at: string;
  created_at: string;
  participants?: User[];
  participant_count?: number;
  is_joined?: boolean;
}

// ── Notifications ─────────────────────────────────────────────────────────────
export type NotificationType = 'message' | 'invite' | 'poll' | 'kudos' | 'activity' | 'nudge' | 'health';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  notification_type: NotificationType;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

// ── Consent ───────────────────────────────────────────────────────────────────
export interface ConsentSettings {
  id: string;
  user_id: string;
  sentiment_analysis_enabled: boolean;
  data_retention_days: number;
  updated_at: string;
}

// ── Productivity ──────────────────────────────────────────────────────────────
export interface ProductivityMetrics {
  tasks_completed: number;
  tasks_pending: number;
  tasks_in_progress: number;
  completion_rate: number;
  collaboration_score: number;
  top_contributors: { user: User; task_count: number }[];
  daily_activity: { date: string; count: number }[];
}

// ── WebSocket Events ──────────────────────────────────────────────────────────
export interface WSEvent {
  type: string;
  data: unknown;
}

export interface IcebreakerQuestion {
  id: string;
  question: string;
  category: string;
}

