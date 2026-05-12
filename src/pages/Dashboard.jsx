import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AvatarGroup from '../components/AvatarGroup';

const COLORS = ['#ff3d6a', '#3b5998', '#5533ff', '#14a800', '#ff9b44', '#77428f', '#4c63db', '#fc7941'];
const PRIORITY_COLORS = { high: 'bg-red-100 text-red-600', medium: 'bg-yellow-100 text-yellow-600', low: 'bg-green-100 text-green-600' };

function TaskCard({ task, onDelete, onComplete, onEdit }) {
  return (
    <div className={`flex items-center gap-4 bg-white hover:bg-slate-50 p-3 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-slate-100 hover:shadow-sm ${task.status === 'completed' ? 'opacity-60' : ''}`}>
      <button
        onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${task.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-green-400'}`}
      >
        {task.status === 'completed' && <i className="ph-fill ph-check text-xs"></i>}
      </button>
      <div className="w-12 h-12 rounded-[1.25rem] text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0" style={{ backgroundColor: task.color || '#3b5998' }}>
        {task.initial}
      </div>
      <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
        <div className="flex items-center gap-2 mb-0.5">
          <h5 className={`font-extrabold text-base text-text-main leading-tight truncate ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</h5>
          {task.priority && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>}
        </div>
        <p className="text-xs text-slate-400 font-medium truncate">{task.desc}</p>
        {task.dueDate && <p className="text-[10px] text-slate-300 mt-0.5">Due {task.dueDate}</p>}
      </div>
      <div className="px-2 opacity-70 group-hover:opacity-100 shrink-0 hidden sm:block">
        <AvatarGroup />
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
        <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-2 text-slate-400 hover:text-brand-purple-800 rounded-xl hover:bg-purple-50">
          <i className="ph ph-pencil text-sm"></i>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50">
          <i className="ph ph-trash text-sm"></i>
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { tasks, addTask, updateTask, deleteTask, completeTask, stats, projects, searchQuery } = useApp();
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: '', desc: '', when: 'today', priority: 'medium', dueDate: '', projectId: '' });

  const q = searchQuery.toLowerCase();
  const filtered = (list) => q ? list.filter(t => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) : list;

  const todayTasks = filtered(tasks.filter(t => t.when === 'today' && t.status === 'active'));
  const tomorrowTasks = filtered(tasks.filter(t => t.when === 'tomorrow' && t.status === 'active'));
  const completedTasks = filtered(tasks.filter(t => t.status === 'completed'));

  const openAdd = () => {
    setForm({ title: '', desc: '', when: 'today', priority: 'medium', dueDate: '', projectId: '' });
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEdit = (task) => {
    setForm({ title: task.title, desc: task.desc || '', when: task.when || 'today', priority: task.priority || 'medium', dueDate: task.dueDate || '', projectId: task.projectId || '' });
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = { ...form, projectId: form.projectId ? Number(form.projectId) : null };
    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      addTask({ ...payload, color, initial: form.title.charAt(0).toUpperCase() });
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const featuredProjects = projects.slice(0, 2);

  return (
    <main className="flex-1 bg-white rounded-t-[3rem] rounded-b-[2rem] shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 bg-leaf-pattern opacity-30 pointer-events-none"></div>

      <div className="p-8 flex-1 overflow-y-auto relative z-10 w-full max-w-4xl mx-auto">

        {/* HEADER */}
        <header className="flex justify-between items-start mb-8 w-full">
          <div>
            <h2 className="text-[28px] font-extrabold text-black mb-1 tracking-tight">Dashboard</h2>
            <p className="text-slate-400 font-medium">Here's what's happening today.</p>
          </div>
          <button onClick={openAdd} className="bg-brand-purple-800 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-purple-900 transition-colors shadow-md text-sm">
            <i className="ph ph-plus-circle text-lg"></i> Add Task
          </button>
        </header>

        {/* STAT PILLS */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Tasks', value: stats.activeTasks, color: 'bg-purple-50 text-brand-purple-800', icon: 'ph-lightning' },
            { label: 'Completed', value: stats.completedTasks, color: 'bg-green-50 text-green-600', icon: 'ph-check-circle' },
            { label: 'Due Today', value: stats.todayTasks, color: 'bg-orange-50 text-orange-500', icon: 'ph-calendar' },
            { label: 'Overdue', value: stats.overdueTasks, color: 'bg-red-50 text-red-500', icon: 'ph-warning' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 flex items-center gap-3`}>
              <i className={`ph-fill ${s.icon} text-2xl`}></i>
              <div>
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs font-semibold opacity-70">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FEATURED PROJECTS */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {featuredProjects.map(proj => (
            <div key={proj.id} className="rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden h-[160px] flex flex-col justify-between cursor-pointer group hover:-translate-y-1 transition-transform" style={{ background: `linear-gradient(135deg, ${proj.color}, ${proj.color}cc)` }}>
              <div className="absolute -right-4 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <i className={`ph-fill ${proj.icon} text-xl`}></i>
                </div>
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">{proj.progress}%</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-extrabold text-lg leading-tight mb-2">{proj.title}</h3>
                <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                  <div className="bg-white rounded-full h-1.5 transition-all" style={{ width: `${proj.progress}%` }}></div>
                </div>
                <AvatarGroup />
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex items-center border-b border-slate-100 mb-6">
          {['active', 'completed'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold capitalize ${activeTab === tab ? 'text-brand-purple-800 border-b-2 border-brand-purple-800 -mb-px' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab === 'active' ? 'Active Tasks' : `Completed (${completedTasks.length})`}
            </button>
          ))}
        </div>

        {/* TASK LISTS */}
        <div className="space-y-6">
          {activeTab === 'active' ? (
            <>
              {todayTasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-3 px-2 uppercase tracking-wide">Today</h4>
                  <div className="flex flex-col gap-3">
                    {todayTasks.map(t => <TaskCard key={t.id} task={t} onDelete={deleteTask} onComplete={completeTask} onEdit={openEdit} />)}
                  </div>
                </div>
              )}
              {tomorrowTasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-3 px-2 uppercase tracking-wide">Tomorrow</h4>
                  <div className="flex flex-col gap-3">
                    {tomorrowTasks.map(t => <TaskCard key={t.id} task={t} onDelete={deleteTask} onComplete={completeTask} onEdit={openEdit} />)}
                  </div>
                </div>
              )}
              {todayTasks.length === 0 && tomorrowTasks.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <i className="ph ph-check-circle text-5xl mb-3 block"></i>
                  <p className="font-semibold">{q ? 'No tasks match your search.' : 'No active tasks. Add one!'}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {completedTasks.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {completedTasks.map(t => <TaskCard key={t.id} task={t} onDelete={deleteTask} onComplete={completeTask} onEdit={openEdit} />)}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <i className="ph ph-trophy text-5xl mb-3 block"></i>
                  <p className="font-semibold">No completed tasks yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-black">
              <i className="ph ph-x text-xl"></i>
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-black">{editingTask ? 'Edit Task' : 'New Task'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Title *</label>
                <input required autoFocus type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-black focus:ring-2 focus:ring-brand-purple-800 outline-none" placeholder="e.g. Design Landing Page" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
                <input type="text" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none" placeholder="Short description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-brand-purple-800 outline-none">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Project</label>
                <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none">
                  <option value="">No Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Schedule</label>
                <div className="flex gap-3">
                  {['today', 'tomorrow'].map(w => (
                    <label key={w} className={`flex items-center gap-2 cursor-pointer font-bold border-2 rounded-xl px-4 py-2 flex-1 justify-center transition-colors ${form.when === w ? 'border-brand-purple-800 bg-purple-50 text-brand-purple-800' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <input type="radio" name="when" value={w} checked={form.when === w} onChange={e => setForm({ ...form, when: e.target.value })} className="hidden" />
                      {w.charAt(0).toUpperCase() + w.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-purple-800 text-white font-bold py-4 rounded-xl mt-2 hover:bg-brand-purple-900 transition-colors shadow-md">
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
