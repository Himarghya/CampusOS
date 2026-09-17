import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Briefcase, Building, MapPin, DollarSign, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const StudentPlacementsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [applyingDriveId, setApplyingDriveId] = useState<string | null>(null);

  const { data: drives, isLoading } = useQuery({
    queryKey: ['placementDrives'],
    queryFn: async () => {
      const res = await api.get('/placements/drives');
      return res.data.data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (driveId: string) => {
      return api.post(`/placements/drives/${driveId}/apply`, {
        resumeUrl: 'https://campusos.edu/resumes/john-doe-primary.pdf',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placementDrives'] });
      setApplyingDriveId(null);
    },
  });

  const handleApply = (driveId: string) => {
    setApplyingDriveId(driveId);
    applyMutation.mutate(driveId);
  };

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement Drives & Opportunities</h1>
          <p className="text-xs text-slate-500 mt-1">Campus recruitment drives, eligibility engine, and application tracker</p>
        </div>
        <Badge variant="primary" size="md">
          Graduating Batch: 2027
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives?.map((drive: any) => {
          const rule = drive.eligibilityRules?.[0];
          const hasApplied = drive.applications && drive.applications.length > 0;
          const app = drive.applications?.[0];

          return (
            <div
              key={drive.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                    ₹{drive.packageLpa} LPA
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {drive.company?.name}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{drive.jobRole}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{drive.description}</p>

                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{drive.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                  </div>
                  {rule && (
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold pt-1 border-t border-slate-200/60">
                      <span>Eligibility: Min CGPA {rule.minCgpa} • {rule.maxBacklogs} Backlogs Max</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {hasApplied ? (
                  <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs flex items-center justify-between">
                    <span className="text-indigo-900 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      <span>Status:</span>
                    </span>
                    <Badge variant={app.status === 'SELECTED' ? 'success' : app.status === 'SHORTLISTED' ? 'purple' : 'neutral'}>
                      {app.status}
                    </Badge>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleApply(drive.id)}
                    loading={applyingDriveId === drive.id}
                    size="sm"
                    className="w-full font-bold"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
