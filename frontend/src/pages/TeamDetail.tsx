import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTeam } from '../hooks/useTeam';
import { TeamCard, MemberList, InviteModal } from '../components/teams';
import { teamApi } from '../api/teams';
import { Button } from '../components/ui/Button';

export default function TeamDetail() {
  const { id } = useParams();
  const { teams } = useTeam();
  const team = teams.find((t: any) => t.id === id);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      teamApi.getMembers(id).then(res => setMembers(res.data)).catch(console.error);
    }
  }, [id]);

  if (!team) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{team.name}</h1>
          <p className="text-slate-600 mt-2 max-w-2xl">{team.description}</p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)}>Invite Members</Button>
      </div>

      <div className="flex gap-6 border-b border-surface-200">
        {['Overview', 'Members', 'Activity', 'Settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamCard team={team} />
            <div className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200">
               <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
               <p className="text-slate-500 text-sm">Activity feed coming soon...</p>
            </div>
          </div>
        )}
        {activeTab === 'Members' && (
          <MemberList members={members} />
        )}
        {activeTab === 'Activity' && (
          <div className="text-slate-500 text-center py-12 bg-surface-50 rounded-xl border border-dashed border-surface-200">
            No recent activity recorded.
          </div>
        )}
        {activeTab === 'Settings' && (
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-surface-200">
            <h3 className="font-bold text-lg mb-4 text-red-600">Danger Zone</h3>
            <Button variant="outline" size="sm">Leave Team</Button>
          </div>
        )}
      </div>

      <InviteModal 
        isOpen={inviteModalOpen} 
        onClose={() => setInviteModalOpen(false)} 
        teamId={team.id} 
        inviteCode={`INV-${team.id.substring(0,6).toUpperCase()}`} 
      />
    </div>
  );
}
