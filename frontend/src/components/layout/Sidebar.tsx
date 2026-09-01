import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Heart,
  Brain,
  TrendingUp,
  Sparkles,
  Calendar,
  Award,
  Bell,
  Settings,
  Shield,
  X,
  LogOut
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Chat', path: '/chat', icon: MessageSquare },
  { name: 'Teams', path: '/teams', icon: Users },
  { name: 'Team Health', path: '/team-health', icon: Heart },
  { name: 'Sentiment', path: '/sentiment', icon: Brain },
  { name: 'Productivity', path: '/productivity', icon: TrendingUp },
  { name: 'Jelling', path: '/jelling', icon: Sparkles },
  { name: 'Activities', path: '/activities', icon: Calendar },
  { name: 'Kudos', path: '/kudos', icon: Award },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  return (
    <div className="flex h-full flex-col border-r border-surface-200 bg-surface">
      <div className="flex h-16 items-center justify-between px-6 border-b border-surface-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
            Jelling
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-dark">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive 
                ? 'bg-brand-50 text-brand-700' 
                : 'text-slate-600 hover:bg-surface-50 hover:text-dark'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-surface-200">
          <NavLink
            to="/notifications"
            onClick={onClose}
            className={({ isActive }) => clsx(
              'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-surface-50 hover:text-dark'
            )}
          >
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              Notifications
            </div>
            {unreadCount > 0 && (
              <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-surface-50 hover:text-dark'
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-surface-50 hover:text-dark'
              )}
            >
              <Shield className="h-5 w-5" />
              Admin
            </NavLink>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-surface-200">
        <div className="flex items-center gap-3 mb-4 px-2">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
              {(user?.full_name || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-dark truncate">{user?.full_name || user?.username}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
