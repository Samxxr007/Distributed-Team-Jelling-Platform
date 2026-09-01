import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface SentimentChartProps {
  data: any[];
  height?: number;
}

export function SentimentChart({ data, height = 300 }: SentimentChartProps) {
  return (
    <Card padding="md">
      <h3 className="text-lg font-semibold text-slate-700 mb-6">Sentiment Over Time</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="positive" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.8} />
            <Area type="monotone" dataKey="neutral" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.8} />
            <Area type="monotone" dataKey="stressed" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.8} />
            <Area type="monotone" dataKey="frustrated" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
            <Area type="monotone" dataKey="negative" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.8} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
