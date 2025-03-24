import React from 'react';
import { Coffee, Github, Instagram, Linkedin, Globe, MessageCircle } from 'lucide-react';
import { useThemeStore } from '../lib/theme';

export function FloatingCoffee() {
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  const links = [
    {
      icon: <Github className="h-6 w-6" />,
      url: "https://github.com/lordpaoloo",
      color: "hover:text-gray-700"
    },
    {
      icon: <Instagram className="h-6 w-6" />,
      url: "https://instagram.com/lordpaoloo",
      color: "hover:text-pink-600"
    },
    {
      icon: <Linkedin className="h-6 w-6" />,
      url: "https://linkedin.com/in/yousef-mohamad-073814355",
      color: "hover:text-blue-600"
    },

    {
      icon: <Globe className="h-6 w-6" />,
      url: "https://lordpaoloo.github.io/",
      color: "hover:text-green-500"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      url: "https://discord.com/users/939517004895911986",
      color: "hover:text-indigo-500"
    },
  ];

  return (
    <div className="fixed right-4 bottom-8 z-50 flex items-center gap-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${link.color} p-2 rounded-full ${isDarkMode ? 'text-white' : 'text-gray-800'} shadow-lg 
            transform transition-all duration-200 hover:scale-110 hover:shadow-xl`}
        >
          {link.icon}
        </a>
      ))}
      <a
        href="https://ko-fi.com/yousefmohamad"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#FF6433] hover:bg-[#fa4e0a]/90 text-black px-4 py-2 rounded-lg shadow-lg 
          transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
      >
        <div className="flex items-center">
          <Coffee className="h-5 w-5" />
          <span className="ml-2 font-medium">Support</span>
        </div>
      </a>
    </div>
  );
}
