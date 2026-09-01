import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { kudosApi } from '../../api/kudos';

const EMOJIS = ['👏', '🎉', '💡', '🔥', '❤️', '⭐', '🚀', '🙌'];

export function KudosForm({ isOpen, onClose, teamId, members }: { isOpen: boolean, onClose: () => void, teamId: string, members: any[] }) {
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('👏');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId || !message) return;
    
    setIsSubmitting(true);
    try {
      await kudosApi.sendKudos({ teamId, receiverId, message, emoji });
      onClose();
      setMessage('');
      setReceiverId('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Kudos">
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <Select 
          label="To" 
          value={receiverId} 
          onChange={e => setReceiverId(e.target.value)}
          options={[
            { value: '', label: 'Select a teammate' },
            ...members.map(m => ({ value: m.user.id, label: m.user.name }))
          ]}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Emoji</label>
          <div className="flex gap-2 flex-wrap">
            {EMOJIS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                  emoji === e ? 'bg-brand-100 ring-2 ring-brand-500 scale-110' : 'bg-surface-50 hover:bg-surface-100'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <Textarea 
          label="Message" 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          placeholder="Thank you for your help with..."
          required
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Send Kudos</Button>
        </div>
      </form>
    </Modal>
  );
}
