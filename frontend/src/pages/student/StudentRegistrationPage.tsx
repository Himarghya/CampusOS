import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import {
  ClipboardList,
  CheckCircle2,
  Calendar,
  AlertCircle,
  BookOpen,
  Send,
  UserCheck,
  Sparkles,
  Lock,
  Layers,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const StudentRegistrationPage: React.FC<{ mode?: 'pre' | 'final' }> = ({ mode = 'pre' }) => {
  const isPre = mode === 'pre';
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [selectedElectives, setSelectedElectives] = useState<string[]>(['cs511']);
  const [selectedOpenElectives, setSelectedOpenElectives] = useState<string[]>(['oe501']);
  const [submitted, setSubmitted] = useState(false);

  const { data: registrationData, isLoading } = useQuery({
    queryKey: ['studentRegOfferings', selectedSemester],
    queryFn: async () => {
      const res = await api.get(`/academic/registration/offerings?semester=${selectedSemester}`);
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const offerings = registrationData?.offerings || {
    core: [],
    disciplineElectives: [],
    openElectives: [],
  };

  const coreCredits = offerings.core.reduce((acc: number, c: any) => acc + c.credits, 0);
  const electiveCredits = offerings.disciplineElectives
    .filter((e: any) => selectedElectives.includes(e.id))
    .reduce((acc: number, c: any) => acc + c.credits, 0);
  const openElectiveCredits = offerings.openElectives
    .filter((e: any) => selectedOpenElectives.includes(e.id))
    .reduce((acc: number, c: any) => acc + c.credits, 0);

  const totalSelectedCredits = coreCredits + electiveCredits + openElectiveCredits;
  const maxLimit = registrationData?.maxCredits || 24;
  const minLimit = registrationData?.minCredits || 16;

  const toggleElective = (id: string) => {
    if (selectedElectives.includes(id)) {
      setSelectedElectives(selectedElectives.filter((e) => e !== id));
    } else {
      setSelectedElectives([...selectedElectives, id]);
    }
  };

  const toggleOpenElective = (id: string) => {
    if (selectedOpenElectives.includes(id)) {
      setSelectedOpenElectives(selectedOpenElectives.filter((e) => e !== id));
    } else {
      setSelectedOpenElectives([...selectedOpenElectives, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isPre ? 'Academic Pre-Registration Offer' : 'Final Course Registration'}
            </h1>
            <Badge variant="success">Open for Enrollment</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isPre
              ? 'Select course preferences and electives for upcoming semester planning'
              : 'Confirm final course enrollments, slot allocations, and faculty advisor approvals'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
            Term: <strong>2026-2027</strong> (Semester {selectedSemester})
          </div>
        </div>
      </div>

      {/* Credit Standing Summary Widget */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">Total Registered Credits</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-black">{totalSelectedCredits}</span>
            <span className="text-xs text-indigo-200">/ max {maxLimit} allowed credits</span>
          </div>
          <p className="text-xs text-indigo-200/80 mt-1">
            Minimum required: {minLimit} credits. Core: {coreCredits} cr • Electives: {electiveCredits + openElectiveCredits} cr
          </p>
        </div>

        <div className="flex items-center gap-3">
          {totalSelectedCredits >= minLimit && totalSelectedCredits <= maxLimit ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Credit Limits Met
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <AlertCircle className="w-4 h-4" /> Credit Bounds Check Required
            </div>
          )}

          <Button
            size="md"
            onClick={handleSubmit}
            disabled={submitted || totalSelectedCredits < minLimit || totalSelectedCredits > maxLimit}
            className="font-bold shadow-md shadow-indigo-900"
          >
            <Send className="w-4 h-4 mr-1.5" />
            <span>{submitted ? 'Submitted to Advisor' : isPre ? 'Submit Pre-Registration' : 'Confirm Registration'}</span>
          </Button>
        </div>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">
                {isPre ? 'Pre-registration preferences recorded successfully!' : 'Final registration confirmed!'}
              </p>
              <p className="text-emerald-700 mt-0.5">
                Forwarded to Faculty Advisor (Dr. Sarah Connor) for prerequisite and slot approval.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-white border border-emerald-300 font-bold text-emerald-900">
            Status: PENDING_ADVISOR_APPROVAL
          </span>
        </div>
      )}

      {/* 1. Core Compulsory Courses */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">1. Core Compulsory Courses ({offerings.core.length})</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mandatory department courses automatically registered</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
            {coreCredits} Credits
          </span>
        </div>

        <div className="space-y-3">
          {offerings.core.map((course: any) => (
            <div
              key={course.id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{course.name}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      {course.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Faculty: <strong>{course.faculty}</strong> • {course.slot}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                <span className="font-bold text-slate-700">{course.credits} Credits</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  Enrolled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Discipline Electives Selection */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">2. Discipline Electives (Select 1 or 2)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Department specialized elective tracks</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
            {electiveCredits} Credits Selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offerings.disciplineElectives.map((course: any) => {
            const isSelected = selectedElectives.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => !submitted && toggleElective(course.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/60 border-indigo-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      {course.code}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={submitted}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{course.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Faculty: {course.faculty}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{course.slot}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{course.credits} Credits</span>
                  <span className="text-[10px] text-indigo-600 font-bold">
                    Prereq: {course.prerequisites.join(', ') || 'None'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Open Electives Selection */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">3. Institute Open Electives (Select 1)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Inter-disciplinary courses from other departments</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
            {openElectiveCredits} Credits Selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offerings.openElectives.map((course: any) => {
            const isSelected = selectedOpenElectives.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => !submitted && toggleOpenElective(course.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-50/60 border-purple-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      {course.code}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={submitted}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{course.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Faculty: {course.faculty}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{course.slot}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{course.credits} Credits</span>
                  <span className="text-[10px] text-purple-600 font-bold">Open Inter-Department</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
