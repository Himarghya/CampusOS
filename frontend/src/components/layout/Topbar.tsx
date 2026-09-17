import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Menu, ShieldCheck, User as UserIcon, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export const Topbar: React.FC<{ onToggleMobile?: () => void }> = ({ onToggleMobile }) => {
  const { user, quickLogin } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
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

  const rolesList: Array<{ role: 'STUDENT' | 'FACULTY' | 'DEPT_HEAD' | 'ADMIN' | 'PLACEMENT_OFFICER'; label: string; desc: string }> = [
    { role: 'STUDENT', label: 'John Doe', desc: 'Student (CSE 4th Sem)' },
    { role: 'FACULTY', label: 'Prof. Vikram Sharma', desc: 'Faculty (DSA)' },
    { role: 'DEPT_HEAD', label: 'Dr. Rajesh Sharma', desc: 'HOD (Computer Science)' },
    { role: 'ADMIN', label: 'College Admin', desc: 'Administrator' },
    { role: 'PLACEMENT_OFFICER', label: 'Amit Kapoor', desc: 'Placement Officer' },
  ];

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active Session • Spring 2026</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all border border-indigo-200 cursor-pointer shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>Switch Role ({user?.role})</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Demo Accounts
              </div>
              {rolesList.map((r) => (
                <button
                  key={r.role}
                  onClick={async () => {
                    setShowRoleSwitcher(false);
                    await quickLogin(r.role);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-indigo-50/50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-slate-800">{r.label}</div>
                    <div className="text-[10px] text-slate-500">{r.desc}</div>
                  </div>
                  {user?.role === r.role && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
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
                        n.isRead ? 'bg-white border-slate-100 text-slate-600' : 'bg-indigo-50/60 border-indigo-100 text-slate-800 font-medium'
                      )}
                    >
                      <div className="font-bold mb-0.5 text-slate-900">{n.title}</div>
                      <div className="text-[11px] text-slate-600">{n.message}</div>
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
          className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
        </Link>
      </div>
    </header>
  );
};
