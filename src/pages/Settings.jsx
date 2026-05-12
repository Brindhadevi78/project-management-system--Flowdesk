import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { logout } = useAuth();
  const { tasks, projects } = useApp();
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pms_settings')) || {}; } catch { return {}; }
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    localStorage.setItem('pms_settings', JSON.stringify(settings));
    // Apply theme
    if (settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [settings]);

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const exportData = () => {
    const data = { tasks, projects, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proki-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearCache = () => {
    localStorage.removeItem('pms_settings');
    window.location.reload();
  };

  const Section = ({ title, children }) => (
    <div className="bg-slate-50 rounded-3xl p-6 mb-5">
      <h3 className="font-extrabold text-base text-text-main mb-5">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );

  const Toggle = ({ label, desc, settingKey }) => (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-sm text-text-main">{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <button onClick={() => toggle(settingKey)}
        className={`w-12 h-6 rounded-full transition-colors relative ${settings[settingKey] ? 'bg-brand-purple-800' : 'bg-slate-200'}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${settings[settingKey] ? 'left-7' : 'left-1'}`}></span>
      </button>
    </div>
  );

  const ActionButton = ({ label, desc, onClick, color = 'slate', icon }) => (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-sm text-text-main">{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <button onClick={onClick}
        className={`px-4 py-2 bg-${color}-100 text-${color}-600 font-bold text-sm rounded-xl hover:bg-${color}-200 transition-colors flex items-center gap-2`}>
        {icon && <i className={`ph ${icon}`}></i>}
        {label}
      </button>
    </div>
  );

  return (
    <main className="flex-1 bg-white rounded-t-[3rem] rounded-b-[2rem] shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
      <div className="p-8 flex-1 overflow-y-auto w-full max-w-3xl mx-auto">

        <header className="mb-8">
          <h2 className="text-[28px] font-extrabold text-black mb-1 tracking-tight">Settings</h2>
          <p className="text-slate-400 font-medium">Customize your workspace preferences</p>
        </header>

        <Section title="Appearance">
          <Toggle label="Dark Mode" desc="Switch to dark theme (coming soon)" settingKey="darkMode" />
          <Toggle label="Compact View" desc="Reduce spacing for more content" settingKey="compactMode" />
          <Toggle label="Show Avatars" desc="Display team member avatars on tasks" settingKey="showAvatars" />
          <Toggle label="Smooth Animations" desc="Enable UI transitions and effects" settingKey="animations" />
        </Section>

        <Section title="Notifications">
          <Toggle label="Email Notifications" desc="Receive updates via email" settingKey="emailNotif" />
          <Toggle label="Task Reminders" desc="Get reminded before due dates" settingKey="taskReminders" />
          <Toggle label="Project Updates" desc="Notify when projects change" settingKey="projectUpdates" />
          <Toggle label="Team Activity" desc="See what your team is doing" settingKey="teamActivity" />
          <Toggle label="Desktop Notifications" desc="Browser push notifications" settingKey="desktopNotif" />
        </Section>

        <Section title="Privacy & Security">
          <Toggle label="Profile Visibility" desc="Let team members see your profile" settingKey="profileVisible" />
          <Toggle label="Activity Status" desc="Show online/offline status" settingKey="activityStatus" />
          <Toggle label="Two-Factor Authentication" desc="Extra security layer (coming soon)" settingKey="twoFactor" />
        </Section>

        <Section title="Data & Storage">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-text-main">Export Data</div>
              <div className="text-xs text-slate-400 mt-0.5">Download all your tasks and projects as JSON</div>
            </div>
            <button onClick={exportData}
              className="px-4 py-2 bg-blue-100 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-200 transition-colors flex items-center gap-2">
              <i className="ph ph-download-simple"></i> Export
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-text-main">Clear Cache</div>
              <div className="text-xs text-slate-400 mt-0.5">Clear local settings and preferences</div>
            </div>
            <button onClick={clearCache}
              className="px-4 py-2 bg-yellow-100 text-yellow-600 font-bold text-sm rounded-xl hover:bg-yellow-200 transition-colors flex items-center gap-2">
              <i className="ph ph-broom"></i> Clear
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-text-main">Storage Used</div>
              <div className="text-xs text-slate-400 mt-0.5">{tasks.length} tasks, {projects.length} projects</div>
            </div>
            <span className="text-sm font-bold text-slate-500">{((JSON.stringify({tasks, projects}).length / 1024).toFixed(1))} KB</span>
          </div>
        </Section>

        <Section title="Danger Zone">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-red-600">Delete All Data</div>
              <div className="text-xs text-slate-400 mt-0.5">Permanently delete all tasks and projects</div>
            </div>
            <button onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-red-100 text-red-600 font-bold text-sm rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2">
              <i className="ph ph-trash"></i> Delete
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-red-600">Logout</div>
              <div className="text-xs text-slate-400 mt-0.5">Sign out from your account</div>
            </div>
            <button onClick={logout}
              className="px-4 py-2 bg-red-100 text-red-600 font-bold text-sm rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2">
              <i className="ph ph-sign-out"></i> Logout
            </button>
          </div>
        </Section>

      </div>

      {/* DELETE CONFIRMATION */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center">
            <i className="ph-fill ph-warning-circle text-6xl text-red-500 mb-4 block"></i>
            <h3 className="text-2xl font-extrabold mb-2">Delete All Data?</h3>
            <p className="text-slate-400 text-sm mb-6">This will permanently delete all your tasks and projects. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={() => {
                // Call API to delete all user data
                fetch('http://localhost:3001/api/tasks', { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('pms_token')}` } });
                fetch('http://localhost:3001/api/projects', { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('pms_token')}` } });
                setTimeout(() => window.location.reload(), 500);
              }} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600">Delete Everything</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
