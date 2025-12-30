
import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Unlink, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Plus, 
  Clock, 
  ShieldAlert, 
  Info, 
  Filter, 
  Activity, 
  X, 
  Lock, 
  BarChart3, 
  Settings as SettingsIcon, 
  Zap, 
  Key, 
  Database, 
  Loader2, 
  TrendingUp, 
  Fingerprint, 
  Globe, 
  Unlink2, 
  Calendar, 
  Layers, 
  Cpu,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  PartyPopper,
  ActivitySquare,
  ZapOff,
  Users,
  Timer,
  Activity as ActivityIcon,
  HardDrive
} from 'lucide-react';
import { supabase, signInWithMeta } from '../services/supabase';
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
  permissions?: string[];
  token_type?: string;
  sync_status?: 'success' | 'warning' | 'failed';
}

interface InstagramAccountsProps {
  session: any;
  onAuthRequired: () => void;
  onActionInProgress: () => void;
  navigate: (page: PageType) => void;
  addActivity: (event: string, description: string, type: any, icon: any, color: string) => void;
}

const REQUIRED_SCOPES = [
  'instagram_basic',
  'instagram_manage_messages',
  'instagram_manage_comments',
  'pages_show_list',
  'pages_read_engagement',
  'public_profile',
  'email'
];

const InstagramAccounts: React.FC<InstagramAccountsProps> = ({ session, onAuthRequired, onActionInProgress, navigate, addActivity }) => {
  const [step, setStep] = useState<'initial' | 'oauth_start' | 'select' | 'validating' | 'success' | 'error' | 'ready'>('ready');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<IGAccount[]>([]);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  // These would typically come from a Meta Graph API call /me/accounts after OAuth
  const [discoveredAccounts] = useState<IGAccount[]>([
    { 
      id: 'ig_9921', 
      username: 'official_fitness_pro', 
      followers: '8.2k', 
      avatar: 'https://picsum.photos/100/100?random=81', 
      status: 'pending', 
      lastSynced: 'Never', 
      permissions: REQUIRED_SCOPES 
    }
  ]);

  useEffect(() => {
    if (session) {
      fetchAccounts();
      
      // Check if we just returned from a successful Meta OAuth redirect
      const params = new URLSearchParams(window.location.hash.substring(1));
      if (params.get('access_token') || window.location.search.includes('code')) {
        setStep('select');
      }
    } else {
      setStep('ready');
      // Mock data for preview
      setAccounts([
        { 
          id: '1', 
          username: 'the_ai_revolution', 
          followers: '12.4k', 
          avatar: 'https://picsum.photos/160/160?random=50', 
          status: 'active', 
          lastSynced: '14m ago',
          token_health: 98,
          token_expiry: '2025-08-15',
          token_type: 'Long-lived',
          sync_status: 'success',
          permissions: REQUIRED_SCOPES
        }
      ]);
    }
  }, [session]);

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('instagram_accounts').select('*');
    if (!error && data) {
      setAccounts(data);
      if (data.length === 0 && step === 'ready') setStep('initial');
    }
    setLoading(false);
  };

  const handleStartOAuth = async () => {
    setLoading(true);
    try {
      // This function from supabase.ts opens the Meta Login window
      const { error } = await signInWithMeta();
      if (error) throw error;
      // The user is now redirected to Facebook
    } catch (err: any) {
      setErrorMessage(err.message || "Meta connection failed.");
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = async (account: IGAccount) => {
    setLoading(true);
    setStep('validating');
    
    try {
      // Simulation of fetching the Long-Lived User Token and Page Token
      await new Promise(r => setTimeout(r, 2000));

      const newAccount = {
        user_id: session.user.id,
        username: account.username,
        followers: account.followers,
        avatar: account.avatar,
        status: 'active' as const,
        lastSynced: 'Just now',
        token_health: 100,
        sync_status: 'success' as const,
        permissions: account.permissions 
      };
      
      const { error } = await supabase.from('instagram_accounts').insert([newAccount]);
      if (error) throw error;

      setStep('success');
      addActivity('Instagram Linked', `@${account.username} is now connected.`, 'update', ShieldCheck, 'text-emerald-400');
      fetchAccounts();
    } catch (err: any) {
      setErrorMessage("Could not save account to database.");
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-32">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Instagram Accounts</h1>
          <p className="text-slate-400 text-lg">Official Meta Graph API connections.</p>
        </div>
        {step === 'ready' && (
          <button 
            onClick={handleStartOAuth} 
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl active:scale-95"
          >
            <Facebook className="w-5 h-5 fill-white" /> Connect New Account
          </button>
        )}
      </div>

      {step === 'initial' && (
        <div className="glass rounded-[3.5rem] p-24 flex flex-col items-center text-center border-white/10">
          <div className="w-20 h-20 rounded-3xl bg-[#1877F2] flex items-center justify-center mb-8 shadow-2xl">
            <Instagram className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black mb-4">Connect your Business Profile</h2>
          <p className="text-slate-400 max-w-sm mb-12">Login with Facebook to authorize InstaFlow to manage your Instagram DMs and comments.</p>
          <button 
            onClick={handleStartOAuth} 
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-4 transition-all shadow-2xl active:scale-95 text-lg"
          >
            <Facebook className="w-6 h-6 fill-white" />
            Continue with Facebook
          </button>
        </div>
      )}

      {step === 'select' && (
        <div className="glass rounded-[3rem] overflow-hidden border border-white/10 max-w-2xl mx-auto">
          <div className="bg-[#1877F2] p-8 text-white">
            <h2 className="text-xl font-bold">Select Instagram Account</h2>
            <p className="text-sm opacity-80">Grant permission for these discovered accounts.</p>
          </div>
          <div className="p-8 space-y-4">
            {discoveredAccounts.map(acc => (
              <div key={acc.id} className="p-6 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-between group hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => handleSelectAccount(acc)}>
                <div className="flex items-center gap-4">
                  <img src={acc.avatar} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-white text-lg">@{acc.username}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{acc.followers} Followers</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'validating' && (
        <div className="flex flex-col items-center justify-center py-32 space-y-8">
           <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
           <p className="text-slate-400 font-bold uppercase tracking-[0.3em]">Validating Meta Token...</p>
        </div>
      )}

      {step === 'success' && (
        <div className="glass rounded-[3rem] p-20 text-center border-emerald-500/20 bg-emerald-500/5">
           <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
             <CheckCircle2 className="w-10 h-10 text-emerald-500" />
           </div>
           <h2 className="text-3xl font-black mb-4">Account Connected!</h2>
           <button onClick={() => setStep('ready')} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs">Return to Dashboard</button>
        </div>
      )}

      {step === 'ready' && accounts.map(account => (
        <div key={account.id} className="glass rounded-[2.5rem] p-8 border border-white/5 flex items-center gap-8 mb-6">
          <img src={account.avatar} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10" />
          <div className="flex-1">
            <h3 className="text-xl font-bold">@{account.username}</h3>
            <div className="flex gap-4 mt-2">
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Active</span>
              <span className="text-[10px] font-black uppercase text-slate-500">Last Sync: {account.lastSynced}</span>
            </div>
          </div>
          <button className="p-4 bg-slate-900 rounded-2xl text-slate-500 hover:text-rose-500 transition-colors border border-white/5">
            <Unlink className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default InstagramAccounts;
