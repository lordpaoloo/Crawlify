import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { useScrapingStore } from '../store/scraping-store';
import { scrapeWebsite } from '../lib/scraper';
import { useThemeStore } from '../lib/theme';

export function TaskForm() {
  const [url, setUrl] = useState('');
  const [selectors, setSelectors] = useState<string[]>(['']);
  const [maxResults, setMaxResults] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTask, updateTask } = useScrapingStore();
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  const handleSelectorChange = (index: number, value: string) => {
    const updatedSelectors = [...selectors];
    updatedSelectors[index] = value;
    setSelectors(updatedSelectors);
  };

  const addSelectorField = () => setSelectors([...selectors, '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const taskId = crypto.randomUUID();
    const task = {
      id: taskId,
      url,
      selectors,
      maxResults,
      status: 'running' as const,
      results: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addTask(task);

    try {
      const results = await scrapeWebsite(url, selectors, maxResults);
      updateTask(taskId, {
        status: 'completed',
        results,
        updatedAt: new Date(),
      });
      
      setUrl('');
      setSelectors(['']);
      setMaxResults(10);
    } catch (error) {
      updateTask(taskId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        updatedAt: new Date(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700 text-white focus:ring-[#9C83FF] focus:border-[#9C83FF]'
      : 'bg-white border-gray-300 text-gray-900 focus:ring-[#FF9051] focus:border-[#FF9051]'
  }`;

  const iconClasses = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-xl shadow-lg mb-8 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Website URL
          </label>
          <div className="relative">
            <Globe className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconClasses}`} />
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`${inputClasses} pl-10`}
              placeholder="https://example.com"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            CSS Selectors
          </label>
          {selectors.map((selector, index) => (
            <div key={index} className="relative mb-2">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconClasses}`} />
              <input
                type="text"
                required
                value={selector}
                onChange={(e) => handleSelectorChange(index, e.target.value)}
                className={`${inputClasses} pl-10`}
                placeholder=".product-title"
                disabled={isSubmitting}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSelectorField}
            className="text-sm text-blue-500 hover:underline"
            disabled={isSubmitting}
          >
            Add another selector
          </button>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Max Results
          </label>
          <input
            type="number"
            min="1"
            value={maxResults}
            onChange={(e) => setMaxResults(parseInt(e.target.value))}
            className={inputClasses}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg font-medium uppercase tracking-wide transition-all duration-200 bg-gradient-to-r from-[#9C83FF] to-[#FF9051] text-white hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Search className="w-5 h-5 animate-spin mr-2" />
              Scraping...
            </div>
          ) : (
            'Start Scraping'
          )}
        </button>
      </div>
    </form>
  );
}