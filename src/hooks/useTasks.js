import { useState, useEffect } from 'react';

const INITIAL_TASKS_TODAY = [
  { id: 1, app: 'Uber', color: '#ff3d6a', initial: 'u', title: 'Uber', desc: 'App Design and Upgrades with new features - In Progress 16 days' },
  { id: 2, app: 'Facebook', color: '#3b5998', initial: 'f', title: 'Facebook Ads', desc: 'Facebook Ads Design for CreativeCloud - Last worked 5 days ago' },
  { id: 3, app: 'Payoneer', color: '#5533ff', initial: 'P', title: 'Payoneer', desc: 'Payoneer Dashboard Design - Due in 3 days' }
];

const INITIAL_TASKS_TOMORROW = [
  { id: 4, app: 'Upwork', color: '#14a800', initial: 'up', title: 'Upwork', desc: 'Development - Viewed Just Now - Assigned 10 min ago' },
  { id: 5, app: 'Upwork2', color: '#14a800', initial: 'up', title: 'Upwork', desc: 'Development - Viewed Just Now - Assigned 10 min ago' }
];

export function useTasks() {
  const [tasksToday, setTasksToday] = useState(() => {
    const saved = localStorage.getItem('planti_tasks_today');
    return saved ? JSON.parse(saved) : INITIAL_TASKS_TODAY;
  });

  const [tasksTomorrow, setTasksTomorrow] = useState(() => {
    const saved = localStorage.getItem('planti_tasks_tomorrow');
    return saved ? JSON.parse(saved) : INITIAL_TASKS_TOMORROW;
  });

  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    localStorage.setItem('planti_tasks_today', JSON.stringify(tasksToday));
  }, [tasksToday]);

  useEffect(() => {
    localStorage.setItem('planti_tasks_tomorrow', JSON.stringify(tasksTomorrow));
  }, [tasksTomorrow]);

  // Methods to manipulate tasks can be added here
  const addTaskToday = (task) => setTasksToday(prev => [...prev, task]);
  const addTaskTomorrow = (task) => setTasksTomorrow(prev => [...prev, task]);
  const removeTaskToday = (id) => setTasksToday(prev => prev.filter(t => t.id !== id));
  const removeTaskTomorrow = (id) => setTasksTomorrow(prev => prev.filter(t => t.id !== id));

  return {
    tasksToday,
    tasksTomorrow,
    activeTab,
    setActiveTab,
    addTaskToday,
    addTaskTomorrow,
    removeTaskToday,
    removeTaskTomorrow
  };
}
