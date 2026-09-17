import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Users, GraduationCap, Building, BookOpen, Briefcase, FileText, ShieldCheck } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/admin');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const kpis = data?.kpis || {
    totalStudents: 120,
    totalFaculty: 15,
    totalDepartments: 4,
    totalCourses: 18,
    activeDrives: 3,
    pendingRequests: 2,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">College Administration Hub</h1>
        <p className="text-xs text-slate-500 mt-1">Institutional metrics, department workloads, and platform audit trail</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Students"
          value={kpis.totalStudents}
          subtitle="Enrolled active students"
          icon={GraduationCap}
          variant="purple"
        />
        <StatCard
          title="Faculty Members"
          value={kpis.totalFaculty}
          subtitle="Professors & Instructors"
          icon={Users}
          variant="blue"
        />
        <StatCard
          title="Departments"
          value={kpis.totalDepartments}
          subtitle="Academic divisions"
          icon={Building}
          variant="green"
        />
        <StatCard
          title="Active Courses"
          value={kpis.totalCourses}
          subtitle="Current semester courses"
          icon={BookOpen}
          variant="amber"
        />
        <StatCard
          title="Placement Drives"
          value={kpis.activeDrives}
          subtitle="Recruitment drives open"
          icon={Briefcase}
          variant="rose"
        />
        <StatCard
          title="Pending Requests"
          value={kpis.pendingRequests}
          subtitle="Awaiting administrative review"
          icon={FileText}
          variant="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Distribution */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <h2 className="text-base font-bold text-slate-900 mb-4">Department Roster & Headcount</h2>
          <div className="space-y-3">
            {data?.departmentDistribution?.map((dept: any) => (
              <div
                key={dept.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900">{dept.name}</div>
                  <div className="text-[11px] text-slate-500 font-semibold">{dept.code}</div>
                </div>
                <div className="flex items-center gap-6 text-xs text-right">
                  <div>
                    <span className="font-bold text-slate-900">{dept.studentsCount}</span>
                    <span className="text-slate-400 block text-[10px]">Students</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{dept.facultyCount}</span>
                    <span className="text-slate-400 block text-[10px]">Faculty</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{dept.coursesCount}</span>
                    <span className="text-slate-400 block text-[10px]">Courses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Activity */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Recent Audit Logs</h2>
            <Link to="/admin/audit" className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentActivity?.map((a: any) => (
              <div
                key={a.id}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800">{a.action.replace(/_/g, ' ')}</div>
                  <div className="text-[11px] text-slate-500">{a.actor}</div>
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
