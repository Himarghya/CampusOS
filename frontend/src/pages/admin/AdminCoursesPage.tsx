import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { BookOpen, Plus, Users, Layers } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminCoursesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(4);
  const [type, setType] = useState('THEORY');
  const [departmentId, setDepartmentId] = useState('');
  const [programId, setProgramId] = useState('');
  const [description, setDescription] = useState('');

  const { data: departments } = useQuery({
    queryKey: ['departmentsList'],
    queryFn: async () => {
      const res = await api.get('/departments');
      return res.data.data;
    },
  });

  const { data: programs } = useQuery({
    queryKey: ['programsList'],
    queryFn: async () => {
      const res = await api.get('/academic/programs');
      return res.data.data;
    },
  });

  React.useEffect(() => {
    if (departments && departments.length > 0 && !departmentId) setDepartmentId(departments[0].id);
    if (programs && programs.length > 0 && !programId) setProgramId(programs[0].id);
  }, [departments, programs, departmentId, programId]);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['adminCoursesList'],
    queryFn: async () => {
      const res = await api.get('/academic/courses');
      return res.data.data;
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async () => {
      return api.post('/academic/courses', {
        name,
        code,
        credits,
        type,
        departmentId,
        programId,
        description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoursesList'] });
      setCreateModal(false);
      setName('');
      setCode('');
      setDescription('');
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Courses & Curriculum</h1>
          <p className="text-xs text-slate-500 mt-1">Course catalog, syllabi, credits allocation, and department assignments</p>
        </div>
        <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Course</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((c: any) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold text-indigo-600">{c.code}</span>
                <Badge variant={c.type === 'LAB' ? 'warning' : 'primary'}>{c.type}</Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{c.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{c.description || 'Comprehensive curriculum module'}</p>

              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Department:</span>
                  <strong className="text-slate-800">{c.department?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Credits:</span>
                  <strong className="text-slate-800">{c.credits} Credits</strong>
                </div>
                <div className="flex justify-between">
                  <span>Enrolled Students:</span>
                  <strong className="text-indigo-600 font-bold">{c._count?.enrollments || 0} Students</strong>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Badge variant="success">Active Curriculum</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New Course">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCourseMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Course Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Distributed Cloud Computing"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="CSE 301"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Credits</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="THEORY">Theory</option>
                <option value="LAB">Lab</option>
                <option value="ELECTIVE">Elective</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
            >
              {departments?.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={createCourseMutation.isPending}>
              Create Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
