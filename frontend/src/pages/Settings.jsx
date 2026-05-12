import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Bell, Moon, Globe, Bot, Shield, CreditCard } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushNotifications: false,
    darkMode: localStorage.getItem('theme') !== 'light',
    currency: 'INR (₹)',
    language: 'English',
    aiSuggestions: true
  });

  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <PageLayout title="Preferences" description="Customize your Finova AI experience.">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Appearance & Locale */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="font-bold text-lg flex items-center gap-2"><Globe className="text-cyan-500 w-5 h-5" /> Region & Display</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle application theme</p>
              </div>
              <Switch checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Default Currency</label>
                <select className="mt-1.5 w-full bg-background border border-input rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500/50">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Language</label>
                <select className="mt-1.5 w-full bg-background border border-input rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500/50">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* AI & Automation */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="font-bold text-lg flex items-center gap-2"><Bot className="text-purple-500 w-5 h-5" /> AI Features</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">Smart Insights</p>
                <p className="text-sm text-muted-foreground">Allow Finova AI to analyze patterns and suggest savings</p>
              </div>
              <Switch checked={settings.aiSuggestions} onChange={() => toggleSetting('aiSuggestions')} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="font-bold text-lg flex items-center gap-2"><Bell className="text-amber-500 w-5 h-5" /> Notifications</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">Email Alerts</p>
                <p className="text-sm text-muted-foreground">Receive weekly reports and budget warnings via email</p>
              </div>
              <Switch checked={settings.emailAlerts} onChange={() => toggleSetting('emailAlerts')} />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <div>
                <p className="font-bold text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive real-time alerts in your browser</p>
              </div>
              <Switch checked={settings.pushNotifications} onChange={() => toggleSetting('pushNotifications')} />
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-cyan-500' : 'bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}
