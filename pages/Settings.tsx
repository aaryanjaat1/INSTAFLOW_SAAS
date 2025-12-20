
import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Clock, 
  Zap, 
  Save, 
  Camera,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Loader2,
  History,
  LogIn,
  Link,
  Settings as SettingsIcon,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { UserProfile } from '../App';

interface SettingsProps {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

interface ActivityLog {
  id: string;
  event: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
}

const Settings: React.FC<SettingsProps> = ({ profile, onSave }) => {
  const [showToken, setShowToken] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activityLogs] = useState<ActivityLog[]>([
    { id: '1', event: 'Profile Updated', description: 'User changed full name and email address.', timestamp: 'Just now', icon: User, color: 'text-blue-400' },
    { id: '2', event: 'New Connection', description: 'Instagram Business account @the_ai_revolution linked.', timestamp: '2 hours ago', icon: Link, color: 'text-emerald-400' },
    { id: '3', event: 'Security Login', description: 'Login from new device: Chrome on MacOS (192.168.1.1)', timestamp: '5 hours ago', icon: LogIn, color: 'text-purple-400' },
    { id: '4', event: 'API Key Rotated', description: 'The personal API access token was refreshed.', timestamp: 'Yesterday, 4:12 PM', icon: Shield, color: 'text-amber-400' },
    { id: '5', event: 'Settings Changed', description: 'Automation "Human-in-the-loop" was enabled.', timestamp: 'Oct 24, 2023', icon: SettingsIcon, color: 'text-slate-400' },
    { id: '6', event: 'Failed Login', description: 'Unsuccessful login attempt from unknown IP.', timestamp: 'Oct 22, 2023', icon: ShieldAlert, color: 'text-rose-400' },
  ]);

  // Sync state if external profile changes
  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(formData);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto pb-20 relative">
      {/* Toast Success Notification */}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[100] animate-fade-in">
           <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl shadow-emerald-500/20 border border-white/10">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-bold">Settings saved successfully!</span>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Platform Settings</h1>
          <p className="text-slate-400 text-lg">Manage your profile, platform limits, and security preferences.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl text-slate-400 hover:text-white transition-colors font-bold disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <section className="glass rounded-[2.5rem] p-8 space-y-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Profile Information</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
            <div className="absolute -inset-1.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-60 transition-opacity"></div>
            <img 
              src={formData.avatar} 
              alt="Avatar" 
              className="relative w-36 h-36 rounded-[2.2rem] border-4 border-slate-900 object-cover shadow-2xl transition-transform group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.2rem] flex items-center justify-center text-white backdrop-blur-sm border border-white/10">
              <Camera className="w-8 h-8" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all focus:bg-slate-900 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all focus:bg-slate-900 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Timezone</label>
              <select 
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all focus:bg-slate-900 focus:border-blue-500/50 appearance-none"
              >
                <option>Pacific Time (PT) - Los Angeles</option>
                <option>Eastern Time (ET) - New York</option>
                <option>Central European Time (CET) - Berlin</option>
                <option>GMT+0 - London</option>
                <option>IST - Mumbai</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Account Activity Log Section */}
      <section className="glass rounded-[2.5rem] p-8 space-y-8 border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <History className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Account Activity Log</h2>
          </div>
          <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors">View All Logs</button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {activityLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
              <div className={`w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 border border-white/5 ${log.color} group-hover:scale-105 transition-transform`}>
                <log.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-bold text-slate-100">{log.event}</h4>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{log.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 truncate">{log.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </section>

      {/* Automation Behavior Section */}
      <section className="glass rounded-[2.5rem] p-8 space-y-8 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Automation Behavior</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900/40 border border-white/5 group">
              <div>
                <p className="font-bold text-slate-200">Human-in-the-loop</p>
                <p className="text-xs text-slate-500 mt-1">Flag complex queries for manual review instead of AI.</p>
              </div>
              <button className="w-14 h-7 rounded-full bg-blue-600 relative transition-all shadow-xl">
                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg"></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900/40 border border-white/5">
              <div>
                <p className="font-bold text-slate-200">Rate Limiting</p>
                <p className="text-xs text-slate-500 mt-1">Max messages sent per hour to prevent shadowbans.</p>
              </div>
              <input 
                type="number" 
                defaultValue="30" 
                className="w-24 bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-center outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="space-y-4 p-6 rounded-3xl bg-slate-900/40 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <p className="font-bold text-slate-200">Working Hours</p>
            </div>
            <div className="flex items-center gap-4">
              <input type="time" defaultValue="09:00" className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl py-3.5 px-4 text-sm outline-none focus:border-blue-500/50" />
              <span className="text-slate-500 font-bold">to</span>
              <input type="time" defaultValue="18:00" className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl py-3.5 px-4 text-sm outline-none focus:border-blue-500/50" />
            </div>
            <p className="text-[10px] text-slate-500 italic mt-2">AI will only reply during these hours. Off-hours replies will be queued.</p>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="glass rounded-[2.5rem] p-8 space-y-6 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Security & API Access</h2>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Personal API Access Token</label>
          <div className="relative group">
            <input 
              type={showToken ? 'text' : 'password'} 
              value="if_sk_829384ndkjfs89234jknsdfk892" 
              readOnly 
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4.5 px-6 pr-14 text-sm font-mono focus:outline-none focus:border-blue-500/30 text-blue-300"
            />
            <button 
              onClick={() => setShowToken(!showToken)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl px-1">Use this token to authenticate your own scripts or internal n8n nodes. Never share this with anyone or commit it to a repository.</p>
        </div>
      </section>

      <div className="flex items-center justify-between border-t border-white/10 pt-10">
        <div className="flex items-center gap-3 text-slate-500">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-medium">Enterprise Grade Security Enabled</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleCancel}
            disabled={isSaving}
            className="px-8 py-4 rounded-[1.5rem] text-slate-400 hover:text-white transition-colors font-bold disabled:opacity-50"
          >
            Cancel Changes
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 px-10 py-4 rounded-[1.5rem] font-bold hover:bg-blue-500 transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Saving Changes...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
