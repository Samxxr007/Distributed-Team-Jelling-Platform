import React from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export function MemberCard({ member }: { member: any }) {
  return (
    <Card padding="sm" className="flex items-center gap-4">
      <Avatar name={member.user.name} showStatus status={member.isOnline ? 'online' : 'offline'} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-slate-900 truncate">{member.user.name}</h4>
          <Badge variant={member.role === 'admin' ? 'purple' : member.role === 'team_lead' ? 'info' : 'default'} size="sm">
            {member.role.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs text-slate-500 truncate">{member.user.email}</p>
      </div>
    </Card>
  );
}

export function MemberList({ members }: { members: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map(m => (
        <MemberCard key={m.id} member={m} />
      ))}
    </div>
  );
}
