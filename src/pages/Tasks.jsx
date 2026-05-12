import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const COLORS = ['#ff3d6a', '#3b5998', '#5533ff', '#14a800', '#ff9b44', '#77428f', '#4c63db', '#fc7941'];
const PRIORITY_BADGE = { high: 'bg-red-100 text-red-600', medium: 'bg-yellow-100 text-yellow-600', low: 'bg-green-100 text-green-600' };
const STATUS_BADGE = { active: 'bg-blue-100 text-blue-600', completed: 'bg-green-100 text-green-600' };

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, completeTask, projects, searchQuery } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ title: '', desc: '', when: 'today', priority: 'medium', dueDate: '', projectId: '' });

  const q = searchQuery.toLowerCase();

  let filtered = tasks
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .filter(t => filterProject === 'all' || String(t.projectId) === filterProject)
    .filter(t => !q || t.title.toLowerCase().includes(q) || t.desc?.toLowerCase().includes(q));

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'dueDate') return (a.dueDate || '').localeCompare(b.dueDate || '');
    if (sortBy === 'priority') return ['high', 'medium', 'low'].indexOf(a.priority) - ['high', 'medium', 'low'].indexOf(b.priority);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return b.createdAt - a.createdAt;
  });

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
  };

  const getProjectName = (id) => projects.find(p => p.id === id)?.title || '—';

  return (
    <main className="flex-1 bg-white rounded-t-[3rem] rounded-b-[2rem] shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
      <div className="p-8 flex-1 overflow-y-auto w-full max-w-4xl mx-auto">

        {/* HEADER */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[28px] font-extrabold text-black mb-1 tracking-tight">Tasks</h2>
            <p className="text-slate-400 font-medium">{filtered.length} tasks found</p>
          </div>
          <button onClick={openAdd} className="bg-brand-purple-800 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-purple-900 transition-colors shadow-md text-sm">
            <i className="ph ph-plus-circle text-lg"></i> Add Task
          </button>
        </header>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-100 rounded-xl px-4 py-2 font-bold text-sm text-slate-600 outline-none border-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            className="bg-slate-100 rounded-xl px-4 py-2 font-bold text-sm text-slate-600 outline-none border-none">
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)}
            className="bg-slate-100 rounded-xl px-4 py-2 font-bold text-sm text-slate-600 outline-none border-none">
            <option value="all">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="bg-slate-100 rounded-xl px-4 py-2 font-bold text-sm text-slate-600 outline-none border-none ml-auto">
            <option value="createdAt">Newest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        {/* TASK TABLE */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <i className="ph ph-clipboard-text text-5xl mb-3 block"></i>
            <p className="font-semibold">No tasks found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(task => (
              <div key={task.id} className={`flex items-center gap-4 bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm p-4 rounded-2xl transition-all group ${task.status === 'completed' ? 'opacity-60' : ''}`}>
                <button onClick={() => completeTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${task.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-green-400'}`}>
                  {task.status === 'completed' && <i className="ph-fill ph-check text-xs"></i>}
                </button>
                <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0" style={{ backgroundColor: task.color }}>
                  {task.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className={`font-bold text-sm text-text-main truncate ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</h5>
                  <p className="text-xs text-slate-400 truncate">{task.desc}</p>
                </div>
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORITY_BADGE[task.priority] || 'bg-slate-100 text-slate-500'}`}>{task.priority}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[task.status]}`}>{task.status}</span>
                </div>
                <div className="hidden lg:block text-xs text-slate-400 shrink-0 w-28 truncate">{getProjectName(task.projectId)}</div>
                <div className="text-xs text-slate-400 shrink-0">{task.dueDate || '—'}</div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <button onClick={() => openEdit(task)} className="p-2 text-slate-400 hover:text-brand-purple-800 rounded-xl hover:bg-purple-50">
                    <i className="ph ph-pencil text-sm"></i>
                  </button>
                  <button onClick={() => setConfirmDelete(task.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50">
                    <i className="ph ph-trash text-sm"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold text-black focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
                <input type="text" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-brand-purple-800 outline-none border-none">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full bg-slate-50 rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Project</label>
                <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none border-none">
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

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center">
            <i className="ph-fill ph-warning-circle text-5xl text-red-500 mb-4 block"></i>
            <h3 className="text-xl font-extrabold mb-2">Delete Task?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={() => { deleteTask(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
