// Built by lordpaoloo (https://github.com/lordpaoloo)
import React, { useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ThemeToggle } from './components/ThemeToggle';
import { FloatingCoffee } from './components/FloatingCoffee';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { useScrapingStore } from './store/scraping-store';
import { useThemeStore } from './lib/theme';


function App() {
  const loadTasksFromDB = useScrapingStore(state => state.loadTasksFromDB);
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  useEffect(() => {
    loadTasksFromDB();
  }, [loadTasksFromDB]);

  return (
    <AuthWrapper>
      <FloatingCoffee />
      <ThemeToggle />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 transition-transform hover:scale-110 duration-200">
              <img src="/logo.png" alt="Crawlify Icon" className="w-10 h-10" />
              <h1 className={`text-5xl font-bold bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent drop-shadow-sm transition-transform hover:scale-105 duration-200`}>
                Crawlify
              </h1>
            </div>
            <p className={`mt-4 text-lg bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent`}>
            Scraping Made Simple.
            </p>
          </div>
          
          <div>
            <TaskForm />
            <TaskList />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}

export default App;