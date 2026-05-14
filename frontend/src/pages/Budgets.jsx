import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, AlertTriangle, CheckCircle, Sparkles, X, Loader2, Info } from 'lucide-react';
import api from '../utils/api';

const COLORS = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Purple', value: '#c084fc' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Cyan', value: '#06b6d4' }
];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    color: '#4f46e5',
    alertThreshold: 80
  });

  const [aiInsight, setAiInsight] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/expenses')
      ]);
      setBudgets(budgetsRes.data);
      setExpenses(expensesRes.data);
      generateAIInsight(budgetsRes.data, expensesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsight = (currBudgets, currExpenses) => {
    if (currBudgets.length === 0) {
      setAiInsight('Create your first budget to unlock AI insights and predictions.');
      return;
    }
    
    let criticalBudget = null;
    let highestPercentage = 0;

    currBudgets.forEach(b => {
      const spent = currExpenses.filter(e => {
        const expMonth = new Date(e.date).toISOString().slice(0, 7);
        return e.category === b.category && e.type === 'expense' && expMonth === b.month;
      }).reduce((s, e) => s + e.amount, 0);
      const pct = (spent / b.limit) * 100;
      if (pct > highestPercentage) {
        highestPercentage = pct;
        criticalBudget = b;
      }
    });

    if (highestPercentage >= 100) {
      setAiInsight(`Critical Alert: You have exceeded your ${criticalBudget.category} budget by ${highestPercentage.toFixed(0)}%. Consider reducing spending in this category immediately.`);
    } else if (highestPercentage >= 80) {
      setAiInsight(`Warning: Your ${criticalBudget.category} budget is at ${highestPercentage.toFixed(0)}% capacity. Slow down your spending to stay within your limits this month.`);
    } else {
      setAiInsight(`Great job! All your budgets are healthy. Your highest usage is ${criticalBudget.category} at ${highestPercentage.toFixed(0)}%.`);
    }
  };

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setIsEditMode(true);
      setEditId(budget._id);
      setFormData({
        category: budget.category,
        limit: budget.limit,
        color: budget.color,
        alertThreshold: budget.alertThreshold
      });
    } else {
      setIsEditMode(false);
      setEditId(null);
      setFormData({ category: '', limit: '', color: '#4f46e5', alertThreshold: 80 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        limit: Number(formData.limit),
        alertThreshold: Number(formData.alertThreshold),
        month: new Date().toISOString().slice(0, 7) // 'YYYY-MM'
      };

      if (isEditMode) {
        const res = await api.put(`/budgets/${editId}`, payload);
        setBudgets(budgets.map(b => b._id === editId ? res.data : b));
      } else {
        const res = await api.post('/budgets', payload);
        setBudgets([res.data, ...budgets]);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save budget.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets(budgets.filter(b => b._id !== id));
      generateAIInsight(budgets.filter(b => b._id !== id), expenses);
    } catch (err) {
      console.error(err);
    }
  };

  const getSpentAmount = (category, month) => {
    return expenses
      .filter(e => {
        const expMonth = new Date(e.date).toISOString().slice(0, 7);
        return e.category === category && e.type === 'expense' && expMonth === month;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <PageLayout title="Intelligent Budgeting" description="AI-enhanced limits and real-time category tracking.">
      
      {/* AI Insights Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-cyan-500/20 rounded-3xl p-6 mb-8 flex items-start gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-32 h-32 text-cyan-500" />
        </div>
        <div className="p-3 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 shrink-0">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground mb-1">AI Budget Analysis</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{aiInsight}</p>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Active Budgets</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Create Budget
        </button>
      </div>

      {/* Budget Cards Grid */}
      {budgets.length === 0 ? (
        <div className="bg-card/80 backdrop-blur-xl border border-border p-12 rounded-3xl text-center shadow-sm">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Budgets Yet</h3>
          <p className="text-muted-foreground mb-6">Create your first budget to start tracking your spending smartly.</p>
          <button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-colors">
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {budgets.map((budget, index) => {
              const spent = getSpentAmount(budget.category, budget.month);
              const percentage = Math.min((spent / budget.limit) * 100, 100);
              const isWarning = percentage >= budget.alertThreshold && percentage < 100;
              const isExceeded = percentage >= 100;
              
              let barColor = budget.color; // Normal
              if (isWarning) barColor = '#f59e0b'; // Amber warning
              if (isExceeded) barColor = '#ef4444'; // Red danger

              return (
                <motion.div 
                  key={budget._id}
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-card/90 backdrop-blur-xl border p-6 rounded-3xl shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 ${isExceeded ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-border hover:border-slate-700'}`}
                >
                  {isExceeded && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                    />
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center opacity-80" style={{ backgroundColor: `${budget.color}20`, color: budget.color }}>
                        <span className="font-bold text-lg">{budget.category.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground leading-tight">{budget.category}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          {isExceeded ? <AlertTriangle className="w-3 h-3 text-red-500" /> : isWarning ? <Info className="w-3 h-3 text-orange-500" /> : <CheckCircle className="w-3 h-3 text-green-500" />}
                          <span className={`text-xs font-medium ${isExceeded ? 'text-red-500' : isWarning ? 'text-orange-500' : 'text-green-500'}`}>
                            {isExceeded ? 'Over budget' : isWarning ? 'Near limit' : 'On track'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(budget)} className="p-1.5 text-slate-400 hover:text-cyan-500 bg-muted/50 hover:bg-muted rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(budget._id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-muted/50 hover:bg-muted rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-3xl font-extrabold text-foreground tracking-tight">₹{spent.toFixed(0)}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-1">spent of ₹{budget.limit}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${isExceeded ? 'text-red-500' : 'text-cyan-500'}`}>
                        {percentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full relative"
                      style={{ backgroundColor: barColor }}
                    >
                      {/* Glossy overlay on bar */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                    </motion.div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="text-foreground">₹{Math.max(budget.limit - spent, 0).toFixed(0)}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
                <h3 className="font-bold text-lg text-foreground">{isEditMode ? 'Edit Budget' : 'Create New Budget'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category Name</label>
                  <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Groceries, Entertainment" className="mt-1.5 w-full p-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner font-medium" />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Monthly Limit (₹)</label>
                  <input type="number" required min="1" value={formData.limit} onChange={e => setFormData({...formData, limit: e.target.value})} placeholder="5000" className="mt-1.5 w-full p-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner font-bold text-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Alert Threshold %</label>
                    <input type="number" required min="1" max="100" value={formData.alertThreshold} onChange={e => setFormData({...formData, alertThreshold: e.target.value})} className="mt-1.5 w-full p-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner font-medium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Theme Color</label>
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {COLORS.map(c => (
                        <button
                          key={c.value} type="button"
                          onClick={() => setFormData({...formData, color: c.value})}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${formData.color === c.value ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-110'}`}
                          style={{ backgroundColor: c.value }}
                          aria-label={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold flex justify-center items-center hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all">
                    {isEditMode ? 'Update Budget' : 'Save Budget'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </PageLayout>
  );
}
