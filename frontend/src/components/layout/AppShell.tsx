import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { useTheme } from '../../context/ThemeContext';

export const AppShell: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#0B0F17] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* Background subtle radial glow effects matching Cyberpunk / Dark UI */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 z-20">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 z-10">
        <Topbar onToggleMobile={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-5 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
