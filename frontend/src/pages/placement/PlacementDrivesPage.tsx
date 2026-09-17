import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Briefcase, Plus, Building, Users, MapPin, CheckCircle2 } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const PlacementDrivesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [title, setTitle] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [packageLpa, setPackageLpa] = useState(12.0);
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [description, setDescription] = useState('');
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const { data: companies } = useQuery({
    queryKey: ['companiesList'],
    queryFn: async () => {
      const res = await api.get('/placements/companies');
      return res.data.data;
    },
  });

  React.useEffect(() => {
    if (companies && companies.length > 0 && !companyId) setCompanyId(companies[0].id);
  }, [companies, companyId]);

  const { data: drives, isLoading } = useQuery({
    queryKey: ['placementDrivesAdmin'],
    queryFn: async () => {
      const res = await api.get('/placements/drives');
      return res.data.data;
    },
  });

  const createDriveMutation = useMutation({
    mutationFn: async () => {
      return api.post('/placements/drives', {
        companyId,
        title,
        jobRole,
        packageLpa,
        location,
        description,
        minCgpa,
        deadline,
        driveDate: deadline,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placementDrivesAdmin'] });
      setCreateModal(false);
      setTitle('');
      setJobRole('');
      setDescription('');
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement Drives</h1>
          <p className="text-xs text-slate-500 mt-1">Configure eligibility criteria, rounds, and candidate applications</p>
        </div>
        <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Placement Drive</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives?.map((d: any) => (
          <div
            key={d.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{d.company?.name}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                  ₹{d.packageLpa} LPA
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{d.jobRole}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{d.description}</p>

              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                <div className="flex items-center justify-between">
                  <span>Location:</span>
                  <strong className="text-slate-800">{d.location}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Deadline:</span>
                  <strong className="text-slate-800">{new Date(d.deadline).toLocaleDateString()}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Applicants:</span>
                  <strong className="text-indigo-600 font-bold">{d.applications?.length || 0} Students</strong>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Badge variant="primary">Active Drive</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create Placement Drive">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createDriveMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Company</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
            >
              {companies?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Drive Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Campus Hiring 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Job Role</label>
              <input
                type="text"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="Software Engineer"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Package (LPA)</label>
              <input
                type="number"
                step="0.5"
                value={packageLpa}
                onChange={(e) => setPackageLpa(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Job Description</label>
            <textarea
              required
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
            <Button type="submit" size="sm" loading={createDriveMutation.isPending}>
              Create Drive
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
