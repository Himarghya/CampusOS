import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Calendar, Clock, MapPin, User, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentTimetablePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const { data: timetable, isLoading } = useQuery({
    queryKey: ['studentTimetableWeekly'],
    queryFn: async () => {
      const res = await api.get('/academic/timetable');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const days = timetable?.days || [];
  const currentDayData = days.find((d: any) => d.day === selectedDay) || days[0];

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'LAB':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'TUTORIAL':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SEMINAR':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Time Table</h1>
          <p className="text-xs text-slate-500 mt-1">
            Weekly class schedule, lecture rooms, laboratory allocations, and faculty details for Semester 4
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
          Academic Term: <strong>Spring 2026</strong>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {days.map((d: any) => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(d.day)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition shadow-xs ${
              selectedDay === d.day
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      {/* Day Schedule Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Schedule for {selectedDay}</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">{currentDayData?.slots?.length || 0} Scheduled Sessions</span>
        </div>

        <div className="space-y-3.5">
          {currentDayData?.slots?.map((slot: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-indigo-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{slot.time}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{slot.name}</h4>
                    <span className="text-[10px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border">
                      {slot.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getTypeStyle(slot.type)}`}>
                      {slot.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3 h-3 text-slate-400" /> {slot.faculty}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <MapPin className="w-3 h-3 text-indigo-500" /> Room: {slot.room}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Class In Session
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
