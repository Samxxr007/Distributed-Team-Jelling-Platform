import React from 'react';
import { Card } from '../ui/Card';
import { formatRelativeTime } from '../../utils/format';
import { Avatar } from '../ui/Avatar';

export function KudosCard({ kudos }: { kudos: any }) {
  const gradients = [
    'from-orange-100 to-amber-100',
    'from-pink-100 to-rose-100',
    'from-blue-100 to-cyan-100',
    'from-green-100 to-emerald-100',
    'from-purple-100 to-fuchsia-100'
  ];
  
  const bg = gradients[kudos.id.charCodeAt(0) % gradients.length];

  return (
    <Card className={`bg-gradient-to-br ${bg} border-none shadow-sm`}>
      <div className="text-4xl mb-4">{kudos.emoji}</div>
      <p className="text-slate-800 font-medium mb-4 leading-relaxed">"{kudos.message}"</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <Avatar name={kudos.senderName} size="sm" className="border-2 border-white" />
            <Avatar name={kudos.receiverName} size="sm" className="border-2 border-white" />
          </div>
          <span className="text-xs text-slate-600 font-medium">
            {kudos.senderName} → {kudos.receiverName}
          </span>
        </div>
        <span className="text-xs text-slate-500">{formatRelativeTime(kudos.createdAt)}</span>
      </div>
    </Card>
  );
}
