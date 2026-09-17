import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Bell, Plus, Megaphone, Calendar, Tag, Check } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

export const NoticesPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ACADEMIC');
  const [priority, setPriority] = useState('NORMAL');
  const [targetAudience, setTargetAudience] = useState('ALL');

  const { data: notices, isLoading } = useQuery({
    queryKey: ['noticesList'],
    queryFn: async () => {
      const res = await api.get('/notices');
      return res.data.data;
    },
  });

  const createNoticeMutation = useMutation({
    mutationFn: async () => {
      return api.post('/notices', {
        title,
        content,
        category,
        priority,
        targetAudience,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['noticesList'] });
      setCreateModal(false);
      setTitle('');
      setContent('');
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.post(`/notices/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['noticesList'] });
    },
  });

  const isFacultyOrAdmin = ['ADMIN', 'SUPER_ADMIN', 'DEPT_HEAD', 'FACULTY', 'PLACEMENT_OFFICER'].includes(user?.role || '');

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notices & Campus Announcements</h1>
          <p className="text-xs text-slate-500 mt-1">Institutional memos, examination alerts, and circulars</p>
        </div>
        {isFacultyOrAdmin && (
          <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Publish Notice</span>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notices?.map((n: any) => (
          <div
            key={n.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={n.priority === 'HIGH' ? 'danger' : 'primary'}>{n.category}</Badge>
                <Badge variant="neutral">{n.targetAudience}</Badge>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4 pl-10">{n.content}</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400 pl-10">
              <span>
                Published by <strong className="text-slate-700">{n.author?.firstName} {n.author?.lastName}</strong> ({n.author?.role})
              </span>
              <span>{new Date(n.publishedAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Publish Notice">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createNoticeMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Notice Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule for Mid-Term Exams"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="ACADEMIC">Academic</option>
                <option value="EXAM">Examination</option>
                <option value="PLACEMENT">Placement</option>
                <option value="EVENT">Event</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="ALL">Everyone</option>
                <option value="STUDENT">Students Only</option>
                <option value="FACULTY">Faculty Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Announcement Content</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed announcement text..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={createNoticeMutation.isPending}>
              Publish Announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
