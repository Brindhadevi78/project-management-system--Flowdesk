import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';

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

function AppShell() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking token
  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-[3px]">
            <div className="w-2 h-5 bg-brand-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-7 bg-brand-purple-800 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
            <div className="w-2 h-5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
          </div>
          <p className="text-slate-400 font-medium text-sm">Loading FlowDesk...</p>
        </div>
      </div>
    );
  }

  // No user → always show login page
  if (!user) {
    return <LoginPage />;
  }

  // Authenticated → show the app
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

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
