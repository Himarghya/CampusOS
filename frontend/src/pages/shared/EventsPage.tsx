import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
  Ticket,
  Plus,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Search,
  Sparkles,
  Code2,
  BookOpen,
  Mic,
  Music,
  Trophy,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const categoryMeta: Record<string, { icon: any; bg: string; text: string; border: string }> = {
  HACKATHON: {
    icon: Code2,
    bg: 'bg-purple-50 text-purple-700',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  WORKSHOP: {
    icon: BookOpen,
    bg: 'bg-indigo-50 text-indigo-700',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  SEMINAR: {
    icon: Mic,
    bg: 'bg-blue-50 text-blue-700',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  CULTURAL: {
    icon: Music,
    bg: 'bg-rose-50 text-rose-700',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  SPORTS: {
    icon: Trophy,
    bg: 'bg-amber-50 text-amber-700',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
};

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
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

  // Faculty, Dept Head, Placement Officer, and Admin can all create events
  const isPrivileged = ['ADMIN', 'SUPER_ADMIN', 'FACULTY', 'DEPT_HEAD', 'PLACEMENT_OFFICER'].includes(
    user?.role || ''
  );

  if (isLoading) return <LoadingSkeleton rows={5} />;

  const filteredEvents = events?.filter((ev: any) => {
    const matchesCategory = activeCategory === 'ALL' || ev.category === activeCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['ALL', 'HACKATHON', 'WORKSHOP', 'SEMINAR', 'CULTURAL', 'SPORTS'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Events & Campus Activities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Hackathons, guest lectures, technical symposiums, and cultural fests
          </p>
        </div>
        {isPrivileged && (
          <Button
            size="md"
            onClick={() => setCreateModal(true)}
            className="font-bold shadow-md shadow-indigo-200 shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Create Event</span>
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-card">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              )}
            >
              {cat === 'ALL' ? 'All Events' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, venue..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents?.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-100">
          No events found matching your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents?.map((ev: any) => {
            const isRegistered = ev.registrations && ev.registrations.length > 0;
            const meta = categoryMeta[ev.category] || categoryMeta.WORKSHOP;
            const IconComp = meta.icon;
            const percentageFilled = Math.min(Math.round((ev.registeredCount / ev.capacity) * 100), 100);

            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={clsx(
                        'w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-xs',
                        meta.bg
                      )}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span
                      className={clsx(
                        'px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wide',
                        meta.bg,
                        meta.border
                      )}
                    >
                      {ev.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{ev.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {new Date(ev.startDate).toLocaleDateString()} – {new Date(ev.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Attendance:</span>
                      </span>
                      <strong className="text-slate-800 font-bold">
                        {ev.registeredCount} / {ev.capacity} Attendees ({percentageFilled}%)
                      </strong>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentageFilled}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  {isRegistered ? (
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
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
                      className="w-full font-bold shadow-xs shadow-indigo-200"
                    >
                      Register Now
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI & Cloud Hackathon 2026"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="HACKATHON">Hackathon</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="SEMINAR">Seminar</option>
                <option value="CULTURAL">Cultural Fest</option>
                <option value="SPORTS">Sports Event</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Venue
            </label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Main Auditorium"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
