import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', size = 'sm', children }: BadgeProps) {
  const variants = {
    default: 'bg-surface-100 text-slate-700 border-surface-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-brand-50 text-brand-700 border-brand-200'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1'
  };

  return (
    <span className={clsx('inline-flex items-center font-medium border rounded-full', variants[variant], sizes[size])}>
      {children}
    </span>
  );
}
