import React from 'react';

export default function Teams() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>
        <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Create Team</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-surface-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg">Team {i}</h3>
              <p className="text-sm text-slate-500 mt-1">A great team building great things.</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm bg-surface-100 px-2 py-1 rounded-md">8 members</span>
              <button className="text-brand-600 text-sm font-medium">View Team</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
