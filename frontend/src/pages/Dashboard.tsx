import React from 'react';
import { useAuthStore } from '../stores/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.full_name || user?.username} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-surface-200">
          <h3 className="text-lg font-semibold text-slate-700">Team Health</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">85/100</p>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-surface-200">
          <h3 className="text-lg font-semibold text-slate-700">Positive Sentiment</h3>
          <p className="text-3xl font-bold text-brand-500 mt-2">72%</p>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-surface-200">
          <h3 className="text-lg font-semibold text-slate-700">Active Tasks</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">14</p>
        </div>
      </div>
    </div>
  );
}
