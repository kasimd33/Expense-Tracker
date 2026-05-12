import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';

export default function AIInsights() {
  const [insights, setInsights] = useState('');
  const [generating, setGenerating] = useState(false);
  
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I have analyzed your recent transactions. What would you like to know?' }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateInsights = async () => {
    setGenerating(true);
    try {
      const res = await api.get('/ai/insights');
      setInsights(res.data.insights);
    } catch (err) {
      setInsights('Failed to generate insights. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const sendChatMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error answering that.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <PageLayout title="AI Financial Advisor" description="Get personalized AI-driven insights and chat directly with your finance assistant.">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Auto-generated Insights */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card/80 backdrop-blur-xl border border-border p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl">Smart Summary</h3>
            </div>
            
            <button 
              onClick={generateInsights}
              disabled={generating}
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity mb-6"
            >
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Fresh Insights'}
            </button>

            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground bg-muted/30 p-5 rounded-2xl border border-border">
              {insights ? (
                <ReactMarkdown>{insights}</ReactMarkdown>
              ) : (
                <div className="text-center py-4">
                  <Bot className="w-10 h-10 mx-auto mb-2 text-slate-500 opacity-50" />
                  <p className="italic">Click generate to let AI analyze your database.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Interactive Chat */}
        <div className="lg:col-span-2">
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-sm flex flex-col h-[600px] overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/50 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Chat with Finova AI</h3>
                <p className="text-xs text-green-500 font-medium">● Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none' 
                      : 'bg-muted text-foreground rounded-tl-none border border-border'
                  }`}>
                    {msg.role === 'ai' ? (
                      <div className="prose prose-sm dark:prose-invert">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : msg.text}
                  </div>
                </motion.div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground p-4 rounded-2xl rounded-tl-none flex gap-1.5 border border-border">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-muted/30 border-t border-border">
              <form onSubmit={sendChatMessage} className="relative flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a financial question..."
                  className="flex-1 bg-background border border-input text-foreground rounded-full pl-6 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={chatLoading || !chatInput.trim()} 
                  className="bg-primary text-primary-foreground p-3.5 rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
