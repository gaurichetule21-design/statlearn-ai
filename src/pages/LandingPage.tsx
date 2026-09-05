import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
  FileText,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Database,
  Search,
} from 'lucide-react';
import { COMPETENCY_CATEGORIES, SKILLS_DATA } from '../data/competencies';

export const LandingPage: React.FC = () => {
  const { allUsers, switchUser } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>(COMPETENCY_CATEGORIES[0]);

  const handleQuickLogin = async (userId: string, targetPath: string) => {
    await switchUser(userId);
    navigate(targetPath);
  };

  const filteredSkills = SKILLS_DATA.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top National Official Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs px-4 py-1.5 flex items-center justify-between text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">GOVERNMENT OF INDIA</span>
          <span>•</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span>National Statistical Systems Training Academy (NSSTA)</span>
          <span>•</span>
          <span className="text-amber-400 font-medium">Mission Karmayogi Aligned</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Skill Intelligence for India's Statistical Workforce</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              StatLearn <span className="text-amber-400">AI</span>
              <span className="block text-2xl sm:text-3xl font-semibold text-slate-300 mt-2">
                Modernizing India's Official Statistical Cadre
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              StatLearn AI identifies individual and organizational competency gaps across the 
              <strong> Indian Statistical Service (ISS)</strong> and <strong>Subordinate Statistical Service (SSS)</strong>,
              curates personalized learning pathways across <strong>iGOT Karmayogi</strong> and <strong>NSSTA</strong>,
              and generates contextual quizzes from official statistical documentation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <button
                onClick={() => handleQuickLogin('user_rajesh_sharma', '/dashboard')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 text-sm flex items-center space-x-2"
              >
                <span>Enter Officer Portal (ISS Director)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickLogin('user_admin_head', '/admin')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all text-sm flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Admin Workforce Analytics</span>
              </button>

              <Link
                to="/quiz-generator"
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold rounded-xl border border-amber-500/30 transition-all text-sm flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Launch AI Quiz Generator</span>
              </Link>
            </div>

            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-2xl font-bold text-white">2,450+</div>
                <div className="text-[11px] text-slate-400">Target Statistical Cadre</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-2xl font-bold text-amber-400">4 Categories</div>
                <div className="text-[11px] text-slate-400">33 Standard Competencies</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-2xl font-bold text-indigo-400">Dual Platform</div>
                <div className="text-[11px] text-slate-400">iGOT Karmayogi & NSSTA</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-2xl font-bold text-emerald-400">RAG AI</div>
                <div className="text-[11px] text-slate-400">Grounded Quiz Generation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem / Challenge */}
      <section className="py-16 border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-2">The Operational Challenge</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Why India's Statistical Workforce Needs StatLearn AI</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              The Indian Statistical Cadre oversees vital economic indices and surveys, but faces unprecedented technological transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-red-950/70 text-red-400 flex items-center justify-center mb-4 border border-red-800">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Rapid Technological Shift</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transition from manual field schedules to Computer-Assisted Personal Interviewing (CAPI), AI-automated coding of industrial classifications, and geospatial satellite validation creates urgent demand for Python, SQL, and ML competencies.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-950/70 text-amber-400 flex items-center justify-center mb-4 border border-amber-800">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Heterogeneous Skill Baselines</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Senior officers possess deep theoretical econometric mastery but limited modern coding exposure, while junior officers know coding but need domain context in national accounts and multi-stage survey variance estimation.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/70 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-800">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Data Privacy & Governance Mandates</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enactment of the Digital Personal Data Protection (DPDP) Act 2023 requires 100% statutory compliance across field microdata collection, anonymization protocols, and secure administrative reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Competency Framework Section */}
      <section className="py-16 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-2">Official Competency Framework</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">33 Standard Statistical & Governance Competencies</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Mapped directly to official Indian statistical designations (Director, Joint Director, Senior Statistical Officer, Junior Statistical Officer).
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {COMPETENCY_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === category
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map(skill => (
              <div
                key={skill.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-white">{skill.name}</h4>
                    <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-mono">
                      Bench: {skill.benchmarkScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{skill.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Relevance: Official Cadre</span>
                  <span className="text-amber-400 font-semibold">{skill.importance} Priority</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How StatLearn AI Works */}
      <section className="py-16 border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-2">End-to-End Workflow</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">How StatLearn AI Drives Officer Progression</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Officer Profiling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captures designation, statistical division, past training history, and existing technical skill self-evaluations.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-white mb-2">AI Assessment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adaptive assessments calibrated to official roles test practical knowledge without arbitrary score generation.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Skill Gap Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates gaps against role benchmarks. Classifies as 🔴 Critical, 🟠 Moderate, or 🟢 Strong with Gemini explanations.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm mb-3">
                4
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Targeted Upskilling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct integration with iGOT Karmayogi online courses and NSSTA Greater Noida residential masterclasses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Demo Officer Switcher */}
      <section className="py-16 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-2">Interactive Demo Profiles</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Experience StatLearn AI from Different Perspectives</h3>
            <p className="text-xs text-slate-400 mt-2">
              Select any profile to load real competency profiles, skill gaps, and custom recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allUsers.slice(0, 4).map(user => (
              <div
                key={user.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{user.name}</h4>
                      <p className="text-xs text-amber-400 font-medium">{user.designation}</p>
                      <span className="text-[10px] text-slate-400">{user.department.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 mb-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">Role:</div>
                    <div className="font-semibold text-white truncate">{user.jobRoleTitle}</div>
                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Competency:</span>
                      <span className="font-bold text-emerald-400">{user.overallCompetency}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickLogin(user.id, user.role === 'admin' ? '/admin' : '/dashboard')}
                  className="w-full py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
                >
                  <span>Launch {user.role === 'admin' ? 'Admin' : 'Officer'} View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
              SL
            </div>
            <div>
              <div className="font-bold text-white text-sm">StatLearn AI</div>
              <div className="text-[11px] text-slate-400">Ministry of Statistics and Programme Implementation (MoSPI)</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <Link to="/dashboard" className="hover:text-amber-400">Officer Dashboard</Link>
            <Link to="/skill-gaps" className="hover:text-amber-400">Skill Gaps</Link>
            <Link to="/courses" className="hover:text-amber-400">Course Catalogue</Link>
            <Link to="/quiz-generator" className="hover:text-amber-400">AI Quiz Generator</Link>
            <Link to="/admin" className="hover:text-amber-400">Admin Workforce Analytics</Link>
          </div>

          <div className="text-[11px] text-slate-400">
            Smart India Hackathon MVP Demonstration • National Statistical System
          </div>
        </div>
      </footer>
    </div>
  );
};
