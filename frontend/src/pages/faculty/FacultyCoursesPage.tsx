import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { BookOpen, Users, Calendar } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';

export const FacultyCoursesPage: React.FC = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['facultyAssignedCoursesList'],
    queryFn: async () => {
      const res = await api.get('/academic/courses');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Courses & Classes</h1>
        <p className="text-xs text-slate-500 mt-1">Teaching timetable, enrolled student rosters, and course materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((c: any) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold text-indigo-600">{c.code}</span>
                <Badge variant="primary">{c.credits} Credits</Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">{c.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{c.description}</p>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-semibold mb-3">
                Section A • {c._count?.enrollments || 40} Students Enrolled
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold text-indigo-600">
              <BookOpen className="w-4 h-4" />
              <span>Full Syllabus & Lab Material Ready</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
