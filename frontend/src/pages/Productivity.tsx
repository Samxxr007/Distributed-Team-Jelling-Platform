import React, { useState, useEffect } from 'react';
import { TaskBoard } from '../components/tasks';
import { taskApi } from '../api/tasks';
import { useTeam } from '../hooks/useTeam';
import { MetricCard } from '../components/dashboard';
import { CheckCircle2, CircleDashed, ListTodo, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function Productivity() {
  const { currentTeam } = useTeam();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (currentTeam?.id) {
      taskApi.getTasks(currentTeam.id).then(res => setTasks(res.data)).catch(console.error);
    }
  }, [currentTeam?.id]);

  const handleStatusChange = async (id: string, status: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    try {
      await taskApi.updateTaskStatus(id, status);
    } catch (e) {
      // Revert if error
    }
  };

  const stats = {
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    total: tasks.length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-brand-600" /> Productivity & Tasks
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard icon={<ListTodo />} label="To Do" value={stats.todo} />
        <MetricCard icon={<CircleDashed />} label="In Progress" value={stats.inProgress} />
        <MetricCard icon={<CheckCircle2 />} label="Done" value={stats.done} />
        <MetricCard icon={<TrendingUp />} label="Completion Rate" value={`${completionRate}%`} />
      </div>

      <TaskBoard 
        tasks={tasks} 
        onStatusChange={handleStatusChange} 
        onAddTask={(status) => console.log('Add task', status)}
      />

      <Card className="mt-8 bg-surface-50 border-surface-200 border-dashed">
        <p className="text-sm text-slate-500 text-center">
          <strong>Research Note:</strong> Better team connectedness may correlate with improved productivity. Correlation ≠ causation. 
          Use these metrics to balance workload, not to micromanage.
        </p>
      </Card>
    </div>
  );
}
