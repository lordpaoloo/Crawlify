import React from 'react';
import { format } from 'date-fns';
import { Play, Pause, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { ScrapingTask } from '../types';

interface TaskListProps {
  tasks: ScrapingTask[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TaskList({ tasks, onDelete, onToggle }: TaskListProps) {
  const getStatusIcon = (status: ScrapingTask['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="text-green-500" />;
      case 'failed':
        return <AlertCircle className="text-red-500" />;
      default:
        return <Clock className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {getStatusIcon(task.status)}
              <h3 className="font-medium text-gray-900">{task.name}</h3>
            </div>
            <div className="mt-1 text-sm text-gray-500 truncate">{task.url}</div>
            <div className="mt-1 text-sm text-gray-500">
              Created: {format(task.createdAt, 'PPp')}
              {task.lastRunAt && ` • Last run: ${format(task.lastRunAt, 'PPp')}`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggle(task.id)}
              className={`p-2 rounded-full hover:bg-gray-100 ${
                task.status === 'running' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {task.status === 'running' ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No scraping tasks yet. Create one to get started!
        </div>
      )}
    </div>
  );
}