import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const TEAM = [
  { id: 1, name: 'John Doe', role: 'Frontend Developer', initials: 'JD', color: '#4c63db', email: 'john@example.com', status: 'online', tasks: 8 },
  { id: 2, name: 'Sara Miller', role: 'UI/UX Designer', initials: 'SM', color: '#e91e8c', email: 'sara@example.com', status: 'online', tasks: 5 },
  { id: 3, name: 'Raj Kumar', role: 'Backend Developer', initials: 'RK', color: '#9c27b0', email: 'raj@example.com', status: 'away', tasks: 11 },
  { id: 4, name: 'Amy Chen', role: 'Project Manager', initials: 'AC', color: '#ff9b44', email: 'amy@example.com', status: 'offline', tasks: 3 },
];

export function AppProvider({ children }) {
  const { user, updateProfile } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const [p, t] = await Promise.all([api.getProjects(), api.getTasks()]);
      setProjects(p);
      setTasks(t.map(t => ({ ...t, projectId: t.project_id, desc: t.description, when: t.when_scheduled, dueDate: t.due_date })));
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  // Projects
  const addProject = async (p) => {
    const created = await api.createProject({ title: p.title, description: p.desc, color: p.color, icon: p.icon, progress: p.progress || 0, status: 'active', priority: p.priority, due_date: p.dueDate, members: p.members || [] });
    setProjects(prev => [{ ...created, desc: created.description, dueDate: created.due_date, members: created.members || [] }, ...prev]);
  };

  const updateProject = async (id, p) => {
    const updated = await api.updateProject(id, { title: p.title, description: p.desc, color: p.color, icon: p.icon, progress: p.progress, status: p.status, priority: p.priority, due_date: p.dueDate, members: p.members || [] });
    setProjects(prev => prev.map(x => x.id === id ? { ...updated, desc: updated.description, dueDate: updated.due_date, members: updated.members || [] } : x));
  };

  const deleteProject = async (id) => {
    await api.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Tasks
  const addTask = async (t) => {
    const created = await api.createTask({ title: t.title, description: t.desc, color: t.color, initial: t.initial, priority: t.priority, status: 'active', due_date: t.dueDate, when_scheduled: t.when, project_id: t.projectId || null });
    setTasks(prev => [{ ...created, projectId: created.project_id, desc: created.description, when: created.when_scheduled, dueDate: created.due_date }, ...prev]);
  };

  const updateTask = async (id, t) => {
    const existing = tasks.find(x => x.id === id);
    const updated = await api.updateTask(id, { title: t.title, description: t.desc ?? t.description, color: t.color ?? existing?.color, initial: t.initial ?? existing?.initial, priority: t.priority, status: t.status ?? existing?.status, due_date: t.dueDate ?? t.due_date, when_scheduled: t.when ?? t.when_scheduled, project_id: t.projectId ?? t.project_id ?? null });
    setTasks(prev => prev.map(x => x.id === id ? { ...updated, projectId: updated.project_id, desc: updated.description, when: updated.when_scheduled, dueDate: updated.due_date } : x));
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completeTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'active' : 'completed';
    await updateTask(id, { ...task, status: newStatus });
  };

  const profile = user ? {
    name: user.name, email: user.email, role: user.role || 'User',
    initials: user.initials || user.name?.slice(0, 2).toUpperCase(),
    bio: user.bio || '', phone: user.phone || '', location: user.location || ''
  } : {};

  const setProfile = async (data) => { await updateProfile(data); };

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
      profile, setProfile, dataLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
