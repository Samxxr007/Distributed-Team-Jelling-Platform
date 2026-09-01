import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Calendar } from 'lucide-react';

export function TaskCard({ task, onStatusChange }: { task: any, onStatusChange: (id: string, status: string) => void }) {
  const priorities = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  } as const;

  return (
    <Card padding="sm" className="mb-3 cursor-pointer hover:border-brand-300">
      <div className="flex justify-between items-start mb-2">
        <Badge variant={priorities[task.priority as keyof typeof priorities] || 'default'}>{task.priority}</Badge>
        <Avatar name={task.assignee?.name || 'Unassigned'} size="xs" />
      </div>
      <h4 className="font-medium text-slate-900 mb-1">{task.title}</h4>
      <div className="flex items-center text-xs text-slate-500 mt-3">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(task.dueDate).toLocaleDateString()}
      </div>
      <div className="mt-3 flex gap-2">
        {task.status !== 'todo' && <button onClick={() => onStatusChange(task.id, 'todo')} className="text-xs text-slate-500 hover:text-brand-600">To Do</button>}
        {task.status !== 'in_progress' && <button onClick={() => onStatusChange(task.id, 'in_progress')} className="text-xs text-slate-500 hover:text-brand-600">In Progress</button>}
        {task.status !== 'done' && <button onClick={() => onStatusChange(task.id, 'done')} className="text-xs text-slate-500 hover:text-brand-600">Done</button>}
      </div>
    </Card>
  );
}

export function TaskBoard({ tasks, onStatusChange, onAddTask }: { tasks: any[], onStatusChange: (id: string, status: string) => void, onAddTask: (status: string) => void }) {
  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
    { id: 'in_progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'in_progress') },
    { id: 'done', title: 'Done', tasks: tasks.filter(t => t.status === 'done') }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(col => (
        <div key={col.id} className="bg-surface-50 p-4 rounded-xl border border-surface-200 flex flex-col max-h-[800px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="font-bold text-slate-700">{col.title}</h3>
            <span className="bg-surface-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">{col.tasks.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto min-h-[200px]">
            {col.tasks.map(task => (
              <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
            ))}
          </div>
          <button 
            onClick={() => onAddTask(col.id)}
            className="w-full mt-2 py-2 text-sm text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-dashed border-surface-300 shrink-0"
          >
            + Add Task
          </button>
        </div>
      ))}
    </div>
  );
}
