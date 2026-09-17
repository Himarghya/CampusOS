import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
  Award,
  Plus,
  CheckCircle2,
  Globe,
  Calendar,
  Trash2,
  Edit3,
  Copy,
  AlertTriangle,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminExamsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Modals state
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('MID_TERM');
  const [startDate, setStartDate] = useState('2026-05-25');
  const [endDate, setEndDate] = useState('2026-06-05');
  const [academicYearId, setAcademicYearId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [status, setStatus] = useState('DRAFT');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

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

  // Create Mutation
  const createExamMutation = useMutation({
    mutationFn: async (payload?: any) => {
      const data = payload || {
        name,
        type,
        startDate,
        endDate,
        academicYearId,
        semesterId,
      };
      return api.post('/examinations', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExamsList'] });
      setCreateModal(false);
      resetForm();
    },
  });

  // Update Mutation
  const updateExamMutation = useMutation({
    mutationFn: async () => {
      if (!selectedExam) return;
      return api.patch(`/examinations/${selectedExam.id}`, {
        name,
        type,
        startDate,
        endDate,
        academicYearId,
        semesterId,
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExamsList'] });
      setEditModal(false);
      setSelectedExam(null);
      resetForm();
    },
  });

  // Delete Mutation (Decrease Exams)
  const deleteExamMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/examinations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExamsList'] });
      setDeleteModal(false);
      setSelectedExam(null);
    },
  });

  // Publish / Status Mutation
  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.post(`/examinations/${id}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExamsList'] });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/examinations/${id}`, { status: 'DRAFT' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminExamsList'] });
    },
  });

  const resetForm = () => {
    setName('');
    setType('MID_TERM');
    setStartDate('2026-05-25');
    setEndDate('2026-06-05');
    setStatus('DRAFT');
  };

  const openEdit = (exam: any) => {
    setSelectedExam(exam);
    setName(exam.name);
    setType(exam.type);
    setStartDate(exam.startDate ? exam.startDate.split('T')[0] : '2026-05-25');
    setEndDate(exam.endDate ? exam.endDate.split('T')[0] : '2026-06-05');
    setAcademicYearId(exam.academicYearId || academicYears?.[0]?.id || '');
    setSemesterId(exam.semesterId || semesters?.[0]?.id || '');
    setStatus(exam.status || 'DRAFT');
    setEditModal(true);
  };

  const openDelete = (exam: any) => {
    setSelectedExam(exam);
    setDeleteModal(true);
  };

  // Quick Duplicate (Increases exam count easily)
  const handleDuplicate = (exam: any) => {
    createExamMutation.mutate({
      name: `${exam.name} (Copy)`,
      type: exam.type,
      startDate: exam.startDate ? exam.startDate.split('T')[0] : '2026-05-25',
      endDate: exam.endDate ? exam.endDate.split('T')[0] : '2026-06-05',
      academicYearId: exam.academicYearId || academicYears?.[0]?.id,
      semesterId: exam.semesterId || semesters?.[0]?.id,
    });
  };

  // Quick Preset Add
  const handleQuickAdd = (presetType: string, defaultName: string) => {
    if (!academicYears?.length || !semesters?.length) return;
    createExamMutation.mutate({
      name: defaultName,
      type: presetType,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      academicYearId: academicYears[0].id,
      semesterId: semesters[0].id,
    });
  };

  // Filtered List
  const filteredExams = exams?.filter((exam: any) => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || exam.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || exam.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const totalExamsCount = exams?.length || 0;
  const publishedCount = exams?.filter((e: any) => e.status === 'PUBLISHED').length || 0;
  const draftCount = exams?.filter((e: any) => e.status === 'DRAFT').length || 0;
  const practicalCount = exams?.filter((e: any) => e.type === 'PRACTICAL').length || 0;

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Examination & Marks Governance</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
              {totalExamsCount} Total Exams
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Increase or decrease examination counts, configure academic evaluation schedules, verify marks, and publish transcripts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="md"
            onClick={() => {
              resetForm();
              setCreateModal(true);
            }}
            className="font-bold shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Create New Exam</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scheduled</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalExamsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Results Published</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{publishedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Draft / Eval</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{draftCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Practical / Labs</p>
            <p className="text-2xl font-black text-purple-600 mt-0.5">{practicalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Increments / Presets Bar */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-purple-50/70 rounded-2xl p-4 border border-indigo-100/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Quick Add Exam Presets (+ Increase Count):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleQuickAdd('MID_TERM', `Mid-Term Examination Series ${totalExamsCount + 1}`)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-bold text-slate-700 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3 h-3 text-indigo-600" /> + Mid Term
          </button>
          <button
            onClick={() => handleQuickAdd('FINAL', `End-Semester Final Assessment ${totalExamsCount + 1}`)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-bold text-slate-700 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3 h-3 text-indigo-600" /> + Final Exam
          </button>
          <button
            onClick={() => handleQuickAdd('PRACTICAL', `Laboratory Practical Evaluation ${totalExamsCount + 1}`)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-bold text-slate-700 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3 h-3 text-indigo-600" /> + Lab Practical
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exam name..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Types</option>
            <option value="MID_TERM">Mid Term</option>
            <option value="FINAL">Final</option>
            <option value="PRACTICAL">Practical</option>
            <option value="INTERNAL">Internal</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      {/* Exam Cards Grid */}
      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Examinations Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Try adjusting your search filters or clear them to see all exams.'
              : 'Create a new examination to get started with evaluation schedules.'}
          </p>
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setCreateModal(true);
            }}
            className="mt-4 font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Examination
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam: any) => {
            const isPublished = exam.status === 'PUBLISHED';

            return (
              <div
                key={exam.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between hover:shadow-lg transition group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={isPublished ? 'success' : 'warning'}>
                      {exam.status}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{exam.type}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition">
                    {exam.name}
                  </h3>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Term:
                      </span>
                      <strong className="text-slate-800 font-semibold">
                        {new Date(exam.startDate).toLocaleDateString()} – {new Date(exam.endDate).toLocaleDateString()}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Evaluated Marks:</span>
                      <strong className="text-slate-800 font-semibold">{exam._count?.marks || 0} Records</strong>
                    </div>
                    {exam.semester?.program && (
                      <div className="flex items-center justify-between">
                        <span>Program:</span>
                        <strong className="text-slate-800 font-semibold">{exam.semester.program.code}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Status Action */}
                  <div>
                    {isPublished ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Results Live</span>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => unpublishMutation.mutate(exam.id)}
                          loading={unpublishMutation.isPending}
                          className="text-xs text-slate-600 hover:text-amber-700"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" /> Revert Draft
                        </Button>
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

                  {/* Management Controls: Edit, Duplicate, Delete (Decrease) */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(exam)}
                        title="Edit Examination"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 transition text-xs font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDuplicate(exam)}
                        title="Duplicate Exam (+1 Count)"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 border border-slate-200 transition text-xs font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Duplicate</span>
                      </button>
                    </div>

                    <button
                      onClick={() => openDelete(exam)}
                      title="Delete Exam (-1 Count)"
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Semester</label>
              <select
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                {semesters?.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    Semester {s.number} ({s.academicYear?.year || 'Current'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
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

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Examination Details">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateExamMutation.mutate();
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
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={updateExamMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete / Decrease Confirmation Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Examination">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <div>
              <p className="font-bold">Are you sure you want to delete this examination?</p>
              <p className="text-rose-600 mt-0.5">
                This will decrease the total number of exams and remove associated mark entries.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
            <p>
              <strong>Exam:</strong> {selectedExam?.name}
            </p>
            <p className="mt-1">
              <strong>Type:</strong> {selectedExam?.type}
            </p>
            <p className="mt-1">
              <strong>Mark Records:</strong> {selectedExam?._count?.marks || 0}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={deleteExamMutation.isPending}
              onClick={() => {
                if (selectedExam) deleteExamMutation.mutate(selectedExam.id);
              }}
            >
              Confirm Delete (-1 Exam)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
