import React, { useState } from 'react';
import { UserSkillGap, GapClassification } from '../types';
import { api } from '../services/api';
import { Sparkles, AlertCircle, CheckCircle2, ChevronRight, Loader2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SkillGapCardProps {
  skill: UserSkillGap;
  onExploreCourse?: (skillName: string) => void;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({ skill, onExploreCourse }) => {
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getBadge = (classification: GapClassification) => {
    switch (classification) {
      case 'Critical Gap':
        return {
          text: '🔴 Critical Gap',
          bg: 'bg-red-950/70 border-red-800 text-red-300',
          barColor: 'bg-red-500',
        };
      case 'Moderate Gap':
        return {
          text: '🟠 Moderate Gap',
          bg: 'bg-amber-950/70 border-amber-800 text-amber-300',
          barColor: 'bg-amber-500',
        };
      case 'Strong Competency':
      default:
        return {
          text: '🟢 Strong Competency',
          bg: 'bg-emerald-950/70 border-emerald-800 text-emerald-300',
          barColor: 'bg-emerald-500',
        };
    }
  };

  const badge = getBadge(skill.classification);

  const handleExplain = async () => {
    setShowModal(true);
    if (!explanation) {
      setExplaining(true);
      try {
        const text = await api.explainSkillGap(
          skill.skillName,
          skill.currentLevel,
          skill.requiredLevel,
          skill.gap
        );
        setExplanation(text);
      } catch (err) {
        setExplanation('Analysis currently unavailable. Please check your network connection.');
      } finally {
        setExplaining(false);
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-xl p-4 shadow-md flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="text-sm font-semibold text-white leading-tight">{skill.skillName}</h4>
            <span className="text-[11px] text-slate-400">{skill.category}</span>
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${badge.bg}`}
          >
            {badge.text}
          </span>
        </div>

        {/* Level Stats */}
        <div className="grid grid-cols-3 gap-2 my-3 p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 text-center">
          <div>
            <div className="text-[10px] text-slate-400">Current</div>
            <div className="text-sm font-bold text-white">{skill.currentLevel}%</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Required</div>
            <div className="text-sm font-bold text-indigo-300">{skill.requiredLevel}%</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Gap</div>
            <div
              className={`text-sm font-bold ${
                skill.gap > 25 ? 'text-red-400' : skill.gap > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {skill.gap > 0 ? `-${skill.gap}` : '0'}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Competency Progress</span>
            <span>Priority: <strong className="text-slate-200">{skill.priority}</strong></span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
            {/* Required benchmark indicator marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-indigo-400 z-10"
              style={{ left: `${skill.requiredLevel}%` }}
              title={`Required standard: ${skill.requiredLevel}%`}
            />
            <div
              className={`h-full rounded-full transition-all duration-300 ${badge.barColor}`}
              style={{ width: `${Math.min(100, skill.currentLevel)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={handleExplain}
          className="inline-flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>AI Insight</span>
        </button>

        {skill.gap > 0 ? (
          <Link
            to={`/courses?search=${encodeURIComponent(skill.skillName)}`}
            className="inline-flex items-center space-x-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <span>Bridge Gap</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        ) : (
          <span className="text-[10px] text-emerald-400 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Standard Met
          </span>
        )}
      </div>

      {/* AI Explanation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">AI Skill Gap Analysis</h4>
                  <p className="text-xs text-slate-400">{skill.skillName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="py-4 text-xs text-slate-300 space-y-3 leading-relaxed max-h-96 overflow-y-auto">
              {explaining ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                  <span>Consulting MoSPI Competency Intelligence Engine...</span>
                </div>
              ) : (
                <div className="whitespace-pre-line text-slate-200 text-xs leading-relaxed">
                  {explanation}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
              <Link
                to={`/courses?search=${encodeURIComponent(skill.skillName)}`}
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1"
              >
                <span>View Recommended Modules</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
