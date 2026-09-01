import { Menu, Search, Sparkles, Zap } from 'lucide-react';
import { useTeamStore } from '../../stores/teamStore';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentTeam, teams, selectTeam } = useTeamStore();

  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:flex items-center max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2">
          <Search className="h-4 w-4 text-slate-400 mr-2.5" />
          <input
            type="text"
            placeholder="Search channels, tasks, or team members..."
            className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {teams.length > 0 && (
          <select
            className="text-xs font-semibold border border-slate-800 rounded-xl px-3 py-2 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            value={currentTeam?.id || ''}
            onChange={(e) => selectTeam(e.target.value)}
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <Zap className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-400 hidden sm:inline">DistilBERT Active</span>
        </div>
      </div>
    </header>
  );
}

