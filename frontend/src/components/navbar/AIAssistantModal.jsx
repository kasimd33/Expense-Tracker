import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot } from 'lucide-react';

export function AIAssistantModal({ open, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi there! I'm your AI financial assistant. What would you like to know about your finances today?" }
  ]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm analyzing your request... (Mock response)" }]);
    }, 1000);
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '85vh', height: '600px' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">Finova AI Assistant</h3>
                  <p className="text-xs text-cyan-400 font-medium">Always here to help</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Chat Area) */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-900/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {messages.length === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
                  {['Where did I spend the most this month?', 'Analyze my food expenses', 'How can I save more money?', 'Show unusual spending patterns'].map((prompt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handlePromptClick(prompt)}
                      className="text-xs text-left p-3 border border-slate-700/80 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800 hover:border-cyan-500/30 transition-all shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700/50">
              <form onSubmit={handleSend} className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Finova AI..."
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-full pl-5 pr-14 py-3.5 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 p-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:hover:shadow-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
