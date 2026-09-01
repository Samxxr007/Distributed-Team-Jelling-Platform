import React, { useState, useEffect } from 'react';
import { useTeam } from '../hooks/useTeam';
import { kudosApi } from '../api/kudos';
import { KudosCard } from '../components/jelling';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Award, Plus } from 'lucide-react';

export default function Kudos() {
  const { currentTeam } = useTeam();
  const [kudos, setKudos] = useState<any[]>([]);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    if (currentTeam?.id) {
      kudosApi.getTeamKudos(currentTeam.id).then(res => setKudos(res.data)).catch(console.error);
    }
  }, [currentTeam?.id]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6 text-brand-600" /> Kudos Board
        </h1>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Send Kudos</Button>
      </div>

      <div className="flex gap-6 border-b border-surface-200">
        {['all', 'received', 'sent'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 font-medium transition-colors border-b-2 capitalize ${
              tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {kudos.length === 0 ? (
        <EmptyState 
          icon={<Award />} 
          title="No Kudos Yet" 
          description="Be the first to recognize a teammate's great work!"
          action={{ label: 'Send Kudos', onClick: () => {} }}
        />
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-8">
          {kudos.map(k => (
            <div key={k.id} className="break-inside-avoid">
              <KudosCard kudos={k} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
