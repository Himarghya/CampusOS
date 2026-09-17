import React, { useState } from 'react';
import api from '../../services/api';
import { Settings, Lock, Check, Palette, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useTheme, themesList, ThemeMode } from '../../context/ThemeContext';
import clsx from 'clsx';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.patch('/auth/change-password', { currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">System Settings & Personalization</h1>
        <p className="text-xs text-slate-400 mt-1">Configure theme color palettes, UI appearance, and account security</p>
      </div>

      {/* Theme & Appearance Customizer */}
      <div className="bg-[#111827] rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Color Themes & Appearance</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your preferred visual mode. The platform will dynamically update across all portals.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            Real-Time
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {themesList.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as ThemeMode)}
              className={clsx(
                'p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between group',
                theme === t.id
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-950 ring-1 ring-cyan-400'
                  : 'bg-[#162032]/60 border-slate-800 hover:border-slate-700'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                      style={{ backgroundColor: t.previewPrimary }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-xs -ml-2"
                      style={{ backgroundColor: t.previewSecondary }}
                    />
                  </div>
                  {theme === t.id && (
                    <span className="p-1 rounded-full bg-cyan-400 text-slate-950">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                  {t.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {t.desc}
                </div>
              </div>

              <div
                className="mt-4 w-full h-2 rounded-full overflow-hidden border border-white/10"
                style={{ backgroundColor: t.previewBg }}
              >
                <div
                  className="h-full w-1/2"
                  style={{ backgroundColor: t.previewPrimary }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Password & Security Card */}
      <div className="bg-[#111827] rounded-3xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-400" />
          <span>Security & Password</span>
        </h2>

        {success && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#162032] border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#162032] border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#162032] border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="cyan" loading={loading} size="md" className="font-bold">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
