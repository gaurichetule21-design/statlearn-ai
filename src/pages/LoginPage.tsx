import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Shield, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { allUsers, login } = useAuth();
  const navigate = useNavigate();

  const handleSelectUser = async (userId: string, role: string) => {
    await login(userId);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-slate-100">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">StatLearn AI Authentication</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ministry of Statistics and Programme Implementation (MoSPI) Single Sign-On Portal
          </p>
        </div>

        {/* Persona Switcher List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Select an Official Profile to Log In:</span>
            <span className="text-amber-400 font-medium">1-Click Instant Access</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {allUsers.map(user => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id, user.role)}
                className="w-full p-3.5 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 truncate">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div className="truncate">
                    <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {user.designation} • {user.department}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        : 'bg-slate-800 text-emerald-400 border border-slate-700'
                    }`}
                  >
                    {user.role === 'admin' ? 'ADMIN' : `${user.overallCompetency}%`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
          StatLearn AI Prototype • Compliant with Indian Official Statistical Standards
        </div>
      </div>
    </div>
  );
};
