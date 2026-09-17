import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import {
  Briefcase,
  Building,
  Users,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BarChart3,
  Search,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';

export const PlacementDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['placementDashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/placement');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const hiringStats = [
    { name: 'Companies Visited', value: 85, fill: '#00F2FE' },
    { name: 'Offers', value: 312, fill: 'url(#cyanPurpleGrad)' },
    { name: 'Students Placed', value: 290, fill: '#A855F7' },
  ];

  const offersTrendData = [
    { month: 'Jun', offers: 50 },
    { month: 'Jul', offers: 140 },
    { month: 'Aug', offers: 110 },
    { month: 'Sep', offers: 360 },
    { month: 'Oct', offers: 180 },
    { month: 'Nov', offers: 320 },
  ];

  const ctcComparisonData = [
    { month: 'Jan', tier1: 120, tier2: 80 },
    { month: 'Feb', tier1: 210, tier2: 150 },
    { month: 'Mar', tier1: 340, tier2: 260 },
    { month: 'Apr', tier1: 310, tier2: 440 },
    { month: 'May', tier1: 420, tier2: 380 },
    { month: 'Jun', tier1: 580, tier2: 240 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>University Placement & Admin Governance</span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-cyan-400 font-semibold text-lg">Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time corporate recruitment pipelines, student shortlisting workflows, and examination controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/placement/drives"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 border border-cyan-400"
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Drives</span>
          </Link>
          <Link
            to="/placement/analytics"
            className="px-4 py-2 rounded-xl bg-[#162032] hover:bg-[#1E2C44] text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-slate-700/80"
          >
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Full Analytics</span>
          </Link>
        </div>
      </div>

      {/* TOP SECTION: Upcoming Recruitment Drives */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Upcoming Recruitment Drives</span>
          </h2>
          <span className="text-xs text-cyan-400 font-semibold">Dashboard ▾</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Drive 1: Google */}
          <div className="bg-[#111827] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4.5 transition-all shadow-lg group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center font-black text-lg text-white">
                  <span className="text-gradient-cyan">G</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google</h3>
                  <p className="text-xs text-slate-400">Software Engineer</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                Aug 15-18
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 mb-2">
              <span><strong>120</strong> applied</span>
              <span><strong>45</strong> shortlisted</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-cyan-400 font-semibold">
                <span>Status: Ongoing</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full w-[65%]" />
              </div>
            </div>
          </div>

          {/* Drive 2: Microsoft */}
          <div className="bg-[#111827] border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4.5 transition-all shadow-lg group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center font-black text-sm text-white">
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-rose-500 rounded-xs" />
                    <div className="bg-emerald-500 rounded-xs" />
                    <div className="bg-sky-500 rounded-xs" />
                    <div className="bg-amber-500 rounded-xs" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Microsoft</h3>
                  <p className="text-xs text-slate-400">SDE II</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                Aug 22-25
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 mb-2">
              <span><strong>95</strong> applied</span>
              <span><strong>32</strong> shortlisted</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-purple-400 font-semibold">
                <span>Status: Upcoming</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[45%]" />
              </div>
            </div>
          </div>

          {/* Drive 3: Amazon */}
          <div className="bg-[#111827] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4.5 transition-all shadow-lg group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center font-black text-lg text-amber-400">
                  a
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Amazon</h3>
                  <p className="text-xs text-slate-400">Data Scientist</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                Aug 29-Sep 1
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 mb-2">
              <span><strong>150</strong> applied</span>
              <span><strong>58</strong> shortlisted</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-cyan-400 font-semibold">
                <span>Status: Active</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full w-[78%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Placement Analytics Charts */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Placement Analytics</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart 1: Hiring Statistics */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Hiring Statistics</h3>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyanPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F2FE" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Offers Trend */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Offers Trend</h3>
              <span className="text-[10px] text-slate-500">Offers over time</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={offersTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyanAreaGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F2FE" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#00F2FE" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Area
                    type="natural"
                    dataKey="offers"
                    stroke="#00F2FE"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#cyanAreaGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: CTC Package Offers */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">CTC Package Offers</h3>
            </div>

            {/* Metric Boxes */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/30">
                <span className="text-[10px] uppercase font-bold text-slate-400">Highest CTC</span>
                <div className="text-xl font-black text-cyan-400 mt-0.5">45.0 LPA</div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30">
                <span className="text-[10px] uppercase font-bold text-slate-400">Average CTC</span>
                <div className="text-xl font-black text-purple-400 mt-0.5">14.2 LPA</div>
              </div>
            </div>

            {/* Dual lines chart */}
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ctcComparisonData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Line type="natural" dataKey="tier1" stroke="#00F2FE" strokeWidth={2} dot={false} />
                  <Line type="natural" dataKey="tier2" stroke="#A855F7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Shortlisting Workflow & Exam Cycle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Shortlisting Workflow */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Student Shortlisting Workflow
            </h3>
            <div className="flex items-center relative">
              <Search className="w-3 h-3 text-slate-500 absolute left-2.5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-7 pr-3 py-1 bg-[#162032] border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center pt-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-3 border-cyan-400 flex items-center justify-center font-black text-sm text-white bg-cyan-950/30 shadow-xs">
                540
              </div>
              <span className="text-[11px] font-semibold text-slate-300 mt-2">Registrations</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-3 border-purple-500 flex items-center justify-center font-black text-sm text-white bg-purple-950/30 shadow-xs">
                310
              </div>
              <span className="text-[11px] font-semibold text-slate-300 mt-2">Tech Assessment</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-3 border-slate-400 flex items-center justify-center font-black text-sm text-white bg-slate-800/60 shadow-xs">
                145
              </div>
              <span className="text-[11px] font-semibold text-slate-300 mt-2">Interviews</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-3 border-cyan-400 flex items-center justify-center font-black text-sm text-white bg-cyan-950/30 shadow-xs">
                92
              </div>
              <span className="text-[11px] font-semibold text-slate-300 mt-2">Offers</span>
            </div>
          </div>
        </div>

        {/* Examination Cycle Management */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Examination Cycle Management
            </h3>
            <span className="text-xs text-cyan-400 font-semibold cursor-pointer">Dashboard overview</span>
          </div>

          <div className="flex items-center justify-between bg-[#162032] p-3 rounded-xl border border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Cycle 2023-24</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-slate-400">Schedule: <strong className="text-emerald-400">Confirmed</strong></span>
              <span className="text-slate-400">Center: <strong className="text-cyan-400">Completed</strong></span>
              <span className="text-slate-400">Papers: <strong className="text-emerald-400">Published</strong></span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-400">
              Active Cycle: <strong className="text-white">2</strong> • Exam Centers: <strong className="text-white">14</strong>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/exams"
                className="px-3 py-1.5 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-xl hover:bg-cyan-900/60 transition cursor-pointer"
              >
                Manage Schedule
              </Link>
              <Link
                to="/grades"
                className="px-3 py-1.5 bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-xl hover:bg-purple-900/60 transition cursor-pointer"
              >
                View Papers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
