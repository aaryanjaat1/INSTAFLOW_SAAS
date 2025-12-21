
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
  ShieldAlert,
  Sparkles,
  Lock,
  Instagram,
  Timer,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, ActivityLog } from '../App';

interface SettingsProps {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onActionInProgress: () => void;
  session: any;
  onAuthRequired: () => void;
  activityLogs: ActivityLog[];
}

const Settings: React.FC<SettingsProps> = ({ profile, onSave, onActionInProgress, session, onAuthRequired, activityLogs }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleSave = async () => {
    if (!session) {
      onAuthRequired();
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(formData);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div><h1 className="text-4xl font-bold mb-2 tracking-tight">Backend Configuration</h1><p className="text-slate-400 text-lg">Define the safety parameters your n8n nodes will pull.</p></div>
        <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-70 text-white">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Config'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Anti-Ban Safety Logic */}
        <section className="lg:col-span-2 glass rounded-[2.5rem] p-10 space-y-8 border border-white/10 relative overflow-hidden">
           <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Anti-Ban Engine</h2>
                <p className="text-xs text-slate-500">Inputs for "Random Delay Calculator" Node</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Min Jitter (sec)</label>
                    <span className="text-xs font-mono text-blue-400">10s</span>
                 </div>
                 <input type="range" className="w-full accent-blue-500" defaultValue="10" />
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Max Jitter (sec)</label>
                    <span className="text-xs font-mono text-blue-400">120s</span>
                 </div>
                 <input type="range" className="w-full accent-blue-500" defaultValue="120" />
              </div>
           </div>

           <div className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-slate-200">Anti-Ban Delay Algorithm</span>
                 </div>
                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-lg">Enabled</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                This setting feeds the "Dynamic Anti-Ban Delay" node in your n8n workflow. It prevents Meta from detecting automation patterns by varying response times.
              </p>
           </div>
        </section>

        {/* Working Hours Node Settings */}
        <section className="glass rounded-[2.5rem] p-10 border border-white/10 space-y-6">
           <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Global Safety</h2>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Automation Window</label>
                <div className="flex items-center gap-3">
                   <input type="time" defaultValue="09:00" className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none" />
                   <span className="text-slate-600 text-xs font-bold">TO</span>
                   <input type="time" defaultValue="21:00" className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none" />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Safety Mode Status</span>
                    <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                       <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                 </div>
                 <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter">
                   Handled by "Safety Mode Router" Node in n8n.
                 </p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
