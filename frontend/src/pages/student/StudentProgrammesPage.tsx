import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Building2, Search, GraduationCap, Award, BookOpen } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentProgrammesPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data: programs, isLoading } = useQuery({
    queryKey: ['academicProgramsList'],
    queryFn: async () => {
      const res = await api.get('/academic/programs');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const filtered = programs?.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Programmes</h1>
          <p className="text-xs text-slate-500 mt-1">Undergraduate, Postgraduate, and Doctoral degree programmes</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programmes..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prog: any) => (
          <div key={prog.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                  {prog.code}
                </span>
                <span className="text-xs font-bold text-slate-400">{prog.degreeType || 'B.Tech'}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{prog.name}</h3>
              <p className="text-xs text-slate-500">{prog.department?.name || 'Academic Division'}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Duration: 4 Years (8 Semesters)</span>
              <span className="font-bold text-indigo-600">160 Credits</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
