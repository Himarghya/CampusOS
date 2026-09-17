import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { CheckSquare, Users, Save, Calendar, Check, X, Clock } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const FacultyAttendancePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [sessionTopic, setSessionTopic] = useState('Graph Algorithms Practice');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentStatus, setStudentStatus] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'EXCUSED'>>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  // Initialize all students as PRESENT by default
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
    },
  });

  if (coursesLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Management</h1>
          <p className="text-xs text-slate-500 mt-1">Conduct sessions, mark bulk attendance, and verify roll calls</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Attendance saved successfully!</span>
          </div>
        )}
      </div>

      {/* Session Configuration Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {courses?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

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
  );
};
