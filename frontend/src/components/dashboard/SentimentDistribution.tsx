import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';

interface SentimentDistributionProps {
  data: { name: string; value: number }[];
}

const COLORS = {
  Positive: '#22c55e',
  Neutral: '#94a3b8',
  Stressed: '#f97316',
  Frustrated: '#ef4444',
  Negative: '#dc2626'
};

export function SentimentDistribution({ data }: SentimentDistributionProps) {
  return (
    <Card padding="md">
      <h3 className="text-lg font-semibold text-slate-700 mb-6">Distribution</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map(item => (
          <div key={item.name} className="flex items-center text-sm">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }} />
            <span className="text-slate-600">{item.name}</span>
            <span className="ml-auto font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
