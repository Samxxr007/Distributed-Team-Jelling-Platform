import React, { useEffect } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Bell, Check, MessageSquare, Heart, Award, Calendar, Lightbulb, UserPlus, BarChart2 } from 'lucide-react';
import { formatRelativeTime } from '../utils/format';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const { notifications, unreadCount, fetchNotifications, markRead, markAllRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'health': return <Heart className="w-5 h-5 text-red-500" />;
      case 'kudos': return <Award className="w-5 h-5 text-orange-500" />;
      case 'activity': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'nudge': return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'invite': return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'poll': return <BarChart2 className="w-5 h-5 text-cyan-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-brand-600" /> Notifications
          {unreadCount > 0 && (
            <span className="bg-brand-100 text-brand-700 text-sm py-1 px-2.5 rounded-full ml-2">
              {unreadCount} new
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" leftIcon={<Check className="w-4 h-4" />} onClick={() => markAllRead()}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState 
          icon={<Bell />} 
          title="You're all caught up!" 
          description="We'll notify you when something important happens."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <Card key={n.id} padding="none" hover className={`overflow-hidden transition-colors ${!n.is_read ? 'bg-brand-50/50' : ''}`}>
              <div 
                className="p-4 flex gap-4 cursor-pointer"
                onClick={() => { if (!n.is_read) markRead(n.id); }}
              >
                <div className="mt-1 shrink-0 bg-white p-2 rounded-full shadow-sm border border-surface-200">
                  {getIcon(n.notification_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className={`text-base ${!n.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {n.title}
                    </h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatRelativeTime(n.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{n.body}</p>
                </div>
                {!n.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
