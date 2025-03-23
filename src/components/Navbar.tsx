import React from 'react';
import { useThemeStore } from '../lib/theme';

export function Navbar() {
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  
  return (
    <nav className={`py-4 px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Crawlify
          <span className="text-sm font-normal ml-2 text-gray-500">Web Scraper</span>
        </h1>
      </div>
    </nav>
  );
}
