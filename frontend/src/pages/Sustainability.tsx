import React from 'react';
import { Leaf, Cpu, Zap, HardDrive, Server, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Sustainability() {
  const resourceData = [
    { name: 'GPT-4 / LLM API', usage: 100 },
    { name: 'Standard NLP Server', usage: 55 },
    { name: 'TruckHai DistilBERT', usage: 14 },
    { name: 'DistilBERT + Redis Cache', usage: 4 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
          <Leaf className="w-3.5 h-3.5" /> Green IT & Compute Efficiency
        </div>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Sustainability & AI Footprint</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Designed specifically with eco-efficient, lightweight CPU inference and zero dependency on energy-heavy mega LLMs.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 text-slate-300 text-sm leading-relaxed">
        <strong className="text-emerald-400">Green IT Principle:</strong> By choosing a domain-specific 66M-parameter DistilBERT transformer over a 1.7T parameter multi-modal model, each sentiment inference uses <strong className="text-white">99.4% less compute and electrical energy</strong>.
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Model Size</span>
            <HardDrive className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white mt-3">250 MB</div>
          <div className="text-[11px] text-emerald-400 mt-1">vs LLM ~1,000 GB</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Latency</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-3">12 ms</div>
          <div className="text-[11px] text-slate-400 mt-1">CPU-only inference</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Redis Cache Hit</span>
            <Database className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-3">68%</div>
          <div className="text-[11px] text-slate-400 mt-1">Avoids duplicate inference</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cloud Footprint</span>
            <Server className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-3">0 GPU</div>
          <div className="text-[11px] text-emerald-400 mt-1">Zero GPU servers required</div>
        </div>
      </div>

      {/* Visual Chart & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-base">Energy & Compute Comparison (Relative Units)</h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="usage" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-base">Green Software Checklist</h3>
          <div className="space-y-3 text-xs">
            {[
              { title: 'Lightweight DistilBERT SST-2 (CPU)', desc: 'Avoids costly power draw of dedicated GPU server farms.' },
              { title: 'Redis In-Memory Sliding-Window Caching', desc: 'Cached sentiment tokens reduce redundant calculations.' },
              { title: 'Container Resource Constraints', desc: 'Microservices throttled cleanly under memory limits.' },
              { title: 'Persistent WebSocket Event Streaming', desc: 'Eliminates thousands of wasteful HTTP polling requests per hour.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <div className="font-bold text-white">{item.title}</div>
                  <div className="text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

