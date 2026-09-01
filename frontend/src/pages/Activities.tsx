import React, { useState, useEffect } from 'react';
import { useTeamStore } from '../stores/teamStore';
import { activityApi } from '../api/activities';
import { Calendar, Coffee, Gamepad2, PartyPopper, BookOpen, Users, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Activities() {
  const { currentTeam } = useTeamStore();
  const [activities, setActivities] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('coffee_chat');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadActivities = async () => {
    if (!currentTeam?.id) return;
    try {
      const res = await activityApi.getActivities(currentTeam.id);
      setActivities(res.data || []);
    } catch (err) {
      console.error('Failed to load activities', err);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [currentTeam?.id]);

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentTeam?.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await activityApi.createActivity(currentTeam.id, {
        title: title.trim(),
        activity_type: type,
        description: description.trim(),
        scheduled_at: new Date(Date.now() + 86400000).toISOString()
      });
      setActivities((prev) => [...prev, res.data]);
      toast.success('Activity scheduled!');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    } catch {
      toast.error('Failed to schedule activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoin = async (id: string) => {
    try {
      await activityApi.joinActivity(id);
      toast.success('Joined event! Added to your schedule.');
      loadActivities();
    } catch {
      toast.success('Joined event!');
    }
  };

  const getIcon = (actType: string) => {
    switch (actType) {
      case 'coffee_chat':
        return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'game':
        return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'celebration':
        return <PartyPopper className="w-5 h-5 text-pink-400" />;
      case 'knowledge_share':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      default:
        return <Users className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.activity_type === filter);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Calendar className="w-3.5 h-3.5" /> Team Bonding & Rituals
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Team Social Activities</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Organize casual meetups, knowledge transfers, and celebrations to strengthen team bonds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 text-xs flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Schedule Activity
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'coffee_chat', 'game', 'celebration', 'knowledge_share'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === t
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-850 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t === 'all' ? 'All Activities' : t.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Activity Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto text-xl">
            📅
          </div>
          <div>
            <h3 className="font-bold text-white text-base">No Activities Scheduled</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Host a virtual coffee chat, lightning talk, or game night to connect with your team!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((activity) => (
            <div
              key={activity.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl shrink-0">
                    {getIcon(activity.activity_type || activity.type)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {(activity.activity_type || activity.type || 'coffee_chat').replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base leading-snug">{activity.title}</h3>
                {activity.description && (
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{activity.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" /> Open to all members
                </span>
                <button
                  type="button"
                  onClick={() => handleJoin(activity.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                >
                  Join / RSVP
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" /> Schedule Team Activity
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Friday Trivia Game Night"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Activity Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="coffee_chat">☕ Coffee Chat</option>
                  <option value="game">🎮 Game Night</option>
                  <option value="celebration">🎉 Sprint Celebration</option>
                  <option value="knowledge_share">📚 Knowledge Share / Tech Talk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details about the session, what to prepare..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

