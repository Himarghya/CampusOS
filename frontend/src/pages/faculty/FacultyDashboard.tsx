import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import {
  BookOpen,
  Users,
  CheckSquare,
  Clock,
  Award,
  FileCheck,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Send,
  Sparkles,
  CheckCircle2,
  MapPin,
  FileText,
  Plus,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [warningSent, setWarningSent] = useState(false);

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
    pendingEvaluationsCount: 5,
    totalSessionsConducted: 40,
  };

  const assignedCourses = data?.assignedCourses || [
    {
      id: 'c1',
      code: 'CSE 201',
      name: 'Data Structures & Algorithms',
      section: 'A',
      credits: 4,
      studentCount: 60,
      attendanceAvg: 88,
      syllabusProgress: 75,
    },
    {
      id: 'c2',
      code: 'CSE 204',
      name: 'Operating Systems',
      section: 'A',
      credits: 4,
      studentCount: 60,
      attendanceAvg: 91,
      syllabusProgress: 68,
    },
  ];

  const pendingEvaluations = data?.pendingEvaluations || [
    { id: 'p1', studentName: 'Aarav Sharma', roll: '2022BCS0014', assignmentTitle: 'B-Tree & Red-Black Trees Implementation', submittedAt: '2 hours ago', scoreMax: 20 },
    { id: 'p2', studentName: 'Diya Sen', roll: '2022BCS0029', assignmentTitle: 'Process Scheduling Algorithm Simulator', submittedAt: '5 hours ago', scoreMax: 25 },
    { id: 'p3', studentName: 'Rohan Gupta', roll: '2022BCS0038', assignmentTitle: 'Memory Management Virtual Paging', submittedAt: 'Yesterday', scoreMax: 20 },
  ];

  const todayClasses = [
    { time: '09:00 - 10:00', code: 'CSE 201', name: 'Data Structures & Algorithms', room: 'CR-204', type: 'LECTURE', status: 'IN_SESSION' },
    { time: '11:15 - 12:15', code: 'CSE 204', name: 'Operating Systems (Virtual Memory)', room: 'CR-204', type: 'LECTURE', status: 'UPCOMING' },
    { time: '14:00 - 16:30', code: 'CSE 201L', name: 'DSA Lab: Graph Traversal BFS/DFS', room: 'LAB-02', type: 'LAB', status: 'UPCOMING' },
  ];

  const attendanceDefaulters = [
    { name: 'Kavya Nair', roll: '2022BCS0051', course: 'CSE 201', percentage: 68 },
    { name: 'Sameer Verma', roll: '2022BCS0062', course: 'CSE 204', percentage: 71 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-black text-xl shadow-inner">
            {user?.firstName?.[0] || 'V'}{user?.lastName?.[0] || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Prof. {user?.firstName} {user?.lastName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Associate Professor
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Department of Computer Science & Engineering • Cabin: <strong>CS-302 (Academic Block B)</strong> • Office Hours: <strong>3:00 - 5:00 PM</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/faculty/attendance"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-900/50"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark Attendance</span>
          </Link>
          <Link
            to="/faculty/assignments"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </Link>
          <Link
            to="/faculty/marks"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm"
          >
            <Award className="w-4 h-4" />
            <span>Marks Entry</span>
          </Link>
        </div>
      </div>

      {/* 4 Enhanced KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          value={pendingEvaluations.length}
          subtitle="Submissions awaiting grading"
          icon={FileCheck}
          variant="amber"
        />
        <StatCard
          title="Sessions Conducted"
          value={kpis.totalSessionsConducted}
          subtitle="Avg Attendance: 89.5%"
          icon={CheckSquare}
          variant="green"
        />
      </div>

      {/* Today's Schedule & Quick Launch */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Today's Academic Teaching Schedule</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Live timetable slots and classroom allocations for today</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Spring 2026 Term Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayClasses.map((cls, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                cls.status === 'IN_SESSION'
                  ? 'bg-indigo-50/60 border-indigo-200 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-800">{cls.time}</span>
                  <Badge variant={cls.status === 'IN_SESSION' ? 'primary' : 'neutral'}>
                    {cls.type}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{cls.name}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span className="font-semibold text-indigo-600">{cls.code}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {cls.room}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between">
                <Link
                  to="/faculty/attendance"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>{cls.status === 'IN_SESSION' ? 'Take Attendance' : 'View Roster'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Row: Assigned Courses (7 cols) & Pending Evaluations (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assigned Courses with Progress */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assigned Courses & Syllabus Progress</h3>
                <p className="text-xs text-slate-500 mt-0.5">Teaching metrics, enrolled students, and completion status</p>
              </div>
              <Link to="/faculty/courses" className="text-xs font-bold text-indigo-600 hover:underline">
                View All Courses
              </Link>
            </div>

            <div className="space-y-4">
              {assignedCourses.map((c: any) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {c.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Section {c.section} • {c.credits} Credits • <strong>{c.studentCount} Students Enrolled</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600">{c.attendanceAvg || 89}% Attendance</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Syllabus Coverage:</span>
                      <span className="font-bold text-slate-800">{c.syllabusProgress || 72}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${c.syllabusProgress || 72}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 text-xs font-bold">
                    <Link to="/faculty/attendance" className="text-slate-600 hover:text-indigo-600">
                      Attendance
                    </Link>
                    <span className="text-slate-300">•</span>
                    <Link to="/faculty/assignments" className="text-slate-600 hover:text-indigo-600">
                      Assignments
                    </Link>
                    <span className="text-slate-300">•</span>
                    <Link to="/faculty/marks" className="text-indigo-600 hover:text-indigo-800">
                      Grade Marks
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Submissions Queue */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pending Evaluations Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">Submissions awaiting review and grading</p>
              </div>
              <Link to="/faculty/assignments" className="text-xs font-bold text-indigo-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {pendingEvaluations.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs hover:bg-indigo-50/30 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">{p.studentName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{p.assignmentTitle}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Submitted: {p.submittedAt}</div>
                  </div>
                  <Link
                    to="/faculty/assignments"
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shrink-0 shadow-xs"
                  >
                    Grade
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Shortage Alert */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Attendance Defaulters Alert (&lt;75%)</span>
              </span>
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                {attendanceDefaulters.length} Students
              </span>
            </div>
            <p className="text-amber-800 mt-1">
              2 students currently fall below the required academic attendance minimum in your classes.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <Button
                size="sm"
                variant="secondary"
                disabled={warningSent}
                onClick={() => setWarningSent(true)}
                className="text-xs font-bold"
              >
                {warningSent ? 'Warning Notice Issued' : 'Issue Attendance Shortage Warning'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
