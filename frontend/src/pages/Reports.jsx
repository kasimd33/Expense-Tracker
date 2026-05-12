import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import api from '../utils/api';
import { Download, FileText, Calendar } from 'lucide-react';

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/expenses').then(res => {
      setExpenses(res.data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const totalIncome = expenses.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Title', 'Category', 'Type', 'Method', 'Amount'];
    const rows = expenses.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.title,
      e.category,
      e.type,
      e.paymentMethod,
      e.amount
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finova_financial_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageLayout title="Financial Reports" description="Generate and download your monthly summaries.">
      
      <div className="flex justify-end mb-6 gap-4">
        <button className="bg-card border border-border text-foreground px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-muted transition-all shadow-sm">
          <Calendar className="w-5 h-5" /> This Month
        </button>
        <button 
          onClick={handleDownloadCSV}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:opacity-90 transition-all"
        >
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-10 pb-10 border-b border-border">
          <FileText className="w-16 h-16 mx-auto mb-4 text-primary opacity-80" />
          <h2 className="text-3xl font-extrabold text-foreground">Finova AI Report</h2>
          <p className="text-muted-foreground mt-2">Summary for the current period</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
            <p className="text-green-500 font-bold uppercase tracking-wider text-sm mb-2">Total Inflow</p>
            <p className="text-4xl font-extrabold text-foreground">₹{totalIncome.toFixed(2)}</p>
          </div>
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <p className="text-red-500 font-bold uppercase tracking-wider text-sm mb-2">Total Outflow</p>
            <p className="text-4xl font-extrabold text-foreground">₹{totalExpense.toFixed(2)}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-border text-muted-foreground">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-3 px-4 text-sm">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{e.title}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{e.category}</td>
                  <td className={`py-3 px-4 text-right font-bold ${e.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {e.type === 'income' ? '+' : '-'}₹{e.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </PageLayout>
  );
}
