import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Edit2, Trash2, X, Loader2 } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food', type: 'expense', paymentMethod: 'Cash' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/expenses', { ...formData, amount: Number(formData.amount) });
      setExpenses([res.data, ...expenses]);
      setIsModalOpen(false);
      setFormData({ title: '', amount: '', category: 'Food', type: 'expense', paymentMethod: 'Cash' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Salary', 'Other'];

  return (
    <PageLayout title="Transactions" description="Manage and track your daily expenses and income.">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border text-foreground rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-card border border-border text-foreground rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Transaction
        </button>
      </div>

      {/* Transactions Table/List */}
      <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 font-semibold text-muted-foreground text-sm">Transaction</th>
                <th className="p-4 font-semibold text-muted-foreground text-sm">Category</th>
                <th className="p-4 font-semibold text-muted-foreground text-sm">Date</th>
                <th className="p-4 font-semibold text-muted-foreground text-sm">Amount</th>
                <th className="p-4 font-semibold text-muted-foreground text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-muted-foreground italic">No transactions found.</td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={expense._id} 
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${expense.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}>
                          {expense.type === 'income' ? '+' : '-'}
                        </div>
                        <span className="font-semibold text-foreground">{expense.title}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className={`p-4 font-bold ${expense.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                      ₹{expense.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-cyan-500 transition-colors rounded-lg hover:bg-slate-800"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(expense._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-800"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
                <h3 className="font-bold text-lg text-foreground">Add Transaction</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-muted-foreground hover:bg-muted rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="mt-1 w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Amount (₹)</label>
                    <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="mt-1 w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none">
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Method</label>
                    <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="mt-1 w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none">
                      <option>Cash</option>
                      <option>Card</option>
                      <option>Bank</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold flex justify-center items-center hover:opacity-90 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Transaction'}
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
