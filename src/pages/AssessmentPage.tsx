import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Question, AssessmentResult } from '../types';
import {
  FileCheck2,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Loader2,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AssessmentPage: React.FC = () => {
  const { currentUser, refreshUser, showToast } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [evaluatedQuestions, setEvaluatedQuestions] = useState<any[]>([]);

  const loadQuestions = async () => {
    setLoading(true);
    setAssessmentResult(null);
    setAnswers({});
    setCurrentIndex(0);
    try {
      const res = await api.getAssessmentQuestions(8);
      setQuestions(res.questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      showToast('Error loading assessment questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleSelect = (option: string) => {
    if (assessmentResult) return;
    const currentQ = questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      const ok = window.confirm(
        `You have answered ${answeredCount} of ${questions.length} questions. Submit anyway?`
      );
      if (!ok) return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitAssessment(answers, questions);
      setAssessmentResult(res.result);
      setEvaluatedQuestions(res.evaluatedQuestions);
      await refreshUser();
      showToast('Assessment evaluated and competency scores updated in database!');
    } catch (err) {
      showToast('Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <div className="text-sm font-semibold text-white">
          Calibrating Adaptive Assessment for {currentUser?.jobRoleTitle}...
        </div>
        <p className="text-xs text-slate-400">
          Generating role-specific technical and statistical questions grounded in MoSPI guidelines.
        </p>
      </div>
    );
  }

  // Result Summary View
  if (assessmentResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Competency Assessment Report</h1>
          <p className="text-xs text-slate-400 mb-4">
            Official Evaluation for {currentUser?.name} ({currentUser?.designation})
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="text-2xl font-black text-white">
                {assessmentResult.score} / {assessmentResult.totalQuestions}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Raw Score</div>
            </div>
            <div>
              <div
                className={`text-2xl font-black ${
                  assessmentResult.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {assessmentResult.percentage}%
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Percentage</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-400">
                {assessmentResult.evaluatedSkills.length}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Skills Updated</div>
            </div>
          </div>
        </div>

        {/* Updated Competencies Breakdown */}
        {assessmentResult.evaluatedSkills.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Competency Scores Recalculated in System</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assessmentResult.evaluatedSkills.map(ev => {
                const isImproved = ev.newLevel >= ev.oldLevel;
                return (
                  <div
                    key={ev.skillId}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white uppercase">{ev.skillId.replace('tech_', '').replace('stat_', '').replace('gov_', '')}</div>
                      <div className="text-[11px] text-slate-400">
                        Previous: {ev.oldLevel}% → <strong className="text-white">Updated: {ev.newLevel}%</strong>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isImproved
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {isImproved ? `+${ev.newLevel - ev.oldLevel}%` : `${ev.newLevel - ev.oldLevel}%`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Item-by-Item Review & Institutional Explanations</h3>
          {evaluatedQuestions.map((q, idx) => (
            <div
              key={q.questionId}
              className={`p-4 rounded-xl border ${
                q.isCorrect ? 'bg-emerald-950/10 border-emerald-800/40' : 'bg-red-950/10 border-red-800/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="text-xs font-semibold text-white">
                  <span className="text-slate-400 mr-2">Q{idx + 1}.</span>
                  {q.question}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    q.isCorrect ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
                  }`}
                >
                  {q.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              <div className="text-xs space-y-1 mb-2">
                <div>
                  <span className="text-slate-400">Your Answer: </span>
                  <span className={q.isCorrect ? 'text-emerald-300 font-medium' : 'text-red-300 font-medium'}>
                    {q.selectedOption || 'Skipped'}
                  </span>
                </div>
                {!q.isCorrect && (
                  <div>
                    <span className="text-slate-400">Correct Answer: </span>
                    <span className="text-emerald-400 font-semibold">{q.correctAnswer}</span>
                  </div>
                )}
              </div>

              {q.explanation && (
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-amber-400 mr-1">Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex justify-between">
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
          >
            Return to Dashboard
          </Link>
          <button
            onClick={loadQuestions}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Assessment View
  const currentQ = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Details */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
            <FileCheck2 className="w-4 h-4" />
            <span>AI Competency Assessment</span>
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Statistical Cadre Proficiency Evaluation
          </h1>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-white">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="text-[10px] text-slate-400">
            Role: {currentUser?.jobRoleTitle}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Topic & Category */}
        <div className="flex items-center space-x-2">
          <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">
            {currentQ.category || 'Official Statistics'}
          </span>
          <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
            {currentQ.topic}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-base font-semibold text-white leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = answers[currentQ.id] === opt;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center space-x-3 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {letter}
                </span>
                <span className="flex-1 leading-normal">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Question Navigation */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-semibold rounded-xl inline-flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 shadow-md"
              >
                {submitting ? (
                  <span>Evaluating...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Assessment</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
