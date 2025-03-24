import React from 'react';
import { Download, Loader2, RefreshCw, AlertCircle, Trash2, Edit } from 'lucide-react';
import { useScrapingStore } from '../store/scraping-store';
import { useThemeStore } from '../lib/theme';
import { downloadCSV } from '../lib/export';
import { scrapeWebsite } from '../lib/scraper';

export function TaskList() {
  const { tasks, updateTask, deleteTask, setEditingTask } = useScrapingStore();
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  const handleRescrape = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    updateTask(taskId, { status: 'running', updatedAt: new Date() });

    try {
      const results = await scrapeWebsite(task.url, task.selectors, task.maxResults); // Updated to use multiple selectors
      updateTask(taskId, {
        status: 'completed',
        results,
        updatedAt: new Date(),
        error: undefined,
      });
    } catch (error) {
      updateTask(taskId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        updatedAt: new Date(),
      });
    }
  };

  const handleEdit = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      // Scroll to the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (tasks.length === 0) {
    return (
      <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-8`}>
        No scraping tasks yet. Add one above to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`p-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-medium truncate ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`} title={task.url}>
              {task.url}
            </h3>
            <div className="flex items-center space-x-2">
              {task.status === 'running' ? (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              ) : task.status === 'completed' ? (
                <span className="text-green-500 text-sm font-medium">Completed</span>
              ) : task.status === 'failed' ? (
                <span className="text-red-500 text-sm font-medium">Failed</span>
              ) : (
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Pending</span>
              )}
            </div>
          </div>
          
          <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Selectors:
            {task.selectors.map((selector, index) => (
              <code
                key={index}
                className={`px-2 py-1 rounded mx-1 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                {selector}
              </code>
            ))}
          </div>
          
          {task.error && (
            <div className="flex items-center text-red-500 text-sm mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              {task.error}
            </div>
          )}

          {task.results && Object.keys(task.results).length > 0 && (
            <div className={`mt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} pt-4`}>
              <h4 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Results:</h4>
              {Object.entries(task.results).map(([selector, selectorResults]) => (
                <div key={selector} className="mb-4">
                  <h5 className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Selector: <code className={`px-2 py-0.5 rounded ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>{selector}</code>
                    ({Array.isArray(selectorResults) ? selectorResults.length : 0} results)
                  </h5>
                  <ul className={`text-sm space-y-1 max-h-40 overflow-y-auto ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {Array.isArray(selectorResults) && selectorResults.map((result, index) => (
                      <li key={index} className="truncate" title={result.text}>
                        {result.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => deleteTask(task.id)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
            <button
              onClick={() => handleEdit(task.id)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            {task.status === 'completed' && (
              <button
                onClick={() => downloadCSV(task)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-1" />
                Download CSV
              </button>
            )}
            <button
              onClick={() => handleRescrape(task.id)}
              disabled={task.status === 'running'}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#9C83FF] to-[#FF9051] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Rescrape
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}