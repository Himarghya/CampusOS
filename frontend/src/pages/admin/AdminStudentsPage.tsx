import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Users, Plus, Search, CheckCircle2, XCircle, Power } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminStudentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [batch, setBatch] = useState('2023-2027');
  const [currentSemester, setCurrentSemester] = useState(4);
  const [cgpa, setCgpa] = useState(8.5);
  const [departmentId, setDepartmentId] = useState('');
  const [programId, setProgramId] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');

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

  const { data: academicYears } = useQuery({
    queryKey: ['academicYearsList'],
    queryFn: async () => {
      const res = await api.get('/academic/academic-years');
      return res.data.data;
    },
  });

  React.useEffect(() => {
    if (departments && departments.length > 0 && !departmentId) setDepartmentId(departments[0].id);
    if (programs && programs.length > 0 && !programId) setProgramId(programs[0].id);
    if (academicYears && academicYears.length > 0 && !academicYearId) setAcademicYearId(academicYears[0].id);
  }, [departments, programs, academicYears, departmentId, programId, academicYearId]);

  const { data, isLoading } = useQuery({
    queryKey: ['studentsList', search],
    queryFn: async () => {
      const res = await api.get('/students', { params: { search } });
      return res.data.data;
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async () => {
      return api.post('/students', {
        firstName,
        lastName,
        email,
        rollNumber,
        batch,
        currentSemester,
        cgpa,
        departmentId,
        programId,
        academicYearId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentsList'] });
      setCreateModal(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setRollNumber('');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/students/${id}/toggle-active`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentsList'] });
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Enrollments, academic status, and student credentials management</p>
        </div>
        <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Student</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-card flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students by name, roll number, or email..."
          className="w-full text-xs font-medium focus:outline-none text-slate-900"
        />
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{s.user?.firstName} {s.user?.lastName}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{s.user?.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{s.rollNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-600">{s.department?.code}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">Sem {s.currentSemester}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">{Number(s.cgpa).toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={s.user?.isActive ? 'success' : 'danger'}>
                      {s.user?.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleActiveMutation.mutate(s.id)}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {s.user?.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Add New Student">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createStudentMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">College Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campusos.edu"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Roll Number</label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="2023CSE099"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
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

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={createStudentMutation.isPending}>
              Create Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
