import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTeamStore } from '../stores/teamStore';
import { messageApi } from '../api/messages';
import { useWebSocket } from '../hooks/useWebSocket';
import {
  Send,
  Sparkles,
  Users,
  Smile,
  Hash,
  Shield,
  Circle,
  MessageSquare,
  Flame,
  ThumbsUp,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Chat() {
  const { user } = useAuthStore();
  const { teams, currentTeam, selectTeam, fetchTeams } = useTeamStore();

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'team' | 'ai-insights'>('team');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Connect WebSocket to active team channel
  const { send: sendWs, isConnected } = useWebSocket(currentTeam?.id || null);

  // Load message history whenever selected team changes
  const loadMessages = async () => {
    if (!currentTeam?.id) return;
    try {
      const res = await messageApi.getMessages(currentTeam.id, { limit: 50 });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to load team messages', err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [currentTeam?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentTeam?.id || isSending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const res = await messageApi.sendMessage({
        team_id: currentTeam.id,
        content: textToSend,
        message_type: 'team'
      });

      // Append locally if not already present
      setMessages((prev) => {
        if (prev.some((m) => m.id === res.data.id)) return prev;
        return [...prev, res.data];
      });
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      await messageApi.addReaction(messageId, emoji);
      toast.success(`Reaction ${emoji} added!`);
    } catch {
      // Ignored
    }
  };

  const getSentimentPill = (sentiment?: string, confidence?: number) => {
    if (!sentiment) return null;
    const confText = confidence ? ` (${Math.round(confidence * 100)}%)` : '';

    switch (sentiment.toLowerCase()) {
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Positive{confText}
          </span>
        );
      case 'stressed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Stressed{confText}
          </span>
        );
      case 'frustrated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Frustrated{confText}
          </span>
        );
      case 'negative':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/10 border border-red-500/30 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Negative{confText}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-700/50 border border-slate-600 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Neutral
          </span>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex rounded-2xl bg-slate-900 border border-slate-800 shadow-sm overflow-hidden">
      {/* Left Channels & Team Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Team Channels</div>
            <div className="space-y-1">
              {teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTeam(t.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTeam?.id === t.id
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">{t.name}</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Direct Teammates</div>
            <div className="space-y-1 text-xs">
              {['Alice Johnson (Lead)', 'Bob Smith', 'Carol Davis', 'Dave Wilson'].map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="truncate">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Privacy Disclaimer Pill */}
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" /> Sentiment Telemetry
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Messages are analyzed in real-time to compute team cohesion metrics.
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between bg-slate-900 overflow-hidden">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base tracking-tight">{currentTeam?.name || 'General Channel'}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" /> Live Stream Connected
                </span>
                <span>•</span>
                <span>{messages.length} messages</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Sentiment Enabled
            </span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-slate-500">
              <MessageSquare className="w-12 h-12 text-slate-600" />
              <div className="text-base font-bold text-slate-300">No messages in this channel yet</div>
              <p className="text-xs max-w-sm">Say hello or share a project update to see real-time AI sentiment analysis in action!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              const senderName = msg.sender_name || (isMe ? 'You' : 'Teammate');

              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group`}>
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                      isMe ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white' : 'bg-slate-800 border border-slate-700 text-indigo-300'
                    }`}
                  >
                    {senderName.charAt(0).toUpperCase()}
                  </div>

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-300">{senderName}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                          : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-sm'
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>

                    {/* AI Sentiment Badge Tag */}
                    <div className="mt-1 flex items-center gap-2">
                      {getSentimentPill(msg.sentiment, msg.sentiment_confidence)}

                      {/* Quick Emoji Reactions */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleAddReaction(msg.id, '👏')}
                          className="hover:scale-125 transition-transform text-xs"
                          title="Clap"
                        >
                          👏
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddReaction(msg.id, '🔥')}
                          className="hover:scale-125 transition-transform text-xs"
                          title="Fire"
                        >
                          🔥
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddReaction(msg.id, '❤️')}
                          className="hover:scale-125 transition-transform text-xs"
                          title="Love"
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${currentTeam?.name || 'team'} (AI sentiment analyzed)...`}
              className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="p-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all disabled:opacity-40"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

