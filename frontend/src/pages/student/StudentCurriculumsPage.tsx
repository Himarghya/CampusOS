import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Layers, BookOpen, CheckCircle2, ChevronDown, GraduationCap } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentCurriculumsPage: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number>(4);

  const curriculumMap: Record<number, Array<{ code: string; name: string; credits: number; type: string; ltp: string; prereq?: string }>> = {
    1: [
      { code: 'MA101', name: 'Engineering Mathematics I (Calculus & ODE)', credits: 4, type: 'MATH_SCIENCE', ltp: '3-1-0' },
      { code: 'PH101', name: 'Engineering Physics & Quantum Mechanics', credits: 4, type: 'MATH_SCIENCE', ltp: '3-0-2' },
      { code: 'CS101', name: 'Introduction to Computer Programming (C & Python)', credits: 4, type: 'CORE', ltp: '3-0-2' },
      { code: 'ME101', name: 'Engineering Mechanics & Product Realization', credits: 3, type: 'CORE', ltp: '2-0-2' },
      { code: 'HS101', name: 'Professional Communication & Ethics', credits: 2, type: 'HUMANITIES', ltp: '1-0-2' },
    ],
    2: [
      { code: 'MA102', name: 'Engineering Mathematics II (Linear Algebra & Transforms)', credits: 4, type: 'MATH_SCIENCE', ltp: '3-1-0', prereq: 'MA101' },
      { code: 'EE101', name: 'Basic Electrical and Electronics Engineering', credits: 4, type: 'CORE', ltp: '3-0-2' },
      { code: 'CS102', name: 'Data Structures and Algorithms Fundamentals', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'CS101' },
      { code: 'CH101', name: 'Environmental Chemistry & Material Science', credits: 3, type: 'MATH_SCIENCE', ltp: '2-0-2' },
      { code: 'ME102', name: 'Engineering Workshop & CAD Practice', credits: 2, type: 'PRACTICAL', ltp: '0-0-3' },
    ],
    3: [
      { code: 'CS201', name: 'Data Structures and Algorithms', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'CS102' },
      { code: 'CS202', name: 'Discrete Mathematical Structures & Graph Theory', credits: 4, type: 'CORE', ltp: '3-1-0', prereq: 'MA102' },
      { code: 'CS203', name: 'Digital Logic and Computer Organization', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'EE101' },
      { code: 'EC201', name: 'Analog and Digital Electronic Circuits', credits: 4, type: 'CORE', ltp: '3-0-2' },
      { code: 'HS201', name: 'Economics for Engineers and Financial Management', credits: 3, type: 'HUMANITIES', ltp: '3-0-0' },
      { code: 'CS201L', name: 'Data Structures Lab', credits: 2, type: 'PRACTICAL', ltp: '0-0-3' },
    ],
    4: [
      { code: 'CS204', name: 'Database Management Systems', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'CS201' },
      { code: 'CS205', name: 'Operating Systems and Systems Programming', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'CS203' },
      { code: 'CS206', name: 'Design and Analysis of Algorithms', credits: 4, type: 'CORE', ltp: '3-1-0', prereq: 'CS201' },
      { code: 'CS207', name: 'Computer Architecture and Microprocessors', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'CS203' },
      { code: 'CS208', name: 'Web Technologies and Microservices', credits: 3, type: 'CORE', ltp: '2-0-2' },
      { code: 'CS205L', name: 'Operating Systems Lab', credits: 2, type: 'PRACTICAL', ltp: '0-0-3' },
      { code: 'CS204L', name: 'Database Systems Lab', credits: 2, type: 'PRACTICAL', ltp: '0-0-3' },
      { code: 'DES201', name: 'Human Computer Interaction & UX', credits: 2, type: 'ELECTIVE', ltp: '1-0-2' },
    ],
    5: [
      { code: 'CS301', name: 'Computer Networks and Protocols', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'CS205' },
      { code: 'CS302', name: 'Theory of Computation and Automata', credits: 4, type: 'CORE', ltp: '3-1-0', prereq: 'CS202' },
      { code: 'CS303', name: 'Software Engineering and Agile Practices', credits: 4, type: 'CORE', ltp: '3-0-2' },
      { code: 'CS411', name: 'Artificial Intelligence & Intelligent Agents', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
      { code: 'MG301', name: 'Engineering Economics and Finance', credits: 3, type: 'OPEN_ELECTIVE', ltp: '3-0-0' },
      { code: 'CS301L', name: 'Computer Networks Lab', credits: 2, type: 'PRACTICAL', ltp: '0-0-3' },
      { code: 'CS391', name: 'Summer Industrial Training & Internship', credits: 1, type: 'PROJECT', ltp: '0-0-2' },
    ],
    6: [
      { code: 'CS304', name: 'Compiler Design and Code Optimization', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'CS302' },
      { code: 'CS305', name: 'Machine Learning & Deep Neural Networks', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'MA102' },
      { code: 'CS306', name: 'Cloud Computing Architecture & Distributed Systems', credits: 4, type: 'CORE', ltp: '3-0-2', prereq: 'CS301' },
      { code: 'CS421', name: 'Discipline Elective II: Cyber Security & Cryptography', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
      { code: 'OE302', name: 'Open Elective II: Design Thinking & Innovation', credits: 3, type: 'OPEN_ELECTIVE', ltp: '3-0-0' },
      { code: 'CS305L', name: 'Machine Learning & PyTorch Lab', credits: 2, type: 'PRACTICAL', ltp: '0-0-3' },
      { code: 'CS392', name: 'Minor Capstone Project Phase-I', credits: 1, type: 'PROJECT', ltp: '0-0-2' },
    ],
    7: [
      { code: 'CS401', name: 'Distributed Ledger & Blockchain Systems', credits: 3, type: 'CORE', ltp: '3-0-0' },
      { code: 'CS431', name: 'Discipline Elective III: Natural Language Processing (LLMs)', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
      { code: 'CS441', name: 'Discipline Elective IV: Big Data Engineering & Spark', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
      { code: 'OE401', name: 'Open Elective III: Quantum Computing Fundamentals', credits: 3, type: 'OPEN_ELECTIVE', ltp: '3-0-0' },
      { code: 'SW401', name: 'Swayam / NPTEL Online Certification I', credits: 2, type: 'ELECTIVE', ltp: 'Online' },
      { code: 'CS491', name: 'Major Capstone Project Phase-I', credits: 6, type: 'PROJECT', ltp: '0-0-12' },
    ],
    8: [
      { code: 'CS451', name: 'Discipline Elective V: Reinforcement Learning & Robotics', credits: 3, type: 'ELECTIVE', ltp: '3-0-0' },
      { code: 'SW402', name: 'Swayam / NPTEL Online Certification II', credits: 3, type: 'ELECTIVE', ltp: 'Online' },
      { code: 'CS492', name: 'Major Capstone Project Phase-II (Industry Internship)', credits: 12, type: 'PROJECT', ltp: '0-0-24' },
    ],
  };

  const courses = curriculumMap[selectedSemester] || curriculumMap[4];
  const semesterTotalCredits = courses.reduce((acc, c) => acc + c.credits, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-600" />
            <span>Curriculum Scheme & Syllabus Partitioning</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            B.Tech Computer Science & Engineering • Complete 8-Semester Degree Structure (160 Total Credits)
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedSemester === sem
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Curriculum table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Semester {selectedSemester} Course Structure</h3>
            <p className="text-xs text-slate-500 mt-0.5">{courses.length} Prescribed Courses</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-2xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
            Total {semesterTotalCredits} Semester Credits
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
            <tbody className="divide-y divide-slate-100">
              {courses.map((c, i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="py-4 px-6 font-mono font-bold text-indigo-600">{c.code}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{c.name}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {c.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-600">{c.ltp}</td>
                  <td className="py-4 px-6 text-slate-500">{c.prereq || 'None'}</td>
                  <td className="py-4 px-6 font-black text-right text-indigo-600 text-sm">{c.credits}</td>
                </tr>
              ))}
              <tr className="bg-indigo-50/50 font-black text-slate-900 border-t-2 border-indigo-100">
                <td colSpan={5} className="py-4 px-6 text-indigo-900 uppercase">Total Semester {selectedSemester} Credits</td>
                <td className="py-4 px-6 text-right text-indigo-700 text-base">{semesterTotalCredits}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
