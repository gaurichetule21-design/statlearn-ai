import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LearningPathwayVisualizer } from '../components/LearningPathwayVisualizer';
import { RecommendationCard } from '../components/RecommendationCard';
import {
  Milestone,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  PlayCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearningPathPage: React.FC = () => {
  const { currentUser, refreshUser, showToast } = useAuth();
  const [recData, setRecData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadPathway = async () => {
    setLoading(true);
    try {
      const data = await api.getRecommendations();
      setRecData(data);
    } catch (err) {
      console.error('Failed to load learning path:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPathway();
  }, [currentUser?.id]);

  const handleUpdateProgress = async (courseId: string, newProgress: number) => {
    setUpdatingId(courseId);
    try {
      await api.updateCourseProgress(courseId, newProgress);
      await refreshUser();
      await loadPathway();
      showToast(newProgress >= 100 ? 'Module completed! Competency boosted.' : `Progress updated to ${newProgress}%`);
    } catch (err) {
      showToast('Error updating progress.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && !recData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <span className="text-sm font-semibold text-white">Synthesizing Personalized Learning Pathway...</span>
      </div>
    );
  }

  const enrolled = currentUser?.enrolledCourses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Milestone className="w-4 h-4" />
          <span>Curriculum Roadmap</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Personalized Statistical Capacity Pathway
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Sequential upskilling tailored to {currentUser?.jobRoleTitle} competencies across iGOT Karmayogi & NSSTA Greater Noida.
        </p>
      </div>

      {/* Visual Roadmap Stepper */}
      {recData?.pathway && (
        <LearningPathwayVisualizer steps={recData.pathway} />
      )}

      {/* Currently Enrolled & Active Learning Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Active Modules & Course Progression ({enrolled.length})</span>
          </h2>
          <Link to="/courses" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1">
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {enrolled.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <p className="text-xs mb-3">No courses enrolled yet. Select recommended courses below to begin your roadmap.</p>
            <Link
              to="/courses"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs inline-block"
            >
              Explore Course Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolled.map(course => (
              <div
                key={course.courseId}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded border ${
                        course.provider.includes('iGOT')
                          ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {course.provider}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{course.title}</h3>
                  <div className="text-xs text-slate-400 mb-4">
                    Target Skill: <strong className="text-amber-400">{course.skill}</strong> • {course.level}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Completion Status</span>
                      <span className="font-bold text-emerald-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Progress Quick-Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Status: <strong className={course.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}>{course.status}</strong>
                  </span>

                  <div className="flex items-center space-x-1">
                    {[25, 50, 75, 100].map(pct => (
                      <button
                        key={pct}
                        disabled={updatingId === course.courseId || course.progress >= pct}
                        onClick={() => handleUpdateProgress(course.courseId, pct)}
                        className={`text-[10px] px-2 py-1 rounded transition-colors font-bold ${
                          course.progress >= pct
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 opacity-50'
                            : 'bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-950'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Targeted Recommendations */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Tailored Modules for Critical Competency Gaps</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recData?.recommendations?.slice(0, 6).map((rec: any) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onEnrolled={loadPathway}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
