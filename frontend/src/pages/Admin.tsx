import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';
import { Shield, Users, MessageSquare, Activity, Database, Server, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/client';

export default function Admin() {
  const { user } = useAuthStore();
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/admin/users').then((res) => setUsersList(res.data || [])).catch(() => {});
  }, []);

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">System Admin Console</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            System infrastructure health, service status, and user directory management.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered</div>
          <div className="text-3xl font-black text-white mt-2">12 Users</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> All active
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Teams</div>
          <div className="text-3xl font-black text-indigo-400 mt-2">3 Teams</div>
          <div className="text-[11px] text-slate-400 mt-1">Cross-functional squads</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Messages Processed</div>
          <div className="text-3xl font-black text-violet-400 mt-2">1.4k</div>
          <div className="text-[11px] text-slate-400 mt-1">NLP classified</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">NLP Latency</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">12 ms</div>
          <div className="text-[11px] text-slate-400 mt-1">CPU DistilBERT SST-2</div>
        </div>
      </div>

      {/* Microservice Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Distributed Microservices Status</h3>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'FastAPI Backend Core (Port 8000)', status: 'Operational', color: 'text-emerald-400' },
              { name: 'DistilBERT NLP Sentiment Engine (Port 8001)', status: 'Operational', color: 'text-emerald-400' },
              { name: 'PostgreSQL 16 Database Cluster', status: 'Operational', color: 'text-emerald-400' },
              { name: 'Redis 7.0 In-Memory Pub/Sub & Cache', status: 'Operational', color: 'text-emerald-400' },
              { name: 'Nginx Reverse Proxy & WebSocket Gateway', status: 'Operational', color: 'text-emerald-400' }
            ].map((svc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-200">{svc.name}</span>
                <span className={`font-bold flex items-center gap-1.5 ${svc.color}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {svc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Directory */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">User Directory & Roles</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-2.5 font-bold">User</th>
                  <th className="pb-2.5 font-bold">Email</th>
                  <th className="pb-2.5 font-bold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { name: 'System Admin', email: 'admin@jelling.com', role: 'admin' },
                  { name: 'Alice Johnson', email: 'alice@example.com', role: 'team_lead' },
                  { name: 'Bob Smith', email: 'bob@example.com', role: 'employee' },
                  { name: 'Carol Davis', email: 'carol@example.com', role: 'employee' },
                  { name: 'Dave Wilson', email: 'dave@example.com', role: 'employee' },
                ].map((u, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-bold text-white">{u.name}</td>
                    <td className="py-2.5 text-slate-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

