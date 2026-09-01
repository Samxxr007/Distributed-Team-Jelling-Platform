import React, { useState, useEffect } from 'react';
import { useTeamStore } from '../stores/teamStore';
import { kudosApi } from '../api/kudos';
import { Award, Plus, Heart, Sparkles, X, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Kudos() {
  const { currentTeam } = useTeamStore();
  const [kudos, setKudos] = useState<any[]>([]);
  const [tab, setTab] = useState<'all' | 'received' | 'sent'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('👏');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadKudos = async () => {
    if (!currentTeam?.id) return;
    try {
      const res = await kudosApi.getTeamKudos(currentTeam.id);
      setKudos(res.data || []);
    } catch (err) {
      console.error('Failed to load kudos', err);
    }
  };

  useEffect(() => {
    loadKudos();
  }, [currentTeam?.id]);

  const handleSendKudos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentTeam?.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await kudosApi.sendKudos({
        team_id: currentTeam.id,
        to_user_id: currentTeam.created_by,
        message: message.trim(),
        emoji
      });
      setKudos((prev) => [res.data, ...prev]);
      toast.success('Kudos sent to team wall! 🎉');
      setIsModalOpen(false);
      setMessage('');
    } catch {
      toast.error('Failed to send kudos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Award className="w-3.5 h-3.5" /> Peer Recognition & Gratitude
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Team Kudos Wall</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Celebrate wins, thank teammates, and foster psychological safety across your team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 text-xs flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Send Kudos
        </button>
      </div>

      {/* Kudos Cards Masonry / Grid */}
      {kudos.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto text-2xl">
            🏆
          </div>
          <div>
            <h3 className="font-bold text-white text-base">No Kudos Given Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Be the first to recognize a colleague for their help, code review, or milestone delivery!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Give First Kudos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kudos.map((k) => (
            <div
              key={k.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-800 border border-slate-700">{k.emoji || '👏'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Recognition
                </span>
              </div>

              <p className="text-sm font-semibold text-white leading-relaxed">{k.message}</p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>To: <strong className="text-slate-200">Team Member</strong></span>
                <span className="text-[10px] text-slate-500">
                  {k.created_at ? new Date(k.created_at).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Kudos Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Send Team Kudos
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendKudos} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Pick An Emoji
                </label>
                <div className="flex items-center gap-2">
                  {['👏', '🔥', '🎉', '🚀', '🌟', '❤️', '💡'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className={`text-xl p-2 rounded-xl border transition-all ${
                        emoji === em
                          ? 'bg-amber-500/20 border-amber-500 scale-110'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Thank you for helping resolve that critical production issue!"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  disabled={isSubmitting || !message.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Kudos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

