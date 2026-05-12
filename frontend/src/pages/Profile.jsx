import React, { useContext, useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Camera, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API Call for updating profile
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <PageLayout title="My Profile" description="Manage your personal information and account settings.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card/80 backdrop-blur-xl border border-border p-8 rounded-3xl text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20"></div>
            
            <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 p-1 mt-8 shadow-xl shadow-cyan-500/20 group cursor-pointer">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-4xl text-white uppercase relative overflow-hidden">
                {user?.name ? user.name.charAt(0) : 'J'}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <h3 className="mt-4 text-xl font-bold text-foreground">{user?.name || 'Finova User'}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            
            <div className="mt-6 flex justify-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-wide">Pro Member</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
              </span>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-xl border border-border p-6 rounded-3xl shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Account Statistics</h4>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-slate-300">Total Expenses Tracked</span>
              <span className="font-bold text-foreground">342</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-slate-300">Active Budgets</span>
              <span className="font-bold text-foreground">5</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-300">Account Created</span>
              <span className="font-bold text-foreground">Oct 2023</span>
            </div>
          </div>
        </div>

        {/* Right Col: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg flex items-center gap-2"><User className="text-cyan-500 w-5 h-5" /> Personal Information</h3>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-cyan-500/50 outline-none font-medium transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-cyan-500/50 outline-none font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end items-center gap-4">
                {saved && (
                  <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-green-500 text-sm font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Changes saved
                  </motion.span>
                )}
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
