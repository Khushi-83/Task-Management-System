import React from 'react';

export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
}

export const TaskCard: React.FC<{ task: TaskProps }> = ({ task }) => {
  const statusColors = {
    TODO: 'bg-gray-100 text-gray-800 border-gray-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    DONE: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-3 group">
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-semibold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
          {task.title}
        </h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusColors[task.status]} whitespace-nowrap`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
      )}
      
      <div className="mt-auto pt-4 flex justify-between items-center text-xs text-gray-400">
        <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="hover:text-primary-600 p-1">Edit</button>
          <button className="hover:text-red-600 p-1">Delete</button>
        </div>
      </div>
    </div>
  );
};
