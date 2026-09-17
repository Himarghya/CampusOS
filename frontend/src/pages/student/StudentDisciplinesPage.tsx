import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Search, Network, BookOpen, Layers, ArrowUpRight } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentDisciplinesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: disciplines, isLoading } = useQuery({
    queryKey: ['academicDisciplinesList'],
    queryFn: async () => {
      const res = await api.get('/academic/disciplines');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const filteredDisciplines = disciplines?.filter((d: any) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = d.name.toLowerCase().includes(query) || d.code.toLowerCase().includes(query);
    const progMatch = d.programmes.some((p: string) => p.toLowerCase().includes(query));
    return nameMatch || progMatch;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header (matches Screenshot 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Disciplines</h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore academic disciplines and degree programmes offered across the institute
          </p>
        </div>

        {/* Search input (matches Screenshot 1 top right) */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by discipline or programme"
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Disciplines & Programmes Table (matches Screenshot 1 exact design & styling) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#BAE6FD]/40 text-slate-700 font-bold border-b border-sky-100">
                <th className="py-4 px-8 w-1/3 text-left font-bold text-slate-800">Discipline</th>
                <th className="py-4 px-8 w-2/3 text-center font-bold text-slate-800">Programmes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDisciplines.map((d: any, index: number) => (
                <tr
                  key={d.id || index}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    index % 2 === 1 ? 'bg-[#F0F9FF]/40' : 'bg-white'
                  }`}
                >
                  <td className="py-5 px-8 font-semibold text-slate-800 text-left">
                    <span className="text-slate-900 font-bold">{d.name}</span>
                    <span className="text-slate-500 ml-1.5 font-medium">({d.code})</span>
                  </td>
                  <td className="py-5 px-8 text-center text-indigo-600 font-medium leading-relaxed">
                    {d.programmes.map((prog: string, pIdx: number) => (
                      <React.Fragment key={pIdx}>
                        <span className="hover:underline hover:text-indigo-800 cursor-pointer">
                          {prog}
                        </span>
                        {pIdx < d.programmes.length - 1 && (
                          <span className="text-slate-300 mx-2 font-normal">|</span>
                        )}
                      </React.Fragment>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
