import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Calendar,
  HelpCircle,
  FileText,
  Users,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/applications', icon: Briefcase },
    { name: 'Interviews', path: '/interviews', icon: MessageSquare },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Question Bank', path: '/questions', icon: HelpCircle },
    { name: 'Resources', path: '/resources', icon: FileText },
    { name: 'Contacts & HR', path: '/contacts', icon: Users },
  ];

  const bottomNavItems = [];

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 rounded-lg px-3.5 py-2.5 text-[15px] font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-primary dark:bg-blue-950/40 dark:text-blue-300 font-semibold'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
    }`;

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 transition-transform duration-300 dark:bg-slate-900 dark:border-slate-800 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between px-2 mb-8">
          <Logo iconSize={20} fontSize="text-xl" />
          <button
            onClick={onClose}
            type="button"
            className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                // Close sidebar on mobile navigation
                if (window.innerWidth < 1024) onClose();
              }}
              className={linkClass}
              end={item.path === '/dashboard'}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom links and logout */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-1">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={linkClass}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          <button
            onClick={() => {
              logout();
              if (window.innerWidth < 1024) onClose();
            }}
            type="button"
            className="flex w-full items-center space-x-3 rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

