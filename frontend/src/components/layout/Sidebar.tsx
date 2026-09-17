import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileCheck,
  CalendarDays,
  CheckSquare,
  Star,
  Bell,
  Briefcase,
  Ticket,
  FileText,
  User,
  Settings,
  LogOut,
  Users,
  Building,
  Layers,
  Award,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Role-specific navigation items
  const role = user?.role || 'STUDENT';

  let navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', path: '/courses', icon: BookOpen },
    { label: 'Assignments', path: '/assignments', icon: FileCheck },
    { label: 'Exams', path: '/exams', icon: CalendarDays },
    { label: 'Attendance', path: '/attendance', icon: CheckSquare },
    { label: 'Grades', path: '/grades', icon: Star },
    { label: 'Notices', path: '/notices', icon: Bell },
    { label: 'Placements', path: '/placements', icon: Briefcase },
    { label: 'Events', path: '/events', icon: Ticket },
    { label: 'Requests', path: '/requests', icon: FileText },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    navItems = [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Students', path: '/admin/students', icon: Users },
      { label: 'Faculty', path: '/admin/faculty', icon: User },
      { label: 'Departments', path: '/admin/departments', icon: Building },
      { label: 'Academic & Courses', path: '/admin/courses', icon: Layers },
      { label: 'Exams & Results', path: '/admin/exams', icon: Award },
      { label: 'Placements', path: '/placements', icon: Briefcase },
      { label: 'Notices', path: '/notices', icon: Bell },
      { label: 'Events', path: '/events', icon: Ticket },
      { label: 'Requests', path: '/requests', icon: FileText },
      { label: 'Analytics', path: '/admin/analytics', icon: Activity },
      { label: 'Audit Logs', path: '/admin/audit', icon: ShieldCheck },
      { label: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (role === 'FACULTY' || role === 'DEPT_HEAD') {
    navItems = [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'My Courses', path: '/faculty/courses', icon: BookOpen },
      { label: 'Attendance', path: '/faculty/attendance', icon: CheckSquare },
      { label: 'Assignments', path: '/faculty/assignments', icon: FileCheck },
      { label: 'Marks Management', path: '/faculty/marks', icon: Award },
      { label: 'Notices', path: '/notices', icon: Bell },
      { label: 'Events', path: '/events', icon: Ticket },
      { label: 'Requests', path: '/requests', icon: FileText },
      { label: 'Profile', path: '/profile', icon: User },
      { label: 'Settings', path: '/settings', icon: Settings },
    ];
  } else if (role === 'PLACEMENT_OFFICER') {
    navItems = [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Placement Drives', path: '/placement/drives', icon: Briefcase },
      { label: 'Companies', path: '/placement/companies', icon: Building },
      { label: 'Analytics', path: '/placement/analytics', icon: Activity },
      { label: 'Notices', path: '/notices', icon: Bell },
      { label: 'Events', path: '/events', icon: Ticket },
      { label: 'Settings', path: '/settings', icon: Settings },
    ];
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
              EduPortal
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              CampusOS Suite
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="px-4 space-y-1 mt-2 max-h-[calc(100vh-210px)] overflow-y-auto pr-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
