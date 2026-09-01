import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '../ui/Card';

interface EngagementCardProps {
  data: any[];
}

export function EngagementCard({ data }: EngagementCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Engagement</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={10} data={data}>
            <RadialBar
              label={{ position: 'insideStart', fill: '#fff' }}
              background
              dataKey="uv"
            />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
