import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2 } from 'lucide-react';

const mockNotifications = [
  { id: 1, title: 'Food budget exceeded', time: '10m ago', unread: true },
  { id: 2, title: 'You saved 12% this month', time: '2h ago', unread: true },
  { id: 3, title: 'Travel expenses increased', time: '1d ago', unread: false },
  { id: 4, title: 'OCR scan completed', time: '2d ago', unread: false },
];

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, unread: false })));
  const clearAll = () => setNotifications([]);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-pink-500 rounded-full border border-[#0F172A]"></span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex gap-2">
                <button onClick={markAllRead} className="text-xs text-slate-400 hover:text-white transition-colors" title="Mark all read"><Check className="w-4 h-4"/></button>
                <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300 transition-colors" title="Clear all"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer ${n.unread ? 'bg-slate-800/20' : ''}`}>
                    <div className="flex justify-between items-start">
                      <p className={`text-sm ${n.unread ? 'text-white font-medium' : 'text-slate-300'}`}>{n.title}</p>
                      {n.unread && <span className="w-2 h-2 mt-1.5 bg-cyan-500 rounded-full shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
