import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import api from '../utils/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const COLORS = ['#4f46e5', '#c084fc', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get('/expenses').then(res => setExpenses(res.data)).catch(console.error);
  }, []);

  const expensesOnly = expenses.filter(e => e.type === 'expense');
  const incomeOnly = expenses.filter(e => e.type === 'income');
  
  const totalExpense = expensesOnly.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomeOnly.reduce((sum, e) => sum + e.amount, 0);
  const savings = totalIncome - totalExpense;

  // Category Data for Pie Chart
  const categoryData = expensesOnly.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) existing.value += curr.amount;
    else acc.push({ name: curr.category, value: curr.amount });
    return acc;
  }, []);

  // Monthly Data for Bar Chart
  const monthlyDataMap = expenses.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = { name: month, Income: 0, Expense: 0 };
    if (curr.type === 'income') acc[month].Income += curr.amount;
    else acc[month].Expense += curr.amount;
    return acc;
  }, {});
  const monthlyData = Object.values(monthlyDataMap);

  return (
    <PageLayout title="Analytics & Trends" description="Deep dive into your financial patterns and spending habits.">
      
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Income', val: totalIncome, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Total Expenses', val: totalExpense, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Net Savings', val: savings, icon: DollarSign, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { label: 'Avg Monthly', val: totalExpense / Math.max(1, monthlyData.length), icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-card/80 backdrop-blur-xl border border-border p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">₹{stat.val.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Income vs Expense Bar Chart */}
        <div className="bg-card/80 backdrop-blur-xl border border-border p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-xl mb-6">Income vs Expenses</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(val) => `₹${val}`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155' }} />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-card/80 backdrop-blur-xl border border-border p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-xl mb-6">Spending by Category</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Trend Line Chart */}
        <div className="bg-card/80 backdrop-blur-xl border border-border p-6 rounded-3xl shadow-sm lg:col-span-2">
          <h3 className="font-bold text-xl mb-6">Expense Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155' }} />
                <Line type="monotone" dataKey="Expense" stroke="#06b6d4" strokeWidth={4} dot={{r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#0F172A'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
