
import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  RefreshCw, 
  Unlink, 
  Plus, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle,
  Zap,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { supabase, signInWithMeta } from '../services/supabase';
import { finalizeInstagramConnection, verifyTokenHealth } from '../services/instagramService';
import { PageType } from '../types';

interface IGAccount {
  id: string;
  username: string;
  followers: string;
  avatar: string;
  status: 'active' | 'expired' | 'pending' | 'error';
  lastSynced: string;
  token_health?: number; 
  token_expiry?: string;
}

interface InstagramAccountsProps {
  session: any;
  onAuthRequired: () => void;
  onActionInProgress: () => void;
  navigate: (page: PageType) => void;
  addActivity: (event: string, description: string, type: any, icon: any, color: string) => void;
}

const InstagramAccounts: React.FC<InstagramAccountsProps> = ({ session, onAuthRequired, onActionInProgress, navigate, addActivity }) => {
  const [step, setStep] = useState<'ready' | 'loading' | 'error'>('ready');
  const [accounts, setAccounts] = useState<IGAccount[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (session) {
      fetchAccounts();
    }
  }, [session]);

  const fetchAccounts = async () => {
    setStep('loading');
    const { data, error } = await supabase.from('instagram_accounts').select('*');
    if (!error && data) setAccounts(data);
    setStep('ready');
  };

  const handleConnect = async () => {
    if (!session) return onAuthRequired();
    const { error } = await signInWithMeta();
    if (error) alert("Meta Auth Failed: " + error.message);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-32">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Connected Channels</h1>
          <p className="text-slate-400 text-lg">Manage official Meta Graph API tokens and subscriptions.</p>
        </div>
        <button 
          onClick={handleConnect}
          className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl active:scale-95"
        >
          <Facebook className="w-5 h-5 fill-white" /> Link New Business Page
        </button>
      </div>

      {step === 'loading' && (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {accounts.length > 0 ? accounts.map(account => (
          <div key={account.id} className="glass rounded-[2.5rem] p-8 border border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:bg-white/[0.04] transition-all">
            <div className="relative">
              <img src={account.avatar} className="w-20 h-20 rounded-[1.8rem] object-cover border-2 border-white/10" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#E4405F] flex items-center justify-center border-4 border-slate-900 shadow-xl">
                <Instagram className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">@{account.username}</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Subscribed & Active</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  Synced: {account.lastSynced}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Token Type: Page (Non-expiring)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={onActionInProgress}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Insights
              </button>
              <button className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 border border-rose-500/10 transition-all">
                <Unlink className="w-5 h-5" />
              </button>
            </div>
          </div>
        )) : step !== 'loading' && (
          <div className="glass rounded-[3rem] p-24 flex flex-col items-center text-center border-dashed border-white/10">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center mb-6 text-slate-600">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Accounts Linked</h3>
            <p className="text-slate-500 max-w-sm mb-8">Connect your Instagram Business account to start your first automation.</p>
            <button onClick={handleConnect} className="bg-blue-600 px-8 py-4 rounded-2xl font-bold text-white shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
              Initialize Meta Link
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-bold mb-1">Market Readiness Notice</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            All connections use the **Official Instagram Graph API**. To use this in production for non-developers, ensure your app is set to **"Live Mode"** and has completed Meta App Review for the `instagram_manage_messages` scope.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstagramAccounts;
