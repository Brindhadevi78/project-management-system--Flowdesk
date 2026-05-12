import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_PROJECTS = [
  { id: 1, title: 'Banking Mobile App', desc: 'R&D and design for new banking app', color: '#ff9b44', icon: 'ph-device-mobile', progress: 47, status: 'active', dueDate: '2025-08-15', members: ['JD', 'SM', 'RK'], priority: 'high' },
  { id: 2, title: 'E-Commerce Platform', desc: 'Full stack e-commerce website', color: '#5d387f', icon: 'ph-shopping-cart', progress: 72, status: 'active', dueDate: '2025-07-30', members: ['JD', 'RK'], priority: 'high' },
  { id: 3, title: 'Dashboard Redesign', desc: 'UI/UX redesign for admin panel', color: '#4c63db', icon: 'ph-layout', progress: 90, status: 'active', dueDate: '2025-07-10', members: ['SM', 'RK'], priority: 'medium' },
  { id: 4, title: 'Marketing Website', desc: 'Landing page and marketing site', color: '#14a800', icon: 'ph-globe', progress: 30, status: 'active', dueDate: '2025-09-01', members: ['JD', 'SM'], priority: 'low' },
];

const INITIAL_TASKS = [
  { id: 1, title: 'Design Login Screen', desc: 'Create wireframes and mockups', projectId: 1, priority: 'high', status: 'active', dueDate: '2025-07-05', color: '#ff9b44', initial: 'D', when: 'today', createdAt: Date.now() },
  { id: 2, title: 'Facebook Ads Design', desc: 'Design ads for CreativeCloud campaign', projectId: 2, priority: 'medium', status: 'active', dueDate: '2025-07-08', color: '#3b5998', initial: 'F', when: 'today', createdAt: Date.now() },
  { id: 3, title: 'Payoneer Dashboard', desc: 'Dashboard design - Due in 3 days', projectId: 3, priority: 'high', status: 'active', dueDate: '2025-07-06', color: '#5533ff', initial: 'P', when: 'today', createdAt: Date.now() },
  { id: 4, title: 'API Integration', desc: 'Integrate payment gateway APIs', projectId: 1, priority: 'high', status: 'active', dueDate: '2025-07-09', color: '#14a800', initial: 'A', when: 'tomorrow', createdAt: Date.now() },
  { id: 5, title: 'Write Unit Tests', desc: 'Cover core modules with tests', projectId: 2, priority: 'low', status: 'active', dueDate: '2025-07-12', color: '#fc7941', initial: 'W', when: 'tomorrow', createdAt: Date.now() },
  { id: 6, title: 'Setup CI/CD Pipeline', desc: 'Configure GitHub Actions', projectId: 3, priority: 'medium', status: 'completed', dueDate: '2025-07-01', color: '#4c63db', initial: 'S', when: 'today', createdAt: Date.now() },
];

const TEAM = [
  { id: 1, name: 'John Doe', role: 'Frontend Developer', initials: 'JD', color: '#4c63db', email: 'john@example.com', status: 'online', tasks: 8 },
  { id: 2, name: 'Sara Miller', role: 'UI/UX Designer', initials: 'SM', color: '#e91e8c', email: 'sara@example.com', status: 'online', tasks: 5 },
  { id: 3, name: 'Raj Kumar', role: 'Backend Developer', initials: 'RK', color: '#9c27b0', email: 'raj@example.com', status: 'away', tasks: 11 },
  { id: 4, name: 'Amy Chen', role: 'Project Manager', initials: 'AC', color: '#ff9b44', email: 'amy@example.com', status: 'offline', tasks: 3 },
];

function load(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [projects, setProjects] = useState(() => load('pms_projects', INITIAL_PROJECTS));
  const [tasks, setTasks] = useState(() => load('pms_tasks', INITIAL_TASKS));
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfileState] = useState(() => load('pms_profile', {
    name: 'AR Shakir', email: 'hi@arshakir.com', role: 'Product Designer',
    initials: 'AS', bio: 'Passionate about building great products.',
    phone: '+1 234 567 890', location: 'New York, USA'
  }));

  useEffect(() => { localStorage.setItem('pms_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('pms_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('pms_profile', JSON.stringify(profile)); }, [profile]);

  const addProject = (p) => setProjects(prev => [{ ...p, id: Date.now(), progress: p.progress || 0, status: 'active' }, ...prev]);
  const updateProject = (id, data) => setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deleteProject = (id) => setProjects(prev => prev.filter(p => p.id !== id));

  const addTask = (t) => setTasks(prev => [{ ...t, id: Date.now(), createdAt: Date.now(), status: 'active' }, ...prev]);
  const updateTask = (id, data) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const completeTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'active' : 'completed' } : t));

  const setProfile = (data) => setProfileState(data);

  const stats = {
    totalTasks: tasks.length,
    activeTasks: tasks.filter(t => t.status === 'active').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    todayTasks: tasks.filter(t => t.when === 'today' && t.status === 'active').length,
    overdueTasks: tasks.filter(t => t.status === 'active' && t.dueDate && new Date(t.dueDate) < new Date()).length,
    activeProjects: projects.filter(p => p.status === 'active').length,
  };

  return (
    <AppContext.Provider value={{
      activePage, setActivePage,
      projects, addProject, updateProject, deleteProject,
      tasks, addTask, updateTask, deleteTask, completeTask,
      team: TEAM, stats, searchQuery, setSearchQuery,
      profile, setProfile
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
