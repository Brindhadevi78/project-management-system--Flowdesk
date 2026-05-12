import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AvatarGroup from '../components/AvatarGroup';

const ICONS = ['ph-device-mobile', 'ph-shopping-cart', 'ph-layout', 'ph-globe', 'ph-code', 'ph-chart-bar', 'ph-rocket', 'ph-briefcase'];
const COLORS = ['#ff9b44', '#5d387f', '#4c63db', '#14a800', '#ff3d6a', '#fc7941', '#5533ff', '#e91e8c'];
const PRIORITY_BADGE = { high: 'bg-red-100 text-red-600', medium: 'bg-yellow-100 text-yellow-600', low: 'bg-green-100 text-green-600' };

const EMPTY_FORM = { title: '', desc: '', color: '#ff9b44', icon: 'ph-briefcase', priority: 'medium', dueDate: '', progress: 0 };

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject, tasks } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingProject(null); setIsModalOpen(true); };
  const openEdit = (p) => { setForm({ title: p.title, desc: p.desc, color: p.color, icon: p.icon, priority: p.priority, dueDate: p.dueDate || '', progress: p.progress }); setEditingProject(p); setIsModalOpen(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = { ...form, progress: Number(form.progress), members: ['JD', 'SM', 'RK'] };
    if (editingProject) updateProject(editingProject.id, payload);
    else addProject(payload);
    setIsModalOpen(false);
  };

  const getProjectTaskCount = (id) => tasks.filter(t => t.projectId === id).length;
  const getProjectDoneCount = (id) => tasks.filter(t => t.projectId === id && t.status === 'completed').length;

  const filtered = filter === 'all' ? projects : projects.filter(p => p.priority === filter);

  return (
    <main className="flex-1 bg-white rounded-t-[3rem] rounded-b-[2rem] shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
      <div className="p-8 flex-1 overflow-y-auto w-full max-w-4xl mx-auto">

        {/* HEADER */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[28px] font-extrabold text-black mb-1 tracking-tight">Projects</h2>
            <p className="text-slate-400 font-medium">{projects.length} total projects</p>
          </div>
          <button onClick={openAdd} className="bg-brand-purple-800 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-purple-900 transition-colors shadow-md text-sm">
            <i className="ph ph-plus-circle text-lg"></i> New Project
          </button>
        </header>

        {/* FILTER PILLS */}
        <div className="flex gap-2 mb-8">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-bold text-sm capitalize transition-colors ${filter === f ? 'bg-brand-purple-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {f === 'all' ? 'All Projects' : `${f} Priority`}
            </button>
          ))}
        </div>

        {/* PROJECT GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <i className="ph ph-folder-open text-5xl mb-3 block"></i>
            <p className="font-semibold">No projects found. Create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {filtered.map(proj => {
              const total = getProjectTaskCount(proj.id);
              const done = getProjectDoneCount(proj.id);
              const realProgress = total > 0 ? Math.round((done / total) * 100) : proj.progress;
              return (
                <div key={proj.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-md" style={{ backgroundColor: proj.color }}>
                      <i className={`ph-fill ${proj.icon}`}></i>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(proj)} className="p-2 text-slate-400 hover:text-brand-purple-800 rounded-xl hover:bg-purple-50">
                        <i className="ph ph-pencil text-sm"></i>
                      </button>
                      <button onClick={() => setConfirmDelete(proj.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50">
                        <i className="ph ph-trash text-sm"></i>
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-text-main mb-1">{proj.title}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{proj.desc}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORITY_BADGE[proj.priority]}`}>{proj.priority}</span>
                    {proj.dueDate && <span className="text-[10px] text-slate-400 font-medium">Due {proj.dueDate}</span>}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                      <span>Progress</span><span>{realProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="rounded-full h-2 transition-all" style={{ width: `${realProgress}%`, backgroundColor: proj.color }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <AvatarGroup />
                    <span className="text-xs text-slate-400 font-medium">{done}/{total} tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-black">
              <i className="ph ph-x text-xl"></i>
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-black">{editingProject ? 'Edit Project' : 'New Project'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Project Name *</label>
                <input required autoFocus type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold text-black focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" placeholder="e.g. Mobile App Redesign" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
                <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={2}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none border-none resize-none" placeholder="Brief description" />
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Progress ({form.progress}%)</label>
                <input type="range" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })}
                  className="w-full accent-brand-purple-800" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${form.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map(ic => (
                    <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${form.icon === ic ? 'bg-brand-purple-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      <i className={`ph-fill ${ic}`}></i>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-purple-800 text-white font-bold py-4 rounded-xl mt-2 hover:bg-brand-purple-900 transition-colors shadow-md">
                {editingProject ? 'Save Changes' : 'Create Project'}
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
            <h3 className="text-xl font-extrabold mb-2">Delete Project?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={() => { deleteProject(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
