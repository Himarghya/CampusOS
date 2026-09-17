import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Users, User, Mail, BookOpen } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';

export const AdminFacultyPage: React.FC = () => {
  const { data: faculty, isLoading } = useQuery({
    queryKey: ['adminFacultyList'],
    queryFn: async () => {
      const res = await api.get('/faculty');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faculty & Department Staff</h1>
        <p className="text-xs text-slate-500 mt-1">Teaching faculty, designations, specializations, and assigned courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty?.map((f: any) => (
          <div
            key={f.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-100">
                  {f.user?.firstName?.[0]}
                  {f.user?.lastName?.[0]}
                </div>
                <Badge variant="primary">{f.department?.code}</Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {f.user?.firstName} {f.user?.lastName}
              </h3>
              <div className="text-xs font-semibold text-indigo-600 mb-2">{f.designation}</div>
              <p className="text-xs text-slate-500 mb-4">{f.specialization || 'Computer Science & Engineering'}</p>

              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Employee Code:</span>
                  <strong className="text-slate-800">{f.employeeCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Cabin:</span>
                  <strong className="text-slate-800">{f.cabinNumber || 'CS-301'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <strong className="text-slate-800">{f.user?.email}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Assigned Courses:</span>
              <strong className="text-indigo-600 font-bold">{f.courseAssignments?.length || 0} Courses</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
