import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight, Lock, Mail, User as UserIcon, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'team_lead' | 'admin'>('employee');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
      await register({ full_name: fullName, email, username, password, role });
      navigate('/dashboard');
    } catch {
      // Handled in store
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-r border-slate-800 text-white overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">TruckHai<span className="text-indigo-400">Jelling</span></span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Privacy-First Architecture
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Join the next generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">intelligent team collaboration</span>.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Experience real-time AI sentiment indicators, team health tracking, and automated team bonding activities with full consent control.
          </p>

          <div className="space-y-2.5 pt-2">
            {[
              'Consent-based AI sentiment diagnostics',
              'Real-time team chat & collaborative task board',
              'Interactive polls, kudos recognition & icebreakers'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          Already have an account? <Link to="/login" className="text-indigo-400 font-semibold hover:underline">Sign in &rarr;</Link>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Create an account</h2>
            <p className="text-slate-400 text-sm mt-2">Get started with your team in seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                  className="w-full bg-slate-800/60 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-800/60 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'employee', label: 'Employee' },
                  { key: 'team_lead', label: 'Team Lead' },
                  { key: 'admin', label: 'Admin' },
                ].map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      role === r.key
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
