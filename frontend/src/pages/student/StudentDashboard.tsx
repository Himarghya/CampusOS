import React, { useState } from 'react';
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
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-black text-xl shadow-inner">
            {user?.firstName?.[0] || 'H'}{user?.lastName?.[0] || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">{user?.firstName} {user?.lastName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Semester 4 Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Roll: <strong className="text-white">2022BCS0042</strong> • B.Tech Computer Science and Engineering
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/academics/pre-registration"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-900/50"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Pre-Registration (Sem 5)</span>
          </Link>
          <Link
            to="/academics/timetable"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Time Table</span>
          </Link>
          <Link
            to="/academics/add-drop"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Backlog Add/Drop</span>
          </Link>
        </div>
      </div>

      {/* Main Page Title (matches Screenshot 3) */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-xs text-slate-500 mt-0.5">Your credit standing towards the degree</p>
      </div>

      {/* 4 Metric Top Cards (matches Screenshot 3) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Credits Earned */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CREDITS EARNED</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalEarned}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Regular Credits */}
        <div className="bg-white rounded-2xl p-5 border-l-4 border-l-emerald-500 border-y border-r border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">REGULAR CREDITS</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{regularCredits}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Backlog / Improvement */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">BACKLOG / IMPROVEMENT</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{backlogCredits}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>

        {/* Swayam */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SWAYAM</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{swayamCredits}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Credits Details Table (matches Screenshot 3) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Credits Details</h3>
              <p className="text-xs text-slate-500 mt-0.5">Semester-wise credit record, as issued by the Academic Office</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Verified Transcript
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#BAE6FD]/40 text-slate-700 font-bold border-b border-sky-100">
                <th className="py-3.5 px-6">Semester</th>
                <th className="py-3.5 px-6">Credits Earned</th>
                <th className="py-3.5 px-6">Regular Credits</th>
                <th className="py-3.5 px-6">Backlog / Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {semesterBreakdown.map((row: any, index: number) => (
                <tr key={index} className={index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="py-3.5 px-6 font-semibold">{row.semester}</td>
                  <td className="py-3.5 px-6 font-bold">{row.creditsEarned}</td>
                  <td className="py-3.5 px-6">{row.regularCredits}</td>
                  <td className="py-3.5 px-6 text-slate-500">{row.backlog}</td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-sky-50/60 font-black text-slate-900 border-t-2 border-sky-200">
                <td className="py-4 px-6">Total</td>
                <td className="py-4 px-6">{totalEarned}</td>
                <td className="py-4 px-6">{regularCredits}</td>
                <td className="py-4 px-6">{backlogCredits}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Remaining Credits requirement for degree Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Degree Progress (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Remaining Credits requirement for degree</h3>
              <p className="text-xs text-slate-500 mt-0.5">Degree completion audit & course distribution requirements</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-indigo-600">{totalEarned} / 160</span>
              <span className="text-xs text-slate-400 font-bold block">50% Completed</span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {categories.map((cat: any, idx: number) => {
              const pct = Math.min(100, Math.round((cat.completed / cat.required) * 100));
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{cat.name}</span>
                    <span className="font-semibold text-slate-500">
                      {cat.completed} / {cat.required} Credits ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pct === 100 ? 'bg-emerald-500' : pct > 50 ? 'bg-indigo-600' : 'bg-amber-500'
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
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-3xl p-6 border border-indigo-100 shadow-card">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                Window Open
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-3">Pre-Registration Offer (Semester 5)</h4>
            <p className="text-xs text-slate-600 mt-1">
              Select your elective choices and core courses for the upcoming 2026-2027 academic year.
            </p>
            <Link
              to="/academics/pre-registration"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800"
            >
              <span>Go to Pre-Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Backlog Add / Drop Alert */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400">Add / Drop</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-3">Backlog & Course Changes</h4>
            <p className="text-xs text-slate-600 mt-1">
              {backlogData?.length || 0} eligible courses available for backlog registration or grade improvement.
            </p>
            <Link
              to="/academics/add-drop"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
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
