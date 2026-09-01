import React from 'react';

export default function TeamHealth() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Team Health Dashboard</h1>
      <div className="bg-surface p-6 rounded-xl border border-surface-200 shadow-sm mb-6">
        <h2 className="text-lg font-bold mb-4">Overall Score</h2>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center text-3xl font-bold text-green-600">
            85
          </div>
          <div>
            <h3 className="font-semibold text-lg text-green-600">Healthy</h3>
            <p className="text-slate-500 text-sm mt-1">Your team is doing well. Communication is positive and steady.</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-xl border border-surface-200 shadow-sm">
          <h3 className="font-semibold text-slate-600">Engagement</h3>
          <p className="text-2xl font-bold mt-2">High</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-surface-200 shadow-sm">
          <h3 className="font-semibold text-slate-600">Stress Level</h3>
          <p className="text-2xl font-bold text-orange-500 mt-2">Low</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-surface-200 shadow-sm">
          <h3 className="font-semibold text-slate-600">Sentiment</h3>
          <p className="text-2xl font-bold text-brand-500 mt-2">Positive</p>
        </div>
      </div>
    </div>
  );
}
