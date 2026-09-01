import React from 'react';
import clsx from 'clsx';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

export function Avatar({ src, name, size = 'md', showStatus, status = 'online', className }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-slate-400',
    away: 'bg-amber-500'
  };

  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className={clsx('relative inline-block rounded-full', sizes[size], className)}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full rounded-full object-cover border border-surface-200" />
      ) : (
        <div className="w-full h-full rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-medium border border-brand-200">
          {initials}
        </div>
      )}
      {showStatus && (
        <span className={clsx(
          'absolute bottom-0 right-0 block rounded-full ring-2 ring-surface',
          statusColors[status],
          size === 'xs' ? 'w-1.5 h-1.5' : size === 'xl' ? 'w-4 h-4' : 'w-2.5 h-2.5'
        )} />
      )}
    </div>
  );
}
