import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

interface AppLayoutProps {
  children?: React.ReactNode;
  showSidebar?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, showSidebar = true }) => {
  const { toastMessage } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/40 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex w-full">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-x-hidden bg-slate-950 min-h-[calc(100vh-4.25rem)]">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
