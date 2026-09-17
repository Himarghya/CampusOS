import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { CheckSquare, AlertTriangle, Calculator, Calendar } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import clsx from 'clsx';

export const StudentAttendancePage: React.FC = () => {
  const [extraSessions, setExtraSessions] = useState(5);

  const { data, isLoading } = useQuery({
    queryKey: ['myAttendance'],
    queryFn: async () => {
      const res = await api.get('/attendance/me');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const overall = data?.overallPercentage || 85;
  const total = data?.totalSessions || 80;
  const present = data?.presentSessions || 68;

  // Projected calculation
  const projectedTotal = total + extraSessions;
  const projectedPresent = present + extraSessions;
  const projectedPercentage = projectedTotal > 0 ? Math.round((projectedPresent / projectedTotal) * 100) : 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time attendance logs, subject analytics, and requirement calculator</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={overall >= 75 ? 'success' : 'danger'} size="md">
            {overall >= 75 ? 'Eligibility Criteria Met (>=75%)' : 'Attendance Shortage (<75%)'}
          </Badge>
        </div>
      </div>

      {/* Top Banner & Attendance Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Overall Campus Attendance
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight mb-2">{overall}%</div>
            <div className="text-xs text-slate-500">
              Total sessions attended: <strong className="text-slate-800">{present}</strong> of <strong className="text-slate-800">{total}</strong>
            </div>
          </div>

          <div className="w-24 h-24 relative flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={clsx(overall >= 75 ? 'text-emerald-500' : 'text-rose-500')}
                strokeDasharray={`${overall}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-black text-sm text-slate-900">{overall}%</span>
          </div>
        </div>

        {/* Projected Calculator */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 rounded-3xl p-6 border border-indigo-100/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-3">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Attendance Projection Simulator</span>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                If I attend the next:
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={extraSessions}
                onChange={(e) => setExtraSessions(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-1.5 bg-white rounded-xl border border-indigo-200 text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <div className="flex-1 text-right">
              <div className="text-[11px] font-bold text-slate-600 mb-1">Projected Attendance:</div>
              <div className="text-2xl font-black text-indigo-600">{projectedPercentage}%</div>
            </div>
          </div>

          <div className="text-[11px] text-indigo-700 font-medium mt-2">
            Calculated over {projectedTotal} total sessions.
          </div>
        </div>
      </div>

      {/* Subject-Wise Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <h2 className="text-base font-bold text-slate-900 mb-5">Subject-Wise Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Total Sessions</th>
                <th className="py-3 px-4">Present</th>
                <th className="py-3 px-4">Absent</th>
                <th className="py-3 px-4">Excused</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.subjectWise?.map((sub: any) => (
                <tr key={sub.courseId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    <div>{sub.courseName}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{sub.courseCode}</div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{sub.totalSessions}</td>
                  <td className="py-4 px-4 font-semibold text-emerald-600">{sub.presentCount}</td>
                  <td className="py-4 px-4 font-semibold text-rose-600">{sub.absentCount}</td>
                  <td className="py-4 px-4 font-semibold text-amber-600">{sub.excusedCount}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full',
                            sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                          )}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900">{sub.percentage}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={sub.status === 'GOOD' ? 'success' : sub.status === 'WARNING' ? 'warning' : 'danger'}>
                      {sub.status}
                    </Badge>
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
