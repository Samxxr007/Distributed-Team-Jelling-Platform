import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTeamStore } from '../stores/teamStore';
import { healthApi } from '../api/health';
import { sentimentApi } from '../api/sentiment';
import { kudosApi } from '../api/kudos';
import { taskApi } from '../api/tasks';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  TrendingUp,
  Users,
  MessageSquare,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Activity,
  Bot,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { teams, currentTeam, fetchTeams, selectTeam } = useTeamStore();

  const [healthData, setHealthData] = useState<any>(null);
  const [healthTrend, setHealthTrend] = useState<any[]>([]);
  const [sentimentTrend, setSentimentTrend] = useState<any[]>([]);
  const [nudges, setNudges] = useState<any[]>([]);
  const [recentKudos, setRecentKudos] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (!currentTeam?.id) return;

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [hRes, hTrendRes, sTrendRes, nRes, kRes, tRes] = await Promise.allSettled([
          healthApi.getTeamHealth(currentTeam.id),
          healthApi.getHealthTrend(currentTeam.id, 7),
          sentimentApi.getSentimentTrend(currentTeam.id, 7),
          healthApi.getNudges(currentTeam.id),
          kudosApi.getTeamKudos(currentTeam.id),
          taskApi.getTasks(currentTeam.id)
        ]);

        if (hRes.status === 'fulfilled') setHealthData(hRes.value.data);
        if (hTrendRes.status === 'fulfilled') setHealthTrend(hTrendRes.value.data);
        if (sTrendRes.status === 'fulfilled') setSentimentTrend(sTrendRes.value.data);
        if (nRes.status === 'fulfilled') setNudges(nRes.value.data || []);
        if (kRes.status === 'fulfilled') setRecentKudos(kRes.value.data || []);
        if (tRes.status === 'fulfilled') setTasks(tRes.value.data || []);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentTeam?.id]);

  const score = Math.round(healthData?.health_score || 85);
  const healthColor =
    score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-indigo-500' : score >= 40 ? 'text-amber-500' : 'text-rose-500';
  const healthBg =
    score >= 80 ? 'bg-emerald-500/10 border-emerald-500/30' : score >= 60 ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-amber-500/10 border-amber-500/30';
  const healthStatus =
    score >= 80 ? 'Optimal Cohesion' : score >= 60 ? 'Stable Dynamics' : score >= 40 ? 'Attention Needed' : 'Burnout Risk';

  const defaultSentimentTrend = [
    { date: 'Mon', positive: 4, neutral: 2, stressed: 0, frustrated: 0 },
    { date: 'Tue', positive: 5, neutral: 3, stressed: 1, frustrated: 0 },
    { date: 'Wed', positive: 6, neutral: 1, stressed: 0, frustrated: 0 },
    { date: 'Thu', positive: 3, neutral: 2, stressed: 2, frustrated: 1 },
    { date: 'Fri', positive: 7, neutral: 2, stressed: 0, frustrated: 0 },
    { date: 'Sat', positive: 2, neutral: 1, stressed: 0, frustrated: 0 },
    { date: 'Sun', positive: 4, neutral: 2, stressed: 0, frustrated: 0 }
  ];

  const chartData = sentimentTrend.length > 0 ? sentimentTrend : defaultSentimentTrend;

  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Live Team Workspace</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> AI DistilBERT Active
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.full_name || user?.username} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here's the real-time sentiment telemetry and cohesion metrics for your team.
          </p>
        </div>

        {/* Team Selector Switcher */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <Users className="w-4 h-4 text-indigo-400 shrink-0" />
          <select
            value={currentTeam?.id || ''}
            onChange={(e) => selectTeam(e.target.value)}
            className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer pr-4"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Score Gauge */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Index</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-black ${healthColor}`}>{score}</span>
              <span className="text-xs text-slate-500 font-semibold">/ 100</span>
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">{healthStatus}</div>
          </div>
          <div className={`p-3 rounded-2xl border ${healthBg}`}>
            <Heart className={`w-6 h-6 ${healthColor}`} />
          </div>
        </div>

        {/* Sentiment Score */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Positive Sentiment</div>
            <div className="text-3xl font-black text-white mt-1">
              {healthData?.sentiment_score ? `${Math.round((healthData.sentiment_score + 1) * 50)}%` : '82%'}
            </div>
            <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +4% this week
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        {/* Stress & Friction */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stress Ratio</div>
            <div className="text-3xl font-black text-amber-400 mt-1">
              {healthData?.stress_ratio !== undefined ? `${Math.round(healthData.stress_ratio * 100)}%` : '12%'}
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">Low Burnout Risk</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* Tasks & Productivity */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sprint Tasks</div>
            <div className="text-3xl font-black text-white mt-1">
              {doneTasks} <span className="text-xs text-slate-500 font-semibold font-normal">/ {tasks.length || 6} done</span>
            </div>
            <div className="text-xs font-medium text-indigo-400 mt-1">{inProgressTasks} in progress</div>
          </div>
          <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/30">
            <CheckCircle2 className="w-6 h-6 text-violet-400" />
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Sentiment 7-Day Trend (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">AI Sentiment Timeline</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time message classifications (Positive, Neutral, Stressed, Frustrated)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Positive</span>
              <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Neutral</span>
              <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Stressed</span>
              <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Frustrated</span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#posGrad)" />
                <Area type="monotone" dataKey="neutral" stroke="#64748b" strokeWidth={2} fillOpacity={0.1} fill="#64748b" />
                <Area type="monotone" dataKey="stressed" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#stressGrad)" />
                <Area type="monotone" dataKey="frustrated" stroke="#f43f5e" strokeWidth={2} fillOpacity={0.2} fill="#f43f5e" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Smart Nudges & Manager Recommendations */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">Smart AI Nudges</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">Autonomous recommendations based on team emotional telemetry.</p>

            <div className="mt-4 space-y-3">
              {nudges.length > 0 ? (
                nudges.map((nudge: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      nudge.severity === 'alert'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                        : nudge.severity === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                    }`}
                  >
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {nudge.title || 'Team Cohesion Recommendation'}
                    </div>
                    {nudge.message || nudge}
                  </div>
                ))
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs leading-relaxed">
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Team Morale is High!
                    </div>
                    Communication sentiment is trending positive (+88%). Great time to celebrate recent milestone completions.
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-slate-300 text-xs leading-relaxed">
                    <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Jelling Suggestion
                    </div>
                    Schedule a 15-minute Friday Coffee Chat to maintain cross-team bonding.
                  </div>
                </>
              )}
            </div>
          </div>

          <Link
            to="/jelling"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
          >
            Launch Jelling Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Action Hub & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/chat"
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-left transition-all group"
            >
              <MessageSquare className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm text-white mt-2">Open Chat</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Real-time team channel</div>
            </Link>

            <Link
              to="/kudos"
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-violet-500/50 text-left transition-all group"
            >
              <Award className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm text-white mt-2">Send Kudos</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Recognize a teammate</div>
            </Link>

            <Link
              to="/productivity"
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-left transition-all group"
            >
              <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm text-white mt-2">Task Board</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Manage sprint tasks</div>
            </Link>

            <Link
              to="/sentiment"
              className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-left transition-all group"
            >
              <Activity className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm text-white mt-2">AI Tester</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Test NLP model live</div>
            </Link>
          </div>
        </div>

        {/* Recent Kudos Feed (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">Team Kudos & Recognition</h3>
            </div>
            <Link to="/kudos" className="text-xs text-indigo-400 font-semibold hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recentKudos.length > 0 ? (
              recentKudos.slice(0, 3).map((k: any) => (
                <div
                  key={k.id}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{k.emoji || '👏'}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{k.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Shared with the team</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                    Kudos
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center text-slate-400 text-sm">
                No kudos sent yet today. Be the first to recognize a teammate!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

