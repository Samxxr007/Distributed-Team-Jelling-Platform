import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Heart, Users, ArrowRight, Eye, EyeOff, Lock, Mail, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (loginEmail: string, loginPass: string) => {
    try {
      await login(loginEmail, loginPass);
      navigate('/dashboard');
    } catch {
      // toast error handled in store
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const demoAccounts = [
    {
      role: 'Admin',
      name: 'System Admin',
      email: 'admin@jelling.com',
      password: 'password123',
      color: 'border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-700',
      badge: 'Full Access'
    },
    {
      role: 'Team Lead',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      color: 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700',
      badge: 'Lead & Analytics'
    },
    {
      role: 'Employee',
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'password123',
      color: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700',
      badge: 'Team Member'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Branding Column */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-r border-slate-800 text-white overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">TruckHai<span className="text-indigo-400">Jelling</span></span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> AI-Powered Collaboration Platform
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Help your distributed team <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">connect, gel, and thrive</span>.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Move beyond standard chat tools with real-time DistilBERT sentiment diagnostics, team health metrics, and automated bonding activities.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { icon: <Heart className="w-4 h-4 text-emerald-400" />, text: 'Team health scoring & burnout indicators' },
              { icon: <Sparkles className="w-4 h-4 text-indigo-400" />, text: 'Real-time NLP sentiment analysis on messages' },
              { icon: <Users className="w-4 h-4 text-violet-400" />, text: 'Automated icebreakers, kudos, & smart manager nudges' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="p-1 rounded-lg bg-slate-800/80 border border-slate-700">{item.icon}</div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          Capstone Project — Distributed Software Teams Jelling Environment
        </div>
      </div>

      {/* Right Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Sign in</h2>
            <p className="text-slate-400 text-sm mt-2">
              Enter your credentials or click any demo account below for instant access.
            </p>
          </div>

          {/* 1-Click Demo Accounts */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Quick 1-Click Demo Logins</span>
              <span className="text-indigo-400">Instant Access</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword(acc.password);
                    handleLogin(acc.email, acc.password);
                  }}
                  disabled={isLoading}
                  className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 transition-all text-left group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors block truncate">{acc.role}</span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">{acc.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-400 mt-2 block">1-Click &rarr;</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-xs text-slate-500 uppercase font-medium">Or sign in manually</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jelling.com"
                  required
                  className="w-full bg-slate-800/60 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-800/60 border border-slate-700 text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

