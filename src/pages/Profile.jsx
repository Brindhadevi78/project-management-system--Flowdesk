import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { profile, setProfile, stats } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="flex-1 bg-white rounded-t-[3rem] rounded-b-[2rem] shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
      <div className="p-8 flex-1 overflow-y-auto w-full max-w-3xl mx-auto">

        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[28px] font-extrabold text-black mb-1 tracking-tight">Profile</h2>
            <p className="text-slate-400 font-medium">Manage your personal information</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="bg-green-100 text-green-600 font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2">
                <i className="ph-fill ph-check-circle"></i> Saved!
              </span>
            )}
          </div>
        </header>

        {/* PROFILE CARD */}
        <div className="bg-gradient-to-br from-brand-purple-800 to-brand-purple-900 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
              {profile.initials || profile.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-extrabold">{profile.name}</h3>
              <p className="text-white/70 font-medium">{profile.role}</p>
              <p className="text-white/50 text-sm mt-1">{profile.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
            {[
              { label: 'Active Tasks', value: stats.activeTasks },
              { label: 'Completed', value: stats.completedTasks },
              { label: 'Projects', value: stats.activeProjects },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-white/60 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EDIT FORM */}
        <div className="bg-slate-50 rounded-3xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-extrabold text-base text-text-main">Personal Information</h3>
            {!editing && (
              <button onClick={() => { setForm(profile); setEditing(true); }}
                className="text-sm font-bold text-brand-purple-800 hover:underline flex items-center gap-1">
                <i className="ph ph-pencil"></i> Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name', type: 'text' },
                  { label: 'Role', key: 'role', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Phone', key: 'phone', type: 'text' },
                  { label: 'Location', key: 'location', type: 'text' },
                  { label: 'Initials (2 chars)', key: 'initials', type: 'text', maxLength: 2 },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">{f.label}</label>
                    <input type={f.type} maxLength={f.maxLength} value={form[f.key] || ''}
                      onChange={e => setForm({ ...form, [f.key]: f.key === 'initials' ? e.target.value.toUpperCase() : e.target.value })}
                      className="w-full bg-white rounded-xl px-4 py-3 font-medium text-black focus:ring-2 focus:ring-brand-purple-800 outline-none border-none" />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Bio</label>
                <textarea value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} rows={2}
                  className="w-full bg-white rounded-xl px-4 py-3 font-medium text-slate-600 focus:ring-2 focus:ring-brand-purple-800 outline-none border-none resize-none" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setEditing(false)} className="flex-1 py-3 rounded-xl font-bold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl font-bold bg-brand-purple-800 text-white hover:bg-brand-purple-900 disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: profile.name, icon: 'ph-user' },
                { label: 'Role', value: profile.role, icon: 'ph-briefcase' },
                { label: 'Email', value: profile.email, icon: 'ph-envelope' },
                { label: 'Phone', value: profile.phone, icon: 'ph-phone' },
                { label: 'Location', value: profile.location, icon: 'ph-map-pin' },
                { label: 'Bio', value: profile.bio, icon: 'ph-info' },
              ].map(f => (
                <div key={f.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-brand-purple-800 shrink-0 shadow-sm">
                    <i className={`ph ${f.icon} text-sm`}></i>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{f.label}</div>
                    <div className="text-sm font-semibold text-text-main">{f.value || '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
