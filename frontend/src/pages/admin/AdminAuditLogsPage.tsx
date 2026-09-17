import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { ShieldCheck, User, Clock, Terminal } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';

export const AdminAuditLogsPage: React.FC = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await api.get('/audit');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-1">Immutable security and operations log for administrative compliance</p>
        </div>
        <Badge variant="primary" size="md">
          Append-Only Log
        </Badge>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs?.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-[11px] border border-indigo-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">
                      {log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : 'System / Anonymous'}
                    </div>
                    {log.actor && (
                      <div className="text-[10px] text-slate-400">{log.actor.role}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{log.entityType}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] max-w-xs truncate">
                    {log.details || '-'}
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
