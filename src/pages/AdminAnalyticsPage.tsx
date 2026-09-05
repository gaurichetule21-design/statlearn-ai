import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
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
  Building2,
  Users,
  Award,
  TrendingDown,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const res = await api.getAdminAnalytics();
        setData(res);
      } catch (err) {
        console.error('Admin analytics load failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleExportCSV = () => {
    if (!data) return;
    const rows = [
      ['Skill Name', 'Category', 'Average Current Level (%)', 'Required Benchmark (%)', 'Workforce Gap (%)', 'Affected Officers Count'],
      ...data.topOrganizationalGaps.map((g: any) => [
        `"${g.skillName}"`,
        `"${g.category}"`,
        g.averageCurrent,
        g.benchmarkScore,
        g.gapPercentage,
        g.affectedEmployees,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MoSPI_Training_Needs_Assessment_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPrint = () => {
    window.print();
  };

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <span className="text-sm font-semibold text-white">Aggregating Ministry Workforce Analytics...</span>
      </div>
    );
  }

  const { overview, departmentBreakdown, topOrganizationalGaps, projectReadiness } = data;

  const departmentChartData = departmentBreakdown.map((d: any) => ({
    name: d.department.split(' ')[0],
    fullName: d.department,
    Competency: d.averageCompetency,
    Officers: d.employeeCount,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Ministry Leadership Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Institutional Skill Intelligence & Training Needs Assessment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            National statistical capacity diagnostics across NAD, SDRD, FOD, PSD, ESD & DIID divisions.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors inline-flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={handleExportPrint}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print / PDF Summary</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Officers Assessed</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{overview.totalAssessedEmployees}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 6 Statistical Divisions</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Ministry Competency Index</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{overview.ministryCompetencyIndex}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Target Benchmark: 75.0%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Critical Workforce Gaps</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-black text-red-400">{overview.criticalGapsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Requiring NSSTA Residential Training</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Course Enrollments</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-indigo-400">{overview.totalEnrolledCourses}</div>
          <div className="text-[11px] text-slate-400 mt-1">iGOT Karmayogi & NSSTA</div>
        </div>
      </div>

      {/* Department Breakdown & Top Organizational Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-1">Department-Wise Competency Index</h3>
          <p className="text-xs text-slate-400 mb-4">Average measured skill proficiency by division</p>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any, name: any) => [`${val}%`, 'Competency Score']}
                />
                <Bar dataKey="Competency" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Workforce Skill Gaps */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Top Skill Gaps Across Organization</h3>
            <p className="text-xs text-slate-400 mb-4">Ranked by overall workforce deficit percentage</p>

            <div className="space-y-3">
              {topOrganizationalGaps.slice(0, 5).map((gap: any, index: number) => (
                <div key={gap.skillId} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-mono text-[11px]">{index + 1}.</span>
                      <span className="font-bold text-white">{gap.skillName}</span>
                      <span className="text-[10px] text-slate-400">({gap.category})</span>
                    </div>
                    <span className="text-xs font-black text-red-400">
                      {gap.gapPercentage}% Gap
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full"
                      style={{ width: `${gap.gapPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>Average Current: {gap.averageCurrent}%</span>
                    <span>Required: {gap.benchmarkScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Capability Readiness */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Institutional Capability Readiness for Strategic Projects</h2>
          <p className="text-xs text-slate-400">
            Workforce staffing and capability matching for upcoming MoSPI flagship modernization initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projectReadiness.map((proj: any) => {
            const isHigh = proj.readinessPercentage >= 70;
            const isModerate = proj.readinessPercentage >= 50 && proj.readinessPercentage < 70;
            return (
              <div
                key={proj.projectId}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span
                      className={`font-bold px-2 py-0.5 rounded border ${
                        isHigh
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : isModerate
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-red-950 text-red-300 border-red-800'
                      }`}
                    >
                      {proj.status}
                    </span>
                    <span className="text-lg font-black text-white">{proj.readinessPercentage}%</span>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-2 leading-snug">{proj.projectName}</h3>

                  <div className="text-[11px] text-slate-400 mb-3">
                    Assigned Division: <strong className="text-amber-400">{proj.targetDepartment}</strong>
                  </div>

                  <div className="space-y-1 text-[11px] mb-3">
                    <div className="text-slate-400 font-semibold">Critical Required Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {proj.requiredSkills.map((sk: string) => (
                        <span key={sk} className="bg-slate-900 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                  Ready Personnel: <strong className="text-white">{proj.readyOfficers} / {proj.targetOfficers} Officers</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
