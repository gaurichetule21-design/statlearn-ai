import React, { useState } from 'react';
import { Recommendation } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, Clock, Sparkles, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onEnrolled?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onEnrolled,
}) => {
  const { currentUser, refreshUser, showToast } = useAuth();
  const [enrolling, setEnrolling] = useState(false);

  const isEnrolled = currentUser?.enrolledCourses.some(
    ec => ec.courseId === recommendation.courseId
  );
  const enrolledRecord = currentUser?.enrolledCourses.find(
    ec => ec.courseId === recommendation.courseId
  );

  const isIgot = recommendation.source === 'iGOT Karmayogi';

  const handleEnroll = async () => {
    if (isEnrolled) return;
    setEnrolling(true);
    try {
      await api.enrollCourse(recommendation.courseId);
      await refreshUser();
      showToast(`Enrolled in "${recommendation.courseTitle}"`);
      if (onEnrolled) onEnrolled();
    } catch (err) {
      showToast('Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'High':
        return 'bg-red-950/80 text-red-300 border-red-800';
      case 'Medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-xl p-4 shadow-md flex flex-col justify-between">
      <div>
        {/* Source & Priority Header */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
              isIgot
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
                : 'bg-amber-950/80 text-amber-300 border-amber-800'
            }`}
          >
            {isIgot ? (
              <BookOpen className="w-3 h-3 mr-1 text-indigo-400" />
            ) : (
              <Award className="w-3 h-3 mr-1 text-amber-400" />
            )}
            {recommendation.source}
          </span>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(
              recommendation.priority
            )}`}
          >
            {recommendation.priority} Priority
          </span>
        </div>

        {/* Title & Metadata */}
        <h4 className="text-sm font-bold text-white mb-1 leading-snug line-clamp-2">
          {recommendation.courseTitle}
        </h4>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mb-3">
          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
            {recommendation.skill}
          </span>
          <span>•</span>
          <span>{recommendation.level}</span>
          <span>•</span>
          <span className="inline-flex items-center">
            <Clock className="w-3 h-3 mr-1 text-slate-400" />
            {recommendation.duration}
          </span>
        </div>

        {/* Rationale / Reason */}
        <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs text-slate-300 mb-3">
          <div className="text-[10px] font-semibold text-amber-400 flex items-center mb-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Reason for Recommendation:
          </div>
          <p className="line-clamp-3 leading-relaxed text-[11px] text-slate-300">
            {recommendation.reason}
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
          {recommendation.provider}
        </span>

        {isEnrolled ? (
          <div className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Enrolled ({enrolledRecord?.progress || 0}%)</span>
          </div>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors inline-flex items-center space-x-1 shadow-sm disabled:opacity-50"
          >
            {enrolling ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Enrolling...</span>
              </>
            ) : (
              <>
                <span>Enroll in Module</span>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
