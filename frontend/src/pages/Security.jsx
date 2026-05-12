import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Shield, Key, Smartphone, AlertTriangle, Monitor, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Security() {
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  return (
    <PageLayout title="Security Center" description="Protect your financial data and manage active sessions.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Change Password */}
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg flex items-center gap-2"><Key className="text-indigo-500 w-5 h-5" /> Change Password</h3>
            </div>
            <form className="p-6 space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Password</label>
                <input type="password" value={passData.current} onChange={e => setPassData({...passData, current: e.target.value})} className="mt-1.5 w-full bg-background border border-input rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
                  <input type="password" value={passData.new} onChange={e => setPassData({...passData, new: e.target.value})} className="mt-1.5 w-full bg-background border border-input rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                  <input type="password" value={passData.confirm} onChange={e => setPassData({...passData, confirm: e.target.value})} className="mt-1.5 w-full bg-background border border-input rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button className="bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-colors">Update Password</button>
              </div>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg flex items-center gap-2"><Monitor className="text-cyan-500 w-5 h-5" /> Active Sessions</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-cyan-500/30 bg-cyan-500/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-300"><Monitor className="w-5 h-5"/></div>
                  <div>
                    <p className="font-bold text-foreground">Windows 11 • Chrome</p>
                    <p className="text-xs text-green-500 font-medium">Active now</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Current</span>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-300"><Smartphone className="w-5 h-5"/></div>
                  <div>
                    <p className="font-bold text-foreground">iPhone 14 Pro • Safari</p>
                    <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">Revoke</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 p-6 rounded-3xl">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">Two-Factor Auth</h3>
            <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account using an authenticator app.</p>
            <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors border border-slate-700">
              Enable 2FA
            </button>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold">Danger Zone</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated financial data. This cannot be undone.</p>
            <button className="text-sm font-bold text-red-500 hover:text-red-400 underline decoration-red-500/30 underline-offset-4">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
