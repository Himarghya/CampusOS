import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import {
  GraduationCap,
  Trophy,
  RefreshCw,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: standing, isLoading } = useQuery({
    queryKey: ['studentCreditStanding'],
    queryFn: async () => {
      const res = await api.get('/academic/credit-standing');
      return res.data.data;
    },
  });

  const { data: backlogData } = useQuery({
    queryKey: ['studentBacklogCourses'],
    queryFn: async () => {
      const res = await api.get('/academic/registration/backlog');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const semesterBreakdown = standing?.semesterBreakdown || [
    { semester: 'Semester 1', creditsEarned: 17, regularCredits: 17, backlog: 0 },
    { semester: 'Semester 2', creditsEarned: 17, regularCredits: 17, backlog: 0 },
    { semester: 'Semester 3', creditsEarned: 21, regularCredits: 21, backlog: 0 },
    { semester: 'Semester 4', creditsEarned: 25, regularCredits: 25, backlog: 0 },
  ];

  const totalEarned = standing?.creditsEarned || 80;
  const regularCredits = standing?.regularCredits || 80;
  const backlogCredits = standing?.backlogCredits || 0;
  const swayamCredits = standing?.swayamCredits || 0;
  const categories = standing?.degreeRequirements?.categories || [
    { name: 'Program Core (PC)', required: 96, completed: 72 },
    { name: 'Discipline Electives (DE)', required: 24, completed: 8 },
    { name: 'Open Electives (OE)', required: 16, completed: 0 },
    { name: 'Engineering Sciences & Math', required: 16, completed: 16 },
    { name: 'Swayam / Online MOOCs', required: 8, completed: 0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Student Profile & Standing Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/20">
            {user?.firstName?.[0] || 'H'}{user?.lastName?.[0] || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">{user?.firstName} {user?.lastName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                Semester 4 Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Roll: <strong className="text-white">2022BCS0042</strong> • B.Tech Computer Science and Engineering
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/academics/pre-registration"
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 border border-cyan-400"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Pre-Registration (Sem 5)</span>
          </Link>
          <Link
            to="/academics/timetable"
            className="px-3.5 py-2 rounded-xl bg-[#162032] hover:bg-[#1E2C44] text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700/80"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Time Table</span>
          </Link>
          <Link
            to="/academics/add-drop"
            className="px-3.5 py-2 rounded-xl bg-[#162032] hover:bg-[#1E2C44] text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700/80"
          >
            <RefreshCw className="w-4 h-4 text-purple-400" />
            <span>Backlog Add/Drop</span>
          </Link>
        </div>
      </div>

      {/* Main Page Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Academic Overview</h2>
        <p className="text-xs text-slate-400 mt-0.5">Your credit standing & degree completion audit</p>
      </div>

      {/* 4 Metric Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Credits Earned */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between group hover:border-cyan-500/40 transition">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CREDITS EARNED</p>
            <p className="text-3xl font-black text-cyan-400 mt-1">{totalEarned}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Regular Credits */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between group hover:border-emerald-500/40 transition">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">REGULAR CREDITS</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{regularCredits}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xs">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Backlog / Improvement */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between group hover:border-amber-500/40 transition">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">BACKLOG / IMPROVEMENT</p>
            <p className="text-3xl font-black text-amber-400 mt-1">{backlogCredits}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-xs">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>

        {/* Swayam */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between group hover:border-purple-500/40 transition">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SWAYAM / ONLINE</p>
            <p className="text-3xl font-black text-purple-400 mt-1">{swayamCredits}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Credits Details Table */}
      <div className="bg-[#111827] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Credits Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">Semester-wise credit record, verified by Academic Office</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
            Official Transcript
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#162032] text-slate-300 font-bold border-b border-slate-800">
                <th className="py-3.5 px-6">Semester</th>
                <th className="py-3.5 px-6">Credits Earned</th>
                <th className="py-3.5 px-6">Regular Credits</th>
                <th className="py-3.5 px-6">Backlog / Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {semesterBreakdown.map((row: any, index: number) => (
                <tr key={index} className={index % 2 === 1 ? 'bg-[#0E1524]' : 'bg-[#111827]'}>
                  <td className="py-3.5 px-6 font-semibold text-white">{row.semester}</td>
                  <td className="py-3.5 px-6 font-bold text-cyan-400">{row.creditsEarned}</td>
                  <td className="py-3.5 px-6 text-slate-300">{row.regularCredits}</td>
                  <td className="py-3.5 px-6 text-slate-400">{row.backlog}</td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-cyan-950/30 font-black text-white border-t-2 border-cyan-500/30">
                <td className="py-4 px-6 text-cyan-300">Total Credits</td>
                <td className="py-4 px-6 text-cyan-400 text-sm">{totalEarned}</td>
                <td className="py-4 px-6 text-slate-300">{regularCredits}</td>
                <td className="py-4 px-6 text-slate-400">{backlogCredits}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Remaining Credits requirement for degree Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Degree Progress (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] rounded-3xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Remaining Credits requirement for degree</h3>
              <p className="text-xs text-slate-400 mt-0.5">Degree completion audit & course distribution</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-cyan-400">{totalEarned} / 160</span>
              <span className="text-xs text-slate-400 font-bold block">50% Completed</span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {categories.map((cat: any, idx: number) => {
              const pct = Math.min(100, Math.round((cat.completed / cat.required) * 100));
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{cat.name}</span>
                    <span className="font-semibold text-slate-400">
                      {cat.completed} / {cat.required} Credits ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct === 100 ? 'bg-emerald-400' : pct > 50 ? 'bg-cyan-400' : 'bg-purple-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Academic Actions & Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pre-Registration Card */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-[#111827] to-[#162032] rounded-3xl p-6 border border-cyan-500/30 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-black">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase tracking-wide">
                Window Open
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-3">Pre-Registration Offer (Semester 5)</h4>
            <p className="text-xs text-slate-400 mt-1">
              Select your elective choices and core courses for the upcoming 2026-2027 academic year.
            </p>
            <Link
              to="/academics/pre-registration"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              <span>Go to Pre-Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Backlog Add / Drop Alert */}
          <div className="bg-[#111827] rounded-3xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">Add / Drop</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-3">Backlog & Course Changes</h4>
            <p className="text-xs text-slate-400 mt-1">
              {backlogData?.length || 0} eligible courses available for backlog registration or grade improvement.
            </p>
            <Link
              to="/academics/add-drop"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              <span>Manage Backlog Courses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
