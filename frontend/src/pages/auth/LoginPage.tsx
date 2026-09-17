import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, ArrowRight, ShieldCheck, BookOpen, Sparkles, CheckCircle2, Lock, Mail } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('john.doe@campusos.edu');
  const [password, setPassword] = useState('Student@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid credentials or server offline');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (role: 'STUDENT' | 'FACULTY' | 'DEPT_HEAD' | 'ADMIN' | 'PLACEMENT_OFFICER') => {
    setLoading(true);
    setError(null);
    try {
      await quickLogin(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#0B0F17] text-slate-100 font-sans">
      {/* Left hero brand column (5 cols) */}
      <div className="lg:col-span-5 bg-[#090D16] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Subtle glow background */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">CampusOS</h1>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">EduPortal Suite</p>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
              One Campus. One Platform. <br />
              <span className="text-gradient-cyan">Complete Academic Intelligence.</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              A unified operating system for students, faculty, and university leadership to manage degrees, course registrations, daily attendance ledgers, CIA exams, and placements.
            </p>
          </div>

          {/* Feature list pills */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="p-3.5 rounded-2xl bg-[#121B2A]/70 border border-slate-700/80 backdrop-blur-xs flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-xs font-semibold text-slate-200">Course & Credit Audit</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121B2A]/70 border border-slate-700/80 backdrop-blur-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs font-semibold text-slate-200">Excel Attendance Grid</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121B2A]/70 border border-slate-700/80 backdrop-blur-xs flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="text-xs font-semibold text-slate-200">Placement Hub</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121B2A]/70 border border-slate-700/80 backdrop-blur-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-xs font-semibold text-slate-200">RBAC & Audit Trails</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>CampusOS v1.0 Production</span>
          <span>© 2026 CampusOS</span>
        </div>
      </div>

      {/* Right Form column (7 cols) */}
      <div className="lg:col-span-7 p-8 lg:p-16 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-white tracking-tight">Sign in to your account</h3>
          <p className="text-sm text-slate-400 mt-1">Enter your credentials or select a 1-click demo persona</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campusos.edu"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#121B2A] border border-slate-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <span className="text-xs font-semibold text-cyan-400 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#121B2A] border border-slate-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="cyan"
            loading={loading}
            className="w-full text-sm font-black shadow-lg shadow-cyan-500/25"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Quick 1-Click Demo Logins */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Quick 1-Click Demo Accounts:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleQuick('STUDENT')}
              className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-950/70 text-cyan-300 text-xs font-bold text-left transition-colors cursor-pointer"
            >
              🎓 Student
              <div className="text-[10px] font-normal text-cyan-400/80">John Doe (CSE)</div>
            </button>
            <button
              onClick={() => handleQuick('FACULTY')}
              className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-950/70 text-purple-300 text-xs font-bold text-left transition-colors cursor-pointer"
            >
              👨‍🏫 Faculty
              <div className="text-[10px] font-normal text-purple-400/80">Prof. Sharma (DSA)</div>
            </button>
            <button
              onClick={() => handleQuick('ADMIN')}
              className="p-2.5 rounded-xl border border-slate-700 bg-[#162032] hover:bg-[#1E2C44] text-slate-200 text-xs font-bold text-left transition-colors cursor-pointer"
            >
              🛡️ Admin
              <div className="text-[10px] font-normal text-slate-400">Governance</div>
            </button>
            <button
              onClick={() => handleQuick('PLACEMENT_OFFICER')}
              className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/40 hover:bg-amber-950/70 text-amber-300 text-xs font-bold text-left transition-colors cursor-pointer"
            >
              💼 Placement
              <div className="text-[10px] font-normal text-amber-400/80">Amit Kapoor</div>
            </button>
            <button
              onClick={() => handleQuick('DEPT_HEAD')}
              className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 text-xs font-bold text-left transition-colors cursor-pointer"
            >
              🏛️ HOD (CSE)
              <div className="text-[10px] font-normal text-emerald-400/80">Dr. Rajesh</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
