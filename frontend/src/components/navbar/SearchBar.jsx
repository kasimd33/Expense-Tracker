import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_RESULTS = [
  { id: 1, type: 'Transaction', text: 'Starbucks Coffee', amount: '-$4.50' },
  { id: 2, type: 'Category', text: 'Food & Dining', amount: null },
  { id: 3, type: 'Transaction', text: 'Apple Subscription', amount: '-$14.99' },
  { id: 4, type: 'Merchant', text: 'Amazon', amount: null },
];

export function SearchBar() {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setResults(MOCK_RESULTS.filter(r => r.text.toLowerCase().includes(query.toLowerCase())));
      setLoading(false);
    }, 400); // debounce
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <motion.div 
      ref={ref}
      animate={{ width: focused ? 280 : 200 }}
      className="relative group hidden md:block z-50"
    >
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${focused ? 'text-cyan-400' : 'text-slate-400'}`}>
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder="Search transactions..."
        className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent focus:bg-slate-800 transition-all placeholder:text-slate-400 shadow-inner"
        aria-label="Search"
      />
      {loading && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-cyan-400">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}

      <AnimatePresence>
        {focused && query && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-2"
          >
            {results.length > 0 ? (
              results.map(r => (
                <button key={r.id} className="w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors flex justify-between items-center group">
                  <div>
                    <p className="text-sm text-white group-hover:text-cyan-400 transition-colors">{r.text}</p>
                    <p className="text-xs text-slate-500">{r.type}</p>
                  </div>
                  {r.amount && <span className="text-sm text-slate-300">{r.amount}</span>}
                </button>
              ))
            ) : (
              !loading && <div className="px-4 py-3 text-sm text-slate-400 text-center">No results found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
