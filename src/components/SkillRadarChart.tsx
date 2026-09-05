import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  current: number;
  required: number;
  fullMark: number;
}

interface SkillRadarChartProps {
  data: RadarDataPoint[];
  title?: string;
  height?: number;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  data,
  title = 'Workforce Competency Profile vs Benchmark',
  height = 360,
}) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400">Comparing Current Assessed Level against Job Role Benchmark</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="inline-flex items-center text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5 inline-block"></span>
            Current Assessed
          </span>
          <span className="inline-flex items-center text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 mr-1.5 inline-block"></span>
            Required Role Standard
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              stroke="#475569"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
            <Radar
              name="Current Level"
              dataKey="current"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.4}
            />
            <Radar
              name="Required Standard"
              dataKey="required"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
