import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { FileCheck, Plus, CheckCircle2, Award, Clock } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const FacultyAssignmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [gradingModal, setGradingModal] = useState<any | null>(null);
  const [score, setScore] = useState<number>(90);
  const [feedback, setFeedback] = useState('Excellent work and clean implementation!');

  // Form states for creation
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const { data: courses } = useQuery({
    queryKey: ['facultyCourses'],
    queryFn: async () => {
      const res = await api.get('/academic/courses');
      return res.data.data;
    },
  });

  React.useEffect(() => {
    if (courses && courses.length > 0 && !courseId) {
      setCourseId(courses[0].id);
    }
  }, [courses, courseId]);

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['facultyAssignments'],
    queryFn: async () => {
      const res = await api.get('/assignments');
      return res.data.data;
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async () => {
      return api.post('/assignments', {
        courseId,
        title,
        description,
        maxMarks,
        dueDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facultyAssignments'] });
      setCreateModal(false);
      setTitle('');
      setDescription('');
    },
  });

  const gradeSubmissionMutation = useMutation({
    mutationFn: async () => {
      return api.patch(`/assignments/submissions/${gradingModal.id}/evaluate`, {
        obtainedMarks: score,
        feedback,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facultyAssignments'] });
      setGradingModal(null);
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assignment Management</h1>
          <p className="text-xs text-slate-500 mt-1">Create course coursework, manage deadlines, and evaluate student work</p>
        </div>
        <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Create Assignment</span>
        </Button>
      </div>

      <div className="space-y-6">
        {assignments?.map((a: any) => (
          <div key={a.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600">{a.course?.code} — {a.course?.name}</span>
                <h3 className="text-base font-bold text-slate-900">{a.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="primary">Due: {new Date(a.dueDate).toLocaleDateString()}</Badge>
                <Badge variant="neutral">Max: {a.maxMarks} pts</Badge>
              </div>
            </div>

            {/* Submissions Section */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Student Submissions ({a.submissions?.length || 0})
              </h4>

              {a.submissions?.length === 0 ? (
                <div className="text-xs text-slate-400 py-3 italic">No student submissions yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {a.submissions?.map((s: any) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {s.student?.user?.firstName} {s.student?.user?.lastName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Submitted: {new Date(s.submittedAt).toLocaleDateString()} • {s.fileName}
                        </div>
                        {s.status === 'EVALUATED' && (
                          <div className="text-[11px] font-bold text-emerald-600 mt-1">
                            Score: {s.obtainedMarks}/{a.maxMarks} pts
                          </div>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant={s.status === 'EVALUATED' ? 'secondary' : 'primary'}
                        onClick={() => {
                          setGradingModal(s);
                          setScore(s.obtainedMarks || 85);
                          setFeedback(s.feedback || 'Good attempt and proper logic.');
                        }}
                      >
                        {s.status === 'EVALUATED' ? 'Regrade' : 'Evaluate'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New Assignment">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createAssignmentMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Course
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
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
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Graph Traversal Practical"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Description / Instructions
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions and requirements for students"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Max Marks
              </label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Grading Modal */}
      <Modal isOpen={!!gradingModal} onClose={() => setGradingModal(null)} title="Evaluate Submission">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            gradeSubmissionMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-900 text-xs font-semibold">
            Student: {gradingModal?.student?.user?.firstName} {gradingModal?.student?.user?.lastName} (Roll: {gradingModal?.student?.rollNumber})
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Obtained Marks (out of 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Feedback & Remarks
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setGradingModal(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Grade
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
