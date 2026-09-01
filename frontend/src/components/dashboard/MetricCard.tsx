import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Badge } from '../ui/Badge';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  isLoading?: boolean;
}

export function MetricCard({ icon, label, value, trend, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-10 w-10 mb-4" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16" />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="p-2 bg-brand-50 rounded-lg text-brand-600 mb-4">
          {icon}
        </div>
        {trend && (
          <Badge variant={trend.isPositive ? 'success' : 'danger'}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </Badge>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </Card>
  );
}
