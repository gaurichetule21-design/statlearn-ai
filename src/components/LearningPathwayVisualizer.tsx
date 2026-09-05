import React from 'react';
import { CheckCircle2, Circle, ArrowRight, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PathwayStep {
  step: number;
  skill: string;
  code: string;
  status: string;
  courseTitle: string;
  source: string;
  duration: string;
  priority: string;
  completed: boolean;
}

interface LearningPathwayVisualizerProps {
  steps: PathwayStep[];
}

export const LearningPathwayVisualizer: React.FC<LearningPathwayVisualizerProps> = ({ steps }) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Personalized Learning Pathway</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
              Modernization Roadmap
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Progressive curriculum sequence based on prerequisite dependencies and role milestones
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Curated for <strong className="text-white">Official Statistical Modernization</strong>
        </div>
      </div>

      {/* Horizontal / Stepped Roadmap */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((item, idx) => (
          <div
            key={item.code}
            className={`relative rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
              item.completed
                ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                : idx === 1
                ? 'bg-amber-950/30 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded ${
                    item.completed
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : idx === 1
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.code}
                </span>

                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </div>

              <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{item.skill}</h4>
              <p className="text-[10px] text-slate-400 line-clamp-1 mb-2">{item.status}</p>

              <div className="p-2 bg-slate-900/90 rounded border border-slate-800/60 text-[10px] text-slate-300 mb-2">
                <span className="line-clamp-2 font-medium">{item.courseTitle}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">{item.duration}</span>
              <span
                className={`font-semibold ${
                  item.source.includes('NSSTA') ? 'text-amber-400' : 'text-indigo-400'
                }`}
              >
                {item.source.split(' ')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
