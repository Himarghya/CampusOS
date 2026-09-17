import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { BookOpen, Users, CheckSquare, Clock, Award, FileCheck, ArrowRight } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Link } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['facultyDashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/faculty');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const kpis = data?.kpis || {
    assignedCoursesCount: 2,
    totalStudentsTaught: 120,
    pendingEvaluationsCount: 8,
    totalSessionsConducted: 40,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          {data?.faculty?.designation} • {data?.faculty?.department}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Assigned Courses"
          value={kpis.assignedCoursesCount}
          subtitle="Active theory & lab courses"
          icon={BookOpen}
          variant="purple"
        />
        <StatCard
          title="Students Taught"
          value={kpis.totalStudentsTaught}
          subtitle="Enrolled students across sections"
          icon={Users}
          variant="blue"
        />
        <StatCard
          title="Pending Evaluations"
          value={kpis.pendingEvaluationsCount}
          subtitle="Submissions awaiting grading"
          icon={FileCheck}
          variant="amber"
        />
        <StatCard
          title="Sessions Conducted"
          value={kpis.totalSessionsConducted}
          subtitle="Attendance sessions logged"
          icon={CheckSquare}
          variant="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assigned Courses List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Assigned Courses</h2>
            <Link to="/faculty/attendance" className="text-xs font-bold text-indigo-600 hover:underline">
              Mark Attendance
            </Link>
          </div>

          <div className="space-y-3">
            {data?.assignedCourses?.map((c: any) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-indigo-600">{c.code}</span>
                  <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">Section {c.section} • {c.credits} Credits</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-slate-900">{c.studentCount}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Students</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Pending Evaluations</h2>
            <Link to="/faculty/assignments" className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {data?.pendingEvaluations?.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">All submissions evaluated!</div>
            ) : (
              data?.pendingEvaluations?.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{p.studentName}</div>
                    <div className="text-[11px] text-slate-500">{p.assignmentTitle}</div>
                  </div>
                  <Link
                    to="/faculty/assignments"
                    className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-[11px] hover:bg-indigo-100"
                  >
                    Grade
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
