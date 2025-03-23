import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { startScraping, checkHealth } from './api/scraper';
import type { ScrapingTask } from './types';

function App() {
  const [tasks, setTasks] = useState<ScrapingTask[]>([]);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkServer = async () => {
      const isHealthy = await checkHealth();
      setServerStatus(isHealthy ? 'online' : 'offline');
    };
    
    checkServer();
    const interval = setInterval(checkServer, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleCreateTask = (name: string, url: string, selectors: string[]) => {
    const newTask: ScrapingTask = {
      id: crypto.randomUUID(),
      name,
      url,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      targetSelectors: selectors,
    };
    setTasks([newTask, ...tasks]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (task.status !== 'running') {
      // Start scraping
      try {
        setTasks(tasks.map(t => 
          t.id === id ? { ...t, status: 'running', updatedAt: new Date() } : t
        ));

        const result = await startScraping(task);
        
        setTasks(tasks.map(t => 
          t.id === id ? {
            ...t,
            status: 'completed',
            updatedAt: new Date(),
            lastRunAt: new Date(),
            data: result.data,
          } : t
        ));
      } catch (error) {
        setTasks(tasks.map(t => 
          t.id === id ? {
            ...t,
            status: 'failed',
            updatedAt: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error',
          } : t
        ));
      }
    } else {
      // Stop scraping (in this version, we just mark it as pending)
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, status: 'pending', updatedAt: new Date() } : t
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Web Scraper</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Server Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                serverStatus === 'online' ? 'bg-green-100 text-green-800' :
                serverStatus === 'offline' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {serverStatus === 'checking' ? 'Checking...' : 
                 serverStatus === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 md:grid-cols-[350px,1fr]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Task</h2>
            <TaskForm onSubmit={handleCreateTask} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Scraping Tasks</h2>
            <TaskList
              tasks={tasks}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;