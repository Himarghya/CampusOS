import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Briefcase, Building, Users, CheckCircle2, Award, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const PlacementAnalyticsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['placementAnalytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/placement');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  const kpis = data?.kpis || {
    totalDrives: 4,
    totalApplications: 25,
    selectedCount: 6,
    shortlistedCount: 12,
    averagePackage: 18.5,
    highestPackage: 28.5,
  };

  const chartData = data?.drivesDetail || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement Intelligence & Compensation Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">Salary packages, company conversion ratios, and recruitment statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Highest Package"
          value={`₹${kpis.highestPackage} LPA`}
          subtitle="Top CTC offered"
          icon={Award}
          variant="purple"
        />
        <StatCard
          title="Average Package"
          value={`₹${kpis.averagePackage} LPA`}
          subtitle="Mean CTC"
          icon={DollarSign}
          variant="green"
        />
        <StatCard
          title="Total Applications"
          value={kpis.totalApplications}
          subtitle="Student submissions"
          icon={Users}
          variant="blue"
        />
        <StatCard
          title="Selections"
          value={kpis.selectedCount}
          subtitle="Offers rolled out"
          icon={CheckCircle2}
          variant="rose"
        />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <h2 className="text-base font-bold text-slate-900 mb-6">Package Breakdown by Recruiting Company (LPA)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="company" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '1rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar dataKey="packageLpa" fill="#6366F1" radius={[8, 8, 0, 0]} name="Package (LPA)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
