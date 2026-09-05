import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SkillRadarChart } from '../components/SkillRadarChart';
import { SkillGapCard } from '../components/SkillGapCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { LearningPathwayVisualizer } from '../components/LearningPathwayVisualizer';
import {
  BarChart3,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Layers,
  ChevronRight,
  Loader2,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeDashboardPage: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const [skillGapData, setSkillGapData] = useState<any>(null);
  const [recData, setRecData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [gaps, recs] = await Promise.all([
          api.getSkillGaps(25, 0),
          api.getRecommendations(),
        ]);
        setSkillGapData(gaps);
        setRecData(recs);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [currentUser?.id]);

  if (loading || !currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <span className="text-sm font-semibold text-white">Loading Officer Intelligence Dashboard...</span>
      </div>
    );
  }

  const criticalCount = skillGapData?.criticalGaps?.length || 0;
  const moderateCount = skillGapData?.moderateGaps?.length || 0;
  const strongCount = skillGapData?.strongCompetencies?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Profile Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center space-x-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow-md"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{currentUser.name}</h1>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {currentUser.designation}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {currentUser.department} • <span className="text-amber-400">{currentUser.jobRoleTitle}</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              Current Assignment: {currentUser.currentAssignment}
            </p>
          </div>
        </div>

        {/* Competency Metric Box */}
        <div className="flex items-center space-x-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">Overall Competency</div>
            <div className="text-3xl font-black text-emerald-400 leading-none mt-0.5">
              {currentUser.overallCompetency}%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Role Benchmark Standard: 75%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/assessment"
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all group flex items-center space-x-3"
        >
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Take Assessment</div>
            <div className="text-[10px] text-slate-400">Evaluate Skills</div>
          </div>
        </Link>

        <Link
          to="/skill-gaps"
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all group flex items-center space-x-3"
        >
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-slate-950 transition-colors">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">View Skill Gaps</div>
            <div className="text-[10px] text-slate-400">Deep Diagnostics</div>
          </div>
        </Link>

        <Link
          to="/courses"
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all group flex items-center space-x-3"
        >
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Explore Courses</div>
            <div className="text-[10px] text-slate-400">iGOT & NSSTA</div>
          </div>
        </Link>

        <Link
          to="/quiz-generator"
          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all group flex items-center space-x-3"
        >
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Generate Quiz</div>
            <div className="text-[10px] text-slate-400">From Documents</div>
          </div>
        </Link>
      </div>

      {/* Radar Chart & Summary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {skillGapData?.radarChartData && (
            <SkillRadarChart
              data={skillGapData.radarChartData}
              title="Competency Radar vs Official Benchmark"
              height={320}
            />
          )}
        </div>

        {/* Skill Gap Classification Breakdown Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Competency Classification</h3>
            <p className="text-xs text-slate-400 mb-4">Evaluated against {currentUser.jobRoleTitle} benchmarks</p>

            <div className="space-y-3">
              <div className="p-3 bg-red-950/20 border border-red-800/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div>
                    <div className="text-xs font-bold text-red-300">Critical Gaps</div>
                    <div className="text-[10px] text-slate-400">Urgent intervention required</div>
                  </div>
                </div>
                <span className="text-lg font-black text-red-400">{criticalCount}</span>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-800/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div>
                    <div className="text-xs font-bold text-amber-300">Moderate Gaps</div>
                    <div className="text-[10px] text-slate-400">Targeted upskilling</div>
                  </div>
                </div>
                <span className="text-lg font-black text-amber-400">{moderateCount}</span>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-800/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <div className="text-xs font-bold text-emerald-300">Strong Competencies</div>
                    <div className="text-[10px] text-slate-400">Standard met or exceeded</div>
                  </div>
                </div>
                <span className="text-lg font-black text-emerald-400">{strongCount}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <Link
              to="/skill-gaps"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
            >
              <span>Explore Detailed Gap Analysis</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Priority Learning Areas (Top Gaps) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Priority Competency Gaps for Action</h2>
            <p className="text-xs text-slate-400">Identified based on designated role priorities</p>
          </div>
          <Link to="/skill-gaps" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1">
            <span>View All Competencies</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGapData?.priorityAreas?.slice(0, 3).map((s: any) => (
            <SkillGapCard key={s.skillId} skill={s} />
          ))}
        </div>
      </div>

      {/* Personalized Learning Pathway */}
      {recData?.pathway && (
        <LearningPathwayVisualizer steps={recData.pathway} />
      )}

      {/* Recommended Courses (iGOT Karmayogi & NSSTA / TPAC) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Capacity Building Modules</span>
            </h2>
            <p className="text-xs text-slate-400">
              Curated from iGOT Karmayogi online & NSSTA Greater Noida residential programmes
            </p>
          </div>
          <Link to="/courses" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1">
            <span>Full Course Catalog ({recData?.counts?.total || 12})</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recData?.recommendations?.slice(0, 3).map((rec: any) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onEnrolled={refreshUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
