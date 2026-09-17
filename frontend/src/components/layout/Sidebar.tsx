import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    { label: 'Attendance', path: '/faculty/attendance', icon: CheckSquare },
    { label: 'Assignments', path: '/faculty/assignments', icon: FileCheck },
    { label: 'Marks Management', path: '/faculty/marks', icon: Award },
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

  // If Student: Render the Dark Navy EduPortal themed navigation matching Screenshot 2
  if (isStudent) {
    const userInitials = `${user?.firstName?.[0] || 'H'}${user?.lastName?.[0] || 'D'}`.toUpperCase();
    const fullName = `${user?.firstName || 'HIMARGHYA'} ${user?.lastName || 'DAS'}`.toUpperCase();

    return (
      <aside className="w-64 bg-[#080E1A] text-slate-300 flex flex-col justify-between h-screen sticky top-0 z-40 select-none border-r border-slate-800">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Search bar (Screenshot 2) */}
          <div className="p-4 border-b border-slate-800/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search"
                className="w-full pl-8 pr-7 py-1.5 bg-[#121B2A] border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
              <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {/* Navigation Items (Screenshot 2) */}
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
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
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
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <ClipboardList className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Pre-Registration</span>
              </NavLink>

              <NavLink
                to="/academics/registration"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <CheckCheck className="w-4 h-4 shrink-0 text-slate-400" />
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
                            ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
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
                            ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
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
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
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
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Results</span>
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
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Landmark className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Programmes</span>
              </NavLink>

              <NavLink
                to="/courses"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Monitor className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Courses</span>
              </NavLink>

              <NavLink
                to="/curriculum/structures"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Layers className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Curriculums</span>
              </NavLink>

              <NavLink
                to="/curriculum/disciplines"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Network className="w-4 h-4 shrink-0 text-slate-400" />
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
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <CheckSquare className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Attendance</span>
              </NavLink>

              <NavLink
                to="/assignments"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <FileCheck className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Assignments</span>
              </NavLink>

              <NavLink
                to="/placements"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive
                      ? 'bg-[#0E3355] text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )
                }
              >
                <Briefcase className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Placements</span>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Bottom Profile Widget (matches Screenshot 2 exact styling) */}
        <div className="p-3 bg-[#0c1424] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0091FF] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-sky-500/20">
              {userInitials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate tracking-wide">{fullName}</div>
              <div className="text-[10px] font-bold text-slate-400 tracking-wider">STUDENT</div>
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

  // Fallback for Admin / Faculty roles
  let navItems = adminNavItems;
  if (role === 'FACULTY' || role === 'DEPT_HEAD') navItems = facultyNavItems;
  if (role === 'PLACEMENT_OFFICER') navItems = placementNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
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
