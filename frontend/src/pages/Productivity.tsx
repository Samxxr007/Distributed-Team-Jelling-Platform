import React, { useState, useEffect } from 'react';
import { useTeamStore } from '../stores/teamStore';
import { taskApi } from '../api/tasks';
import {
  TrendingUp,
  ListTodo,
  Clock,
  CheckCircle2,
  Plus,
  AlertCircle,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Productivity() {
  const { currentTeam } = useTeamStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskStatus, setNewTaskStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = async () => {
    if (!currentTeam?.id) return;
    try {
      const res = await taskApi.getTasks(currentTeam.id);
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [currentTeam?.id]);

  const handleStatusChange = async (taskId: string, nextStatus: 'todo' | 'in_progress' | 'done') => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)));
    try {
      await taskApi.updateTaskStatus(taskId, nextStatus);
      toast.success(`Task moved to ${nextStatus.replace('_', ' ')}`);
    } catch (err) {
      toast.error('Failed to update task status');
      loadTasks();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !currentTeam?.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await taskApi.createTask(currentTeam.id, {
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim(),
        priority: newTaskPriority,
        status: newTaskStatus
      });
      setTasks((prev) => [...prev, res.data]);
      toast.success('Task created successfully!');
      setIsModalOpen(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  const completionRate = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  const getPriorityBadge = (priority: string = 'medium') => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 border border-slate-600">Low</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" /> Sprint Velocity & Task Board
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Team Productivity Hub</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Track collaborative sprint progress, task velocity, and team throughput.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 text-xs flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Task
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To Do</div>
          <div className="text-2xl font-black text-white mt-1">{todoTasks.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Awaiting start</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{inProgTasks.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active development</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{doneTasks.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sprint deliveries</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{completionRate}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">To Do</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-slate-400">
              {todoTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {todoTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-white leading-snug">{t.title}</h4>
                  {getPriorityBadge(t.priority)}
                </div>
                {t.description && <p className="text-xs text-slate-400">{t.description}</p>}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500">#{t.id.substring(0, 6)}</span>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(t.id, 'in_progress')}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    Start &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setNewTaskStatus('todo');
              setIsModalOpen(true);
            }}
            className="w-full py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>

        {/* In Progress Column */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">In Progress</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
              {inProgTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {inProgTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-white leading-snug">{t.title}</h4>
                  {getPriorityBadge(t.priority)}
                </div>
                {t.description && <p className="text-xs text-slate-400">{t.description}</p>}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(t.id, 'todo')}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-200"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(t.id, 'done')}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    Complete &check;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setNewTaskStatus('in_progress');
              setIsModalOpen(true);
            }}
            className="w-full py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>

        {/* Done Column */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Done</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
              {doneTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {doneTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-3 opacity-80"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-300 line-through leading-snug">{t.title}</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                {t.description && <p className="text-xs text-slate-500">{t.description}</p>}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <span>Completed</span>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(t.id, 'in_progress')}
                    className="text-[11px] font-bold text-slate-400 hover:text-white"
                  >
                    Reopen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Correlation Note */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed text-center">
        <strong className="text-slate-200">Engineering Velocity Note:</strong> Healthy team sentiment and psychological safety correlate with a 38% reduction in blocker resolution times. Use health insights to support teammates, not monitor hours.
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Sprint Task</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement WebSocket reconnect handler"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Details, acceptance criteria..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Initial Column
                  </label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTaskTitle.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

