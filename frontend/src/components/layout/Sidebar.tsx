import React, { useState } from 'react';
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
  ClipboardList,
  CheckCheck,
  ArrowRightLeft,
  Calendar,
  Landmark,
  Monitor,
  Network,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courseChangesOpen, setCourseChangesOpen] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const role = user?.role || 'STUDENT';
  const isStudent = role === 'STUDENT';

  // Admin & Faculty nav items
  const adminNavItems = [
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

  const facultyNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', path: '/faculty/courses', icon: BookOpen },
    { label: 'Attendance (Excel Ledger)', path: '/faculty/attendance', icon: CheckSquare },
    { label: 'Assignments', path: '/faculty/assignments', icon: FileCheck },
    { label: 'Marks Management (CIA)', path: '/faculty/marks', icon: Award },
    { label: 'Notices', path: '/notices', icon: Bell },
    { label: 'Events', path: '/events', icon: Ticket },
    { label: 'Requests', path: '/requests', icon: FileText },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const placementNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Placement Drives', path: '/placement/drives', icon: Briefcase },
    { label: 'Companies', path: '/placement/companies', icon: Building },
    { label: 'Analytics', path: '/placement/analytics', icon: Activity },
    { label: 'Notices', path: '/notices', icon: Bell },
    { label: 'Events', path: '/events', icon: Ticket },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const userInitials = `${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || 'S'}`.toUpperCase();
  const fullName = `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim();

  // If Student: Render the Dark Cyber Student Navigation
  if (isStudent) {
    return (
      <aside className="w-64 bg-[#090D16] text-slate-300 flex flex-col justify-between h-screen sticky top-0 z-40 select-none border-r border-slate-800/80">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-wide">CampusOS</span>
                <span className="text-[10px] block font-bold text-cyan-400 uppercase tracking-wider">Student Portal</span>
              </div>
            </div>
          </div>

          {/* Top Search bar */}
          <div className="p-3 border-b border-slate-800/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Quick navigate..."
                className="w-full pl-8 pr-7 py-1.5 bg-[#121B2A] border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
              <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            {/* Dashboard Link */}
            <div>
              <NavLink
                to="/dashboard"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Dashboard</span>
              </NavLink>
            </div>

            {/* SECTION 1: ACADEMICS */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Academics
              </div>

              <NavLink
                to="/academics/pre-registration"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <ClipboardList className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Pre-Registration</span>
              </NavLink>

              <NavLink
                to="/academics/registration"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <CheckCheck className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Final Registration</span>
              </NavLink>

              {/* Course Changes Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setCourseChangesOpen(!courseChangesOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ArrowRightLeft className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>Course Changes</span>
                  </div>
                  {courseChangesOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>

                {courseChangesOpen && (
                  <div className="pl-6 pr-1 py-1 space-y-1">
                    <NavLink
                      to="/academics/swayam"
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                          isActive
                            ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        )
                      }
                    >
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>Swayam</span>
                    </NavLink>

                    <NavLink
                      to="/academics/add-drop"
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                          isActive
                            ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        )
                      }
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
                      <span>Add / Drop (Backlogs)</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink
                to="/academics/timetable"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Calendar className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Calendar & Time Table</span>
              </NavLink>
            </div>

            {/* SECTION 2: EXAMINATION */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Examination
              </div>

              <NavLink
                to="/grades"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <FileText className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Results & CIA Grades</span>
              </NavLink>
            </div>

            {/* SECTION 3: PROGRAM & CURRICULUM */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Program & Curriculum
              </div>

              <NavLink
                to="/curriculum/programmes"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Landmark className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Programmes</span>
              </NavLink>

              <NavLink
                to="/courses"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Monitor className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Courses</span>
              </NavLink>

              <NavLink
                to="/curriculum/disciplines"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Network className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Disciplines</span>
              </NavLink>
            </div>

            {/* SECTION 4: CAMPUS LIFE & CAREER */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Campus Life
              </div>

              <NavLink
                to="/attendance"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <CheckSquare className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Attendance</span>
              </NavLink>

              <NavLink
                to="/assignments"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <FileCheck className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Assignments</span>
              </NavLink>

              <NavLink
                to="/placements"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Briefcase className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Placements</span>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Bottom Profile Widget */}
        <div className="p-3 bg-[#0c1424] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md shadow-cyan-500/20">
              {userInitials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate tracking-wide">{fullName}</div>
              <div className="text-[10px] font-bold text-cyan-400 tracking-wider">STUDENT</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // Admin, Faculty, and Placement Officer Sleek Dark Navigation
  let navItems = adminNavItems;
  let roleTitle = 'University Admin';
  if (role === 'FACULTY' || role === 'DEPT_HEAD') {
    navItems = facultyNavItems;
    roleTitle = 'Faculty Portal';
  }
  if (role === 'PLACEMENT_OFFICER') {
    navItems = placementNavItems;
    roleTitle = 'Placement Center';
  }

  return (
    <aside className="w-64 bg-[#090D16] text-slate-300 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              CampusOS
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              {roleTitle}
            </div>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Footer */}
      <div className="p-3 bg-[#0c1424] border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">
            {userInitials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{fullName}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
