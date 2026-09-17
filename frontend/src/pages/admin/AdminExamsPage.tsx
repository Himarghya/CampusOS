import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Award, Plus, CheckCircle2, Globe, Calendar } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminExamsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('MID_TERM');
  const [startDate, setStartDate] = useState('2026-05-25');
  const [endDate, setEndDate] = useState('2026-06-05');
  const [academicYearId, setAcademicYearId] = useState('');
  const [semesterId, setSemesterId] = useState('');

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
    if (academicYears && academicYears.length > 0 && !academicYearId) setAcademicYearId(academicYears[0].id);
    if (semesters && semesters.length > 0 && !semesterId) setSemesterId(semesters[0].id);
  }, [academicYears, semesters, academicYearId, semesterId]);

  const { data: exams, isLoading } = useQuery({
    queryKey: ['adminExamsList'],
    queryFn: async () => {
      const res = await api.get('/examinations');
      return res.data.data;
    },
  });

  const createExamMutation = useMutation({
    mutationFn: async () => {
      return api.post('/examinations', {
        name,
        type,
        startDate,
        endDate,
        academicYearId,
        semesterId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExamsList'] });
      setCreateModal(false);
      setName('');
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.post(`/examinations/${id}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExamsList'] });
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Examination & Marks Governance</h1>
          <p className="text-xs text-slate-500 mt-1">Configure academic evaluation schedules, verify marks, and publish official transcripts</p>
        </div>
        <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Create Examination</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams?.map((exam: any) => {
          const isPublished = exam.status === 'PUBLISHED';

          return (
            <div
              key={exam.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={isPublished ? 'success' : 'warning'}>
                    {exam.status}
                  </Badge>
                  <span className="text-xs font-bold text-slate-400">{exam.type}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{exam.name}</h3>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Term:</span>
                    <strong className="text-slate-800">
                      {new Date(exam.startDate).toLocaleDateString()} – {new Date(exam.endDate).toLocaleDateString()}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Evaluated Marks Entries:</span>
                    <strong className="text-slate-800">{exam._count?.marks || 0} Records</strong>
                  </div>
                </div>
              </div>

              <div>
                {isPublished ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 pt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Results Live & Visible to Students</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => publishMutation.mutate(exam.id)}
                    loading={publishMutation.isPending}
                    className="w-full font-bold"
                  >
                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                    <span>Approve & Publish Results</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New Examination">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createExamMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Examination Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. End Semester Practical Examination 2026"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Exam Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="MID_TERM">Mid Term</option>
                <option value="FINAL">End Semester Final</option>
                <option value="PRACTICAL">Practical Lab Exam</option>
                <option value="INTERNAL">Continuous Assessment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Academic Year</label>
              <select
                value={academicYearId}
                onChange={(e) => setAcademicYearId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                {academicYears?.map((ay: any) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={createExamMutation.isPending}>
              Create Examination
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
