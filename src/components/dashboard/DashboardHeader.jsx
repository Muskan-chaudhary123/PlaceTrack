import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

export const DashboardHeader = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/applications')) return 'Applications';
    if (path.startsWith('/interviews')) return 'Interviews';
    if (path.startsWith('/calendar')) return 'Calendar';
    if (path.startsWith('/questions')) return 'Question Bank';
    if (path.startsWith('/resources')) return 'Resources';
    if (path.startsWith('/contacts')) return 'Contacts & HR';
    return 'Overview';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-xs px-4 sm:px-6 lg:px-8 dark:bg-slate-900/90 dark:border-slate-800">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          type="button"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-block text-sm font-semibold text-slate-400 dark:text-slate-500">
            PlaceTrack
          </span>
          <span className="hidden sm:inline-block text-slate-300 dark:text-slate-600 font-medium">
            /
          </span>
          <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right: Search, Notifications, Theme, Avatar */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Search Input bar */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-56 rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-900"
          />
        </div>

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center space-x-2.5 border-l border-slate-200/80 dark:border-slate-800 pl-3 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-primary dark:bg-blue-950/60 dark:text-blue-300">
            {getInitials(user?.fullName)}
          </div>
          <span className="hidden text-sm font-semibold text-slate-700 dark:text-slate-300 lg:block">
            {user?.fullName || 'Student'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
