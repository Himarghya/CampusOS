import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Layers, BookOpen, CheckCircle2, ChevronDown } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';

export const StudentCurriculumsPage: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number>(4);

  const curriculumMap: Record<number, Array<{ code: string; name: string; credits: number; type: string }>> = {
    1: [
      { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, type: 'CORE' },
      { code: 'PH101', name: 'Engineering Physics & Quantum Mechanics', credits: 4, type: 'CORE' },
      { code: 'CS101', name: 'Introduction to Computer Programming', credits: 4, type: 'CORE' },
      { code: 'ME101', name: 'Engineering Mechanics', credits: 3, type: 'CORE' },
      { code: 'HS101', name: 'Professional Communication & Ethics', credits: 2, type: 'HUMANITIES' },
    ],
    2: [
      { code: 'MA102', name: 'Engineering Mathematics II (Linear Algebra)', credits: 4, type: 'CORE' },
      { code: 'EE101', name: 'Basic Electrical and Electronics Engineering', credits: 4, type: 'CORE' },
      { code: 'CS102', name: 'Data Structures and Algorithms Fundamentals', credits: 4, type: 'CORE' },
      { code: 'CH101', name: 'Environmental Chemistry & Ecology', credits: 3, type: 'CORE' },
      { code: 'ME102', name: 'Engineering Workshop & CAD Practice', credits: 2, type: 'PRACTICAL' },
    ],
    3: [
      { code: 'CS201', name: 'Data Structures and Algorithms', credits: 4, type: 'CORE' },
      { code: 'CS202', name: 'Discrete Mathematical Structures', credits: 4, type: 'CORE' },
      { code: 'CS203', name: 'Digital Logic and Computer Organization', credits: 4, type: 'CORE' },
      { code: 'EC201', name: 'Analog and Digital Electronic Circuits', credits: 4, type: 'CORE' },
      { code: 'HS201', name: 'Economics for Engineers', credits: 3, type: 'HUMANITIES' },
      { code: 'CS201L', name: 'Data Structures Lab', credits: 2, type: 'PRACTICAL' },
    ],
    4: [
      { code: 'CS204', name: 'Database Management Systems', credits: 4, type: 'CORE' },
      { code: 'CS205', name: 'Operating Systems and Systems Programming', credits: 4, type: 'CORE' },
      { code: 'CS206', name: 'Design and Analysis of Algorithms', credits: 4, type: 'CORE' },
      { code: 'CS207', name: 'Computer Architecture and Microprocessors', credits: 4, type: 'CORE' },
      { code: 'CS208', name: 'Web Technologies and Microservices', credits: 3, type: 'CORE' },
      { code: 'CS205L', name: 'Operating Systems Lab', credits: 2, type: 'PRACTICAL' },
      { code: 'CS204L', name: 'Database Systems Lab', credits: 2, type: 'PRACTICAL' },
      { code: 'DES201', name: 'Human Computer Interaction', credits: 2, type: 'ELECTIVE' },
    ],
    5: [
      { code: 'CS301', name: 'Computer Networks and Protocols', credits: 4, type: 'CORE' },
      { code: 'CS302', name: 'Theory of Computation and Automata', credits: 4, type: 'CORE' },
      { code: 'CS303', name: 'Software Engineering and Agile Practices', credits: 4, type: 'CORE' },
      { code: 'CS411', name: 'Artificial Intelligence & Intelligent Agents', credits: 3, type: 'ELECTIVE' },
      { code: 'MG301', name: 'Engineering Economics and Finance', credits: 3, type: 'OPEN_ELECTIVE' },
      { code: 'CS301L', name: 'Computer Networks Lab', credits: 2, type: 'PRACTICAL' },
    ],
  };

  const courses = curriculumMap[selectedSemester] || curriculumMap[4];
  const semesterTotalCredits = courses.reduce((acc, c) => acc + c.credits, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Curriculum Structure</h1>
          <p className="text-xs text-slate-500 mt-1">
            B.Tech Computer Science & Engineering • 8-Semester Degree Scheme (160 Total Credits)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedSemester === sem
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
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
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Total {semesterTotalCredits} Credits
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#BAE6FD]/40 text-slate-700 font-bold border-b border-sky-100">
                <th className="py-3.5 px-6">Course Code</th>
                <th className="py-3.5 px-6">Course Title</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6 text-right">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((c, i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{c.code}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">{c.name}</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-right text-indigo-600">{c.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
