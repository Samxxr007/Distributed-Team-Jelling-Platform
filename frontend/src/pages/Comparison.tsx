import React from 'react';
import { Check, X, Sparkles, Brain, Heart, Lightbulb, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Comparison() {
  const features = [
    { name: 'Real-time Team Chat', standard: 'check', jelling: 'check' },
    { name: 'Video & Screen Sharing Integration', standard: 'check', jelling: 'limited', note: 'Roadmap' },
    { name: 'DistilBERT Real-time Sentiment Telemetry', standard: 'cross', jelling: 'check', note: 'Edge NLP' },
    { name: 'Multi-Factor Team Health Diagnostics', standard: 'cross', jelling: 'check', note: 'Continuous' },
    { name: 'Built-in Jelling & Rituals (Icebreakers, Socials)', standard: 'limited', jelling: 'check', note: 'Automated' },
    { name: 'Smart AI Manager Nudges & Burnout Detection', standard: 'cross', jelling: 'check', note: 'Heuristic' },
    { name: 'Team Productivity & Kanban Throughput', standard: 'limited', jelling: 'check' },
    { name: 'Privacy-First Aggregated Consent Controls', standard: 'cross', jelling: 'check', note: '100% Opt-In' },
    { name: 'Zero GPU/Cloud API Cost (CPU-Optimized)', standard: 'cross', jelling: 'check', note: 'Green IT' },
  ];

  const renderIcon = (status: string, note?: string) => {
    if (status === 'check')
      return (
        <div className="flex flex-col items-center">
          <Check className="w-5 h-5 text-emerald-400" />
          {note && <span className="text-[10px] text-emerald-400 font-bold mt-0.5">{note}</span>}
        </div>
      );
    if (status === 'cross') return <X className="w-5 h-5 text-rose-500 mx-auto" />;
    if (status === 'limited')
      return (
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Limited</span>
          {note && <span className="text-[10px] text-amber-400 mt-0.5">{note}</span>}
        </div>
      );
    return null;
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Architectural Comparison
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Jelling vs Standard Collaboration Tools
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Standard tools optimize for message frequency. <strong className="text-slate-200">Jelling Environment</strong> detects emotional friction, prevents burnout, and builds true team alignment.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-xs uppercase tracking-wider">
                <th className="p-5 font-bold text-slate-300 w-1/3">Capability</th>
                <th className="p-5 font-bold text-slate-400 text-center w-1/3 border-l border-slate-800">
                  Slack / MS Teams / Zoom
                </th>
                <th className="p-5 font-bold text-indigo-400 text-center w-1/3 border-l border-slate-800 bg-indigo-950/30">
                  TruckHai Jelling Platform
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {features.map((f, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-200">{f.name}</td>
                  <td className="p-4 border-l border-slate-800 align-middle text-center">
                    {renderIcon(f.standard)}
                  </td>
                  <td className="p-4 border-l border-slate-800 bg-indigo-950/10 align-middle text-center">
                    {renderIcon(f.jelling, f.note)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Continuous Sentiment Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Understand team morale in real time without annoying survey spam or micromanagement.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Algorithmic Health Scoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-factor composite scoring combining sentiment, engagement, and inverse stress indicators.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Automated Manager Nudges</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Smart recommendations suggest retrospective sessions, coffee breaks, or kudos when friction occurs.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 text-sm transition-all"
        >
          <span>Go to Team Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

