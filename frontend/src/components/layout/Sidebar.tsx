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
  LogOut,
  Leaf,
  Scale
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Chat Stream', path: '/chat', icon: MessageSquare },
  { name: 'Workspaces', path: '/teams', icon: Users },
  { name: 'Team Health', path: '/team-health', icon: Heart },
  { name: 'AI Sentiment', path: '/sentiment', icon: Brain },
  { name: 'Productivity', path: '/productivity', icon: TrendingUp },
  { name: 'Jelling Hub', path: '/jelling', icon: Sparkles },
  { name: 'Team Socials', path: '/activities', icon: Calendar },
  { name: 'Kudos Board', path: '/kudos', icon: Award },
  { name: 'Tool Matrix', path: '/comparison', icon: Scale },
  { name: 'Green IT', path: '/sustainability', icon: Leaf },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  return (
    <div className="flex h-full flex-col border-r border-slate-800 bg-slate-950 text-slate-300">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            TruckHai<span className="text-indigo-400">Jelling</span>
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
          <NavLink
            to="/notifications"
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              )
            }
          >
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 shrink-0" />
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              )
            }
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>Settings</span>
          </NavLink>

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-purple-400 hover:bg-slate-900 hover:text-purple-300'
                )
              }
            >
              <Shield className="h-4 w-4 shrink-0" />
              <span>Admin Console</span>
            </NavLink>
          )}
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm">
            {(user?.full_name || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.full_name || user?.username}</p>
            <p className="text-[10px] text-indigo-400 truncate capitalize font-semibold">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 justify-center px-3 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

