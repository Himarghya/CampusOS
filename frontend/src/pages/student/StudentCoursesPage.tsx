import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { BookOpen, User, Layers, CheckCircle2 } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';

export const StudentCoursesPage: React.FC = () => {
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['myEnrollments'],
    queryFn: async () => {
      const res = await api.get('/academic/enrollments/me');
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Courses</h1>
          <p className="text-xs text-slate-500 mt-1">Curriculum & courses enrolled for the current semester</p>
        </div>
        <Badge variant="primary" size="md">
          Semester 4 • 2025-2026
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments?.map((enr: any) => {
          const faculty = enr.course.assignments?.[0]?.faculty;
          return (
            <div
              key={enr.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <Badge variant={enr.course.type === 'LAB' ? 'warning' : 'primary'}>
                    {enr.course.type}
                  </Badge>
                </div>

                <div className="text-xs font-bold text-indigo-600 mb-1">{enr.course.code}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{enr.course.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {enr.course.description || 'Comprehensive curriculum covering theoretical foundations and practical laboratory exercises.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{faculty ? `${faculty.user.firstName} ${faculty.user.lastName}` : 'Faculty Assigned'}</span>
                </div>
                <div className="font-bold text-slate-700">{enr.course.credits} Credits</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
