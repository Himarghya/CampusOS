import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, Building, GraduationCap, Award } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Account & Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Identity verification, role assignment, and institutional details</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <Badge variant="primary">{user?.role?.replace(/_/g, ' ')}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal Details</h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">First Name:</span>
                <strong className="text-slate-800">{user?.firstName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Name:</span>
                <strong className="text-slate-800">{user?.lastName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email Address:</span>
                <strong className="text-slate-800">{user?.email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <strong className="text-slate-800">{user?.phone || '+91 98765 43210'}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Institutional Affiliation</h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Institution:</span>
                <strong className="text-slate-800">CampusOS Institute of Technology (CIT01)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <strong className="text-slate-800">Computer Science & Engineering</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Academic Status:</span>
                <strong className="text-emerald-600">Active & Enrolled</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authentication:</span>
                <strong className="text-indigo-600">JWT Access + Refresh Rotation</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
