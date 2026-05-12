import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, CreditCard, Shield, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const ref = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 600); // Wait for animation
  };

  const closeDropdown = () => setOpen(false);

  const menuItems = [
    { icon: <User className="w-4 h-4" />, label: 'My Profile', path: '/profile' },
    { icon: <Settings className="w-4 h-4" />, label: 'Settings', path: '/settings' },
    { icon: <CreditCard className="w-4 h-4" />, label: 'Billing', path: '/billing' },
    { icon: <Shield className="w-4 h-4" />, label: 'Security', path: '/security' }
  ];

  return (
    <div className="relative z-50" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300 ml-2 group outline-none focus:ring-2 focus:ring-cyan-500/50"
        aria-expanded={open}
        aria-label="User Profile Menu"
      >
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all uppercase overflow-hidden">
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative z-10">{user?.name ? user.name.charAt(0) : 'JD'}</span>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0F172A] rounded-full z-20"></span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-300 ${open ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute right-0 mt-3 w-64 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-white uppercase relative">
                    {user?.name ? user.name.charAt(0) : 'JD'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                    {user?.name || 'Finova User'}
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </p>
                  <p className="text-xs text-slate-400 truncate font-medium">{user?.email || 'user@finova.ai'}</p>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Pro Plan</span>
              </div>
            </div>

            {/* Links */}
            <div className="p-2 space-y-0.5">
              {menuItems.map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  key={item.label}
                >
                  <Link 
                    to={item.path}
                    onClick={closeDropdown}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl flex items-center gap-3 transition-all group"
                  >
                    <span className="text-slate-400 group-hover:text-cyan-400 transition-colors">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-slate-700/50 bg-slate-900/50">
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all group"
              >
                <LogOut className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isLoggingOut ? 'animate-pulse' : ''}`} /> 
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
