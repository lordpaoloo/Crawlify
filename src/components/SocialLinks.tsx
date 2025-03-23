import React from 'react';
import { Github, Instagram, Linkedin, Coffee, Globe, MessageCircle } from 'lucide-react';

export function SocialLinks() {
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
      url: "www.linkedin.com/in/yousef-mohamad-073814355",
      color: "hover:text-blue-600"
    },
    {
      icon: <Coffee className="h-6 w-6" />,
      url: "https://buymeacoffee.com/lordpaoloo",
      color: "hover:text-yellow-500"
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
    }
  ];

  return (
    <div className="fixed left-8 bottom-8 flex flex-col gap-4">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`transform transition-all duration-200 text-gray-400 ${link.color} hover:scale-110`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
