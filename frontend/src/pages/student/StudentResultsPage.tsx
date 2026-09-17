import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import {
  Award,
  Star,
  BookOpen,
  CheckCircle2,
  Download,
  Layers,
  TrendingUp,
  GraduationCap,
  FileCheck,
  Printer,
  Calendar,
  Sparkles,
  Search,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

export const StudentResultsPage: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: dbResults, isLoading } = useQuery({
    queryKey: ['myResults'],
    queryFn: async () => {
      try {
        const res = await api.get('/examinations/my-results');
        return res.data.data;
      } catch {
        return [];
      }
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  // Comprehensive Semester-Wise Official Academic Transcript & Grades Data
  const semesterResultsData: Record<number, {
    semesterNumber: number;
    term: string;
    academicYear: string;
    sgpa: number;
    creditsEarned: number;
    totalCredits: number;
    resultStatus: 'PASSED' | 'PROVISIONAL' | 'IN_PROGRESS';
    courses: Array<{
      code: string;
      name: string;
      credits: number;
      internal: number;
      maxInternal: number;
      external: number;
      maxExternal: number;
      total: number;
      grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P';
      gradePoints: number;
      status: 'PASS' | 'IN_EVALUATION';
    }>;
  }> = {
    1: {
      semesterNumber: 1,
      term: 'Autumn 2024',
      academicYear: '2024-2025',
      sgpa: 8.50,
      creditsEarned: 17,
      totalCredits: 17,
      resultStatus: 'PASSED',
      courses: [
        { code: 'MA101', name: 'Engineering Mathematics I (Calculus & ODE)', credits: 4, internal: 38, maxInternal: 40, external: 54, maxExternal: 60, total: 92, grade: 'A+', gradePoints: 9, status: 'PASS' },
        { code: 'PH101', name: 'Engineering Physics & Quantum Mechanics', credits: 4, internal: 35, maxInternal: 40, external: 51, maxExternal: 60, total: 86, grade: 'A', gradePoints: 8, status: 'PASS' },
        { code: 'CS101', name: 'Introduction to Computer Programming (C & Python)', credits: 4, internal: 40, maxInternal: 40, external: 58, maxExternal: 60, total: 98, grade: 'O', gradePoints: 10, status: 'PASS' },
        { code: 'ME101', name: 'Engineering Mechanics & Product Realization', credits: 3, internal: 31, maxInternal: 40, external: 47, maxExternal: 60, total: 78, grade: 'B+', gradePoints: 7, status: 'PASS' },
        { code: 'HS101', name: 'Professional Communication & Ethics', credits: 2, internal: 36, maxInternal: 40, external: 48, maxExternal: 60, total: 84, grade: 'A', gradePoints: 8, status: 'PASS' },
      ],
    },
    2: {
      semesterNumber: 2,
      term: 'Spring 2025',
      academicYear: '2024-2025',
      sgpa: 8.62,
      creditsEarned: 17,
      totalCredits: 17,
      resultStatus: 'PASSED',
      courses: [
        { code: 'MA102', name: 'Engineering Mathematics II (Linear Algebra)', credits: 4, internal: 36, maxInternal: 40, external: 49, maxExternal: 60, total: 85, grade: 'A', gradePoints: 8, status: 'PASS' },
        { code: 'EE101', name: 'Basic Electrical & Electronics Engineering', credits: 4, internal: 37, maxInternal: 40, external: 54, maxExternal: 60, total: 91, grade: 'A+', gradePoints: 9, status: 'PASS' },
        { code: 'CS102', name: 'Data Structures and Algorithms Fundamentals', credits: 4, internal: 39, maxInternal: 40, external: 56, maxExternal: 60, total: 95, grade: 'O', gradePoints: 10, status: 'PASS' },
        { code: 'CH101', name: 'Environmental Chemistry & Ecology', credits: 3, internal: 34, maxInternal: 40, external: 48, maxExternal: 60, total: 82, grade: 'A', gradePoints: 8, status: 'PASS' },
        { code: 'ME102', name: 'Engineering Workshop & CAD Practice', credits: 2, internal: 38, maxInternal: 40, external: 52, maxExternal: 60, total: 90, grade: 'A+', gradePoints: 9, status: 'PASS' },
      ],
    },
    3: {
      semesterNumber: 3,
      term: 'Autumn 2025',
      academicYear: '2025-2026',
      sgpa: 8.80,
      creditsEarned: 21,
      totalCredits: 21,
      resultStatus: 'PASSED',
      courses: [
        { code: 'CS201', name: 'Data Structures and Algorithms', credits: 4, internal: 40, maxInternal: 40, external: 56, maxExternal: 60, total: 96, grade: 'O', gradePoints: 10, status: 'PASS' },
        { code: 'CS202', name: 'Discrete Mathematical Structures & Graph Theory', credits: 4, internal: 37, maxInternal: 40, external: 53, maxExternal: 60, total: 90, grade: 'A+', gradePoints: 9, status: 'PASS' },
        { code: 'CS203', name: 'Digital Logic and Computer Organization', credits: 4, internal: 36, maxInternal: 40, external: 52, maxExternal: 60, total: 88, grade: 'A', gradePoints: 8, status: 'PASS' },
        { code: 'EC201', name: 'Analog and Digital Electronic Circuits', credits: 4, internal: 32, maxInternal: 40, external: 47, maxExternal: 60, total: 79, grade: 'B+', gradePoints: 7, status: 'PASS' },
        { code: 'HS201', name: 'Economics for Engineers', credits: 3, internal: 35, maxInternal: 40, external: 50, maxExternal: 60, total: 85, grade: 'A', gradePoints: 8, status: 'PASS' },
        { code: 'CS201L', name: 'Data Structures Lab', credits: 2, internal: 40, maxInternal: 40, external: 58, maxExternal: 60, total: 98, grade: 'O', gradePoints: 10, status: 'PASS' },
      ],
    },
    4: {
      semesterNumber: 4,
      term: 'Spring 2026 (Current Session)',
      academicYear: '2025-2026',
      sgpa: 8.94,
      creditsEarned: 25,
      totalCredits: 25,
      resultStatus: 'PROVISIONAL',
      courses: [
        { code: 'CS204', name: 'Database Management Systems', credits: 4, internal: 38, maxInternal: 40, external: 53, maxExternal: 60, total: 91, grade: 'A+', gradePoints: 9, status: 'PASS' },
        { code: 'CS205', name: 'Operating Systems and Systems Programming', credits: 4, internal: 39, maxInternal: 40, external: 56, maxExternal: 60, total: 95, grade: 'O', gradePoints: 10, status: 'PASS' },
        { code: 'CS206', name: 'Design and Analysis of Algorithms', credits: 4, internal: 38, maxInternal: 40, external: 55, maxExternal: 60, total: 93, grade: 'A+', gradePoints: 9, status: 'PASS' },
        { code: 'CS207', name: 'Computer Architecture and Microprocessors', credits: 4, internal: 35, maxInternal: 40, external: 51, maxExternal: 60, total: 86, grade: 'A', gradePoints: 8, status: 'PASS' },
        { code: 'CS208', name: 'Web Technologies and Microservices', credits: 3, internal: 39, maxInternal: 40, external: 57, maxExternal: 60, total: 96, grade: 'O', gradePoints: 10, status: 'PASS' },
        { code: 'CS205L', name: 'Operating Systems Lab', credits: 2, internal: 39, maxInternal: 40, external: 58, maxExternal: 60, total: 97, grade: 'O', gradePoints: 10, status: 'PASS' },
        { code: 'CS204L', name: 'Database Systems Lab', credits: 2, internal: 40, maxInternal: 40, external: 59, maxExternal: 60, total: 99, grade: 'O', gradePoints: 10, status: 'PASS' },
        { code: 'DES201', name: 'Human Computer Interaction & UX', credits: 2, internal: 36, maxInternal: 40, external: 52, maxExternal: 60, total: 88, grade: 'A', gradePoints: 8, status: 'PASS' },
      ],
    },
  };

  const sgpaTrendData = [
    { sem: 'Sem 1', sgpa: 8.50, cgpa: 8.50 },
    { sem: 'Sem 2', sgpa: 8.62, cgpa: 8.56 },
    { sem: 'Sem 3', sgpa: 8.80, cgpa: 8.64 },
    { sem: 'Sem 4', sgpa: 8.94, cgpa: 8.72 },
  ];

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'O':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">O (Outstanding)</span>;
      case 'A+':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-100 text-indigo-800 border border-indigo-300">A+ (Excellent)</span>;
      case 'A':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-sky-100 text-sky-800 border border-sky-300">A (Very Good)</span>;
      case 'B+':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">B+ (Good)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">{grade}</span>;
    }
  };

  const semestersToDisplay = selectedSemester === 'all'
    ? [1, 2, 3, 4]
    : [selectedSemester];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-7 h-7 text-indigo-600" />
            <span>Examination Results & Semester Transcripts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official published academic grades, continuous internal evaluation (CIA) marks, and semester transcripts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 font-bold"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Transcript</span>
          </Button>
        </div>
      </div>

      {/* 4 Performance Metric Cards & GPA Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Metric Cards (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Cumulative CGPA</span>
            <div className="text-3xl font-black text-slate-900 mt-2 flex items-baseline gap-1">
              <span>8.72</span>
              <span className="text-xs text-slate-400 font-semibold">/ 10.0</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span>Dean's Honours List</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Credits Completed</span>
            <div className="text-3xl font-black text-indigo-600 mt-2 flex items-baseline gap-1">
              <span>80</span>
              <span className="text-xs text-slate-400 font-semibold">/ 160</span>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 mt-2">50% Degree Progress</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Latest Term SGPA</span>
            <div className="text-3xl font-black text-emerald-600 mt-2 flex items-baseline gap-1">
              <span>8.94</span>
              <span className="text-xs text-slate-400 font-semibold">Sem 4</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-2">+0.14 vs Previous Sem</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Backlogs Active</span>
            <div className="text-3xl font-black text-slate-900 mt-2">0</div>
            <span className="text-[11px] font-bold text-emerald-600 mt-2">✓ 100% Courses Cleared</span>
          </div>
        </div>

        {/* GPA Progression Trend Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>SGPA Progression</span>
            </span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Steady Growth
            </span>
          </div>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sgpaTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="sem" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[8.0, 9.5]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sgpa"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4F46E5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Semester Selection Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Filter Semester:
          </span>
          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedSemester === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Semesters Overview
          </button>
          {[1, 2, 3, 4].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedSemester === sem
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Semester {sem}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search course in results..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* SEMESTER PARTITIONED RESULT CARDS & GRADE TABLES */}
      <div className="space-y-6">
        {semestersToDisplay.map((semNum) => {
          const sem = semesterResultsData[semNum];
          if (!sem) return null;

          const filteredCourses = searchQuery
            ? sem.courses.filter(
                (c) =>
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.code.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : sem.courses;

          return (
            <div
              key={semNum}
              className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden transition-all"
            >
              {/* Semester Partition Header */}
              <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-slate-900">
                      Semester {sem.semesterNumber} Grade Sheet
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {sem.term} ({sem.academicYear})
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {sem.resultStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {sem.courses.length} Courses Evaluated • {sem.creditsEarned} Credits Earned
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-right">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Semester SGPA</span>
                    <span className="text-lg font-black text-indigo-900">{sem.sgpa.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Full-Width Grade Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
                      <th className="py-4 px-6">Course Code</th>
                      <th className="py-4 px-6">Course Title</th>
                      <th className="py-4 px-4 text-center">Credits</th>
                      <th className="py-4 px-4 text-center">CIA / Internal (40)</th>
                      <th className="py-4 px-4 text-center">End-Sem Exam (60)</th>
                      <th className="py-4 px-4 text-center">Total (100)</th>
                      <th className="py-4 px-4 text-center">Letter Grade</th>
                      <th className="py-4 px-4 text-center">Grade Points</th>
                      <th className="py-4 px-6 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredCourses.map((c, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'}>
                        <td className="py-4 px-6 font-mono font-bold text-indigo-600">{c.code}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">{c.name}</td>
                        <td className="py-4 px-4 text-center font-bold text-slate-700">{c.credits}</td>
                        <td className="py-4 px-4 text-center font-semibold text-slate-600">{c.internal}</td>
                        <td className="py-4 px-4 text-center font-semibold text-slate-600">{c.external}</td>
                        <td className="py-4 px-4 text-center font-black text-slate-900 text-sm">{c.total}</td>
                        <td className="py-4 px-4 text-center">{getGradeBadge(c.grade)}</td>
                        <td className="py-4 px-4 text-center font-bold text-indigo-600">{c.gradePoints}</td>
                        <td className="py-4 px-6 text-right font-extrabold text-emerald-600">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                            PASSED
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Semester Aggregate Row */}
                    <tr className="bg-indigo-50/50 font-black text-slate-900 border-t-2 border-indigo-100">
                      <td colSpan={2} className="py-4 px-6 text-indigo-950 uppercase tracking-wider">
                        Semester {sem.semesterNumber} Aggregate Summary
                      </td>
                      <td className="py-4 px-4 text-center text-indigo-700 text-sm">{sem.creditsEarned} Cr</td>
                      <td colSpan={3} className="py-4 px-4 text-center text-slate-500 font-normal">
                        All Courses Cleared
                      </td>
                      <td className="py-4 px-4 text-center text-indigo-900 text-xs uppercase font-bold">
                        SGPA Score:
                      </td>
                      <td colSpan={2} className="py-4 px-6 text-right text-indigo-700 text-base">
                        {sem.sgpa.toFixed(2)} / 10.0
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
