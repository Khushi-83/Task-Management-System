import React from 'react';

export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'Completed' | 'Archived';
  priority?: 'Low' | 'Medium' | 'High';
  due_date?: string | null;
  createdAt: string;
}

export const TaskCard: React.FC<{ 
  task: TaskProps;
  onEdit?: (task: TaskProps) => void;
  onDelete?: (id: string) => void;
}> = ({ task, onEdit, onDelete }) => {
  const statusColors = {
    Pending: 'bg-slate-100/80 text-slate-700 border-slate-200/60',
    Completed: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    Archived: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
  };

  const priorityColors = {
    Low: 'bg-blue-50 text-blue-600 border-blue-100',
    Medium: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    High: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="glass-card p-5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col gap-3 group relative overflow-hidden">
      {/* Subtle top glare effect */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-70"></div>
      
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-bold text-slate-800 leading-snug group-hover:text-primary-600 transition-colors">
          {task.title}
        </h3>
        <span className={`text-[11px] px-3 py-1 rounded-full font-bold border ${statusColors[task.status] || statusColors.Pending} whitespace-nowrap tracking-wide uppercase shadow-sm`}>
          {task.status}
        </span>
      </div>
      
      {task.priority && (
        <div className="flex">
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${priorityColors[task.priority] || priorityColors.Medium} uppercase`}>
            {task.priority} Priority
          </span>
        </div>
      )}
      
      {task.description && (
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">{task.description}</p>
      )}
      
      <div className="mt-auto pt-5 flex justify-between items-center text-xs text-slate-400 font-medium border-t border-slate-100/50">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
          {onEdit && (
            <button 
              onClick={() => onEdit(task)} 
              className="hover:bg-primary-50 text-primary-600 hover:text-primary-700 p-1.5 rounded-md transition-colors shadow-sm bg-white/50 border border-primary-100"
              aria-label="Edit task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(task.id)} 
              className="hover:bg-red-50 text-red-500 hover:text-red-700 p-1.5 rounded-md transition-colors shadow-sm bg-white/50 border border-red-100"
              aria-label="Delete task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
