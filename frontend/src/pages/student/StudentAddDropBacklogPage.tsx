import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import {
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  BookOpen,
  ArrowRightLeft,
  Sparkles,
  Award,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const StudentAddDropBacklogPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'backlog' | 'add_drop' | 'swayam'>('backlog');

  // Backlog selections
  const [registeredBacklogs, setRegisteredBacklogs] = useState<string[]>([]);
  const [swayamCourse, setSwayamCourse] = useState({
    title: 'Cloud Computing (NPTEL)',
    courseId: 'noc26-cs12',
    credits: 3,
    provider: 'Swayam / IIT Kharagpur',
  });
  const [swayamRegistered, setSwayamRegistered] = useState(false);

  const { data: backlogList, isLoading } = useQuery({
    queryKey: ['studentBacklogCoursesList'],
    queryFn: async () => {
      const res = await api.get('/academic/registration/backlog');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  const toggleBacklog = (id: string) => {
    if (registeredBacklogs.includes(id)) {
      setRegisteredBacklogs(registeredBacklogs.filter((bId) => bId !== id));
    } else {
      setRegisteredBacklogs([...registeredBacklogs, id]);
    }
  };

  const selectedBacklogObjects = backlogList?.filter((b: any) => registeredBacklogs.includes(b.id)) || [];
  const totalBacklogFee = selectedBacklogObjects.reduce((acc: number, b: any) => acc + (b.examFee || 500), 0);
  const totalBacklogCredits = selectedBacklogObjects.reduce((acc: number, b: any) => acc + b.credits, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Changes & Backlog Management</h1>
            <Badge variant="warning">Add / Drop Window Active</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Register or drop backlog subjects, modify elective courses, and submit Swayam MOOC credits
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('backlog')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'backlog'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Backlog & Improvement ({backlogList?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('add_drop')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'add_drop'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Regular Courses Add / Drop</span>
        </button>
        <button
          onClick={() => setActiveTab('swayam')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'swayam'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Swayam MOOC Credit Transfer</span>
        </button>
      </div>

      {/* TAB 1: BACKLOG & IMPROVEMENT */}
      {activeTab === 'backlog' && (
        <div className="space-y-6">
          {/* Summary Fee & Registration Strip */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100">
                Selected Backlog / Improvement Courses
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black">{registeredBacklogs.length} Courses</span>
                <span className="text-xs text-amber-100">({totalBacklogCredits} Credits)</span>
              </div>
              <p className="text-xs text-amber-100 mt-1">
                Total Supplementary Exam Fee: <strong>₹{totalBacklogFee}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="md"
                disabled={registeredBacklogs.length === 0}
                onClick={() => setRegisteredBacklogs([])}
                className="bg-white/20 text-white hover:bg-white/30 border-0"
              >
                Clear Selections
              </Button>
              <Button
                size="md"
                disabled={registeredBacklogs.length === 0}
                className="bg-slate-900 text-white hover:bg-slate-800 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Confirm Backlog Registration</span>
              </Button>
            </div>
          </div>

          {/* List of Backlog Subjects */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900">Eligible Backlog & Improvement Courses</h3>
            <div className="space-y-3">
              {backlogList?.map((item: any) => {
                const isSelected = registeredBacklogs.includes(item.id);
                const isImprovement = item.type === 'IMPROVEMENT';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isImprovement ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.gradeObtained}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{item.courseName}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
                            {item.courseCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isImprovement ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Original Term: {item.originalSemester} • {item.credits} Credits • Fee: ₹{item.examFee}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant={isSelected ? 'danger' : 'primary'}
                        onClick={() => toggleBacklog(item.id)}
                        className="font-bold text-xs"
                      >
                        {isSelected ? (
                          <>
                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Drop From Exam
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add for Exam
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGULAR ADD / DROP */}
      {activeTab === 'add_drop' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
            <h3 className="text-base font-bold text-slate-900 mb-1">Current Active Enrollments (Semester 4)</h3>
            <p className="text-xs text-slate-500 mb-4">You can drop open electives or swap slots during the first 2 weeks</p>

            <div className="space-y-3">
              {[
                { code: 'CS201', name: 'Data Structures and Algorithms', credits: 4, type: 'CORE', canDrop: false },
                { code: 'CS202', name: 'Operating Systems', credits: 4, type: 'CORE', canDrop: false },
                { code: 'CS203', name: 'Web Technologies and Services', credits: 4, type: 'CORE', canDrop: false },
                { code: 'DES201', name: 'Human Computer Interaction', credits: 3, type: 'OPEN_ELECTIVE', canDrop: true },
              ].map((c, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{c.name}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border">
                        {c.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{c.credits} Credits • {c.type}</span>
                  </div>

                  {c.canDrop ? (
                    <Button variant="danger" size="sm" className="text-xs font-bold">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Drop Course
                    </Button>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                      Mandatory Core
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SWAYAM MOOC CREDIT TRANSFER */}
      {activeTab === 'swayam' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Swayam / NPTEL Course Credit Transfer</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transfer up to 8 credits by completing approved online MOOC certifications
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{swayamCourse.title}</span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {swayamCourse.courseId}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Provider: <strong>{swayamCourse.provider}</strong> • Approved Credits: <strong>{swayamCourse.credits}</strong>
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setSwayamRegistered(true)}
                disabled={swayamRegistered}
                className="font-bold text-xs"
              >
                {swayamRegistered ? 'Registered for Credit Transfer' : 'Apply for Credit Transfer'}
              </Button>
            </div>

            {swayamRegistered && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Credit transfer request submitted to the Dean of Academics for certificate verification.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
