import React from 'react';
import { useApp } from '../context/AppContext';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ph-squares-four', iconActive: 'ph-fill ph-squares-four' },
  { id: 'tasks', label: 'Tasks', icon: 'ph-clipboard-text', iconActive: 'ph-fill ph-clipboard-text' },
  { id: 'projects', label: 'Projects', icon: 'ph-folder-notch', iconActive: 'ph-fill ph-folder-notch' },
  { id: 'team', label: 'Team', icon: 'ph-users', iconActive: 'ph-fill ph-users' },
];

const SETTINGS_NAV = [
  { id: 'profile', label: 'Profile', icon: 'ph-user', iconActive: 'ph-fill ph-user' },
  { id: 'settings', label: 'Settings', icon: 'ph-gear', iconActive: 'ph-fill ph-gear' },
];

export default function Sidebar() {
  const { activePage, setActivePage, profile, stats } = useApp();

  return (
    <aside className="w-[240px] flex flex-col shrink-0">

      {/* LOGO */}
      <div className="flex items-center gap-2 px-6 py-4">
        <div className="flex gap-[2px]">
          <div className="w-1.5 h-4 bg-brand-orange-500 rounded-full"></div>
          <div className="w-1.5 h-6 bg-brand-purple-800 rounded-full -mt-2"></div>
          <div className="w-1.5 h-4 bg-stat-green rounded-full"></div>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-brand-purple-900">FlowDesk</h1>
      </div>

      {/* PROFILE WIDGET */}
      <div className="flex flex-col items-center mt-6 mb-8">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 flex items-center justify-center overflow-hidden border-2 border-theme-bg text-white shadow-inner">
            <span className="text-3xl font-extrabold tracking-tight">{profile.initials || 'AS'}</span>
          </div>
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-sm text-[9px] font-bold text-slate-600 flex items-center gap-1 border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 block"></span> Online
          </div>
        </div>
        <h3 className="font-bold text-base text-text-main">{profile.name}</h3>
        <p className="text-xs text-text-muted mt-0.5">{profile.email}</p>
      </div>

      {/* MAIN NAV */}
      <div className="px-4 mb-6">
        <h4 className="text-[10px] font-bold text-slate-400 mb-3 px-2 tracking-widest">PROJECTS & TASKS</h4>
        <nav className="flex flex-col gap-1">
          {NAV.map(item => {
            const isActive = activePage === item.id;
            return (
              <button key={item.id} onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors w-full text-left ${isActive ? 'bg-white text-brand-purple-800 shadow-sm font-bold' : 'text-text-muted hover:bg-white hover:text-text-main hover:shadow-sm'}`}>
                <i className={`${isActive ? item.iconActive : item.icon} text-lg`}></i>
                {item.label}
                {item.id === 'tasks' && stats.activeTasks > 0 && (
                  <span className="ml-auto bg-brand-purple-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{stats.activeTasks}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* SETTINGS NAV */}
      <div className="px-4 mt-auto mb-4">
        <h4 className="text-[10px] font-bold text-slate-400 mb-3 px-2 tracking-widest">ACCOUNT</h4>
        <nav className="flex flex-col gap-1">
          {SETTINGS_NAV.map(item => {
            const isActive = activePage === item.id;
            return (
              <button key={item.id} onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors w-full text-left ${isActive ? 'bg-white text-brand-purple-800 shadow-sm font-bold' : 'text-text-muted hover:bg-white hover:text-text-main hover:shadow-sm'}`}>
                <i className={`${isActive ? item.iconActive : item.icon} text-lg`}></i>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}
