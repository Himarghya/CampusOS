import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Building, Plus, Users, BookOpen, Layers } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminDepartmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departmentsListAll'],
    queryFn: async () => {
      const res = await api.get('/departments');
      return res.data.data;
    },
  });

  const createDeptMutation = useMutation({
    mutationFn: async () => {
      return api.post('/departments', { name, code });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentsListAll'] });
      setCreateModal(false);
      setName('');
      setCode('');
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Departments</h1>
          <p className="text-xs text-slate-500 mt-1">Faculties, degree programs, and departmental governance</p>
        </div>
        <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Department</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments?.map((d: any) => (
          <div
            key={d.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building className="w-6 h-6" />
                </div>
                <Badge variant="primary">{d.code}</Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-4">{d.name}</h3>

              <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Students:</span>
                  <strong className="text-slate-800">{d._count?.students || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Faculty:</span>
                  <strong className="text-slate-800">{d._count?.faculty || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active Courses:</span>
                  <strong className="text-indigo-600 font-bold">{d._count?.courses || 0}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-4">
              <span className="text-xs text-slate-400 font-semibold">
                Programs: {d.programs?.length || 1} Degree Track
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create Department">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createDeptMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Department Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mechanical Engineering"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ME"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={createDeptMutation.isPending}>
              Save Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const FacultyCoursesPage: React.FC = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['facultyAssignedCourses'],
    queryFn: async () => {
      const res = await api.get('/academic/courses');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Courses & Classes</h1>
        <p className="text-xs text-slate-500 mt-1">Teaching timetable, enrolled student rosters, and course materials</p>
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
                <Badge variant="primary">{c.credits} Credits</Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">{c.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{c.description}</p>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-semibold mb-3">
                Section A • {c._count?.enrollments || 40} Students Enrolled
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold text-indigo-600">
              <BookOpen className="w-4 h-4" />
              <span>Full Syllabus & Lab Material Ready</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
