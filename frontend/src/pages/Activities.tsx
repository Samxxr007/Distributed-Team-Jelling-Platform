import React, { useState, useEffect } from 'react';
import { useTeam } from '../hooks/useTeam';
import { activityApi } from '../api/activities';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import { Calendar, Coffee, Gamepad, PartyPopper, BookOpen, Users } from 'lucide-react';

export default function Activities() {
  const { currentTeam } = useTeam();
  const [activities, setActivities] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (currentTeam?.id) {
      activityApi.getActivities(currentTeam.id).then(res => setActivities(res.data)).catch(console.error);
    }
  }, [currentTeam?.id]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'coffee_chat': return <Coffee className="w-6 h-6 text-amber-600" />;
      case 'game': return <Gamepad className="w-6 h-6 text-purple-600" />;
      case 'celebration': return <PartyPopper className="w-6 h-6 text-pink-600" />;
      case 'knowledge_share': return <BookOpen className="w-6 h-6 text-blue-600" />;
      default: return <Users className="w-6 h-6 text-brand-600" />;
    }
  };

  const filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-brand-600" /> Team Activities
        </h1>
        <Button>Create Activity</Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'coffee_chat', 'game', 'celebration', 'knowledge_share'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === type ? 'bg-brand-600 text-white' : 'bg-surface-100 text-slate-600 hover:bg-surface-200'
            }`}
          >
            {type === 'all' ? 'All Activities' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState 
          icon={<Calendar />} 
          title="No activities found" 
          description="Schedule a coffee chat or game to bring the team together!"
          action={{ label: 'Create Activity', onClick: () => {} }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(activity => (
            <Card key={activity.id} hover className="flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-surface-100 rounded-xl">
                  {getIcon(activity.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{activity.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{new Date(activity.scheduledAt).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-6 flex-1">{activity.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-100">
                <div className="text-sm font-medium text-slate-500">{activity.participants?.length || 0} participants</div>
                <Button variant={activity.isJoined ? "outline" : "primary"} size="sm">
                  {activity.isJoined ? 'Leave' : 'Join'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
