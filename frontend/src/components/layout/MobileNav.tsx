import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, FileCheck, User } from 'lucide-react';
import clsx from 'clsx';

export const MobileNav: React.FC = () => {
  const tabs = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Courses', path: '/courses', icon: BookOpen },
    { label: 'Assignments', path: '/assignments', icon: FileCheck },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around z-40 px-2 shadow-lg">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl text-[11px] font-semibold transition-colors',
              isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            )
          }
        >
          <tab.icon className="w-5 h-5" />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
