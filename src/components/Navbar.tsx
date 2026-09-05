import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  ExternalLink,
  BookOpen,
  LogOut,
  Award,
  BarChart3,
  UserCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, allUsers, switchUser, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserChange = async (userId: string) => {
    await switchUser(userId);
    setDropdownOpen(false);
    // If switched to admin, navigate to admin dashboard; else employee dashboard
    const user = allUsers.find(u => u.id === userId);
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (location.pathname.startsWith('/admin')) {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top National Official Bar */}
      <div className="bg-slate-950 px-4 py-1 border-b border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-300">GOVERNMENT OF INDIA</span>
          <span className="text-slate-600">|</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">NSSTA & iGOT Karmayogi Ecosystem</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-300">
          <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-semibold border border-emerald-800">
            OFFICIAL STATISTICAL WORKFORCE MVP
          </span>
          <Link to="/" className="hover:text-amber-400 transition-colors">
            Portal Home
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-700 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-bold tracking-tight text-white">StatLearn</span>
                  <span className="text-xs bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-wide">
                  Skill Intelligence for India's Statistical Workforce
                </p>
              </div>
            </Link>

            {/* Portal Badges */}
            <div className="hidden lg:flex items-center space-x-2 ml-4 pl-4 border-l border-slate-800">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                <BookOpen className="w-3 h-3 mr-1 text-indigo-400" />
                iGOT Karmayogi
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800">
                <Award className="w-3 h-3 mr-1 text-amber-400" />
                NSSTA / TPAC
              </span>
            </div>
          </div>

          {/* User Controls & Quick Switcher */}
          <div className="flex items-center space-x-3">
            {/* Employee vs Admin Switch Toggle */}
            <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => {
                  if (isAdmin) {
                    const emp = allUsers.find(u => u.role === 'employee');
                    if (emp) handleUserChange(emp.id);
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  !isAdmin
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Officer View
              </button>
              <button
                onClick={() => {
                  if (!isAdmin) {
                    const adm = allUsers.find(u => u.role === 'admin');
                    if (adm) handleUserChange(adm.id);
                  } else {
                    navigate('/admin');
                  }
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  isAdmin
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin Analytics
              </button>
            </div>

            {/* Profile Dropdown / Quick Officer Switcher */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors text-left"
              >
                <div className="relative">
                  <img
                    src={
                      currentUser?.avatar ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
                    }
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-600"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${
                      isAdmin ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center space-x-1">
                    <span>{currentUser?.name?.split(' ')[0] || 'Officer'}</span>
                    {isAdmin && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                    {currentUser?.designation || 'Statistical Officer'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 bg-slate-800/50">
                    <div className="text-xs text-slate-400">Signed in as</div>
                    <div className="text-sm font-bold text-white">{currentUser?.name}</div>
                    <div className="text-xs text-amber-400 font-medium">{currentUser?.designation}</div>
                    <div className="text-[11px] text-slate-400">{currentUser?.department}</div>
                    <div className="mt-2 flex items-center justify-between text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
                      <span className="text-slate-400">Competency Score:</span>
                      <span className="font-bold text-emerald-400">{currentUser?.overallCompetency}%</span>
                    </div>
                  </div>

                  {/* Switch Demo Profiles */}
                  <div className="py-2">
                    <div className="px-4 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      Switch Demo Officer
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-0.5 px-1">
                      {allUsers.map(user => (
                        <button
                          key={user.id}
                          onClick={() => handleUserChange(user.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            user.id === currentUser?.id
                              ? 'bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="font-medium text-white truncate">{user.name}</div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {user.designation} • {user.department.split(' ')[0]}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              user.role === 'admin'
                                ? 'bg-indigo-900/60 text-indigo-300'
                                : 'bg-slate-800 text-emerald-400'
                            }`}
                          >
                            {user.overallCompetency}%
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      Edit Officer Profile
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-red-400 hover:bg-slate-800 hover:text-red-300"
                    >
                      Switch / Re-Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
