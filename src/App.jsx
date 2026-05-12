import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function PageRouter() {
  const { activePage } = useApp();
  const pages = {
    dashboard: <Dashboard />,
    projects: <Projects />,
    tasks: <Tasks />,
    team: <Team />,
    profile: <Profile />,
    settings: <Settings />,
  };
  return pages[activePage] || <Dashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex w-full h-screen bg-theme-bg overflow-hidden text-text-main font-sans text-sm p-4 gap-4">
        <Sidebar />
        <PageRouter />
        <RightSidebar />
      </div>
    </AppProvider>
  );
}
