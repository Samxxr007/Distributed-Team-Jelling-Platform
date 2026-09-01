import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Activity, Shield, TrendingUp, MessageSquare, ArrowRight, Check, Zap, Users, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">TruckHai<span className="text-indigo-400">Jelling</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#comparison" className="hover:text-white transition-colors">Vs Standard Tools</a>
            <a href="#architecture" className="hover:text-white transition-colors">AI Intelligence</a>
            <Link to="/comparison" className="hover:text-white transition-colors">Feature Matrix</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/20 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Continuous Team Cohesion & AI Health Scoring
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Where Distributed Teams <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">
              Actually "Jell" & Succeed
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed font-normal">
            Standard communication tools measure activity. <strong className="text-slate-200">Jelling Environment</strong> detects morale trends, burnout risk, and sentiment shifts in real time using edge-optimized DistilBERT transformers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-base"
            >
              Launch Live Workspace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/comparison"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold rounded-2xl transition-all text-base"
            >
              Explore Feature Matrix
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            {[
              { label: 'Team Health Index', val: '85/100', sub: 'Calculated in Real-Time', color: 'text-emerald-400' },
              { label: 'NLP Model Footprint', val: '<250 MB', sub: 'DistilBERT SST-2', color: 'text-indigo-400' },
              { label: 'Sentiment Classifications', val: '5 Labels', sub: 'Positive / Frustrated / Stressed', color: 'text-violet-400' },
              { label: 'Data Privacy', val: '100% Opt-In', sub: 'Aggregated Metrics Only', color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left">
                <div className={`text-2xl font-black ${stat.color}`}>{stat.val}</div>
                <div className="text-xs font-semibold text-white mt-1">{stat.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars / Features */}
      <section id="features" className="py-24 px-6 bg-slate-900/50 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Beyond Ordinary Chat</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              The 3 Pillars of a High-Performing Remote Team
            </h2>
            <p className="text-slate-400 text-sm">
              Engineered specifically to solve remote isolation, missed burnout signals, and fragmented communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">1. AI Sentiment Telemetry</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                DistilBERT processes incoming team messages into 5 fine-grained emotional states. Understand team sentiment trajectories before small frustrations turn into turnover.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">2. Multi-Factor Health Score</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Combines sentiment scores, active engagement ratios, velocity indicators, and stress signals into a single, intuitive 0–100 Team Health score with smart manager nudges.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">3. Active "Jelling" Tools</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automated icebreaker prompts, live interactive polls, peer recognition kudos boards, and virtual game/coffee sessions designed to build genuine camaraderie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-indigo-950/30 border border-indigo-500/20 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Ready to elevate your distributed team?
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto">
              Sign in with one click or create your team workspace right now.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-3.5 bg-white hover:bg-slate-100 text-indigo-950 font-bold rounded-xl shadow-lg transition-all text-sm"
              >
                Launch Demo Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

