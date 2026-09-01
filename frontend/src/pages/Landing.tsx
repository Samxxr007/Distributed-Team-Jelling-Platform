import React from 'react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-dark">Jelling Environment</h1>
      <p className="mt-4 text-lg text-slate-600">The Intelligent Collaboration Platform for Distributed Teams</p>
      <div className="mt-8 flex gap-4">
        <a href="/login" className="px-6 py-2 bg-brand-600 text-white rounded-lg">Login</a>
        <a href="/register" className="px-6 py-2 bg-surface border border-surface-200 text-dark rounded-lg">Register</a>
      </div>
    </div>
  );
}
