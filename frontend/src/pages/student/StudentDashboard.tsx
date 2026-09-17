import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  BookOpen,
  FileCheck,
  CalendarDays,
  Star,
  Megaphone,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Code,
  Database,
  Globe,
  Cpu,
  Layers,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['studentDashboard', user?.id],
    queryFn: async () => {
      const res = await api.get('/dashboard/student');
      return res.data.data;
    },
  });

  if (isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  const kpis = data?.kpis || {
    myCoursesCount: 6,
    pendingAssignmentsCount: 12,
    upcomingExamsCount: 3,
    cgpa: 8.72,
    overallAttendance: 85,
  };

  const myCourses = data?.myCourses || [];
  const upcomingExams = data?.upcomingExams || [];
  const announcements = data?.announcements || [];
  const attendanceOverview = data?.attendanceOverview || {
    overallPercentage: 85,
    presentPercentage: 85,
    absentPercentage: 10,
    leavePercentage: 5,
  };

  // Helper icons for course subject codes
  const getCourseIcon = (code: string, index: number) => {
    if (code.includes('201')) return { icon: Code, bg: 'bg-purple-100 text-purple-600', bar: 'bg-indigo-600' };
    if (code.includes('202')) return { icon: Database, bg: 'bg-emerald-100 text-emerald-600', bar: 'bg-emerald-500' };
    if (code.includes('203')) return { icon: Globe, bg: 'bg-amber-100 text-amber-600', bar: 'bg-amber-500' };
    if (code.includes('204')) return { icon: Cpu, bg: 'bg-blue-100 text-blue-600', bar: 'bg-blue-500' };
    return { icon: Layers, bg: 'bg-slate-100 text-slate-600', bar: 'bg-indigo-500' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Greeting Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Welcome back,
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {user?.firstName} {user?.lastName} 👋
        </h1>
        <p className="text-xs lg:text-sm text-slate-500 mt-1 font-medium">
          Here's what's happening with your academics.
        </p>
      </div>

      {/* 4 Top KPI Stat Cards matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="My Courses"
          value={kpis.myCoursesCount}
          subtitle="Enrolled courses"
          icon={BookOpen}
          variant="purple"
        />
        <StatCard
          title="Assignments"
          value={kpis.pendingAssignmentsCount}
          subtitle="Pending submissions"
          icon={FileCheck}
          variant="green"
        />
        <StatCard
          title="Exams"
          value={kpis.upcomingExamsCount}
          subtitle="Upcoming exams"
          icon={CalendarDays}
          variant="amber"
        />
        <StatCard
          title="CGPA"
          value={Number(kpis.cgpa).toFixed(2)}
          subtitle="Current CGPA"
          icon={Star}
          variant="rose"
        />
      </div>

      {/* Middle Row: My Courses (Left) & Upcoming Exams (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* My Courses Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">My Courses</h2>
            <Link
              to="/courses"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
            </Link>
          </div>

          <div className="space-y-4">
            {myCourses.slice(0, 4).map((c: any, index: number) => {
              const meta = getCourseIcon(c.code, index);
              const IconComp = meta.icon;

              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50/80 transition-colors border border-slate-100/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={clsx('w-10 h-10 rounded-2xl flex items-center justify-center shrink-0', meta.bg)}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{c.name}</div>
                      <div className="text-xs font-semibold text-slate-400">{c.code}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 min-w-[120px] justify-end">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                      <div
                        className={clsx('h-full rounded-full transition-all duration-500', meta.bar)}
                        style={{ width: `${c.attendancePercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-600 w-9 text-right">
                      {c.attendancePercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Exams Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">Upcoming Exams</h2>
              <Link
                to="/exams"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3.5">
              {upcomingExams.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No upcoming exams scheduled
                </div>
              ) : (
                upcomingExams.slice(0, 3).map((e: any) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{e.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {new Date(e.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-extrabold tracking-wide uppercase border border-indigo-100">
                      {e.courseCode || 'CSE'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/exams"
            className="mt-5 w-full py-2.5 px-4 rounded-2xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            <span>View Exam Schedule</span>
          </Link>
        </div>
      </div>

      {/* Bottom Row: Recent Announcements (Left) & Attendance Overview Donut (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Announcements (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Recent Announcements</h2>
            <Link
              to="/notices"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {announcements.slice(0, 3).map((a: any, idx: number) => {
              const icons = [
                { icon: Megaphone, bg: 'bg-purple-100 text-purple-600' },
                { icon: FileCheck, bg: 'bg-emerald-100 text-emerald-600' },
                { icon: BookOpen, bg: 'bg-amber-100 text-amber-600' },
              ];
              const IconComp = icons[idx % icons.length].icon;
              const bg = icons[idx % icons.length].bg;

              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/60"
                >
                  <div className={clsx('w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5', bg)}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate pr-2">{a.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {new Date(a.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{a.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Overview Donut Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4">Attendance Overview</h2>

            <div className="flex items-center justify-center gap-6 py-3">
              {/* Radial Donut SVG */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background ring */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Present ring (Green) */}
                  <path
                    className="text-emerald-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${attendanceOverview.presentPercentage}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900">
                    {attendanceOverview.overallPercentage}%
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight">
                    Overall
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Present:</span>
                  <span className="font-bold text-slate-900">{attendanceOverview.presentPercentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Absent:</span>
                  <span className="font-bold text-slate-900">{attendanceOverview.absentPercentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Leave:</span>
                  <span className="font-bold text-slate-900">{attendanceOverview.leavePercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security / JWT Protection Banner (matching mockup pill) */}
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-emerald-950 text-[11px]">Your account is secure</div>
                <div className="text-[10px] text-emerald-700">Protected by JWT authentication</div>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
