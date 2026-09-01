import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { useTeamStore } from '../../stores/teamStore';

export function CreateTeamModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTeam } = useTeamStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await createTeam({ name, description });
      onClose();
      setName('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Team">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Team Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
          placeholder="e.g. Frontend Engineers"
        />
        <Textarea 
          label="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="What is this team for?"
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Create Team</Button>
        </div>
      </form>
    </Modal>
  );
}
