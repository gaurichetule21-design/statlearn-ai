import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SkillRadarChart } from '../components/SkillRadarChart';
import { SkillGapCard } from '../components/SkillGapCard';
import { COMPETENCY_CATEGORIES } from '../data/competencies';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  GitCompare,
  Sliders,
  Filter,
  Sparkles,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [criticalThreshold, setCriticalThreshold] = useState<number>(25);
  const [moderateThreshold, setModerateThreshold] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [gapData, setGapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchGaps = async () => {
    setLoading(true);
    try {
      const data = await api.getSkillGaps(criticalThreshold, moderateThreshold);
      setGapData(data);
    } catch (err) {
      console.error('Failed to fetch gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, [criticalThreshold, moderateThreshold, currentUser?.id]);

  if (loading && !gapData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <span className="text-sm font-semibold text-white">Calculating Competency Gaps...</span>
      </div>
    );
  }

  // Filter skills
  const skills = gapData?.skills || [];
  const filteredSkills = skills.filter((s: any) => {
    const matchCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchClassification =
      activeFilter === 'All' ||
      (activeFilter === 'Critical' && s.classification === 'Critical Gap') ||
      (activeFilter === 'Moderate' && s.classification === 'Moderate Gap') ||
      (activeFilter === 'Strong' && s.classification === 'Strong Competency');
    return matchCategory && matchClassification;
  });

  // Data for Skill Comparison Bar Chart
  const comparisonData = skills.slice(0, 12).map((s: any) => ({
    name: s.skillName.length > 14 ? s.skillName.substring(0, 14) + '...' : s.skillName,
    Current: s.currentLevel,
    Required: s.requiredLevel,
    Gap: s.gap,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Diagnostic Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Competency Gap Analysis & Benchmark Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Role: <strong className="text-slate-200">{currentUser?.jobRoleTitle}</strong> ({currentUser?.department})
          </p>
        </div>

        {/* Threshold Controls Box */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md space-y-2">
          <div className="text-xs font-bold text-white flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Configurable Gap Classification Threshold</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">Critical Gap &gt;</span>
              <input
                type="number"
                min="10"
                max="50"
                value={criticalThreshold}
                onChange={e => setCriticalThreshold(parseInt(e.target.value) || 25)}
                className="w-14 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-amber-400 font-bold text-center"
              />
              <span className="text-[11px] text-slate-400">pts</span>
            </div>

            <div className="text-[10px] text-slate-500">
              (Current threshold marks gaps &gt; {criticalThreshold} as 🔴 Critical)
            </div>
          </div>
        </div>
      </div>

      {/* KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveFilter(activeFilter === 'Critical' ? 'All' : 'Critical')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'Critical'
              ? 'bg-red-950/40 border-red-500 ring-1 ring-red-500'
              : 'bg-slate-900 border-slate-800 hover:border-red-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-red-400">🔴 Critical Gaps</span>
            <span className="text-2xl font-black text-white">{gapData?.criticalGaps?.length || 0}</span>
          </div>
          <p className="text-[11px] text-slate-400">Gap &gt; {criticalThreshold} points below benchmark</p>
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'Moderate' ? 'All' : 'Moderate')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'Moderate'
              ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500'
              : 'bg-slate-900 border-slate-800 hover:border-amber-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-400">🟠 Moderate Gaps</span>
            <span className="text-2xl font-black text-white">{gapData?.moderateGaps?.length || 0}</span>
          </div>
          <p className="text-[11px] text-slate-400">Gap between 1 and {criticalThreshold} points</p>
        </button>

        <button
          onClick={() => setActiveFilter(activeFilter === 'Strong' ? 'All' : 'Strong')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'Strong'
              ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
              : 'bg-slate-900 border-slate-800 hover:border-emerald-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-400">🟢 Strong Competencies</span>
            <span className="text-2xl font-black text-white">{gapData?.strongCompetencies?.length || 0}</span>
          </div>
          <p className="text-[11px] text-slate-400">Meeting or exceeding standard benchmark</p>
        </button>
      </div>

      {/* Comparison Visualizer Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recharts Bar Comparison Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-1">Skill Comparison Chart</h3>
          <p className="text-xs text-slate-400 mb-4">Assessed Level vs Required Role Benchmark</p>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Current" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Required" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        {gapData?.radarChartData && (
          <SkillRadarChart
            data={gapData.radarChartData}
            title="Multi-Dimensional Competency Balance"
            height={320}
          />
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === 'All'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Categories
            </button>
            {COMPETENCY_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredSkills.length}</strong> competencies
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((s: any) => (
            <SkillGapCard key={s.skillId} skill={s} />
          ))}
        </div>
      </div>
    </div>
  );
};
