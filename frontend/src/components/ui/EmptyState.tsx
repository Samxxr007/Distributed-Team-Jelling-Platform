import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center p-8 border-2 border-dashed border-surface-200 rounded-xl bg-surface-50">
      {icon && <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 mb-4">{icon}</div>}
      <h3 className="mt-2 text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}
