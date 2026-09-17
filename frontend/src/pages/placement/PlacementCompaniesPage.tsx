import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Building, Plus, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const PlacementCompaniesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Software & Technology');
  const [website, setWebsite] = useState('https://');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const { data: companies, isLoading } = useQuery({
    queryKey: ['placementCompaniesList'],
    queryFn: async () => {
      const res = await api.get('/placements/companies');
      return res.data.data;
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: async () => {
      return api.post('/placements/companies', {
        name,
        industry,
        website,
        description,
        contactEmail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placementCompaniesList'] });
      setCreateModal(false);
      setName('');
      setDescription('');
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Partner Recruiters & Companies</h1>
          <p className="text-xs text-slate-500 mt-1">Corporate relations, industry hiring partners, and recruiter contact profiles</p>
        </div>
        <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Company</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies?.map((c: any) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building className="w-6 h-6" />
                </div>
                <Badge variant="primary">{c._count?.drives || 1} Active Drives</Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{c.name}</h3>
              <div className="text-xs font-semibold text-indigo-600 mb-2">{c.industry}</div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{c.description || 'Global corporate technology partner.'}</p>

              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <a href={c.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate">
                    {c.website || 'https://campusos.edu'}
                  </a>
                </div>
                {c.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 font-semibold">Tier 1 Recruiter Partner</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Add Partner Company">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCompanyMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Company Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apple Inc."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Industry</label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Software / Cloud"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Recruiter Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="campus-recruitment@company.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
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
            <Button type="submit" size="sm" loading={createCompanyMutation.isPending}>
              Save Company
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
