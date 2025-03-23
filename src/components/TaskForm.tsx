import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (name: string, url: string, selectors: string[]) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectors, setSelectors] = useState(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, url, selectors.filter(Boolean));
    setName('');
    setUrl('');
    setSelectors(['']);
  };

  const addSelector = () => {
    setSelectors([...selectors, '']);
  };

  const removeSelector = (index: number) => {
    setSelectors(selectors.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Task Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Product Price Tracker"
          required
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          Target URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">CSS Selectors</label>
        {selectors.map((selector, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={selector}
              onChange={(e) => {
                const newSelectors = [...selectors];
                newSelectors[index] = e.target.value;
                setSelectors(newSelectors);
              }}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder=".product-price, #title"
            />
            {selectors.length > 1 && (
              <button
                type="button"
                onClick={() => removeSelector(index)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSelector}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} /> Add Selector
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Scraping Task
      </button>
    </form>
  );
}