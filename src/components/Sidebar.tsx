import React from 'react';
import { LayoutDashboard, PieChart, Wallet, LogOut, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Logo } from './Logo';

interface SidebarProps {
  activeTab: 'expenses' | 'analysis';
  onTabChange: (tab: 'expenses' | 'analysis') => void;
  user: User | null;
}

export function Sidebar({ activeTab, onTabChange, user }: SidebarProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    {
      id: 'expenses',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: <PieChart className="w-5 h-5" />,
    },
  ] as const;

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#1e293b] border-r border-slate-700/50 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700/50">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        {menuItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors
              ${activeTab === id
                ? 'bg-cyan-600/20 text-cyan-400 border-r-2 border-cyan-500'
                : 'text-slate-400 hover:bg-[#0f172a] hover:text-gray-100'
              }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-700/50 p-4">
        <div className="flex items-center space-x-3 px-2 py-2">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-slate-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}