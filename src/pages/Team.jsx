import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const STATUS_COLOR = { online: 'bg-green-500', away: 'bg-yellow-400', offline: 'bg-slate-300' };
const COLORS = ['#4c63db', '#e91e8c', '#9c27b0', '#ff9b44', '#14a800', '#fc7941', '#5533ff'];

export default function Team() {
  const { tasks } = useApp();
  const [team, setTeam] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pms_team')) || []; } catch { return []; }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', email: '', status: 'online' });

  useEffect(() => {
    localStorage.setItem('pms_team', JSON.stringify(team));
  }, [team]);

  const openAdd = () => {
    setForm({ name: '', role: '', email: '', status: 'online' });
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const openEdit = (member) => {
    setForm({ name: member.name, role: member.role, email: member.email, status: member.status });
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    if (editingMember) {
      setTeam(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...form, initials, color: m.color } : m));
    } else {
      setTeam(prev => [...prev, { ...form, id: Date.now(), initials, color, tasks: 0 }]);
    }
    setIsModalOpen(false);
  };

  const removeMember = (id) => {
    if (window.confirm('Remove this team member?')) {
      setTeam(prev => prev.filter(m => m.id !== id));
    }
  };

  const getMemberTaskCount = (initials) => tasks.filter(t => t.status === 'active').length;

  return (
    <main className="flex-1 bg-white rounded-t-[3rem] rounded-b-[2rem] shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
      <div className="p-8 flex-1 overflow-y-auto w-full max-w-4xl mx-auto">

        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[28px] font-extrabold text-black mb-1 tracking-tight">Team</h2>
            <p className="text-slate-400 font-medium">{team.length} members</p>
          </div>
          <button onClick={openAdd} className="bg-brand-purple-800 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-purple-900 transition-colors shadow-md text-sm">
            <i className="ph ph-plus-circle text-lg"></i> Add Member
          </button>
        </header>

        {team.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <i className="ph ph-users text-5xl mb-3 block"></i>
            <p className="font-semibold">No team members yet. Add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {team.map(member => (
              <div key={member.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-md" style={{ backgroundColor: member.color }}>
                      {member.initials}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${STATUS_COLOR[member.status]}`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-base text-text-main">{member.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{member.role}</p>
                    <p className="text-xs text-slate-300 mt-0.5 truncate">{member.email}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => openEdit(member)} className="p-2 text-slate-400 hover:text-brand-purple-800 rounded-xl hover:bg-purple-50">
                      <i className="ph ph-pencil text-sm"></i>
                    </button>
                    <button onClick={() => removeMember(member.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50">
                      <i className="ph ph-trash text-sm"></i>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${member.status === 'online' ? 'bg-green-100 text-green-600' : member.status === 'away' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-400'}`}>
                    {member.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-2xl p-3 text-center">
                    <div className="text-xl font-extrabold text-text-main">{member.tasks || 0}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Assigned</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-3 text-center">
                    <div className="text-xl font-extrabold text-green-600">{Math.floor((member.tasks || 0) * 0.6)}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Completed</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-black">
              <i className="ph ph-x text-xl"></i>
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-black">{editingMember ? 'Edit Member' : 'Add Team Member'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name *</label>
                <input required autoFocus type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold text-black focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Role *</label>
                <input required type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" placeholder="Frontend Developer" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-brand-purple-800 outline-none border-none">
                  <option value="online">Online</option>
                  <option value="away">Away</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-brand-purple-800 text-white font-bold py-4 rounded-xl mt-2 hover:bg-brand-purple-900 transition-colors shadow-md">
                {editingMember ? 'Save Changes' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
