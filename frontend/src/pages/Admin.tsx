import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Shield, Users, MessageSquare, Activity, Database } from 'lucide-react';
import { MetricCard } from '../components/dashboard';

export default function Admin() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-red-600" />
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={<Users />} label="Total Users" value="1,248" trend={{ value: 12, isPositive: true }} />
        <MetricCard icon={<Users />} label="Total Teams" value="156" trend={{ value: 5, isPositive: true }} />
        <MetricCard icon={<MessageSquare />} label="Messages Processed" value="142k" trend={{ value: 24, isPositive: true }} />
        <MetricCard icon={<Activity />} label="Active Today" value="892" trend={{ value: 2, isPositive: false }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-500" /> System Health
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="font-medium">Backend API</span>
              <span className="flex items-center gap-2 text-green-600 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="font-medium">Sentiment NLP Service</span>
              <span className="flex items-center gap-2 text-green-600 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="font-medium">Redis Cache</span>
              <span className="flex items-center gap-2 text-green-600 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg">
              <span className="font-medium">PostgreSQL DB</span>
              <span className="flex items-center gap-2 text-green-600 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-green-500"></span> Operational</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4">Recent Teams</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-50 text-slate-500">
                <tr>
                  <th className="p-3 font-medium rounded-tl-lg">Name</th>
                  <th className="p-3 font-medium">Members</th>
                  <th className="p-3 font-medium">Health</th>
                  <th className="p-3 font-medium rounded-tr-lg">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {[1, 2, 3, 4].map(i => (
                  <tr key={i}>
                    <td className="p-3 font-medium text-slate-900">Engineering Pod {i}</td>
                    <td className="p-3">{4 + i}</td>
                    <td className="p-3"><span className="text-green-600 font-medium">85</span></td>
                    <td className="p-3 text-slate-500">Oct {10 + i}, 2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
