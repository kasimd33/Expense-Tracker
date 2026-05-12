import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, Sparkles, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Notifications } from './Notifications';
import { ProfileDropdown } from './ProfileDropdown';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';
import { AIAssistantModal } from './AIAssistantModal';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Expenses', path: '/expenses' },
  { name: 'Budgets', path: '/budgets' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'AI Insights', path: '/ai-insights' },
  { name: 'OCR Scanner', path: '/ocr-scanner' },
  { name: 'Reports', path: '/reports' }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[40] transition-all duration-300 bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-2">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* LEFT: Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer group shrink-0" aria-label="Finova AI Home">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                <Hexagon className="text-white w-5 h-5" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="font-bold text-2xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Finova <span className="font-light">AI</span>
              </span>
            </Link>

            {/* CENTER: Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = currentPath.includes(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative px-4 py-2 rounded-full text-sm font-semibold transition-colors group"
                  >
                    <span className={`relative z-10 ${isActive ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white transition-colors duration-200'}`}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-pill"
                        className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT: Actions */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              
              <SearchBar />

              <button 
                onClick={() => setAiModalOpen(true)}
                className="relative group px-4 py-2.5 rounded-full font-bold text-sm text-white overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Ask Finova</span>
                </div>
              </button>

              <div className="flex items-center gap-1 border-l border-slate-700/50 pl-3 ml-1">
                <Notifications />
                <ThemeToggle />
                <ProfileDropdown />
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -mr-2 rounded-lg text-slate-300 hover:text-white focus:outline-none"
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      <MobileMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} navLinks={navLinks} currentPath={currentPath} />
      <AIAssistantModal open={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </>
  );
}
