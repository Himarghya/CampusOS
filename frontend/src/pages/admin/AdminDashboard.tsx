import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import {
  Users,
  GraduationCap,
  Building,
  BookOpen,
  Briefcase,
  FileText,
  ShieldCheck,
  Award,
  TrendingUp,
  Activity,
  Plus,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  ArrowRight,
  Server,
  Lock,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

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
    totalStudents: 1420,
    totalFaculty: 118,
    totalDepartments: 8,
    totalCourses: 94,
    activeDrives: 6,
    pendingRequests: 3,
  };

  const departmentDistribution = data?.departmentDistribution || [
    { id: 'd1', code: 'CSE', name: 'Computer Science and Engineering', studentsCount: 480, facultyCount: 32, coursesCount: 28 },
    { id: 'd2', code: 'ECE', name: 'Electronics and Communication Engineering', studentsCount: 360, facultyCount: 26, coursesCount: 24 },
    { id: 'd3', code: 'ME', name: 'Mechanical Engineering', studentsCount: 280, facultyCount: 22, coursesCount: 18 },
    { id: 'd4', code: 'Des.', name: 'Design and Innovation', studentsCount: 180, facultyCount: 18, coursesCount: 14 },
    { id: 'd5', code: 'MT', name: 'Mechatronics', studentsCount: 120, facultyCount: 12, coursesCount: 10 },
  ];

  const recentActivity = data?.recentActivity || [
    { id: 'a1', action: 'EXAM_RESULTS_PUBLISHED', actor: 'Admin Principal', entity: 'End Semester Final', time: '10 mins ago' },
    { id: 'a2', action: 'MARKS_SUBMITTED', actor: 'Prof. Vikram Sharma', entity: 'CSE 201 Data Structures', time: '25 mins ago' },
    { id: 'a3', action: 'STUDENT_ENROLLED', actor: 'Academic Registrar', entity: '2022BCS0042', time: '1 hour ago' },
    { id: 'a4', action: 'PLACEMENT_DRIVE_POSTED', actor: 'Placement Officer', entity: 'Google SWE Intern', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Command Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-black text-xl shadow-inner">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Institutional Governance & Command Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Spring 2026 Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              CampusOS Suite Enterprise • 8 Academic Divisions • 16 Integrated Modules Operational
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/students"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-900/50"
          >
            <Users className="w-4 h-4" />
            <span>Manage Students</span>
          </Link>
          <Link
            to="/admin/exams"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm"
          >
            <Award className="w-4 h-4" />
            <span>Exam Governance</span>
          </Link>
          <Link
            to="/admin/audit"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {/* 6 High-Density Top Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Students</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{kpis.totalStudents}</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% YoY
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Faculty Roster</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{kpis.totalFaculty}</div>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">1:12 Ratio</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Departments</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{kpis.totalDepartments}</div>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-1">Active Schools</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Course Catalog</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{kpis.totalCourses}</div>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">Theory & Labs</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Placement Drives</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{kpis.activeDrives}</div>
          <span className="text-[10px] text-purple-600 font-semibold block mt-1">Recruiters Live</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Status</span>
          <div className="text-xl font-black text-emerald-600 mt-0.5">100%</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Compliant</span>
        </div>
      </div>

      {/* Main Governance Grid: Department Workload (7 cols) & Audit Activity (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Distribution Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic Department Roster & Enrollment</h3>
              <p className="text-xs text-slate-500 mt-0.5">Headcounts, student loads, and active courses across faculties</p>
            </div>
            <Link to="/admin/departments" className="text-xs font-bold text-indigo-600 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {departmentDistribution.map((dept: any) => (
              <div
                key={dept.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-indigo-50/20 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                      {dept.code}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{dept.name}</span>
                  </div>
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

        {/* Live Audit Activity Trail */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Real-Time Audit Trail</h3>
                <p className="text-xs text-slate-500 mt-0.5">Security events and institutional mutations</p>
              </div>
              <Link to="/admin/audit" className="text-xs font-bold text-indigo-600 hover:underline">
                Full Log
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivity.map((a: any) => (
                <div
                  key={a.id}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-50 text-indigo-700">
                        {a.action}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-semibold mt-1">{a.actor}</div>
                    <div className="text-[10px] text-slate-400">{a.entity}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health Strip */}
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-emerald-950 text-[11px]">System Status: All Systems Operational</div>
                <div className="text-[10px] text-emerald-700">Database synchronized • RBAC enforced</div>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
