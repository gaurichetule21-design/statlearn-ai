import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Course } from '../types';
import {
  GraduationCap,
  Search,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  Filter,
  Loader2,
  ChevronRight,
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const { currentUser, refreshUser, showToast } = useAuth();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [sourceFilter, setSourceFilter] = useState<'All' | 'iGOT Karmayogi' | 'NSSTA / TPAC'>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentUser?.id]);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      await api.enrollCourse(courseId);
      await refreshUser();
      await fetchCourses();
      showToast('Enrolled in course successfully!');
    } catch (err) {
      showToast('Enrollment failed.');
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchSource = sourceFilter === 'All' || c.source === sourceFilter;
    const matchLevel = levelFilter === 'All' || c.level === levelFilter;

    return matchSearch && matchSource && matchLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Course Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Institutional Statistical & Digital Governance Courses
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Unified catalog across <strong>iGOT Karmayogi</strong> (Online Self-Paced) and <strong>NSSTA / TPAC</strong> (Residential & Hybrid Workshops).
          </p>
        </div>

        {/* Source Badges */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800">
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            iGOT Karmayogi
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
            <Award className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            NSSTA / TPAC
          </span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by topic, skill (e.g. Python, Sampling, National Accounts, DPDP)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Provider Source Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Source:</span>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Providers</option>
            <option value="iGOT Karmayogi">iGOT Karmayogi</option>
            <option value="NSSTA / TPAC">NSSTA / TPAC</option>
          </select>
        </div>

        {/* Level Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Level:</span>
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <span className="text-xs">Loading official curriculum...</span>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <p className="text-sm font-semibold text-white mb-1">No matching modules found</p>
          <p className="text-xs">Try adjusting your search query or clear the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredCourses.map(c => {
            const isIgot = c.source === 'iGOT Karmayogi';
            return (
              <div
                key={c.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        isIgot
                          ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
                          : 'bg-amber-950/80 text-amber-300 border-amber-800'
                      }`}
                    >
                      {isIgot ? <BookOpen className="w-3 h-3 mr-1" /> : <Award className="w-3 h-3 mr-1" />}
                      {c.source}
                    </span>

                    <span className="text-[10px] text-slate-400 font-medium">{c.level}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{c.title}</h3>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">{c.description}</p>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-4">
                    <span className="bg-slate-950 border border-slate-800 text-amber-400 px-2 py-0.5 rounded font-medium">
                      {c.skill}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {c.duration}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 truncate max-w-[130px]">{c.provider}</span>

                  {c.isEnrolled ? (
                    <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enrolled ({c.progress}%)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnroll(c.id)}
                      disabled={enrollingId === c.id}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
                    >
                      <span>Enroll</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
