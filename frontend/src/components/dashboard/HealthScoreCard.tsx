import React from 'react';
import { Card } from '../ui/Card';
import { formatHealthScore } from '../../utils/format';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface HealthScoreCardProps {
  score: number;
  trend?: number;
}

export function HealthScoreCard({ score, trend }: HealthScoreCardProps) {
  const { label, color } = formatHealthScore(score);
  
  return (
    <Card className="flex flex-col items-center text-center">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Team Health</h3>
      
      <div className="relative w-32 h-16 overflow-hidden mb-2">
        <div className={`w-32 h-32 rounded-full border-[12px] border-surface-200 border-b-transparent border-r-transparent rotate-45 absolute top-0 left-0`} />
        <div 
          className={`w-32 h-32 rounded-full border-[12px] ${color.replace('text-', 'border-')} border-b-transparent border-r-transparent absolute top-0 left-0 transition-transform duration-1000 ease-out`}
          style={{ transform: `rotate(${45 + (score / 100) * 180}deg)` }}
        />
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
        <span className={`text-4xl font-bold ${color}`}>{score}</span>
      </div>
      
      <h4 className={`text-xl font-bold ${color} mt-6`}>{label}</h4>
      
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{Math.abs(trend)}% from last week</span>
        </div>
      )}
    </Card>
  );
}
