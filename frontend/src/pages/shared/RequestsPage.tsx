import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { FileText, Plus, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [reviewModal, setReviewModal] = useState<any | null>(null);
  const [remarks, setRemarks] = useState('');

  // Form states
  const [type, setType] = useState('LEAVE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requestsList'],
    queryFn: async () => {
      const res = await api.get('/requests');
      return res.data.data;
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async () => {
      return api.post('/requests', {
        type,
        title,
        description,
        reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestsList'] });
      setCreateModal(false);
      setTitle('');
      setDescription('');
      setReason('');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminRemarks }: { id: string; status: string; adminRemarks?: string }) => {
      return api.patch(`/requests/${id}/status`, { status, adminRemarks });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestsList'] });
      setReviewModal(null);
    },
  });

  const isPrivileged = ['ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD'].includes(user?.role || '');

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Administrative & Academic Requests</h1>
          <p className="text-xs text-slate-500 mt-1">Leave applications, bonafide certificates, ID reissue, and official approval requests</p>
        </div>
        <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Request</span>
        </Button>
      </div>

      <div className="space-y-4">
        {requests?.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-100">
            No active administrative requests found.
          </div>
        ) : (
          requests?.map((r: any) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary">{r.type.replace(/_/g, ' ')}</Badge>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      By {r.user?.firstName} {r.user?.lastName} ({r.user?.role})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.description}</p>
                  {r.reason && <p className="text-xs text-slate-400 italic mt-0.5">Reason: {r.reason}</p>}
                </div>

                <div className="shrink-0">
                  <Badge
                    variant={r.status === 'APPROVED' ? 'success' : r.status === 'REJECTED' ? 'danger' : 'warning'}
                    size="md"
                  >
                    {r.status}
                  </Badge>
                </div>
              </div>

              {r.adminRemarks && (
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <strong>Reviewer Remarks:</strong> {r.adminRemarks}
                </div>
              )}

              {isPrivileged && r.status === 'PENDING' && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-3">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => updateStatusMutation.mutate({ id: r.id, status: 'REJECTED', adminRemarks: 'Not eligible' })}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => updateStatusMutation.mutate({ id: r.id, status: 'APPROVED', adminRemarks: 'Approved' })}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Submit New Request">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createRequestMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Request Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
            >
              <option value="LEAVE">Leave of Absence</option>
              <option value="BONAFIDE_CERTIFICATE">Bonafide Certificate</option>
              <option value="ID_CARD_REISSUE">ID Card Reissue</option>
              <option value="ATTENDANCE_CORRECTION">Attendance Correction</option>
              <option value="DOCUMENT_VERIFICATION">Document Verification</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Request Subject</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Leave for National Hackathon Participation"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details regarding your request..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Reason (Optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Medical, Academic Competition"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={createRequestMutation.isPending}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
