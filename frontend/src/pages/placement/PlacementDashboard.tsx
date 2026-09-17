import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import {
  Briefcase,
  Building,
  Users,
  CheckCircle2,
  Award,
  Clock,
  TrendingUp,
  DollarSign,
  FileCheck,
  Globe,
  Sparkles,
  ArrowRight,
  Target,
  BarChart3,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

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
    totalCompanies: 42,
    activeDrives: 6,
    totalApplications: 528,
    selectedCount: 68,
    shortlistedCount: 112,
  };

  const drives = data?.drives || [
    {
      id: 'd1',
      companyName: 'Google',
      jobRole: 'Software Development Engineer - I',
      packageLpa: '45.0',
      minCgpa: 8.5,
      deadline: '2026-06-20T23:59:59Z',
      applicationsCount: 184,
      status: 'OPEN',
      mode: 'ON_CAMPUS',
    },
    {
      id: 'd2',
      companyName: 'Microsoft',
      jobRole: 'Cloud Solutions Architect',
      packageLpa: '38.5',
      minCgpa: 8.0,
      deadline: '2026-06-25T23:59:59Z',
      applicationsCount: 142,
      status: 'OPEN',
      mode: 'ON_CAMPUS',
    },
    {
      id: 'd3',
      companyName: 'Qualcomm',
      jobRole: 'Systems Software & VLSI Engineer',
      packageLpa: '28.0',
      minCgpa: 7.5,
      deadline: '2026-06-28T23:59:59Z',
      applicationsCount: 96,
      status: 'SHORTLISTING',
      mode: 'HYBRID',
    },
    {
      id: 'd4',
      companyName: 'Goldman Sachs',
      jobRole: 'Quantitative Technology Analyst',
      packageLpa: '32.0',
      minCgpa: 8.0,
      deadline: '2026-07-02T23:59:59Z',
      applicationsCount: 106,
      status: 'OPEN',
      mode: 'ON_CAMPUS',
    },
  ];

  const topRecruiters = ['Google', 'Microsoft', 'Qualcomm', 'Cisco', 'Amazon', 'Goldman Sachs', 'Oracle', 'Nvidia'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Placement Season Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center font-black text-xl shadow-inner">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Corporate Relations & Placement Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Season 2026 Live
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Highest CTC: <strong className="text-emerald-400">₹45.0 LPA</strong> • Average CTC: <strong className="text-white">₹14.2 LPA</strong> • Placement Rate: <strong className="text-sky-300">88.4%</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/placement/drives"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-900/50"
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Drives</span>
          </Link>
          <Link
            to="/placement/companies"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm"
          >
            <Building className="w-4 h-4" />
            <span>Recruiters</span>
          </Link>
          <Link
            to="/placement/analytics"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>

      {/* 4 Enhanced Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Drives"
          value={kpis.activeDrives}
          subtitle="Open for student applications"
          icon={Briefcase}
          variant="purple"
        />
        <StatCard
          title="Partner Companies"
          value={kpis.totalCompanies}
          subtitle="Registered global employers"
          icon={Building}
          variant="blue"
        />
        <StatCard
          title="Total Applications"
          value={kpis.totalApplications}
          subtitle="Verified candidate submissions"
          icon={Users}
          variant="amber"
        />
        <StatCard
          title="Shortlists & Offers"
          value={`${kpis.shortlistedCount} / ${kpis.selectedCount}`}
          subtitle="Selected job offers"
          icon={CheckCircle2}
          variant="green"
        />
      </div>

      {/* Hiring Partners Ticker */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Featured Campus Recruiters:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {topRecruiters.map((brand, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Main Table: Active Drives */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Recruitment Drives & Application Pipelines</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage job postings, eligibility filters, and candidate shortlists</p>
          </div>
          <Link to="/placement/drives" className="text-xs font-bold text-indigo-600 hover:underline">
            View All Drives
          </Link>
        </div>

        <div className="space-y-3.5">
          {drives.map((d: any) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-sm shrink-0">
                  {d.companyName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{d.companyName}</span>
                    <Badge variant={d.status === 'OPEN' ? 'success' : 'warning'}>
                      {d.status}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{d.jobRole}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="font-bold text-slate-800">₹{d.packageLpa} LPA CTC</span>
                    <span>•</span>
                    <span>Min CGPA: <strong>{d.minCgpa}</strong></span>
                    <span>•</span>
                    <span>Deadline: <strong>{new Date(d.deadline).toLocaleDateString()}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                  {d.applicationsCount} Applicants
                </span>
                <Link
                  to="/placement/drives"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition shadow-xs"
                >
                  Manage Shortlists
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
