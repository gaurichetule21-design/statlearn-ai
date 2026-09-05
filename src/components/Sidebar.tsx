import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserCircle,
  FileCheck2,
  GitCompare,
  Milestone,
  GraduationCap,
  Sparkles,
  History,
  Bot,
  BarChart,
  Users,
  Target,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Award,
  Zap,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();

  const isCurrentAdminRoute = location.pathname.startsWith('/admin') || isAdmin;

  const employeeNavItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', to: '/profile', icon: UserCircle },
    { label: 'Competency Assessment', to: '/assessment', icon: FileCheck2 },
    { label: 'Skill Gaps', to: '/skill-gaps', icon: GitCompare },
    { label: 'Learning Path', to: '/learning-path', icon: Milestone },
    { label: 'Courses', to: '/courses', icon: GraduationCap },
    { label: 'Quiz Generator', to: '/quiz-generator', icon: Sparkles, badge: 'AI-RAG' },
    { label: 'Quiz History', to: '/quiz-history', icon: History },
    { label: 'AI Assistant', to: '/assistant', icon: Bot, badge: 'Gemini' },
  ];

  const adminNavItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard },
    { label: 'Workforce', to: '/admin?tab=workforce', icon: Users },
    { label: 'Competencies', to: '/admin?tab=competencies', icon: Layers },
    { label: 'Skill Gaps', to: '/admin?tab=gaps', icon: GitCompare },
    { label: 'Training Analytics', to: '/admin?tab=training', icon: BarChart },
    { label: 'Emerging Skills', to: '/admin?tab=emerging', icon: TrendingUp, badge: '+42%' },
    { label: 'Recommendations', to: '/admin?tab=recommendations', icon: Target },
    { label: 'Reports', to: '/admin?tab=reports', icon: FileSpreadsheet },
  ];

  const navItems = isCurrentAdminRoute ? adminNavItems : employeeNavItems;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4.25rem)]">
      {/* Sidebar Header Badge */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {isCurrentAdminRoute ? 'Administrative Console' : 'Officer Learning Portal'}
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isCurrentAdminRoute
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}
          >
            {isCurrentAdminRoute ? 'ADMIN' : 'OFFICER'}
          </span>
        </div>
        <div className="mt-2 text-xs font-medium text-slate-200 truncate">
          {currentUser?.jobRoleTitle || 'Official Statistical System'}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.to ||
            (item.to.includes('?') &&
              location.pathname === item.to.split('?')[0] &&
              location.search === `?${item.to.split('?')[1]}`);

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isActive
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-slate-800 text-amber-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Officer Summary Card in Sidebar */}
      {!isCurrentAdminRoute && currentUser && (
        <div className="p-3 m-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Overall Competency</span>
            <span className="font-bold text-emerald-400">{currentUser.overallCompetency}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentUser.overallCompetency}%` }}
            />
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Enrolled Modules:</span>
            <span className="font-semibold text-white">{currentUser.enrolledCourses.length}</span>
          </div>
        </div>
      )}

      {/* Indian Official Statistics Institutional Footer */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-400 text-center">
        National Statistical Systems Training Academy (NSSTA) • iGOT Karmayogi
      </div>
    </aside>
  );
};
