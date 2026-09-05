import React, { useState } from 'react';
import { Question, QuizAttempt, Recommendation } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Clock,
  HelpCircle,
  Layers,
  BarChart2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizPlayerProps {
  title: string;
  sourceDocumentName: string;
  difficulty: string;
  questions: Question[];
  onComplete?: (attempt: QuizAttempt) => void;
  onRestart?: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  title,
  sourceDocumentName,
  difficulty,
  questions,
  onComplete,
  onRestart,
}) => {
  const { showToast, refreshUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleSubmit = async () => {
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQuestions} questions. Do you want to submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitQuiz({
        title,
        sourceDocumentName,
        difficulty,
        answers,
        questions,
      });

      setIsSubmitted(true);
      setAttemptResult(res.attempt);
      await refreshUser();
      showToast(res.message);
      if (onComplete) onComplete(res.attempt);
    } catch (err) {
      showToast('Error submitting quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  // If already submitted, display Result Review Mode
  if (isSubmitted && attemptResult) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
        {/* Score Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 text-center relative overflow-hidden">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Assessment Outcome Summary</h2>
          <p className="text-xs text-slate-400 mb-4">{attemptResult.title} • {attemptResult.sourceDocumentName}</p>

          <div className="flex items-center justify-center space-x-6">
            <div>
              <div className="text-3xl font-black text-white">
                {attemptResult.score} <span className="text-sm font-normal text-slate-400">/ {attemptResult.totalQuestions}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Final Score</div>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div>
              <div className={`text-3xl font-black ${
                attemptResult.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {attemptResult.percentage}%
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Competency Rating</div>
            </div>
          </div>
        </div>

        {/* Strengths & Areas to Improve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-950/20 border border-emerald-800/60 rounded-xl">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-200">
              {attemptResult.strengths.map((str, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-amber-950/20 border border-amber-800/60 rounded-xl">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-2">
              <BarChart2 className="w-4 h-4" />
              <span>Identified Areas to Improve</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-200">
              {attemptResult.areasToImprove.map((area, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Learning based on Areas to Improve */}
        {attemptResult.recommendedCourses && attemptResult.recommendedCourses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Target Learning for Gaps</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {attemptResult.recommendedCourses.map(rec => (
                <div key={rec.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="text-amber-400 font-semibold">{rec.source}</span>
                      <span>{rec.duration}</span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-2 mb-1">{rec.courseTitle}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{rec.reason}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-end">
                    <Link
                      to={`/courses?search=${encodeURIComponent(rec.skill)}`}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center space-x-1"
                    >
                      <span>Enroll in Module</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Question Review */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white">Question-by-Question Review & Explanations</h3>
          <div className="space-y-3">
            {attemptResult.answers.map((item, idx) => (
              <div
                key={item.questionId}
                className={`p-4 rounded-xl border ${
                  item.isCorrect
                    ? 'bg-emerald-950/10 border-emerald-800/40'
                    : 'bg-red-950/10 border-red-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-xs font-semibold text-white">
                    <span className="text-slate-400 mr-2">Q{idx + 1}.</span>
                    {item.question}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center shrink-0 ${
                      item.isCorrect
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                        : 'bg-red-900/60 text-red-300 border border-red-700'
                    }`}
                  >
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Correct (+1)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Incorrect (0)
                      </>
                    )}
                  </span>
                </div>

                <div className="text-xs space-y-1 mb-2">
                  <div>
                    <span className="text-slate-400">Your Answer: </span>
                    <span className={item.isCorrect ? 'text-emerald-300 font-medium' : 'text-red-300 font-medium'}>
                      {item.selectedOption}
                    </span>
                  </div>
                  {!item.isCorrect && (
                    <div>
                      <span className="text-slate-400">Correct Answer: </span>
                      <span className="text-emerald-400 font-semibold">{item.correctAnswer}</span>
                    </div>
                  )}
                </div>

                {item.explanation && (
                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    <span className="font-semibold text-amber-400 mr-1">Explanation:</span>
                    {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Retake Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-between">
          <Link
            to="/quiz-history"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            View in Quiz History
          </Link>
          {onRestart && (
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors inline-flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Generate Another Quiz</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Header & Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">Question {currentIndex + 1} of {totalQuestions}</span>
            <span>•</span>
            <span className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-700">
              {currentQ.topic || 'Official Statistics'}
            </span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
              {currentQ.difficulty || difficulty}
            </span>
          </div>
          <div>
            <span>{answeredCount} of {totalQuestions} answered</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="py-2">
        <h3 className="text-base font-semibold text-white leading-relaxed">
          {currentQ.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {currentQ.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = answers[currentQ.id] === option;

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(option)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center space-x-3 group ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 group-hover:text-white'
                }`}
              >
                {letter}
              </span>
              <span className="flex-1 leading-normal">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Question Jump Dots */}
      <div className="flex flex-wrap gap-1.5 py-2 border-t border-slate-800/80">
        {questions.map((q, i) => {
          const isAnswered = !!answers[q.id];
          const isCur = i === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-6 h-6 rounded text-[10px] font-bold transition-colors ${
                isCur
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                  : isAnswered
                  ? 'bg-indigo-900 text-indigo-200'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Bottom Navigation Controls */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-semibold rounded-lg transition-colors inline-flex items-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors inline-flex items-center space-x-1.5 shadow-md"
            >
              {submitting ? (
                <span>Evaluating...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
