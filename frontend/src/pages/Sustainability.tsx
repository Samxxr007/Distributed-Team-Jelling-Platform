import React from 'react';
import { Card } from '../components/ui/Card';
import { Leaf, Cpu, Zap, HardDrive, Server } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Sustainability() {
  const resourceData = [
    { name: 'GPT-4 Scale API', usage: 100 },
    { name: 'Standard NLP Model', usage: 60 },
    { name: 'Jelling (DistilBERT)', usage: 15 },
    { name: 'Jelling w/ Cache', usage: 5 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Leaf className="w-8 h-8 text-green-600" />
        <h1 className="text-2xl font-bold text-slate-900">Green IT & Sustainability</h1>
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <p className="text-green-800 leading-relaxed font-medium">
          Our platform is designed with Green IT principles. Instead of relying on massive, energy-intensive LLMs for simple text classification, we use optimized, task-specific models combined with aggressive caching.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col items-center text-center">
          <HardDrive className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="text-sm font-medium text-slate-500">Model Size</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">250 MB</p>
          <span className="text-xs text-green-600 mt-1">vs GPT-4 ~1TB</span>
        </Card>
        <Card className="flex flex-col items-center text-center">
          <Zap className="w-8 h-8 text-amber-500 mb-3" />
          <h3 className="text-sm font-medium text-slate-500">Avg Inference Time</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">45 ms</p>
          <span className="text-xs text-green-600 mt-1">CPU-optimized</span>
        </Card>
        <Card className="flex flex-col items-center text-center">
          <Database className="w-8 h-8 text-purple-500 mb-3" />
          <h3 className="text-sm font-medium text-slate-500">Requests Cached</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">68 %</p>
          <span className="text-xs text-green-600 mt-1">via Redis</span>
        </Card>
        <Card className="flex flex-col items-center text-center">
          <Server className="w-8 h-8 text-slate-500 mb-3" />
          <h3 className="text-sm font-medium text-slate-500">Container Efficiency</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">High</p>
          <span className="text-xs text-green-600 mt-1">Autoscaling enabled</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="font-bold text-lg mb-6">Estimated Resource Usage (Energy/Req)</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={resourceData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="usage" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-6">Green Practices Checklist</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✅</span>
              <div>
                <strong className="block text-sm text-slate-900">Lightweight DistilBERT model (CPU-only)</strong>
                <span className="text-xs text-slate-500">Avoids expensive GPU energy overhead for simple tasks.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✅</span>
              <div>
                <strong className="block text-sm text-slate-900">Redis caching</strong>
                <span className="text-xs text-slate-500">Reduces redundant inference for common short messages.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✅</span>
              <div>
                <strong className="block text-sm text-slate-900">Container resource limits</strong>
                <span className="text-xs text-slate-500">Prevents memory leaks and CPU waste.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✅</span>
              <div>
                <strong className="block text-sm text-slate-900">Horizontal autoscaling</strong>
                <span className="text-xs text-slate-500">Scales down to minimum replicas when idle at night.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✅</span>
              <div>
                <strong className="block text-sm text-slate-900">Efficient WebSocket</strong>
                <span className="text-xs text-slate-500">Replaces heavy HTTP polling for real-time updates.</span>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      <p className="text-xs text-slate-400 text-center mt-8">
        * Resource estimates based on architecture design. Actual measurements require production deployment profiling.
      </p>
    </div>
  );
}

const Database = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
);
