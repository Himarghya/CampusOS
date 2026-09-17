import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Award, Star, BookOpen, CheckCircle2 } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';

export const StudentResultsPage: React.FC = () => {
  const { data: results, isLoading } = useQuery({
    queryKey: ['myResults'],
    queryFn: async () => {
      const res = await api.get('/examinations/my-results');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Examination Results & Grades</h1>
          <p className="text-xs text-slate-500 mt-1">Official published academic grades, marks breakdown, and transcripts</p>
        </div>
        <div className="flex items-center gap-2 p-2 px-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Cumulative CGPA: 8.72</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <h2 className="text-base font-bold text-slate-900 mb-5">Published Examination Records</h2>
        {results?.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No published exam results found yet for this semester.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Exam Name</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Internal</th>
                  <th className="py-3 px-4">External</th>
                  <th className="py-3 px-4">Total (100)</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results?.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">{r.exam?.name}</td>
                    <td className="py-4 px-4 font-bold text-indigo-600">
                      <div>{r.course?.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{r.course?.code}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">{r.internalMarks}</td>
                    <td className="py-4 px-4 font-semibold text-slate-700">{r.externalMarks}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{r.totalMarks}</td>
                    <td className="py-4 px-4">
                      <Badge variant="primary" size="md">
                        {r.grade}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-slate-500 italic">{r.remarks || 'Satisfactory'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
