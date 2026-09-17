import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
  CheckSquare,
  Users,
  Save,
  Calendar,
  Check,
  X,
  Clock,
  Table,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const FacultyAttendancePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'roll_call' | 'spreadsheet'>('spreadsheet');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [sessionTopic, setSessionTopic] = useState('Graph Algorithms & DFS/BFS');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentStatus, setStudentStatus] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'>>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Spreadsheet Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DEFAULTER' | 'HIGH'>('ALL');
  const [localSpreadsheetEdits, setLocalSpreadsheetEdits] = useState<Record<string, Record<string, 'P' | 'A' | 'L'>>>({});

  // Load courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['facultyCourses'],
    queryFn: async () => {
      const res = await api.get('/academic/courses');
      return res.data.data;
    },
  });

  // Set default course
  React.useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  // Load selected course details including enrolled students
  const { data: courseDetail, isLoading: courseLoading } = useQuery({
    queryKey: ['courseDetail', selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) return null;
      const res = await api.get(`/academic/courses/${selectedCourseId}`);
      return res.data.data;
    },
    enabled: !!selectedCourseId,
  });

  // Load Day-by-Day Spreadsheet Data
  const { data: spreadsheetData, isLoading: spreadsheetLoading } = useQuery({
    queryKey: ['courseSpreadsheet', selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) return null;
      const res = await api.get(`/attendance/course/${selectedCourseId}/spreadsheet`);
      return res.data.data;
    },
    enabled: !!selectedCourseId,
  });

  // Initialize all students as PRESENT by default for roll call
  React.useEffect(() => {
    if (courseDetail?.enrollments) {
      const initial: Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'> = {};
      courseDetail.enrollments.forEach((e: any) => {
        initial[e.studentId] = 'PRESENT';
      });
      setStudentStatus(initial);
    }
  }, [courseDetail]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'EXCUSED') => {
    setStudentStatus((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    if (!courseDetail?.enrollments) return;
    const updated: Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'> = {};
    courseDetail.enrollments.forEach((e: any) => {
      updated[e.studentId] = status;
    });
    setStudentStatus(updated);
  };

  const saveAttendanceMutation = useMutation({
    mutationFn: async () => {
      // 1. Create Session
      const sessionRes = await api.post('/attendance/sessions', {
        courseId: selectedCourseId,
        date: attendanceDate,
        topic: sessionTopic,
        section: 'A',
      });
      const sessionId = sessionRes.data.data.id;

      // 2. Mark Bulk Records
      const records = Object.entries(studentStatus).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      return api.post('/attendance/records/bulk', {
        sessionId,
        records,
      });
    },
    onSuccess: () => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      queryClient.invalidateQueries({ queryKey: ['facultyDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['courseSpreadsheet', selectedCourseId] });
    },
  });

  // Quick toggle in spreadsheet cell
  const handleCellToggle = (studentId: string, sessionId: string, currentVal: 'P' | 'A' | 'L') => {
    const nextVal = currentVal === 'P' ? 'A' : currentVal === 'A' ? 'L' : 'P';
    setLocalSpreadsheetEdits((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [sessionId]: nextVal,
      },
    }));
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!spreadsheetData) return;
    const sessionDates = spreadsheetData.sessionDates || [];
    const students = spreadsheetData.students || [];

    const headers = [
      'Roll Number',
      'Student Name',
      'Email',
      ...sessionDates.map((s: any) => `${s.date} (${s.topic.replace(/,/g, ' ')})`),
      'Held',
      'Attended',
      'Absent',
      'Percentage (%)',
      'Status',
    ];

    const rows = students.map((s: any) => {
      const dailyCols = sessionDates.map((sess: any) => {
        const val = localSpreadsheetEdits[s.studentId]?.[sess.sessionId] || s.dailyAttendance[sess.sessionId] || 'P';
        return val;
      });

      return [
        `"${s.rollNumber}"`,
        `"${s.name}"`,
        `"${s.email}"`,
        ...dailyCols,
        s.totalHeld,
        s.presentCount,
        s.absentCount,
        `${s.percentage}%`,
        s.isDefaulter ? 'DEFAULTER (<75%)' : 'ELIGIBLE',
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${spreadsheetData.course?.code || 'CSE201'}_Attendance_Ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (coursesLoading) return <LoadingSkeleton rows={5} />;

  // Filtered Spreadsheet Students
  const sessionDates = spreadsheetData?.sessionDates || [];
  const rawStudents = spreadsheetData?.students || [];

  const filteredStudents = rawStudents.filter((s: any) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'DEFAULTER'
        ? s.percentage < 75
        : s.percentage >= 90;

    return matchesSearch && matchesStatus;
  });

  const summary = spreadsheetData?.summary || {
    totalStudents: rawStudents.length,
    totalSessionsHeld: sessionDates.length,
    courseAverageAttendance: 88,
    defaultersCount: rawStudents.filter((s: any) => s.percentage < 75).length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Governance & Ledger</h1>
            <Badge variant="primary">Spring 2026</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Conduct live roll call sessions or inspect complete day-by-day attendance spreadsheet matrix
          </p>
        </div>

        {/* View Switcher: Roll Call vs Excel Spreadsheet */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode('spreadsheet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'spreadsheet'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel Ledger Matrix</span>
          </button>
          <button
            onClick={() => setViewMode('roll_call')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'roll_call'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span>Live Roll Call</span>
          </button>
        </div>
      </div>

      {/* Course Selection & Summary Strip */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setLocalSpreadsheetEdits({});
              }}
              className="mt-0.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {courses?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Summary Metrics */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500">Total Enrolled:</span>{' '}
            <strong className="text-slate-900 font-black">{summary.totalStudents}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500">Sessions Conducted:</span>{' '}
            <strong className="text-slate-900 font-black">{summary.totalSessionsHeld}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>Avg Attendance:</span>{' '}
            <strong className="font-black">{summary.courseAverageAttendance}%</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200">
            <span>Defaulters (&lt;75%):</span>{' '}
            <strong className="font-black">{summary.defaultersCount} Students</strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: EXCEL ATTENDANCE SPREADSHEET MATRIX (User's Exact Request)        */}
      {/* ========================================================================= */}
      {viewMode === 'spreadsheet' && (
        <div className="space-y-4">
          {/* Action Bar: Search, Filters & Export Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student name or roll no..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <option value="ALL">All Enrolled Students</option>
                <option value="DEFAULTER">Defaulters Only (&lt;75%)</option>
                <option value="HIGH">High Attendance (&ge;90%)</option>
              </select>

              <Button
                size="sm"
                onClick={handleExportCSV}
                className="font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Export to Excel (CSV)</span>
              </Button>
            </div>
          </div>

          {/* Excel Spreadsheet Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>
                  {spreadsheetData?.course?.code} • {spreadsheetData?.course?.name} — Day-Wise Attendance Ledger
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-bold">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> P: Present
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> A: Absent
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> L: Leave
                </span>
                <span className="text-slate-400 italic">(Click any cell to toggle)</span>
              </div>
            </div>

            {spreadsheetLoading ? (
              <LoadingSkeleton rows={8} />
            ) : (
              <div className="overflow-x-auto max-h-[600px] relative">
                <table className="w-full text-left text-xs border-collapse">
                  {/* Sticky Table Header */}
                  <thead className="bg-[#BAE6FD]/40 text-slate-800 font-bold sticky top-0 z-20 border-b border-sky-200 shadow-xs">
                    <tr>
                      <th className="py-3 px-4 sticky left-0 bg-[#BAE6FD] z-30 min-w-[120px] border-r border-sky-200">
                        Roll No.
                      </th>
                      <th className="py-3 px-4 sticky left-[120px] bg-[#BAE6FD] z-30 min-w-[180px] border-r border-sky-200">
                        Student Name
                      </th>
                      {sessionDates.map((s: any, idx: number) => {
                        const dateFormatted = new Date(s.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        });
                        return (
                          <th
                            key={s.sessionId || idx}
                            title={`${s.date} - ${s.topic}`}
                            className="py-3 px-2 text-center min-w-[65px] border-r border-sky-200 font-bold"
                          >
                            <div className="text-[11px] font-black">{dateFormatted}</div>
                            <div className="text-[9px] text-slate-500 font-medium truncate max-w-[60px] mx-auto">
                              {s.type === 'LAB' ? 'Lab' : `S${idx + 1}`}
                            </div>
                          </th>
                        );
                      })}
                      <th className="py-3 px-3 text-center bg-[#a6ddfc] min-w-[60px] border-r border-sky-200">
                        Held
                      </th>
                      <th className="py-3 px-3 text-center bg-[#a6ddfc] min-w-[60px] border-r border-sky-200">
                        Attended
                      </th>
                      <th className="py-3 px-3 text-center bg-[#a6ddfc] min-w-[60px] border-r border-sky-200">
                        Absent
                      </th>
                      <th className="py-3 px-3 text-center bg-[#91d3fa] min-w-[80px] border-r border-sky-200">
                        Percentage
                      </th>
                      <th className="py-3 px-4 text-center bg-[#91d3fa] min-w-[110px]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={sessionDates.length + 7} className="py-12 text-center text-slate-400">
                          No student records match the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student: any, rowIdx: number) => {
                        // Calculate live counts considering local edits
                        let livePresent = 0;
                        let liveAbsent = 0;
                        let liveLeave = 0;

                        sessionDates.forEach((sess: any) => {
                          const val =
                            localSpreadsheetEdits[student.studentId]?.[sess.sessionId] ||
                            student.dailyAttendance[sess.sessionId] ||
                            'P';
                          if (val === 'P') livePresent++;
                          else if (val === 'A') liveAbsent++;
                          else liveLeave++;
                        });

                        const livePercentage =
                          sessionDates.length > 0 ? Math.round((livePresent / sessionDates.length) * 100) : 100;
                        const isDefaulter = livePercentage < 75;

                        return (
                          <tr
                            key={student.studentId || rowIdx}
                            className={`hover:bg-indigo-50/40 transition-colors ${
                              rowIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                            } ${isDefaulter ? 'bg-rose-50/20' : ''}`}
                          >
                            {/* Sticky Roll No */}
                            <td
                              className={`py-3 px-4 font-mono font-bold text-slate-900 sticky left-0 z-10 border-r border-slate-200 ${
                                rowIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'
                              }`}
                            >
                              {student.rollNumber}
                            </td>

                            {/* Sticky Name */}
                            <td
                              className={`py-3 px-4 font-semibold text-slate-900 sticky left-[120px] z-10 border-r border-slate-200 ${
                                rowIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'
                              }`}
                            >
                              <div className="font-bold text-xs">{student.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{student.email}</div>
                            </td>

                            {/* Day-by-Day Cells */}
                            {sessionDates.map((sess: any) => {
                              const cellStatus =
                                localSpreadsheetEdits[student.studentId]?.[sess.sessionId] ||
                                student.dailyAttendance[sess.sessionId] ||
                                'P';

                              return (
                                <td
                                  key={sess.sessionId}
                                  onClick={() => handleCellToggle(student.studentId, sess.sessionId, cellStatus)}
                                  className="py-2.5 px-2 text-center border-r border-slate-100 cursor-pointer hover:bg-indigo-100/60 select-none transition"
                                >
                                  <span
                                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black shadow-2xs ${
                                      cellStatus === 'P'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : cellStatus === 'A'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {cellStatus}
                                  </span>
                                </td>
                              );
                            })}

                            {/* Summary Columns */}
                            <td className="py-3 px-3 text-center font-bold text-slate-600 border-r border-slate-100">
                              {sessionDates.length}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-emerald-700 border-r border-slate-100">
                              {livePresent}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-rose-700 border-r border-slate-100">
                              {liveAbsent}
                            </td>
                            <td className="py-3 px-3 text-center font-black text-slate-900 border-r border-slate-100">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  livePercentage >= 75
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-rose-50 text-rose-700 font-black'
                                }`}
                              >
                                {livePercentage}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {isDefaulter ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                                  DEFAULTER
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  ELIGIBLE
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: DAILY ROLL CALL MODE                                              */}
      {/* ========================================================================= */}
      {viewMode === 'roll_call' && (
        <div className="space-y-6">
          {savedSuccess && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Attendance saved successfully for {sessionTopic}!</span>
            </div>
          )}

          {/* Session Configuration Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Session Date
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Topic / Laboratory Title
              </label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="e.g. Graph Traversal, SQL Joins"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Student Roll Call List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Enrolled Students ({courseDetail?.enrollments?.length || 0})
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkAll('PRESENT')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('ABSENT')}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {courseLoading ? (
              <LoadingSkeleton rows={4} />
            ) : (
              <div className="divide-y divide-slate-100">
                {courseDetail?.enrollments?.map((enr: any) => {
                  const currentStatus = studentStatus[enr.studentId] || 'PRESENT';

                  return (
                    <div
                      key={enr.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {enr.student?.user?.firstName?.[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {enr.student?.user?.firstName} {enr.student?.user?.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            Roll: {enr.student?.rollNumber} • Batch: {enr.student?.batch}
                          </div>
                        </div>
                      </div>

                      {/* Present / Absent / Excused Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(enr.studentId, 'PRESENT')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(enr.studentId, 'ABSENT')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(enr.studentId, 'EXCUSED')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            currentStatus === 'EXCUSED'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Leave</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => {
                  setSaving(true);
                  saveAttendanceMutation.mutate();
                }}
                loading={saving}
                size="md"
                className="font-bold shadow-md shadow-indigo-200"
              >
                <Save className="w-4 h-4 mr-1.5" />
                <span>Save Attendance Session</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
