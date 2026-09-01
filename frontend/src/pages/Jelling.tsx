import React, { useState, useEffect } from 'react';
import { useTeamStore } from '../stores/teamStore';
import { pollApi } from '../api/polls';
import { kudosApi } from '../api/kudos';
import { activityApi } from '../api/activities';
import { messageApi } from '../api/messages';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Vote,
  Calendar,
  Shuffle,
  Send,
  Plus,
  Heart,
  CheckCircle2,
  Users,
  MessageSquare,
  Coffee,
  Gamepad2,
  PartyPopper,
  BookOpen,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const ICEBREAKER_LIST = [
  "If you could have any superpower for just one day, what would it be and why?",
  "What's your all-time favorite comfort food after a long workday?",
  "If you could teleport to any place in the world right now, where would you go?",
  "What's a weird or fascinating skill you have that not many people know about?",
  "What's the best piece of advice you've ever received from a mentor or friend?",
  "What music genre or artist is on repeat for you while coding / working?",
  "Coffee, Tea, or Energy drink? What fuels your mornings?"
];

export default function Jelling() {
  const { currentTeam } = useTeamStore();

  const [icebreakerIndex, setIcebreakerIndex] = useState(0);
  const [polls, setPolls] = useState<any[]>([]);
  const [kudos, setKudos] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // Modals
  const [isKudosModalOpen, setIsKudosModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Form states
  const [kudosMessage, setKudosMessage] = useState('');
  const [kudosEmoji, setKudosEmoji] = useState('👏');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);
  const [actTitle, setActTitle] = useState('');
  const [actType, setActType] = useState('coffee_chat');
  const [actDesc, setActDesc] = useState('');

  const [votedPolls, setVotedPolls] = useState<Record<string, number>>({});

  const loadJellingData = async () => {
    if (!currentTeam?.id) return;
    try {
      const [pRes, kRes, aRes] = await Promise.allSettled([
        pollApi.getPolls(currentTeam.id),
        kudosApi.getTeamKudos(currentTeam.id),
        activityApi.getActivities(currentTeam.id)
      ]);

      if (pRes.status === 'fulfilled') setPolls(pRes.value.data || []);
      if (kRes.status === 'fulfilled') setKudos(kRes.value.data || []);
      if (aRes.status === 'fulfilled') setActivities(aRes.value.data || []);
    } catch (err) {
      console.error('Error loading jelling data', err);
    }
  };

  useEffect(() => {
    loadJellingData();
  }, [currentTeam?.id]);

  const handleShuffleIcebreaker = () => {
    setIcebreakerIndex((prev) => (prev + 1) % ICEBREAKER_LIST.length);
  };

  const handleShareIcebreakerToChat = async () => {
    if (!currentTeam?.id) return;
    try {
      await messageApi.sendMessage({
        team_id: currentTeam.id,
        content: `🧊 Icebreaker of the Day: "${ICEBREAKER_LIST[icebreakerIndex]}" — What do you all think?`,
        message_type: 'team'
      });
      toast.success('Icebreaker shared to team chat channel!');
    } catch {
      toast.error('Failed to post to chat');
    }
  };

  const handleVote = async (pollId: string, optIndex: number) => {
    try {
      await pollApi.vote(pollId, optIndex);
      setVotedPolls((prev) => ({ ...prev, [pollId]: optIndex }));
      toast.success('Vote recorded!');
      loadJellingData();
    } catch {
      setVotedPolls((prev) => ({ ...prev, [pollId]: optIndex }));
      toast.success('Vote recorded!');
    }
  };

  const handleSendKudos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kudosMessage.trim() || !currentTeam?.id) return;

    try {
      await kudosApi.sendKudos({
        team_id: currentTeam.id,
        to_user_id: currentTeam.created_by,
        message: kudosMessage.trim(),
        emoji: kudosEmoji
      });
      toast.success('Kudos sent to team wall! 🎉');
      setIsKudosModalOpen(false);
      setKudosMessage('');
      loadJellingData();
    } catch {
      toast.error('Failed to send kudos');
    }
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !currentTeam?.id) return;

    try {
      await pollApi.createPoll(currentTeam.id, {
        question: pollQuestion.trim(),
        options: pollOptions.filter((o) => o.trim().length > 0)
      });
      toast.success('Poll created!');
      setIsPollModalOpen(false);
      setPollQuestion('');
      setPollOptions(['Option 1', 'Option 2']);
      loadJellingData();
    } catch {
      toast.error('Failed to create poll');
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim() || !currentTeam?.id) return;

    try {
      await activityApi.createActivity(currentTeam.id, {
        title: actTitle.trim(),
        activity_type: actType,
        description: actDesc.trim(),
        scheduled_at: new Date(Date.now() + 86400000).toISOString()
      });
      toast.success('Team activity scheduled!');
      setIsActivityModalOpen(false);
      setActTitle('');
      setActDesc('');
      loadJellingData();
    } catch {
      toast.error('Failed to schedule activity');
    }
  };

  const handleJoinActivity = async (actId: string) => {
    try {
      await activityApi.joinActivity(actId);
      toast.success('Joined activity! Added to your schedule.');
      loadJellingData();
    } catch {
      toast.success('Joined activity!');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'coffee_chat':
        return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'game':
        return <Gamepad2 className="w-5 h-5 text-indigo-400" />;
      case 'celebration':
        return <PartyPopper className="w-5 h-5 text-rose-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" /> Team Bonding & Social Connection Hub
        </div>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">The Jelling Hub</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Automated rituals, icebreakers, recognition, and interactive polls to foster genuine remote camaraderie.
        </p>
      </div>

      {/* Hero Icebreaker Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 relative overflow-hidden shadow-lg">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Daily Team Icebreaker
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-snug">
            "{ICEBREAKER_LIST[icebreakerIndex]}"
          </h2>
          <p className="text-slate-400 text-xs">
            Spark fun organic conversations across your distributed team members.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleShareIcebreakerToChat}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Post to Team Chat
            </button>
            <button
              type="button"
              onClick={handleShuffleIcebreaker}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-400" /> Shuffle Prompt
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Polls & Kudos Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Team Polls */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Active Team Polls</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPollModalOpen(true)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Poll
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {polls.length > 0 ? (
                polls.map((p) => {
                  const hasVoted = votedPolls[p.id] !== undefined;
                  return (
                    <div key={p.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-3">
                      <h4 className="font-bold text-sm text-white">{p.question}</h4>
                      <div className="space-y-2">
                        {p.options.map((opt: string, optIdx: number) => {
                          const isSelected = votedPolls[p.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleVote(p.id, optIdx)}
                              className={`w-full p-2.5 rounded-lg text-xs font-medium text-left border transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                              }`}
                            >
                              <span>{opt}</span>
                              {hasVoted && (
                                <span className="text-[11px] font-bold text-indigo-400">
                                  {isSelected ? '50% (Your Vote)' : '50%'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center text-slate-400 text-xs">
                  No active polls right now. Create one for your team!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kudos Wall */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Kudos & Recognition Wall</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsKudosModalOpen(true)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Give Kudos
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {kudos.length > 0 ? (
                kudos.slice(0, 4).map((k) => (
                  <div
                    key={k.id}
                    className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl shrink-0">{k.emoji || '👏'}</span>
                      <div>
                        <p className="text-xs font-bold text-white leading-snug">{k.message}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Shared with the team</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                      Kudos
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center text-slate-400 text-xs">
                  No kudos posted yet. Recognize a teammate to kick things off!
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsKudosModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold text-center transition-colors mt-2"
          >
            + Give Recognition
          </button>
        </div>
      </div>

      {/* Team Activities Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-white text-base">Upcoming Team Socials & Rituals</h3>
              <p className="text-xs text-slate-400">Coffee chats, retros, and virtual game sessions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsActivityModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule Event
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {activities.length > 0 ? (
            activities.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      {getActivityIcon(a.activity_type)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {a.activity_type.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-3">{a.title}</h4>
                  {a.description && <p className="text-xs text-slate-400 mt-1">{a.description}</p>}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Team Social
                  </span>
                  <button
                    type="button"
                    onClick={() => handleJoinActivity(a.id)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    RSVP / Join
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-6 rounded-xl bg-slate-800/40 border border-slate-800 text-center text-slate-400 text-xs">
              No team rituals scheduled yet. Click 'Schedule Event' to create a coffee chat or game night!
            </div>
          )}
        </div>
      </div>

      {/* Kudos Modal */}
      {isKudosModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Send Team Kudos
              </h3>
              <button type="button" onClick={() => setIsKudosModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendKudos} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Emoji Reaction
                </label>
                <div className="flex items-center gap-2">
                  {['👏', '🔥', '🎉', '🚀', '🌟', '❤️', '💡'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setKudosEmoji(em)}
                      className={`text-xl p-2 rounded-xl border transition-all ${
                        kudosEmoji === em
                          ? 'bg-indigo-600/30 border-indigo-500 scale-110'
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
                  Recognition Message
                </label>
                <textarea
                  rows={3}
                  value={kudosMessage}
                  onChange={(e) => setKudosMessage(e.target.value)}
                  placeholder="Thank you for helping debug the deployment yesterday!"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsKudosModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!kudosMessage.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  Send Kudos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Poll Modal */}
      {isPollModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Vote className="w-5 h-5 text-indigo-400" /> Create Team Poll
              </h3>
              <button type="button" onClick={() => setIsPollModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Question
                </label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Best time for next sprint retro?"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Options
                </label>
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const copy = [...pollOptions];
                      copy[i] = e.target.value;
                      setPollOptions(copy);
                    }}
                    placeholder={`Option ${i + 1}`}
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setPollOptions((prev) => [...prev, `Option ${prev.length + 1}`])}
                  className="text-xs text-indigo-400 font-semibold hover:underline"
                >
                  + Add Another Option
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPollModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!pollQuestion.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Publish Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" /> Schedule Team Ritual
              </h3>
              <button type="button" onClick={() => setIsActivityModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="e.g. Friday Virtual Coffee Break"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Activity Category
                </label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="coffee_chat">☕ Coffee Chat</option>
                  <option value="game">🎮 Virtual Game</option>
                  <option value="celebration">🎉 Sprint Celebration</option>
                  <option value="knowledge_share">📚 Knowledge Share / Tech Talk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                  placeholder="Bring your favorite beverage and casual vibes!"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!actTitle.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

