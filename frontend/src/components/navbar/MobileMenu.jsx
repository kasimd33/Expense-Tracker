import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, User, Settings, LogOut, Bell, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MobileMenu({ open, setOpen, navLinks, currentPath }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-[#0F172A]/95 backdrop-blur-2xl lg:hidden flex flex-col"
        >
          {/* Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
            <span className="font-bold text-xl text-white">Finova Menu</span>
            <button 
              onClick={() => setOpen(false)}
              className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>

            {/* Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = currentPath.includes(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Profile & Settings block */}
            <div className="pt-4 border-t border-slate-800 space-y-1">
              <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                <User className="w-5 h-5" /> My Profile
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                <Settings className="w-5 h-5" /> Settings
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                <Bell className="w-5 h-5" /> Notifications
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                <Moon className="w-5 h-5" /> Dark Mode
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 space-y-4 pb-6">
            <button className="w-full relative px-4 py-4 rounded-xl font-bold text-white overflow-hidden flex justify-center items-center gap-2 shadow-lg shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
              <div className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Ask AI Assistant</span>
              </div>
            </button>
            <button className="w-full text-center py-2 text-red-400 font-medium hover:text-red-300 transition-colors flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
