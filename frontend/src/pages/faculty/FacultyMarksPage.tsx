import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Award, Save, Check } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const FacultyMarksPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [marksState, setMarksState] = useState<Record<string, { internal: number; external: number; remarks: string }>>({});
  const [success, setSuccess] = useState(false);

  const { data: exams } = useQuery({
    queryKey: ['examsList'],
    queryFn: async () => {
      const res = await api.get('/examinations');
      return res.data.data;
    },
  });

  const { data: courses } = useQuery({
    queryKey: ['facultyCourses'],
    queryFn: async () => {
      const res = await api.get('/academic/courses');
      return res.data.data;
    },
  });

  React.useEffect(() => {
    if (exams && exams.length > 0 && !selectedExamId) setSelectedExamId(exams[0].id);
    if (courses && courses.length > 0 && !selectedCourseId) setSelectedCourseId(courses[0].id);
  }, [exams, courses, selectedExamId, selectedCourseId]);

  const { data: courseDetail, isLoading } = useQuery({
    queryKey: ['courseDetailMarks', selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) return null;
      const res = await api.get(`/academic/courses/${selectedCourseId}`);
      return res.data.data;
    },
    enabled: !!selectedCourseId,
  });

  React.useEffect(() => {
    if (courseDetail?.enrollments) {
      const initial: any = {};
      courseDetail.enrollments.forEach((e: any) => {
        initial[e.studentId] = { internal: 25, external: 60, remarks: 'Good work' };
      });
      setMarksState(initial);
    }
  }, [courseDetail]);

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
      setTimeout(() => setSuccess(false), 3000);
      queryClient.invalidateQueries({ queryKey: ['examsList'] });
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Examination Marks Entry</h1>
          <p className="text-xs text-slate-500 mt-1">Submit internal assessment and external examination scores for grading</p>
        </div>
        {success && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Check className="w-4 h-4" />
            <span>Marks submitted successfully!</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Examination
          </label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
          >
            {exams?.map((ex: any) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
          >
            {courses?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <h2 className="text-base font-bold text-slate-900 mb-4">Student Marks Roster</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Internal (30)</th>
                <th className="py-3 px-4">External (70)</th>
                <th className="py-3 px-4">Total (100)</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseDetail?.enrollments?.map((enr: any) => {
                const cur = marksState[enr.studentId] || { internal: 0, external: 0, remarks: '' };
                const total = (Number(cur.internal) || 0) + (Number(cur.external) || 0);

                return (
                  <tr key={enr.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {enr.student?.user?.firstName} {enr.student?.user?.lastName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{enr.student?.rollNumber}</td>
                    <td className="py-3.5 px-4">
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
                        className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3.5 px-4">
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
                        className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">{total}</td>
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
                        placeholder="Remarks"
                        className="w-40 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none"
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
            <span>Submit Marks for Approval</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
