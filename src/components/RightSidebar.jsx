import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AvatarGroup from './AvatarGroup';

function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const { year, month } = current;

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, type: 'prev' });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, type: 'current' });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, type: 'next' });

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-50">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-extrabold text-base">{monthNames[month]}, {year}</h3>
        <div className="flex gap-2">
          <button onClick={prev} className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-black transition-colors">
            <i className="ph ph-caret-left text-xs font-bold"></i>
          </button>
          <button onClick={next} className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-black transition-colors">
            <i className="ph ph-caret-right text-xs font-bold"></i>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-xs">
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
          <div key={d} className="text-slate-400 font-medium text-[10px]">{d}</div>
        ))}
        {cells.map((cell, i) => {
          const isToday = cell.type === 'current' && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div key={i} className={`font-bold cursor-pointer rounded-full w-7 h-7 flex items-center justify-center mx-auto text-xs transition-colors
              ${cell.type !== 'current' ? 'text-slate-300' : isToday ? 'bg-brand-purple-900 text-white shadow-md' : 'hover:text-brand-purple-800 hover:bg-purple-50'}`}>
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RightSidebar() {
  const { stats, setActivePage, searchQuery, setSearchQuery, profile } = useApp();

  return (
    <aside className="w-[300px] flex flex-col shrink-0 py-4 px-2 overflow-y-auto gap-5">

      {/* TOP ACTIONS */}
      <div className="flex justify-end gap-3">
        <button className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-500 hover:text-brand-purple-800 transition-colors">
          <i className="ph ph-chat-centered-text text-lg"></i>
        </button>
        <button className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-500 hover:text-brand-purple-800 transition-colors relative">
          <i className="ph ph-bell text-lg"></i>
          {stats.overdueTasks > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
        </button>
        <button onClick={() => setActivePage('profile')} className="w-11 h-11 bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 rounded-2xl border-2 border-white shadow-sm cursor-pointer flex items-center justify-center text-white">
          <span className="font-extrabold text-sm">{profile.initials || 'AS'}</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <i className="ph ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-white border-none rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-slate-200 placeholder-slate-400 font-medium shadow-sm outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black">
            <i className="ph ph-x text-sm"></i>
          </button>
        )}
      </div>

      {/* STAT BLOCKS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stat-peach rounded-3xl p-4 flex flex-col justify-between h-28 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setActivePage('tasks')}>
          <span className="text-3xl font-extrabold text-text-main">{stats.todayTasks}</span>
          <span className="text-xs font-bold text-slate-600 leading-tight">Planned<br/>Today</span>
        </div>
        <div className="bg-stat-purple rounded-3xl p-4 flex flex-col justify-between h-28 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setActivePage('tasks')}>
          <span className="text-3xl font-extrabold text-text-main">{stats.completedTasks}</span>
          <span className="text-xs font-bold text-slate-600 leading-tight">Completed<br/>Tasks</span>
        </div>
        <div className="bg-stat-peach rounded-3xl p-4 flex flex-col justify-between h-28 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setActivePage('tasks')}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-slate-600">{stats.overdueTasks} <span className="font-medium text-slate-500 text-xs">Overdue</span></span>
            <span className="text-sm font-bold text-slate-600">{stats.todayTasks} <span className="font-medium text-slate-500 text-xs">Due Today</span></span>
            <span className="text-sm font-bold text-slate-600">{stats.activeTasks} <span className="font-medium text-slate-500 text-xs">Active</span></span>
          </div>
        </div>
        <div className="bg-stat-green rounded-3xl p-4 flex flex-col justify-between h-28 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setActivePage('projects')}>
          <span className="text-3xl font-extrabold text-text-main">{stats.activeProjects}</span>
          <span className="text-xs font-bold text-slate-600 leading-tight">Active<br/>Projects</span>
        </div>
      </div>

      {/* CALENDAR */}
      <Calendar />

    </aside>
  );
}
