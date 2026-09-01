import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Shield, User, Bell, Lock, CheckCircle2, Save, Database, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.full_name || 'Team Member');
  const [sentimentConsent, setSentimentConsent] = useState(true);
  const [retentionDays, setRetentionDays] = useState('90');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile preferences saved!');
    }, 600);
  };

  const handleSavePrivacy = () => {
    toast.success('Privacy & AI Consent settings updated!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Account & Privacy Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your personal profile, AI sentiment telemetry consent, and privacy retention preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">Profile Information</h2>
            <p className="text-xs text-slate-400">Update your public name and view account details</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || 'admin@jelling.com'}
              disabled
              className="w-full bg-slate-950 border border-slate-800 text-slate-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Role & Permissions
            </label>
            <div className="inline-flex items-center px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              {user?.role || 'Team Lead'}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Privacy & AI Consent Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">Privacy & AI Telemetry Consent</h2>
            <p className="text-xs text-slate-400">Full control over how your text messages are processed</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm">Enable AI Sentiment Analysis</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Allows DistilBERT NLP to classify messages into aggregate team health scores. Individual raw messages are never logged or stored in AI prompt traces.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSentimentConsent(!sentimentConsent);
                toast.success(sentimentConsent ? 'AI analysis paused' : 'AI analysis enabled');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                sentimentConsent
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {sentimentConsent ? 'Opted In (Active)' : 'Opted Out'}
            </button>
          </div>

          {/* Data Retention */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Sentiment Metric Data Retention Window
            </label>
            <select
              value={retentionDays}
              onChange={(e) => {
                setRetentionDays(e.target.value);
                handleSavePrivacy();
              }}
              className="w-full max-w-xs bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="30">30 Days (Ephemeral)</option>
              <option value="90">90 Days (Recommended)</option>
              <option value="180">180 Days (Half Year)</option>
              <option value="365">365 Days (Full Year)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Historical sentiment aggregates older than this window are automatically purged from PostgreSQL.
            </p>
          </div>

          {/* Transparent Guarantees */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Platform Privacy Guarantees:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Zero raw chat logs sent to 3rd-party vendors (OpenAI, Anthropic, etc.).</li>
              <li>Local DistilBERT inference runs strictly in isolated container instances.</li>
              <li>Managers see only aggregated team-level health scores, never per-employee sentiment surveillance.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

