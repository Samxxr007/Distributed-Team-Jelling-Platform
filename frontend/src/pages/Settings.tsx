import React from 'react';

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-surface border border-surface-200 rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="p-4 border-b border-surface-200 bg-surface-50">
          <h2 className="font-bold text-dark">Profile Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input type="text" defaultValue="Sameer G" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" defaultValue="user@example.com" className="w-full px-3 py-2 border rounded-lg bg-surface-50" readOnly />
          </div>
          <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Save Changes</button>
        </div>
      </div>

      <div className="bg-surface border border-surface-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-surface-200 bg-brand-50 flex items-center gap-2">
          <span className="text-brand-600">🛡️</span>
          <h2 className="font-bold text-dark">Privacy & AI Analysis</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable AI Sentiment Analysis</h3>
              <p className="text-sm text-slate-500 mt-1">Allow AI to analyze your messages for team health metrics.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
