import { Menu, Search, BrainCircuit } from 'lucide-react';
import { useTeamStore } from '../../stores/teamStore';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentTeam, teams, selectTeam } = useTeamStore();

  return (
    <header className="h-16 bg-surface border-b border-surface-200 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-dark rounded-lg hover:bg-surface-50"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden md:flex items-center max-w-md w-full bg-surface-50 border border-surface-200 rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search messages, users, or tasks..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {teams.length > 0 && (
          <select 
            className="text-sm border border-surface-200 rounded-lg px-3 py-1.5 bg-surface outline-none focus:border-brand-500"
            value={currentTeam?.id || ''}
            onChange={(e) => selectTeam(e.target.value)}
          >
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100">
          <BrainCircuit className="h-4 w-4 text-brand-600 animate-pulse" />
          <span className="text-xs font-medium text-brand-700 hidden sm:inline">AI Active</span>
        </div>
      </div>
    </header>
  );
}
