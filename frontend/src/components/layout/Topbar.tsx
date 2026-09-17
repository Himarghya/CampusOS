import React, { useState, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  Menu,
  ShieldCheck,
  Palette,
  Check,
  Search,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, themesList, ThemeMode } from '../../context/ThemeContext';
import api from '../../services/api';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export const Topbar: React.FC<{ onToggleMobile?: () => void }> = ({ onToggleMobile }) => {
  const { user, quickLogin } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [topSearch, setTopSearch] = useState('');

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  const rolesList: Array<{
    role: 'STUDENT' | 'FACULTY' | 'DEPT_HEAD' | 'ADMIN' | 'PLACEMENT_OFFICER';
    label: string;
    desc: string;
  }> = [
    { role: 'STUDENT', label: 'John Doe', desc: 'Student (CSE 4th Sem)' },
    { role: 'FACULTY', label: 'Prof. Vikram Sharma', desc: 'Faculty (DSA)' },
    { role: 'DEPT_HEAD', label: 'Dr. Rajesh Sharma', desc: 'HOD (Computer Science)' },
    { role: 'ADMIN', label: 'College Admin', desc: 'Administrator' },
    { role: 'PLACEMENT_OFFICER', label: 'Amit Kapoor', desc: 'Placement Officer' },
  ];

  const currentTheme = themesList.find((t) => t.id === theme) || themesList[0];

  return (
    <header className="h-20 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Menu & Active Status / Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Session • Spring 2026</span>
        </div>

        {/* Global Search Input */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={topSearch}
            onChange={(e) => setTopSearch(e.target.value)}
            placeholder="Search courses, students, exams..."
            className="w-64 pl-9 pr-4 py-1.5 bg-[#121B2A] border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition"
          />
        </div>
      </div>

      {/* Right: Actions, Palette Switcher, Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Color / Theme Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            title="Change Theme & Color Palette"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121B2A] hover:bg-[#162236] text-slate-200 text-xs font-bold transition-all border border-slate-700/70 hover:border-cyan-500/40 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: currentTheme.previewPrimary }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full ring-1 ring-white/20 -ml-1"
                style={{ backgroundColor: currentTheme.previewSecondary }}
              />
            </div>
            <span className="hidden sm:inline text-[11px] font-semibold text-slate-300">
              {currentTheme.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showThemePicker && (
            <div className="absolute right-0 mt-2 w-72 bg-[#111827] rounded-2xl shadow-2xl border border-slate-700/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  Color Themes & Palettes
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Live Toggle</span>
              </div>

              <div className="space-y-1.5">
                {themesList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id as ThemeMode);
                      setShowThemePicker(false);
                    }}
                    className={clsx(
                      'w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer',
                      theme === t.id
                        ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 font-bold'
                        : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: t.previewPrimary }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs -ml-1.5"
                          style={{ backgroundColor: t.previewSecondary }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-semibold leading-tight">{t.name}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{t.desc}</div>
                      </div>
                    </div>
                    {theme === t.id && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-300 text-xs font-bold transition-all border border-cyan-500/30 cursor-pointer shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Role: {user?.role?.replace('_', ' ')}</span>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-64 bg-[#111827] rounded-2xl shadow-2xl border border-slate-700/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Accounts
              </div>
              {rolesList.map((r) => (
                <button
                  key={r.role}
                  onClick={async () => {
                    setShowRoleSwitcher(false);
                    await quickLogin(r.role);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-800/80 flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-white">{r.label}</div>
                    <div className="text-[10px] text-slate-400">{r.desc}</div>
                  </div>
                  {user?.role === r.role && <Check className="w-4 h-4 text-cyan-400 font-bold" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#121B2A] text-slate-300 hover:text-white hover:bg-[#162236] border border-slate-700/70 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-[#0B0F17]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] rounded-2xl shadow-2xl border border-slate-700/80 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-cyan-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={clsx(
                        'p-2.5 rounded-xl text-xs border transition-colors',
                        n.isRead
                          ? 'bg-[#121B2A]/60 border-slate-800 text-slate-400'
                          : 'bg-cyan-950/40 border-cyan-500/30 text-slate-200 font-medium'
                      )}
                    >
                      <div className="font-bold mb-0.5 text-white">{n.title}</div>
                      <div className="text-[11px] text-slate-300">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1 pr-3 rounded-xl bg-[#121B2A] hover:bg-[#162236] border border-slate-700/70 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-white leading-tight">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
        </Link>
      </div>
    </header>
  );
};
