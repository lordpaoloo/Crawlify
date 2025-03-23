import React from 'react';
import { Github, Instagram, Linkedin, Coffee, Globe, MessageCircle } from 'lucide-react';

export function FloatingSocialBalls() {
  const baseLinks = [
    {
      icon: <Github className="h-4 w-4" />,
      url: "https://github.com/yourusername",
      color: "bg-gradient-to-br from-gray-800/80 to-gray-600/80 hover:from-gray-800 hover:to-gray-600",
    },
    {
      icon: <Instagram className="h-4 w-4" />,
      url: "https://instagram.com/yourusername",
      color: "bg-gradient-to-br from-pink-600/80 to-purple-600/80 hover:from-pink-600 hover:to-purple-600",
    },
    {
      icon: <Linkedin className="h-4 w-4" />,
      url: "https://linkedin.com/in/yourusername",
      color: "bg-gradient-to-br from-blue-600/80 to-blue-400/80 hover:from-blue-600 hover:to-blue-400",
    },
    {
      icon: <Coffee className="h-4 w-4" />,
      url: "https://buymeacoffee.com/yourusername",
      color: "bg-gradient-to-br from-yellow-500/80 to-orange-500/80 hover:from-yellow-500 hover:to-orange-500",
    },
    {
      icon: <Globe className="h-4 w-4" />,
      url: "https://yourwebsite.com",
      color: "bg-gradient-to-br from-green-500/80 to-emerald-400/80 hover:from-green-500 hover:to-emerald-400",
    },
    {
      icon: <MessageCircle className="h-4 w-4" />,
      url: "https://discord.gg/yourinvite",
      color: "bg-gradient-to-br from-indigo-500/80 to-purple-500/80 hover:from-indigo-500 hover:to-purple-500",
    }
  ];

  // Create multiple instances of each icon with different positions and animations
  const links = [...Array(3)].flatMap(() => 
    baseLinks.map((link, i) => ({
      ...link,
      animation: `animate-float-${(i % 3) + 1}`
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden floating-container">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute pointer-events-auto p-3 rounded-full backdrop-blur-sm 
            ${link.color} ${link.animation} text-white shadow-lg 
            transform transition-all duration-300 
            hover:scale-125 hover:shadow-xl hover:z-10`}
          style={{
            left: `${10 + (Math.sin(index * 0.5) * 15 + (index * 5))%80}%`,
            top: `${15 + (Math.cos(index * 0.5) * 20 + (index * 3))%70}%`,
            transform: `translateZ(${index * 5}px)`,
            opacity: 0.9
          }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
