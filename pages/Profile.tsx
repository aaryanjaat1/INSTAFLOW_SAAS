
import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Key, 
  CreditCard, 
  Instagram, 
  Zap, 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Webhook, 
  Settings, 
  ChevronRight, 
  ExternalLink,
  Copy,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { PageType } from '../types';
import { UserProfile } from '../App';

interface ProfileProps {
  onNavigate: (page: PageType) => void;
  profile: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, profile }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText('if_sk_829384ndkjfs89234jknsdfk892');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const quickLinks = [
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'conversations' as PageType, label: 'Inbox', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 'automations' as PageType, label: 'Automations', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 'analytics' as PageType, label: 'Analytics', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'webhooks' as PageType, label: 'n8n Webhooks', icon: Webhook, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { id: 'settings' as PageType, label: 'Settings', icon: Settings, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-20 space-y-8">
      {/* Header Profile Card */}
      <div className="glass rounded-[3rem] p-10 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-blue-500 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <img 
              src={profile.avatar} 
              alt="Avatar" 
              className="relative w-40 h-40 rounded-[2.2rem] border-4 border-slate-900 object-cover shadow-2xl transition-transform group-hover:scale-[1.02]"
            />
            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-2xl shadow-xl border-4 border-slate-900">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-white">{profile.name}</h1>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">
                {profile.plan}
              </span>
            </div>
            <p className="text-slate-400 font-medium text-lg">{profile.email} • {profile.timezone.split(' - ')[1] || 'Global'}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-sm">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">Admin Privileges</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Verified Partner</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-48">
             <button onClick={() => onNavigate('settings')} className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-[1.5rem] font-bold text-sm transition-all border border-white/5">
                Edit Profile
             </button>
             <button className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 py-4 rounded-[1.5rem] font-bold text-sm transition-all border border-rose-500/10 flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API & Security */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">API Management</h3>
              </div>
              <button className="text-sm font-bold text-blue-400 hover:text-white transition-colors">Generate New Key</button>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Secret Key (sk_live_...)</label>
              <div className="relative group">
                <input 
                  type={showApiKey ? 'text' : 'password'} 
                  readOnly 
                  value="if_sk_829384ndkjfs89234jknsdfk892"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-4 pr-24 text-sm font-mono text-amber-200 focus:outline-none focus:border-amber-500/50 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button 
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={handleCopyKey}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    {copiedKey ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic">This key grants full access to your outbound automation triggers. Keep it secret!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Last Used</p>
                    <p className="text-sm font-bold">14 mins ago</p>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Environment</p>
                    <p className="text-sm font-bold">Production</p>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
            </div>
          </section>

          <section className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Connected Platforms</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Instagram Business', user: '@the_ai_revolution', status: 'Active', icon: Instagram, color: 'text-pink-500' },
                { name: 'Meta Business Suite', user: 'Flow Studio LLC', status: 'Verified', icon: Shield, color: 'text-blue-500' },
                { name: 'n8n Automation Cloud', user: 'instance-v1.local', status: 'Connected', icon: Webhook, color: 'text-purple-500' }
              ].map((platform, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${platform.color}`}>
                      <platform.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200">{platform.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{platform.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" />
                    {platform.status}
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => onNavigate('accounts')} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-blue-400 hover:text-white transition-colors group">
              Manage All Connections <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </section>
        </div>

        {/* Right Column: Usage & Navigation */}
        <div className="space-y-8">
          <section className="glass rounded-[2.5rem] p-8 border border-white/5 bg-gradient-to-br from-blue-600/5 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Plan & Billing</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-900/60 rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message Usage</span>
                  <span className="text-xs font-black text-blue-400">75% Used</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-500 text-center font-medium">Resetting in 12 days (Nov 24)</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Active Plan</span>
                  <span className="font-bold text-slate-200 underline cursor-pointer">{profile.plan}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Next Payment</span>
                  <span className="font-bold text-slate-200">$79.00</span>
                </div>
              </div>

              <button onClick={() => onNavigate('billing')} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-[1.5rem] font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Manage Billing
              </button>
            </div>
          </section>

          <section className="glass rounded-[2.5rem] p-8 border border-white/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               Quick Navigation
               <ChevronRight className="w-4 h-4 text-slate-600" />
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className={`w-10 h-10 rounded-2xl ${link.bg} ${link.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <link.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{link.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
