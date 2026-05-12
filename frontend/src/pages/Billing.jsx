import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { CreditCard, Check, Sparkles, Download } from 'lucide-react';

export default function Billing() {
  return (
    <PageLayout title="Subscription & Billing" description="Manage your plan and payment methods.">
      <div className="max-w-5xl mx-auto">
        
        {/* Current Plan */}
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl p-1 shadow-2xl shadow-cyan-500/20 mb-10">
          <div className="bg-slate-900 rounded-[22px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Sparkles className="w-48 h-48 text-cyan-500" />
            </div>
            
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full mb-4">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Current Plan</span>
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
                Finova Pro <Sparkles className="text-cyan-400 w-6 h-6" />
              </h2>
              <p className="text-slate-400 font-medium">Unlock full AI Insights, unlimited OCR scans, and premium reports.</p>
            </div>

            <div className="text-center md:text-right shrink-0 relative z-10">
              <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Billed Annually</p>
              <h3 className="text-3xl font-extrabold text-white">₹999<span className="text-lg text-slate-500 font-medium">/mo</span></h3>
              <button className="mt-4 bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg">
                Manage Subscription
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Method */}
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><CreditCard className="text-cyan-500" /> Payment Method</h3>
            <div className="p-4 border border-border rounded-xl flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-800 rounded-md flex items-center justify-center border border-slate-700">
                  <span className="font-bold text-white text-xs italic">VISA</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <button className="text-sm font-bold text-cyan-500 hover:text-cyan-400 transition-colors">Edit</button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Billing History</h3>
            <div className="space-y-4">
              {[
                { date: 'Oct 01, 2023', amount: '₹11,988', status: 'Paid' },
                { date: 'Oct 01, 2022', amount: '₹11,988', status: 'Paid' },
              ].map((invoice, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-bold text-foreground">{invoice.date}</p>
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1 mt-0.5"><Check className="w-3 h-3"/> {invoice.status}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground">{invoice.amount}</span>
                    <button className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-slate-800 rounded-lg transition-colors"><Download className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
