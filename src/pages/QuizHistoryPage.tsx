import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { QuizAttempt } from '../types';
import {
  History,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronRight,
  RotateCcw,
  BarChart2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuizHistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    if (currentUser?.quizHistory) {
      setHistory(currentUser.quizHistory);
      if (currentUser.quizHistory.length > 0 && !selectedAttempt) {
        setSelectedAttempt(currentUser.quizHistory[0]);
      }
    }
  }, [currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Verification Record</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Official Quiz History & Progress Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past material assessments, question-by-question outcomes, and targeted recommendations.
          </p>
        </div>

        <Link
          to="/quiz-generator"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New AI Quiz</span>
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Award className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Quiz Attempts Recorded Yet</h3>
          <p className="text-xs max-w-sm mx-auto">
            Upload a training handbook or choose from MoSPI sample manuals to generate your first verified assessment.
          </p>
          <Link
            to="/quiz-generator"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl inline-block"
          >
            Launch AI Quiz Generator
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Attempt History List */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recorded Assessments ({history.length})
            </h2>
            <div className="space-y-2">
              {history.map(att => (
                <button
                  key={att.id}
                  onClick={() => setSelectedAttempt(att)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col space-y-1.5 ${
                    selectedAttempt?.id === att.id
                      ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[180px]">{att.title}</span>
                    <span
                      className={`text-xs font-black ${
                        att.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {att.percentage}%
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 truncate">{att.sourceDocumentName}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span>{att.date}</span>
                    <span>
                      Score: {att.score}/{att.totalQuestions} ({att.difficulty})
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right 2 Columns: Detailed Selected Attempt Inspection */}
          <div className="lg:col-span-2">
            {selectedAttempt && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedAttempt.title}</h2>
                    <p className="text-xs text-slate-400">
                      Source: <span className="text-amber-400">{selectedAttempt.sourceDocumentName}</span> • Date: {selectedAttempt.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400 leading-none">
                      {selectedAttempt.percentage}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {selectedAttempt.score} of {selectedAttempt.totalQuestions} Correct
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-800/60 rounded-xl">
                    <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Strengths</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-0.5">
                      {selectedAttempt.strengths.map((str, i) => (
                        <li key={i} className="flex items-center space-x-1.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-950/20 border border-amber-800/60 rounded-xl">
                    <div className="text-xs font-bold text-amber-400 mb-1 flex items-center space-x-1.5">
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Areas to Improve</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-0.5">
                      {selectedAttempt.areasToImprove.map((area, i) => (
                        <li key={i} className="flex items-center space-x-1.5">
                          <span className="w-1 h-1 rounded-full bg-amber-400" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Question Details */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Questions & Answers
                  </h3>
                  <div className="space-y-3">
                    {selectedAttempt.answers.map((item, idx) => (
                      <div
                        key={item.questionId || idx}
                        className={`p-3.5 rounded-xl border ${
                          item.isCorrect ? 'bg-emerald-950/10 border-emerald-800/40' : 'bg-red-950/10 border-red-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="text-xs font-semibold text-white">
                            <span className="text-slate-400 mr-1.5">Q{idx + 1}.</span>
                            {item.question}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                              item.isCorrect ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
                            }`}
                          >
                            {item.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        <div className="text-xs space-y-0.5 mb-1.5">
                          <div>
                            <span className="text-slate-400">Your Selection: </span>
                            <span className={item.isCorrect ? 'text-emerald-300' : 'text-red-300'}>
                              {item.selectedOption}
                            </span>
                          </div>
                          {!item.isCorrect && (
                            <div>
                              <span className="text-slate-400">Correct: </span>
                              <span className="text-emerald-400 font-semibold">{item.correctAnswer}</span>
                            </div>
                          )}
                        </div>

                        {item.explanation && (
                          <div className="p-2 bg-slate-950/80 rounded border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                            <strong className="text-amber-400 mr-1">Explanation:</strong>
                            {item.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
