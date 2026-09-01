import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { taskApi } from '../../api/tasks';

export function CreateTaskModal({ isOpen, onClose, teamId, members }: { isOpen: boolean, onClose: () => void, teamId: string, members: any[] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await taskApi.createTask(teamId, { title, description, priority, assigneeId, dueDate });
      onClose();
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="What needs to be done?"
          required 
        />
        <Textarea 
          label="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
        />
        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Priority" 
            value={priority} 
            onChange={e => setPriority(e.target.value)}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' }
            ]}
          />
          <Input 
            label="Due Date" 
            type="date"
            value={dueDate} 
            onChange={e => setDueDate(e.target.value)} 
          />
        </div>
        <Select 
          label="Assignee" 
          value={assigneeId} 
          onChange={e => setAssigneeId(e.target.value)}
          options={[
            { value: '', label: 'Unassigned' },
            ...members.map(m => ({ value: m.user.id, label: m.user.name }))
          ]}
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}
