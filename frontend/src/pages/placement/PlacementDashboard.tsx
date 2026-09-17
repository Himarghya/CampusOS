import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Briefcase, Building, Users, CheckCircle2, Award, Clock } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';

export const PlacementDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['placementDashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/placement');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const kpis = data?.kpis || {
    totalCompanies: 4,
    activeDrives: 2,
    totalApplications: 18,
    selectedCount: 4,
    shortlistedCount: 6,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement & Career Hub</h1>
        <p className="text-xs text-slate-500 mt-1">Campus recruiting drives, partner companies, student shortlists, and offers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Drives"
          value={kpis.activeDrives}
          subtitle="Open applications"
          icon={Briefcase}
          variant="purple"
        />
        <StatCard
          title="Partner Companies"
          value={kpis.totalCompanies}
          subtitle="Registered recruiters"
          icon={Building}
          variant="blue"
        />
        <StatCard
          title="Applications"
          value={kpis.totalApplications}
          subtitle="Total candidate submissions"
          icon={Users}
          variant="amber"
        />
        <StatCard
          title="Shortlisted / Offers"
          value={`${kpis.shortlistedCount} / ${kpis.selectedCount}`}
          subtitle="Interview cleared"
          icon={CheckCircle2}
          variant="green"
        />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900">Active Recruitment Drives</h2>
          <Link to="/placements" className="text-xs font-bold text-indigo-600 hover:underline">
            Manage Drives
          </Link>
        </div>

        <div className="space-y-3">
          {data?.drives?.map((d: any) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{d.companyName}</span>
                <h4 className="text-sm font-bold text-slate-900">{d.jobRole}</h4>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Package: ₹{d.packageLpa} LPA • Deadline: {new Date(d.deadline).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant="primary">{d.applicationsCount} Applicants</Badge>
                <Link
                  to="/placements"
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
