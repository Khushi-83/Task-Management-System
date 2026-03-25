import React, { useState, useEffect } from 'react';
import { TaskCard } from '../components/TaskCard';
import type { TaskProps } from '../components/TaskCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/TaskForm';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import type { TaskData } from '../api/tasks';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskProps | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: TaskProps) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleSubmitTask = async (taskData: TaskData) => {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskData);
        setTasks(tasks.map(t => (t.id === editingTask.id ? { ...t, ...updated } : t)));
      } else {
        const newTask = await createTask(taskData);
        setTasks([newTask, ...tasks]);
      }
      setIsModalOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const archivedTasks = tasks.filter(t => t.status === 'Archived');

  const chartData = [
    { name: 'Pending', value: pendingTasks.length, color: '#94a3b8' },
    { name: 'Completed', value: completedTasks.length, color: '#10b981' },
    { name: 'Archived', value: archivedTasks.length, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Overview of your tasks and progress.</p>
        </div>
        <Button onClick={handleOpenCreateModal}>+ New Task</Button>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-3xl md:col-span-3 flex justify-around items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-white/5 z-0"></div>
          <div className="relative z-10 w-full flex justify-around items-center">
            <div className="text-center transition-transform hover:scale-105 duration-300">
              <div className="text-5xl font-extrabold text-slate-800 drop-shadow-sm">{tasks.length}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Total Tasks</div>
            </div>
            <div className="w-px h-16 bg-slate-200/60 hidden md:block"></div>
            <div className="text-center transition-transform hover:scale-105 duration-300">
              <div className="text-5xl font-extrabold text-emerald-500 drop-shadow-sm">{completedTasks.length}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Completed</div>
            </div>
            <div className="w-px h-16 bg-slate-200/60 hidden md:block"></div>
            <div className="text-center transition-transform hover:scale-105 duration-300">
              <div className="text-5xl font-extrabold text-amber-500 drop-shadow-sm">{archivedTasks.length}</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Archived</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 rounded-3xl flex flex-col justify-center items-center h-full min-h-[160px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 z-0"></div>
          <div className="relative z-10 w-full h-full -mb-2 mt-1">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie 
                  data={chartData} 
                  innerRadius={38} 
                  outerRadius={58} 
                  paddingAngle={6} 
                  dataKey="value" 
                  stroke="none"
                  cornerRadius={6}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 8px ${entry.color}60)` }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)' }}
                  itemStyle={{ fontWeight: 700, color: '#1e293b' }} 
                />
                <Legend verticalAlign="bottom" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-slate-400 font-medium h-full flex items-center justify-center">No data yet</div>
          )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* PENDING Column */}
        <div className="task-column rounded-3xl p-5 shadow-sm border-t-4 border-t-slate-300">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center justify-between uppercase tracking-wide text-sm">
            Pending <span className="bg-white/80 shadow-sm border border-slate-200/60 text-slate-700 text-xs py-0.5 px-3 rounded-full">{pendingTasks.length}</span>
          </h3>
          <div className="space-y-3">
            {pendingTasks.map(task => <TaskCard key={task.id} task={task} onEdit={handleOpenEditModal} onDelete={handleDeleteTask} />)}
            {pendingTasks.length === 0 && (
              <button 
                onClick={handleOpenCreateModal}
                className="w-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-300/70 rounded-2xl text-slate-400 hover:text-primary-600 hover:border-primary-300 hover:bg-white/60 transition-all group shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100/80 group-hover:bg-primary-50 flex items-center justify-center mb-3 transition-colors shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-bold text-sm">Add New Task</span>
                <span className="text-xs text-slate-400 mt-1 font-medium">Get started on your goals</span>
              </button>
            )}
          </div>
        </div>

        {/* COMPLETED Column */}
        <div className="task-column rounded-3xl p-5 shadow-sm border-t-4 border-t-emerald-400">
          <h3 className="font-extrabold text-emerald-900 mb-5 flex items-center justify-between uppercase tracking-wide text-sm">
            Completed <span className="bg-white/80 shadow-sm border border-emerald-200/60 text-emerald-700 text-xs py-0.5 px-3 rounded-full">{completedTasks.length}</span>
          </h3>
          <div className="space-y-3">
            {completedTasks.map(task => <TaskCard key={task.id} task={task} onEdit={handleOpenEditModal} onDelete={handleDeleteTask} />)}
            {completedTasks.length === 0 && <p className="text-sm text-green-300 text-center py-6 border-2 border-dashed border-green-100 rounded-xl">No tasks here</p>}
          </div>
        </div>

        {/* ARCHIVED Column */}
        <div className="task-column rounded-3xl p-5 shadow-sm border-t-4 border-t-amber-400 opacity-80 mix-blend-multiply">
          <h3 className="font-extrabold text-amber-900 mb-5 flex items-center justify-between uppercase tracking-wide text-sm">
            Archived <span className="bg-white/80 shadow-sm border border-amber-200/60 text-amber-700 text-xs py-0.5 px-3 rounded-full">{archivedTasks.length}</span>
          </h3>
          <div className="space-y-3">
            {archivedTasks.map(task => <TaskCard key={task.id} task={task} onEdit={handleOpenEditModal} onDelete={handleDeleteTask} />)}
            {archivedTasks.length === 0 && <p className="text-sm text-orange-300 text-center py-6 border-2 border-dashed border-orange-100 rounded-xl">No tasks here</p>}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm 
          key={editingTask ? editingTask.id : 'new'}
          initialData={editingTask}
          onSubmit={handleSubmitTask} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};
