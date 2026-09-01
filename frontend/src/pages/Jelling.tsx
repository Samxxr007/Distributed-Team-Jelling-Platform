import React from 'react';

export default function Jelling() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Jelling Hub</h1>
      <div className="bg-gradient-to-r from-brand-500 to-brand-700 p-8 rounded-xl text-white mb-8 shadow-sm">
        <h2 className="text-2xl font-bold">Icebreaker of the Day</h2>
        <p className="text-lg mt-2 opacity-90">If you could have any superpower, what would it be and why?</p>
        <button className="mt-4 bg-white text-brand-700 px-4 py-2 rounded-lg text-sm font-medium">Answer in Chat</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-surface-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Recent Kudos</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-lg">🎉</div>
              <div>
                <p className="text-sm font-medium"><span className="font-bold">John</span> gave kudos to <span className="font-bold">Alice</span></p>
                <p className="text-xs text-slate-500">"Great job on the presentation!"</p>
              </div>
            </div>
          </div>
          <button className="mt-4 text-brand-600 text-sm font-medium hover:underline">View all Kudos</button>
        </div>
        
        <div className="bg-surface border border-surface-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Active Polls</h3>
          <div className="p-4 bg-surface-50 rounded-lg border border-surface-100">
            <h4 className="font-medium text-sm mb-3">Where should we go for the retreat?</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="poll" /> Mountains</label>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="poll" /> Beach</label>
            </div>
            <button className="mt-4 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm w-full">Vote</button>
          </div>
        </div>
      </div>
    </div>
  );
}
