import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
  Award,
  Save,
  Check,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  CheckCircle2,
  Sparkles,
  BookOpen,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  Globe,
  Sliders,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const FacultyMarksPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Selected Exam & Course
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [marksState, setMarksState] = useState<Record<string, { internal: number; external: number; remarks: string }>>({});
  const [success, setSuccess] = useState(false);

  // Modal State for Creating Internal Exam
  const [createInternalModal, setCreateInternalModal] = useState(false);
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState('INTERNAL');
  const [maxInternalMarks, setMaxInternalMarks] = useState(30);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [academicYearId, setAcademicYearId] = useState('');
  const [semesterId, setSemesterId] = useState('');

  // Queries
  const { data: exams, isLoading: examsLoading } = useQuery({
    queryKey: ['facultyExamsList'],
    queryFn: async () => {
      const res = await api.get('/examinations');
      return res.data.data;
    },
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['facultyCourses'],
    queryFn: async () => {
      const res = await api.get('/academic/courses');
      return res.data.data;
    },
  });

  const { data: academicYears } = useQuery({
    queryKey: ['academicYearsList'],
    queryFn: async () => {
      const res = await api.get('/academic/academic-years');
      return res.data.data;
    },
  });

  const { data: semesters } = useQuery({
    queryKey: ['semestersList'],
    queryFn: async () => {
      const res = await api.get('/academic/semesters');
      return res.data.data;
    },
  });

  React.useEffect(() => {
    if (exams && exams.length > 0 && !selectedExamId) setSelectedExamId(exams[0].id);
    if (courses && courses.length > 0 && !selectedCourseId) setSelectedCourseId(courses[0].id);
    if (academicYears && academicYears.length > 0 && !academicYearId) setAcademicYearId(academicYears[0].id);
    if (semesters && semesters.length > 0 && !semesterId) setSemesterId(semesters[0].id);
  }, [exams, courses, academicYears, semesters, selectedExamId, selectedCourseId, academicYearId, semesterId]);

  const { data: courseDetail, isLoading: courseLoading } = useQuery({
    queryKey: ['courseDetailMarks', selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) return null;
      const res = await api.get(`/academic/courses/${selectedCourseId}`);
      return res.data.data;
    },
    enabled: !!selectedCourseId,
  });

  // Populate default marks
  React.useEffect(() => {
    if (courseDetail?.enrollments) {
      const initial: any = {};
      courseDetail.enrollments.forEach((e: any, idx: number) => {
        initial[e.studentId] = {
          internal: 24 + (idx % 6),
          external: 58 + (idx % 12),
          remarks: 'Good continuous assessment performance',
        };
      });
      setMarksState(initial);
    }
  }, [courseDetail]);

  // Create Internal Exam Mutation
  const createExamMutation = useMutation({
    mutationFn: async (payload?: any) => {
      const data = payload || {
        name: examName,
        type: examType,
        startDate,
        endDate,
        academicYearId: academicYearId || academicYears?.[0]?.id,
        semesterId: semesterId || semesters?.[0]?.id,
      };
      return api.post('/examinations', data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['facultyExamsList'] });
      setCreateInternalModal(false);
      if (res.data?.data?.id) {
        setSelectedExamId(res.data.data.id);
      }
      setExamName('');
    },
  });

  // Delete Exam Mutation
  const deleteExamMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/examinations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facultyExamsList'] });
    },
  });

  // Publish Exam Mutation
  const publishExamMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.post(`/examinations/${id}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facultyExamsList'] });
    },
  });

  // Submit Marks Mutation
  const submitMarksMutation = useMutation({
    mutationFn: async () => {
      const marks = Object.entries(marksState).map(([studentId, val]) => ({
        studentId,
        internalMarks: val.internal,
        externalMarks: val.external,
        remarks: val.remarks,
      }));

      return api.post(`/examinations/${selectedExamId}/marks`, {
        courseId: selectedCourseId,
        marks,
      });
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
      queryClient.invalidateQueries({ queryKey: ['facultyExamsList'] });
    },
  });

  // Quick preset helper
  const handleQuickAddInternal = (presetName: string, type = 'INTERNAL') => {
    if (!academicYears?.length || !semesters?.length) return;
    createExamMutation.mutate({
      name: `${presetName} — ${courses?.find((c: any) => c.id === selectedCourseId)?.code || 'CSE 201'}`,
      type,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      academicYearId: academicYears[0].id,
      semesterId: semesters[0].id,
    });
  };

  const selectedExam = exams?.find((e: any) => e.id === selectedExamId);
  const isPublished = selectedExam?.status === 'PUBLISHED';

  const calculateGrade = (total: number) => {
    if (total >= 90) return { grade: 'A+', color: 'bg-emerald-100 text-emerald-800' };
    if (total >= 80) return { grade: 'A', color: 'bg-emerald-50 text-emerald-700' };
    if (total >= 70) return { grade: 'B+', color: 'bg-indigo-50 text-indigo-700' };
    if (total >= 60) return { grade: 'B', color: 'bg-blue-50 text-blue-700' };
    if (total >= 50) return { grade: 'C', color: 'bg-amber-50 text-amber-700' };
    if (total >= 40) return { grade: 'P', color: 'bg-slate-100 text-slate-700' };
    return { grade: 'F', color: 'bg-rose-100 text-rose-800' };
  };

  if (examsLoading || coursesLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Main Creation Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Internal Assessment & Marks Entry</h1>
            <Badge variant="primary">{exams?.length || 0} Scheduled Exams</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create internal assessments, conduct continuous evaluations, grade lab practicals, and record marks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="md"
            onClick={() => setCreateInternalModal(true)}
            className="font-bold shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Create Internal Exam</span>
          </Button>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Marks recorded and submitted successfully for {selectedExam?.name}!</span>
        </div>
      )}

      {/* Quick Presets Bar for Internal Tests */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-purple-50/70 rounded-2xl p-4 border border-indigo-100/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Quick Add Internal Evaluation Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleQuickAddInternal('Continuous Internal Assessment 1 (CIA-1)', 'INTERNAL')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-xs font-bold text-slate-700 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3 h-3 text-indigo-600" /> + CIA-1 (30 Marks)
          </button>
          <button
            onClick={() => handleQuickAddInternal('Continuous Internal Assessment 2 (CIA-2)', 'INTERNAL')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-xs font-bold text-slate-700 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3 h-3 text-indigo-600" /> + CIA-2 (30 Marks)
          </button>
          <button
            onClick={() => handleQuickAddInternal('Mid-Semester Lab Practical Exam', 'PRACTICAL')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-xs font-bold text-slate-700 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3 h-3 text-indigo-600" /> + Lab Practical (50 Marks)
          </button>
          <button
            onClick={() => handleQuickAddInternal('Surprise Assessment Quiz', 'INTERNAL')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-xs font-bold text-slate-700 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3 h-3 text-indigo-600" /> + Quiz Test
          </button>
        </div>
      </div>

      {/* Examination & Course Selection Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Examination / Test
          </label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {exams?.map((ex: any) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} [{ex.type}] — {ex.status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Target Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {courses?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Exam Control Card */}
      {selectedExam && (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                {selectedExam.type}
              </span>
              <h3 className="text-base font-bold text-slate-900">{selectedExam.name}</h3>
              <Badge variant={isPublished ? 'success' : 'warning'}>{selectedExam.status}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Term: {new Date(selectedExam.startDate).toLocaleDateString()} – {new Date(selectedExam.endDate).toLocaleDateString()} • {selectedExam._count?.marks || 0} Student Marks Recorded
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isPublished ? (
              <Button
                size="sm"
                onClick={() => publishExamMutation.mutate(selectedExam.id)}
                loading={publishExamMutation.isPending}
                className="font-bold text-xs"
              >
                <Globe className="w-3.5 h-3.5 mr-1" />
                <span>Publish Results to Students</span>
              </Button>
            ) : (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Results Live
              </span>
            )}

            <button
              onClick={() => {
                if (confirm('Delete this examination and its recorded marks?')) {
                  deleteExamMutation.mutate(selectedExam.id);
                }
              }}
              title="Delete Exam"
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Student Marks Roster Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Evaluation Roster</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter internal assessment (out of 30) and semester marks (out of 70)
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {courseDetail?.enrollments?.length || 0} Enrolled Candidates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#BAE6FD]/40 text-slate-700 font-bold border-b border-sky-100">
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4 text-center">Internal Marks (30)</th>
                <th className="py-3.5 px-4 text-center">External / Final (70)</th>
                <th className="py-3.5 px-4 text-center">Total (100)</th>
                <th className="py-3.5 px-4 text-center">Grade</th>
                <th className="py-3.5 px-4">Feedback / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseDetail?.enrollments?.map((enr: any, rowIdx: number) => {
                const cur = marksState[enr.studentId] || { internal: 0, external: 0, remarks: '' };
                const total = Math.min(100, (Number(cur.internal) || 0) + (Number(cur.external) || 0));
                const gradeMeta = calculateGrade(total);

                return (
                  <tr key={enr.id} className={rowIdx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {enr.student?.user?.firstName} {enr.student?.user?.lastName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{enr.student?.rollNumber}</td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={cur.internal}
                        onChange={(e) =>
                          setMarksState((prev) => ({
                            ...prev,
                            [enr.studentId]: { ...cur, internal: Number(e.target.value) },
                          }))
                        }
                        className="w-16 text-center px-2 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="70"
                        value={cur.external}
                        onChange={(e) =>
                          setMarksState((prev) => ({
                            ...prev,
                            [enr.studentId]: { ...cur, external: Number(e.target.value) },
                          }))
                        }
                        className="w-16 text-center px-2 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-slate-900 text-sm">{total}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${gradeMeta.color}`}>
                        {gradeMeta.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        value={cur.remarks}
                        onChange={(e) =>
                          setMarksState((prev) => ({
                            ...prev,
                            [enr.studentId]: { ...cur, remarks: e.target.value },
                          }))
                        }
                        placeholder="e.g. Excellent practical lab exam performance"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <Button
            onClick={() => submitMarksMutation.mutate()}
            loading={submitMarksMutation.isPending}
            size="md"
            className="font-bold shadow-md shadow-indigo-200"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save & Submit Marks</span>
          </Button>
        </div>
      </div>

      {/* Create Internal Exam Modal */}
      <Modal
        isOpen={createInternalModal}
        onClose={() => setCreateInternalModal(false)}
        title="Create Internal Assessment / Continuous Test"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createExamMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Assessment Name
            </label>
            <input
              type="text"
              required
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g. Continuous Internal Assessment 1 (CIA-1) - DSA"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="INTERNAL">Continuous Assessment (CIA)</option>
                <option value="PRACTICAL">Lab Practical Evaluation</option>
                <option value="MID_TERM">Mid-Term Examination</option>
                <option value="FINAL">End Semester Final</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Maximum Internal Marks
              </label>
              <select
                value={maxInternalMarks}
                onChange={(e) => setMaxInternalMarks(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="20">20 Marks (Quiz / Test)</option>
                <option value="30">30 Marks (Standard CIA)</option>
                <option value="50">50 Marks (Practical / Lab Exam)</option>
                <option value="100">100 Marks (Comprehensive Final)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateInternalModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={createExamMutation.isPending}>
              Create Assessment Test
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
