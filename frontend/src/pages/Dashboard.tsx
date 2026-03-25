import React, { useState } from 'react';
import { TaskCard } from '../components/TaskCard';
import type { TaskProps } from '../components/TaskCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/TaskForm';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Mock Data
const MOCK_TASKS: TaskProps[] = [
  { id: '1', title: 'Design Database Schema', status: 'DONE', createdAt: '2026-03-20T10:00:00Z', description: 'Create Prisma schema and run migrations' },
  { id: '2', title: 'Build UI Components', status: 'IN_PROGRESS', createdAt: '2026-03-24T14:30:00Z', description: 'Create Navbar, Button, and Input' },
  { id: '3', title: 'Implement Auth API', status: 'TODO', createdAt: '2026-03-25T09:15:00Z', description: 'JWT endpoints for login/register' },
];

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskProps[]>(MOCK_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = (taskData: any) => {
    const newTask: TaskProps = {
      id: Math.random().toString(36).substr(2, 9),
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
  };

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  const chartData = [
    { name: 'To Do', value: todoTasks.length, color: '#f3f4f6' }, // gray-100
    { name: 'In Progress', value: inProgressTasks.length, color: '#dbeafe' }, // blue-100
    { name: 'Done', value: doneTasks.length, color: '#dcfce3' }, // green-100
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Overview of your tasks and progress.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ New Task</Button>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-3 flex justify-around items-center">
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900">{tasks.length}</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Total Tasks</div>
            </div>
            <div className="w-px h-12 bg-gray-100 hidden md:block"></div>
            <div className="text-center">
              <div className="text-4xl font-black text-green-600">{doneTasks.length}</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Completed</div>
            </div>
            <div className="w-px h-12 bg-gray-100 hidden md:block"></div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-600">{inProgressTasks.length}</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">In Progress</div>
            </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center h-full min-h-[140px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={chartData} innerRadius={35} outerRadius={50} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-gray-400">No data</div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* TO DO Column */}
        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
            To Do <span className="bg-white shadow-sm border border-gray-200 text-gray-700 text-xs py-0.5 px-2.5 rounded-full">{todoTasks.length}</span>
          </h3>
          <div className="space-y-3">
            {todoTasks.map(task => <TaskCard key={task.id} task={task} />)}
            {todoTasks.length === 0 && <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">No tasks here</p>}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div className="bg-blue-50/30 rounded-2xl p-4 border border-blue-100/30">
          <h3 className="font-bold text-blue-800 mb-4 flex items-center justify-between">
            In Progress <span className="bg-white shadow-sm border border-blue-200 text-blue-700 text-xs py-0.5 px-2.5 rounded-full">{inProgressTasks.length}</span>
          </h3>
          <div className="space-y-3">
            {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
            {inProgressTasks.length === 0 && <p className="text-sm text-blue-300 text-center py-6 border-2 border-dashed border-blue-100 rounded-xl">No tasks here</p>}
          </div>
        </div>

        {/* DONE Column */}
        <div className="bg-green-50/30 rounded-2xl p-4 border border-green-100/30">
          <h3 className="font-bold text-green-800 mb-4 flex items-center justify-between">
            Done <span className="bg-white shadow-sm border border-green-200 text-green-700 text-xs py-0.5 px-2.5 rounded-full">{doneTasks.length}</span>
          </h3>
          <div className="space-y-3">
            {doneTasks.map(task => <TaskCard key={task.id} task={task} />)}
            {doneTasks.length === 0 && <p className="text-sm text-green-300 text-center py-6 border-2 border-dashed border-green-100 rounded-xl">No tasks here</p>}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Task"
      >
        <TaskForm 
          onSubmit={handleCreateTask} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};
