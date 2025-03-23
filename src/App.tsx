import React, { useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ThemeToggle } from './components/ThemeToggle';
import { FloatingCoffee } from './components/FloatingCoffee';
import { useScrapingStore } from './store/scraping-store';
import { useThemeStore } from './lib/theme';

function App() {
  const loadTasksFromDB = useScrapingStore(state => state.loadTasksFromDB);
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  useEffect(() => {
    loadTasksFromDB();
  }, [loadTasksFromDB]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfbf7] text-slate-900'
    }`}>
      <FloatingCoffee />
      <ThemeToggle />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-5xl font-bold bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent drop-shadow-sm transition-transform hover:scale-105 duration-200`}>
            Crawlify
            </h1>
            <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Enter a URL and one or more CSS selectors to start scraping
            </p>
          </div>
          
          <div>
            <TaskForm />
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;