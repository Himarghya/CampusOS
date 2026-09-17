import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import {
  GraduationCap,
  Search,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Download,
  Filter,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';

export const StudentProgrammesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('BTECH-CSE');
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [activeSemTab, setActiveSemTab] = useState<number>(1);

  const { data: programs, isLoading } = useQuery({
    queryKey: ['academicProgramsList'],
    queryFn: async () => {
      const res = await api.get('/academic/programs');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;

  // Detailed 8-Semester Curriculum Scheme for Programmes
  const semesterDataMap: Record<number, {
    title: string;
    totalCredits: number;
    status: 'COMPLETED' | 'ACTIVE' | 'UPCOMING';
    courses: Array<{
      code: string;
      name: string;
      credits: number;
      type: 'CORE' | 'ELECTIVE' | 'LAB' | 'MATH_SCIENCE' | 'HUMANITIES' | 'OPEN_ELECTIVE' | 'PROJECT';
      ltp: string;
      prerequisite?: string;
    }>;
  }> = {
    1: {
      title: 'Semester 1: Foundation & Basic Sciences',
      totalCredits: 17,
      status: 'COMPLETED',
      courses: [
        { code: 'MA101', name: 'Engineering Mathematics I (Calculus & ODE)', credits: 4, type: 'MATH_SCIENCE', ltp: '3-1-0' },
        { code: 'PH101', name: 'Engineering Physics & Quantum Mechanics', credits: 4, type: 'MATH_SCIENCE', ltp: '3-0-2' },
        { code: 'CS101', name: 'Introduction to Computer Programming (C & Python)', credits: 4, type: 'CORE', ltp: '3-0-2' },
        { code: 'ME101', name: 'Engineering Mechanics & Product Realization', credits: 3, type: 'CORE', ltp: '2-0-2' },
        { code: 'HS101', name: 'Professional Communication & Ethics', credits: 2, type: 'HUMANITIES', ltp: '1-0-2' },
      ],
    },
    2: {
      title: 'Semester 2: Engineering Foundations & Core Prep',
      totalCredits: 17,
      status: 'COMPLETED',
      courses: [
        { code: 'MA102', name: 'Engineering Mathematics II (Linear Algebra & Transforms)', credits: 4, type: 'MATH_SCIENCE', ltp: '3-1-0', prerequisite: 'MA101' },
        { code: 'EE101', name: 'Basic Electrical & Electronics Engineering', credits: 4, type: 'CORE', ltp: '3-0-2' },
        { code: 'CS102', name: 'Data Structures and Algorithms Fundamentals', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'CS101' },
        { code: 'CH101', name: 'Environmental Chemistry & Material Science', credits: 3, type: 'MATH_SCIENCE', ltp: '2-0-2' },
        { code: 'ME102', name: 'Engineering Workshop & Digital Prototyping', credits: 2, type: 'LAB', ltp: '0-0-3' },
      ],
    },
    3: {
      title: 'Semester 3: Core Computer Science & Discrete Logic',
      totalCredits: 21,
      status: 'COMPLETED',
      courses: [
        { code: 'CS201', name: 'Data Structures and Algorithms', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'CS102' },
        { code: 'CS202', name: 'Discrete Mathematical Structures & Graph Theory', credits: 4, type: 'CORE', ltp: '3-1-0', prerequisite: 'MA102' },
        { code: 'CS203', name: 'Digital Logic and Computer Organization', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'EE101' },
        { code: 'EC201', name: 'Analog & Digital Electronic Circuits', credits: 4, type: 'CORE', ltp: '3-0-2' },
        { code: 'HS201', name: 'Economics for Engineers and Financial Management', credits: 3, type: 'HUMANITIES', ltp: '3-0-0' },
        { code: 'CS201L', name: 'Advanced DSA Implementation Lab', credits: 2, type: 'LAB', ltp: '0-0-3' },
      ],
    },
    4: {
      title: 'Semester 4: Systems & Applied Software',
      totalCredits: 25,
      status: 'ACTIVE',
      courses: [
        { code: 'CS204', name: 'Database Management Systems', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'CS201' },
        { code: 'CS205', name: 'Operating Systems and Systems Programming', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'CS203' },
        { code: 'CS206', name: 'Design and Analysis of Algorithms', credits: 4, type: 'CORE', ltp: '3-1-0', prerequisite: 'CS201' },
        { code: 'CS207', name: 'Computer Architecture & Microprocessor Systems', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'CS203' },
        { code: 'CS208', name: 'Web Technologies and Cloud Microservices', credits: 3, type: 'CORE', ltp: '2-0-2' },
        { code: 'CS205L', name: 'Operating Systems & Concurrency Lab', credits: 2, type: 'LAB', ltp: '0-0-3' },
        { code: 'CS204L', name: 'Database Systems & SQL Lab', credits: 2, type: 'LAB', ltp: '0-0-3' },
        { code: 'DES201', name: 'Human Computer Interaction & UX Design', credits: 2, type: 'ELECTIVE', ltp: '1-0-2' },
      ],
    },
    5: {
      title: 'Semester 5: Advanced Computing & Specializations',
      totalCredits: 21,
      status: 'UPCOMING',
      courses: [
        { code: 'CS301', name: 'Computer Networks and Internet Protocols', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'CS205' },
        { code: 'CS302', name: 'Theory of Computation and Formal Automata', credits: 4, type: 'CORE', ltp: '3-1-0', prerequisite: 'CS202' },
        { code: 'CS303', name: 'Software Engineering & Agile Methodologies', credits: 4, type: 'CORE', ltp: '3-0-2' },
        { code: 'CS411', name: 'Discipline Elective I: Artificial Intelligence & Agents', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
        { code: 'MG301', name: 'Open Elective I: Engineering Economics & Strategy', credits: 3, type: 'OPEN_ELECTIVE', ltp: '3-0-0' },
        { code: 'CS301L', name: 'Computer Networks Socket Programming Lab', credits: 2, type: 'LAB', ltp: '0-0-3' },
        { code: 'CS391', name: 'Summer Internship & Industrial Training', credits: 1, type: 'PROJECT', ltp: '0-0-2' },
      ],
    },
    6: {
      title: 'Semester 6: Distributed Systems & Machine Learning',
      totalCredits: 21,
      status: 'UPCOMING',
      courses: [
        { code: 'CS304', name: 'Compiler Design and Code Optimization', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'CS302' },
        { code: 'CS305', name: 'Machine Learning & Deep Neural Networks', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'MA102' },
        { code: 'CS306', name: 'Cloud Computing Architecture & Distributed Systems', credits: 4, type: 'CORE', ltp: '3-0-2', prerequisite: 'CS301' },
        { code: 'CS421', name: 'Discipline Elective II: Cyber Security & Cryptography', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
        { code: 'OE302', name: 'Open Elective II: Design Thinking & Innovation', credits: 3, type: 'OPEN_ELECTIVE', ltp: '3-0-0' },
        { code: 'CS305L', name: 'Machine Learning Models & PyTorch Lab', credits: 2, type: 'LAB', ltp: '0-0-3' },
        { code: 'CS392', name: 'Minor Capstone Project Phase-I', credits: 1, type: 'PROJECT', ltp: '0-0-2' },
      ],
    },
    7: {
      title: 'Semester 7: Specialized Electives & Capstone I',
      totalCredits: 20,
      status: 'UPCOMING',
      courses: [
        { code: 'CS401', name: 'Distributed Ledger & Blockchain Systems', credits: 3, type: 'CORE', ltp: '3-0-0' },
        { code: 'CS431', name: 'Discipline Elective III: Natural Language Processing (LLMs)', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
        { code: 'CS441', name: 'Discipline Elective IV: Big Data Engineering & Spark', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
        { code: 'OE401', name: 'Open Elective III: Quantum Computing Fundamentals', credits: 3, type: 'OPEN_ELECTIVE', ltp: '3-0-0' },
        { code: 'SW401', name: 'Swayam / NPTEL Online MOOC Certification I', credits: 2, type: 'ELECTIVE', ltp: 'Online' },
        { code: 'CS491', name: 'Major Degree Capstone Project Phase-I', credits: 6, type: 'PROJECT', ltp: '0-0-12' },
      ],
    },
    8: {
      title: 'Semester 8: Industrial Capstone & Degree Culmination',
      totalCredits: 18,
      status: 'UPCOMING',
      courses: [
        { code: 'CS451', name: 'Discipline Elective V: Reinforcement Learning & Robotics', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
        { code: 'SW402', name: 'Swayam / NPTEL Online MOOC Certification II', credits: 3, type: 'ELECTIVE', ltp: 'Online' },
        { code: 'CS492', name: 'Major Degree Capstone Project Phase-II (Industry Internship)', credits: 12, type: 'PROJECT', ltp: '0-0-24' },
      ],
    },
  };

  const programmesList = [
    {
      code: 'BTECH-CSE',
      name: 'B.Tech in Computer Science & Engineering',
      degree: 'B.Tech (Undergraduate)',
      dept: 'Computer Science & Engineering',
      totalCredits: 160,
      duration: '4 Years (8 Semesters)',
      accreditation: 'NBA Tier-1 / NAAC A++',
    },
    {
      code: 'BTECH-ECE',
      name: 'B.Tech in Electronics & Communication Engineering',
      degree: 'B.Tech (Undergraduate)',
      dept: 'Electronics & Communication',
      totalCredits: 160,
      duration: '4 Years (8 Semesters)',
      accreditation: 'NBA Tier-1 / NAAC A++',
    },
    {
      code: 'BTECH-ME',
      name: 'B.Tech in Mechanical Engineering',
      degree: 'B.Tech (Undergraduate)',
      dept: 'Mechanical Engineering',
      totalCredits: 160,
      duration: '4 Years (8 Semesters)',
      accreditation: 'NBA Tier-1 / NAAC A++',
    },
    {
      code: 'BTECH-SM',
      name: 'B.Tech in Smart Manufacturing',
      degree: 'B.Tech (Undergraduate)',
      dept: 'Smart Manufacturing & Automation',
      totalCredits: 160,
      duration: '4 Years (8 Semesters)',
      accreditation: 'Industry 4.0 Center of Excellence',
    },
    {
      code: 'BDES',
      name: 'Bachelor of Design (B.Des)',
      degree: 'B.Des (Undergraduate)',
      dept: 'Design and Innovation',
      totalCredits: 160,
      duration: '4 Years (8 Semesters)',
      accreditation: 'Design Excellence Certified',
    },
    {
      code: 'MTECH-AI',
      name: 'M.Tech in Artificial Intelligence & Machine Learning',
      degree: 'M.Tech (Postgraduate)',
      dept: 'Computer Science & Engineering',
      totalCredits: 68,
      duration: '2 Years (4 Semesters)',
      accreditation: 'AI Research Council Approved',
    },
  ];

  const currentProg = programmesList.find((p) => p.code === selectedProgramme) || programmesList[0];

  const getCategoryBadge = (type: string) => {
    switch (type) {
      case 'CORE':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Core</span>;
      case 'MATH_SCIENCE':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">Basic Science</span>;
      case 'ELECTIVE':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Elective</span>;
      case 'OPEN_ELECTIVE':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Open Elective</span>;
      case 'LAB':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Practical Lab</span>;
      case 'HUMANITIES':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Humanities</span>;
      case 'PROJECT':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">Capstone Project</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">Course</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">✓ Completed</span>;
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 animate-pulse">● Current Semester</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Upcoming</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      {/* Page Title & Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-600" />
            <span>Academic Programmes & Semester Structure</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete 8-Semester Curriculum Scheme, Degree Credit Audits, and Course Catalogues
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course code or title..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Programme Selection Strip */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-card flex items-center gap-3 overflow-x-auto scrollbar-thin">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-2">
          Programmes:
        </span>
        <div className="flex items-center gap-2">
          {programmesList.map((prog) => (
            <button
              key={prog.code}
              onClick={() => setSelectedProgramme(prog.code)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedProgramme === prog.code
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {prog.name.split(' in ')[0]} ({prog.code})
            </button>
          ))}
        </div>
      </div>

      {/* Active Programme Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 font-extrabold text-xs">
              {currentProg.code}
            </span>
            <span className="text-xs font-semibold text-slate-300">• {currentProg.degree}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentProg.accreditation}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">{currentProg.name}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Department of {currentProg.dept} • Degree Pathway: <strong>{currentProg.duration}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs">
          <div className="text-center pr-4 border-r border-white/10">
            <div className="text-2xl font-black text-indigo-400">8</div>
            <div className="text-[10px] uppercase font-bold text-slate-300">Semesters</div>
          </div>
          <div className="text-center pr-4 border-r border-white/10">
            <div className="text-2xl font-black text-emerald-400">{currentProg.totalCredits}</div>
            <div className="text-[10px] uppercase font-bold text-slate-300">Total Credits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-400">42</div>
            <div className="text-[10px] uppercase font-bold text-slate-300">Courses</div>
          </div>
        </div>
      </div>

      {/* Semester Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Partitioning View:</span>
          </span>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All 8 Semesters Grid
          </button>
          <button
            onClick={() => setViewMode('single')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'single'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Single Semester View
          </button>
        </div>

        {viewMode === 'single' && (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setActiveSemTab(sem)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeSemTab === sem
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW MODE 1: ALL 8 SEMESTERS FLUID GRID PARTITION */}
      {viewMode === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
            const semInfo = semesterDataMap[sem];
            if (!semInfo) return null;

            const filteredCourses = search
              ? semInfo.courses.filter(
                  (c) =>
                    c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.code.toLowerCase().includes(search.toLowerCase())
                )
              : semInfo.courses;

            return (
              <div
                key={sem}
                className="bg-white rounded-3xl border border-slate-100 shadow-card flex flex-col justify-between overflow-hidden hover:shadow-card-hover transition-all group"
              >
                <div>
                  {/* Semester Partition Header */}
                  <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">Semester {sem}</span>
                        {getStatusBadge(semInfo.status)}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{semInfo.courses.length} Prescribed Courses</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                        {semInfo.totalCredits} Credits
                      </span>
                    </div>
                  </div>

                  {/* Course List within Partition */}
                  <div className="p-4 space-y-2.5">
                    {filteredCourses.map((c) => (
                      <div
                        key={c.code}
                        className="p-3 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-indigo-50/30 hover:border-indigo-100 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs text-indigo-600">{c.code}</span>
                              {getCategoryBadge(c.type)}
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug line-clamp-2">
                              {c.name}
                            </h4>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-slate-900">{c.credits} Cr</span>
                            <span className="block text-[10px] text-slate-400 font-mono">{c.ltp}</span>
                          </div>
                        </div>

                        {c.prerequisite && (
                          <div className="mt-1.5 text-[10px] text-slate-500">
                            Prereq: <strong className="text-slate-700">{c.prerequisite}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partition Footer */}
                <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">L-T-P Theory & Lab</span>
                  <span className="font-bold text-indigo-700">{semInfo.totalCredits} / 160 Total</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: SINGLE SEMESTER DETAILED WIDESCREEN BREAKDOWN */}
      {viewMode === 'single' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  Semester {activeSemTab} Detailed Scheme
                </h3>
                {getStatusBadge(semesterDataMap[activeSemTab]?.status || 'UPCOMING')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {semesterDataMap[activeSemTab]?.title} • {semesterDataMap[activeSemTab]?.courses.length} Courses
              </p>
            </div>
            <span className="px-4 py-1.5 rounded-2xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
              Total {semesterDataMap[activeSemTab]?.totalCredits} Semester Credits
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
                  <th className="py-4 px-6">Course Code</th>
                  <th className="py-4 px-6">Course Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Structure (L-T-P)</th>
                  <th className="py-4 px-6">Prerequisite</th>
                  <th className="py-4 px-6 text-right">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {semesterDataMap[activeSemTab]?.courses.map((c, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'}>
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600 text-xs">{c.code}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{c.name}</td>
                    <td className="py-4 px-6">{getCategoryBadge(c.type)}</td>
                    <td className="py-4 px-6 font-mono text-slate-600">{c.ltp}</td>
                    <td className="py-4 px-6 text-slate-500">{c.prerequisite || 'None'}</td>
                    <td className="py-4 px-6 font-black text-right text-indigo-600 text-sm">{c.credits}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-indigo-50/50 font-black text-slate-900 border-t-2 border-indigo-100">
                  <td colSpan={5} className="py-4 px-6 text-indigo-900 text-xs uppercase tracking-wider">
                    Total Semester {activeSemTab} Credits
                  </td>
                  <td className="py-4 px-6 text-right text-indigo-700 text-base">
                    {semesterDataMap[activeSemTab]?.totalCredits}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Degree Requirements Credit Distribution Summary */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Degree Category Distribution & Graduation Requirements (160 Credits)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Program Core (PC)</span>
            <div className="text-lg font-black text-indigo-600 mt-1">96 Credits</div>
            <span className="text-[10px] text-slate-500">60% of Degree</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Discipline Electives</span>
            <div className="text-lg font-black text-purple-600 mt-1">24 Credits</div>
            <span className="text-[10px] text-slate-500">Track Specialization</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Open Electives</span>
            <div className="text-lg font-black text-amber-600 mt-1">16 Credits</div>
            <span className="text-[10px] text-slate-500">Interdisciplinary</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Basic Sciences & Eng</span>
            <div className="text-lg font-black text-sky-600 mt-1">16 Credits</div>
            <span className="text-[10px] text-slate-500">Math, Physics, EE</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">MOOCs / Swayam</span>
            <div className="text-lg font-black text-emerald-600 mt-1">8 Credits</div>
            <span className="text-[10px] text-slate-500">Online Certifications</span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
            <span className="text-[10px] uppercase font-bold text-indigo-700">Total Graduation</span>
            <div className="text-lg font-black text-indigo-900 mt-1">160 Credits</div>
            <span className="text-[10px] text-indigo-700 font-bold">8 Semesters Full</span>
          </div>
        </div>
      </div>
    </div>
  );
};
