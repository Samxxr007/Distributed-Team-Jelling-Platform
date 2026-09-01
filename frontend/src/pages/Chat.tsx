import React from 'react';

export default function Chat() {
  return (
    <div className="flex h-full bg-surface border border-surface-200 rounded-xl overflow-hidden">
      <div className="w-1/4 border-r border-surface-200 p-4">
        <h2 className="font-bold text-lg mb-4">Teams</h2>
        <div className="space-y-2">
          <div className="p-3 bg-brand-50 text-brand-700 rounded-lg cursor-pointer font-medium">Engineering</div>
          <div className="p-3 hover:bg-surface-50 text-slate-700 rounded-lg cursor-pointer">Design</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-surface-200 shadow-sm flex items-center justify-between">
          <h3 className="font-bold">Engineering</h3>
          <span className="text-xs text-slate-500">3 online</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-200 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold">Alice <span className="text-xs font-normal text-slate-500">10:42 AM</span></div>
              <div className="bg-surface-100 p-3 rounded-lg rounded-tl-none mt-1 text-sm inline-block">Hey team, how's the sprint going?</div>
            </div>
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex-shrink-0" />
            <div className="flex flex-col items-end">
              <div className="text-sm font-bold"><span className="text-xs font-normal text-slate-500">10:45 AM</span> You</div>
              <div className="bg-brand-500 text-white p-3 rounded-lg rounded-tr-none mt-1 text-sm inline-block">Going well! Just finishing up the frontend.</div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-surface-200">
          <input type="text" placeholder="Type a message..." className="w-full bg-surface-50 border border-surface-200 rounded-lg px-4 py-2 focus:outline-brand-500" />
        </div>
      </div>
    </div>
  );
}
