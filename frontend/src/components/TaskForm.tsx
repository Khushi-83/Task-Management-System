import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface TaskFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || 'Medium');
  const [status, setStatus] = useState(initialData?.status || 'Pending');
  const [dueDate, setDueDate] = useState(initialData?.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, priority, status, due_date: dueDate ? new Date(dueDate).toISOString() : null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Task Title"
        required
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="E.g., Design new landing page"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Detailed task description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Priority
          </label>
          <select
            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-medium"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-medium"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Due Date (Optional)
        </label>
        <input
          type="date"
          className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-medium"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 mt-6">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
