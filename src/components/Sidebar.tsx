import React, { useEffect } from 'react';
import { LayoutDashboard, PieChart, Wallet, LogOut, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface SidebarProps {
  activeTab: 'expenses' | 'analysis';
  onTabChange: (tab: 'expenses' | 'analysis') => void;
  user: User;
}

export function Sidebar({ activeTab, onTabChange, user }: SidebarProps) {
  useEffect(() => {
    console.log('User metadata:', user);
  }, [user]);

  const menuItems = [
    { id: 'expenses', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'analysis', label: 'Analysis', icon: <PieChart className="w-5 h-5" /> },
  ] as const;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Get the profile picture URL from user metadata
  const profilePicture = user.user_metadata?.picture || user.user_metadata?.avatar_url;
  const userName = user.user_metadata?.full_name || user.user_metadata?.name;

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#1e293b] border-r border-slate-700/50 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 text-transparent bg-clip-text">
              Finflow
            </h1>
            <p className="text-xs text-slate-500">Finance Manager</p>
          </div>
        </div>
      </div>

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

      <div className="border-t border-slate-700/50 p-4">
        <div className="flex items-center space-x-3 mb-4">
          {profilePicture ? (
            <img 
              src={profilePicture} 
              alt={userName || 'User'} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-cyan-600/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-cyan-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {userName || user.email}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}