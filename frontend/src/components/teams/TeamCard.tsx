import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TeamCard({ team }: { team: any }) {
  return (
    <Link to={`/teams/${team.id}`} className="block">
      <Card hover className="h-full flex flex-col cursor-pointer transition-colors border-l-4 border-l-brand-500">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-slate-900">{team.name}</h3>
          <Badge variant={team.healthScore >= 80 ? 'success' : team.healthScore >= 60 ? 'info' : 'warning'}>
            Health: {team.healthScore}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 mb-6 flex-1">{team.description}</p>
        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-surface-100">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{team.memberCount} members</span>
          </div>
          {team.isActive && (
            <div className="flex items-center gap-1.5 text-green-600">
              <Activity className="w-4 h-4" />
              <span>Active</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
