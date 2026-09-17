import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Ticket, Plus, Calendar, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('HACKATHON');
  const [venue, setVenue] = useState('Auditorium Hall A');
  const [startDate, setStartDate] = useState(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [capacity, setCapacity] = useState(150);

  const { data: events, isLoading } = useQuery({
    queryKey: ['eventsList'],
    queryFn: async () => {
      const res = await api.get('/events');
      return res.data.data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return api.post(`/events/${eventId}/register`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventsList'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return api.delete(`/events/${eventId}/register`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventsList'] });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async () => {
      return api.post('/events', {
        title,
        description,
        category,
        venue,
        startDate,
        endDate,
        capacity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventsList'] });
      setCreateModal(false);
      setTitle('');
      setDescription('');
    },
  });

  const isPrivileged = ['ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Events & Campus Activities</h1>
          <p className="text-xs text-slate-500 mt-1">Hackathons, guest lectures, technical symposiums, and cultural fests</p>
        </div>
        {isPrivileged && (
          <Button size="md" onClick={() => setCreateModal(true)} className="font-bold shadow-md shadow-indigo-200">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Create Event</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((ev: any) => {
          const isRegistered = ev.registrations && ev.registrations.length > 0;

          return (
            <div
              key={ev.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <Badge variant="primary">{ev.category}</Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{ev.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{ev.description}</p>

                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(ev.startDate).toLocaleDateString()} – {new Date(ev.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {ev.registeredCount} / {ev.capacity} Attendees
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {isRegistered ? (
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Registered</span>
                    </span>
                    <button
                      onClick={() => cancelMutation.mutate(ev.id)}
                      className="text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => registerMutation.mutate(ev.id)}
                    loading={registerMutation.isPending}
                    size="sm"
                    className="w-full font-bold"
                  >
                    Register Now
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create Campus Event">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createEventMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI & Cloud Hackathon 2026"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="HACKATHON">Hackathon</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="SEMINAR">Seminar</option>
                <option value="CULTURAL">Cultural Fest</option>
                <option value="SPORTS">Sports Event</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Venue</label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Main Auditorium"
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
              placeholder="Event description..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={createEventMutation.isPending}>
              Create Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
