import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Plus, Scan, TrendingUp, DollarSign, Wallet, Loader, Bot, X, Send } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/navbar/Navbar';

const COLORS = ['#aa3bff', '#c084fc', '#4f46e5', '#ec4899', '#f59e0b', '#10b981'];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hi! I am your AI Financial Advisor. Ask me anything about your spending.' }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (chatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getInsights = async () => {
    setInsights('Loading...');
    try {
      const res = await api.get('/ai/insights');
      setInsights(res.data.insights);
    } catch (err) {
      console.error(err);
      setInsights('Failed to load insights.');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', {
        title, amount: Number(amount), category, type, paymentMethod
      });
      setTitle(''); setAmount(''); fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const res = await api.post('/ocr/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTitle(res.data.suggestedTitle || 'Scanned Receipt');
      if (res.data.suggestedAmount) {
        setAmount(res.data.suggestedAmount);
      }
      alert('OCR Scan successful! Please verify the details.');
    } catch (err) {
      console.error(err);
      alert('OCR Scan failed.');
    }
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader className="animate-spin text-primary" size={32} /></div>;

  // Analytics Data
  const expensesOnly = expenses.filter(e => e.type === 'expense');
  const totalExpense = expensesOnly.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryData = expensesOnly.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) existing.value += curr.amount;
    else acc.push({ name: curr.category, value: curr.amount });
    return acc;
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 pb-4 pt-28 md:px-8 md:pb-8 md:pt-32 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex justify-between items-center bg-card/80 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">ExpenseAI</h1>
              <p className="text-muted-foreground text-sm font-medium">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button onClick={logout} className="p-3 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10">
            <LogOut size={20} />
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/80 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/20"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl"><Wallet size={28} /></div>
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Total Balance</p>
                <h3 className="text-3xl font-extrabold text-foreground">₹{balance.toFixed(2)}</h3>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card/80 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-green-500/20"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl"><TrendingUp size={28} /></div>
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Total Income</p>
                <h3 className="text-3xl font-extrabold text-foreground">₹{totalIncome.toFixed(2)}</h3>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/80 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-red-500/20"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl"><DollarSign size={28} /></div>
              <div>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Total Expense</p>
                <h3 className="text-3xl font-extrabold text-foreground">₹{totalExpense.toFixed(2)}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form & Insights */}
          <div className="space-y-8">
            <div className="bg-card/80 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-foreground">Add Transaction</h3>
                <button onClick={() => fileInputRef.current.click()} className="text-sm font-medium flex items-center gap-2 bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-xl hover:bg-secondary transition-colors shadow-sm">
                  <Scan size={16} /> Scan Receipt
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
              
              <form onSubmit={handleAddExpense} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <select value={type} onChange={(e) => setType(e.target.value)} className="p-3.5 rounded-2xl border border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="p-3.5 rounded-2xl border border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium">
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3.5 rounded-2xl border border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full p-3.5 rounded-2xl border border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium" />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3.5 rounded-2xl border border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium">
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Salary">Salary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all flex justify-center items-center gap-2">
                  <Plus size={20} /> Add Transaction
                </button>
              </form>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-background p-[1px] rounded-3xl">
              <div className="bg-card/90 backdrop-blur-2xl p-6 rounded-[23px] h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl flex items-center gap-2"><Bot className="text-primary" /> AI Insights</h3>
                  <button onClick={getInsights} className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:shadow-md transition-all">
                    Generate
                  </button>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                  {insights ? (
                    <ReactMarkdown>{insights}</ReactMarkdown>
                  ) : (
                    <p className="text-center italic mt-4 opacity-70">Click generate to get personalized AI budgeting advice.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Charts */}
          <div className="bg-card/80 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-sm flex flex-col items-center">
             <h3 className="font-bold text-xl w-full mb-8">Expenses by Category</h3>
             {categoryData.length > 0 ? (
               <div className="w-full" style={{ height: 300 }}>
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }} />
                    </PieChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="flex-1 flex items-center justify-center text-muted-foreground italic">No spending data available</div>
             )}
          </div>

          {/* Right Column: Recent Transactions */}
          <div className="bg-card/80 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-sm flex flex-col h-[600px]">
             <h3 className="font-bold text-xl mb-6">Recent Transactions</h3>
             <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
               {expenses.length === 0 && <p className="text-muted-foreground text-center mt-8 italic">No transactions yet</p>}
               {expenses.map((expense) => (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={expense._id} className="flex justify-between items-center p-4 bg-background/50 hover:bg-secondary/20 rounded-2xl transition-all border border-transparent hover:border-border">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${expense.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}>
                       {expense.type === 'income' ? '+' : '-'}
                     </div>
                     <div>
                       <p className="font-bold text-foreground">{expense.title}</p>
                       <p className="text-xs text-muted-foreground font-medium mt-0.5">{new Date(expense.date).toLocaleDateString()} • {expense.category}</p>
                     </div>
                   </div>
                   <div className={`font-extrabold text-lg tracking-tight ${expense.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                     ₹{expense.amount.toFixed(2)}
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>

        </div>
      </div>

      {/* Floating AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {chatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-card/95 backdrop-blur-2xl rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full"><Bot size={20} /></div>
                  <div>
                    <h3 className="font-bold">AI Financial Advisor</h3>
                    <p className="text-xs text-white/80">Online</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><X size={20} /></button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary/50 text-foreground rounded-bl-none'}`}>
                      {msg.role === 'ai' ? (
                        <div className="prose prose-sm dark:prose-invert text-current">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/50 text-foreground p-3 rounded-2xl rounded-bl-none flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-background border-t border-border">
                <form onSubmit={sendChatMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your finances..."
                    className="flex-1 bg-secondary/50 border border-input rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button type="submit" disabled={chatLoading || !chatInput.trim()} className="bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    <Send size={18} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95 ${chatOpen ? 'bg-destructive' : 'bg-gradient-to-tr from-primary to-secondary'}`}
        >
          {chatOpen ? <X size={28} /> : <Bot size={28} />}
        </button>
      </div>

    </div>
    </>
  );
};

export default Dashboard;
