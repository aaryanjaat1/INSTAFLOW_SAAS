
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
  const [selectedAccount, setSelectedAccount] = useState<IGAccount | null>(null);
  const [linkedAccount, setLinkedAccount] = useState<IGAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<IGAccount[]>([]);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  const [discoveredAccounts] = useState<IGAccount[]>([
    { 
      id: 'ig_9921', 
      username: 'official_fitness_pro', 
      followers: '8.2k', 
      avatar: 'https://picsum.photos/100/100?random=81', 
      status: 'pending', 
      lastSynced: 'Never', 
      permissions: REQUIRED_SCOPES 
    },
    { 
      id: 'ig_7742', 
      username: 'studio_design_global', 
      followers: '142.9k', 
      avatar: 'https://picsum.photos/100/100?random=82', 
      status: 'pending', 
      lastSynced: 'Never', 
      permissions: REQUIRED_SCOPES 
    }
  ]);

  useEffect(() => {
    if (session) {
      fetchAccounts();
      if (window.location.hash.includes('accounts')) {
        setStep('select');
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      setStep('ready');
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
        },
        { 
          id: '2', 
          username: 'creative_insights', 
          followers: '4.8k', 
          avatar: 'https://picsum.photos/160/160?random=51', 
          status: 'error', 
          lastSynced: '3d ago',
          token_health: 12,
          token_expiry: '2024-12-01',
          token_type: 'Expired',
          sync_status: 'failed',
          permissions: REQUIRED_SCOPES
        }
      ]);
    }
  }, [session]);

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('instagram_accounts').select('*');
    if (!error && data) {
      // Mock augmenting data if it's from Supabase for this UI demo
      const augmented = data.map(acc => ({
        ...acc,
        token_health: acc.token_health || 100,
        token_type: acc.token_type || 'Long-lived',
        sync_status: acc.sync_status || 'success'
      }));
      setAccounts(augmented);
      if (data.length === 0 && step !== 'select') setStep('initial');
      else if (step !== 'select' && step !== 'validating' && step !== 'success' && step !== 'error') setStep('ready');
    }
    setLoading(false);
  };

  const handleStartOAuth = async () => {
    if (!session) return onAuthRequired();
    setLoading(true);
    try {
      const { error } = await signInWithMeta();
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to connect to Meta. Please check your project configuration.");
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = async (account: IGAccount) => {
    setLoading(true);
    setStep('validating');
    setErrorMessage(null);
    
    try {
      await new Promise(r => setTimeout(r, 1500)); // Mock validation steps
      await new Promise(r => setTimeout(r, 1200));
      await new Promise(r => setTimeout(r, 1000));

      const newAccount = {
        id: account.id,
        user_id: session.user.id,
        username: account.username,
        followers: account.followers,
        avatar: account.avatar,
        status: 'active' as const,
        lastSynced: 'Just now',
        token_health: 100,
        token_type: 'Long-lived',
        sync_status: 'success' as const,
        token_expiry: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
        permissions: account.permissions 
      };
      
      const { error } = await supabase.from('instagram_accounts').upsert([newAccount]);
      if (error) throw error;

      setLinkedAccount(newAccount);
      setStep('success');
      addActivity('New API Connection', `@${account.username} connected via Meta Graph v20.0`, 'update', ShieldCheck, 'text-blue-400');
      fetchAccounts();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while validating your Meta token. Please ensure all permissions are granted.");
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) return onAuthRequired();
    const account = accounts.find(a => a.id === id);
    if (!account || !confirm(`Revoke Meta access for @${account.username}?`)) return;
    
    const { error } = await supabase.from('instagram_accounts').delete().eq('id', id);
    if (!error) {
      fetchAccounts();
      addActivity('Token Revoked', `@${account.username} access token was invalidated.`, 'update', Unlink2, 'text-rose-400');
    }
  };

  const handleSyncProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSyncingIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setAccounts(prev => prev.map(acc => 
        acc.id === id ? { ...acc, lastSynced: 'Just now', status: 'active', token_health: 100, sync_status: 'success' } : acc
      ));
      addActivity('Manual Sync', `Account data refreshed for @${accounts.find(a => a.id === id)?.username}.`, 'update', RefreshCw, 'text-emerald-400');
    }, 2500);
  };

  const getHealthLabel = (health?: number) => {
    if (health === undefined) return 'Unknown';
    if (health > 90) return 'Optimal';
    if (health > 70) return 'Good';
    if (health > 40) return 'Warning';
    return 'Critical';
  };

  const StatusBadge = ({ status, syncStatus }: { status: IGAccount['status'], syncStatus?: IGAccount['sync_status'] }) => {
    const isActive = status === 'active';
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border transition-all ${
        isActive && syncStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
        syncStatus === 'failed' || status === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 
        syncStatus === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
        'bg-slate-800 border-white/5 text-slate-500'
      }`}>
        {isActive && syncStatus === 'success' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
        {status === 'active' && syncStatus === 'success' ? 'API Active' : 
         status === 'error' ? 'Auth Failure' : 
         syncStatus === 'failed' ? 'Sync Error' : 
         status.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-32">
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Instagram Connectivity</h1>
          <p className="text-slate-400 text-lg">Manage official Meta Graph API handshakes and synchronization health.</p>
        </div>
        {accounts.length > 0 && step === 'ready' && (
          <button onClick={handleStartOAuth} disabled={loading} className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 whitespace-nowrap">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Facebook className="w-5 h-5 fill-white" />} Link Account
          </button>
        )}
      </div>

      {step === 'initial' && (
        <div className="glass rounded-[3.5rem] p-24 flex flex-col items-center text-center border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1877F2]/10 blur-[120px] -mr-32 -mt-32"></div>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#06b6d4] via-[#1877F2] to-[#a855f7] flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/30">
            <Instagram className="text-white w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Connect to Meta Business Suite</h2>
          <p className="text-slate-400 max-w-lg mb-12 text-lg leading-relaxed text-balance">InstaFlow requires official API access to your Instagram Business account to automate DMs and comments securely.</p>
          <button onClick={handleStartOAuth} disabled={loading} className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-4 transition-all shadow-2xl shadow-blue-600/20 scale-110 active:scale-100">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Facebook className="w-6 h-6 fill-white" />}
            Continue with Facebook
          </button>
        </div>
      )}

      {step === 'select' && (
        <div className="animate-fade-in max-w-4xl mx-auto">
          <div className="glass rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-[#1877F2] p-8 flex items-center justify-between">
               <div className="flex items-center gap-4 text-white">
                  <Facebook className="w-8 h-8 fill-white" />
                  <div>
                    <h2 className="text-xl font-bold">Import Accounts</h2>
                    <p className="text-sm text-blue-100/80">Discovered Business Profiles from Meta</p>
                  </div>
               </div>
               <button onClick={() => setStep('ready')} className="text-white/60 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-10 space-y-3">
              {discoveredAccounts.map(account => (
                <div key={account.id} className="glass-dark rounded-[2rem] p-6 flex items-center justify-between group hover:border-[#1877F2]/40 transition-all cursor-pointer bg-slate-900/40" onClick={() => handleSelectAccount(account)}>
                  <div className="flex items-center gap-5">
                    <img src={account.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover border-2 border-white/5" alt={account.username} />
                    <div>
                      <h4 className="font-bold text-slate-100 text-lg">@{account.username}</h4>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{account.followers} Followers</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                    <Plus className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'validating' && (
        <div className="glass rounded-[3rem] p-32 flex flex-col items-center justify-center border-white/10 min-h-[500px] animate-fade-in">
           <div className="relative mb-12">
             <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
             <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-emerald-500" />
           </div>
           <h2 className="text-2xl font-bold mb-8 tracking-tight text-white uppercase tracking-[0.1em]">Securing Handshake</h2>
           <div className="space-y-4 w-full max-w-xs">
              {['Token Exchange', 'Webhook Hooks', 'Encryption'].map((label, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>{label}</span>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                </div>
              ))}
           </div>
        </div>
      )}

      {step === 'success' && linkedAccount && (
        <div className="glass rounded-[3rem] p-20 flex flex-col items-center justify-center border-emerald-500/30 bg-emerald-500/5 text-center animate-fade-in">
           <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/20">
             <PartyPopper className="w-12 h-12 text-emerald-500" />
           </div>
           <h2 className="text-4xl font-black text-white mb-4">Connection Secure!</h2>
           <p className="text-slate-400 max-w-md mb-12 leading-relaxed">
             Successfully linked <strong>@{linkedAccount.username}</strong> to your workspace. Your automations are now active.
           </p>
           <div className="flex gap-4">
              <button onClick={() => setStep('ready')} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-95">Go to Accounts</button>
              <button onClick={() => navigate('automations')} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-600/20 transition-all active:scale-95">Set Automations</button>
           </div>
        </div>
      )}

      {step === 'ready' && accounts.length > 0 && (
        <div className="space-y-8">
          {accounts.map(account => {
            const isSyncing = syncingIds.has(account.id);
            return (
              <div key={account.id} className="glass rounded-[2.5rem] p-8 flex flex-col xl:flex-row items-stretch xl:items-center gap-8 transition-all duration-500 border-2 border-white/5 hover:border-blue-500/20 group shadow-xl relative overflow-hidden">
                {account.status === 'error' && (
                  <div className="absolute inset-0 bg-rose-500/5 pointer-events-none"></div>
                )}
                
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 xl:w-1/3">
                  <div className="relative shrink-0">
                    <img src={account.avatar} alt={account.username} className="w-28 h-28 rounded-[1.8rem] border-4 border-slate-900 object-cover shadow-2xl"/>
                    <div className={`absolute -bottom-1 -right-1 p-2 rounded-xl border-2 border-slate-900 shadow-xl ${account.status === 'error' ? 'bg-rose-600' : 'bg-[#1877F2]'}`}>
                      {account.status === 'error' ? <ZapOff className="w-4 h-4 text-white" /> : <Instagram className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-2xl font-black tracking-tight text-white">@{account.username}</h3>
                      <StatusBadge status={account.status} syncStatus={account.sync_status} />
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{account.followers}</span>
                      </div>
                      <div className="w-px h-3 bg-white/10"></div>
                      <button onClick={onActionInProgress} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                        View Profile <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Metrics Mid-section */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 bg-slate-900/40 p-6 rounded-[2rem] border border-white/5">
                  {/* Token Health */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black flex items-center gap-2">
                        <Fingerprint className="w-3 h-3" /> API Integrity
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                        account.token_type === 'Expired' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {account.token_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            (account.token_health || 0) > 80 ? 'bg-emerald-500' : 
                            (account.token_health || 0) > 40 ? 'bg-amber-500' : 'bg-rose-500'
                          }`} 
                          style={{ width: `${account.token_health || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-slate-100">{account.token_health || 0}%</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                      Health Status: <span className={(account.token_health || 0) > 40 ? 'text-slate-300' : 'text-rose-400'}>{getHealthLabel(account.token_health)}</span>
                    </p>
                  </div>

                  {/* Sync Status */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black flex items-center gap-2">
                      <ActivityIcon className={`w-3 h-3 ${isSyncing ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} /> Sync Lifecycle
                    </span>
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className={`font-bold text-sm transition-colors ${isSyncing ? 'text-blue-400' : 'text-slate-100'}`}>
                            {isSyncing ? 'Refreshing Engine...' : account.lastSynced}
                          </span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Last Successful Push</span>
                       </div>
                       <div className="text-right">
                          <span className="text-xs font-black text-slate-300 flex items-center gap-1 justify-end">
                            <Timer className="w-3 h-3" /> 24h
                          </span>
                          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">99.9% Uptime</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-row xl:flex-col gap-3 shrink-0">
                  <button 
                    onClick={(e) => handleSyncProfile(account.id, e)} 
                    disabled={isSyncing} 
                    className={`flex-1 xl:w-56 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 border border-white/5 active:scale-95 disabled:opacity-50 ${
                      account.status === 'error' 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20'
                    }`}
                  >
                    {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isSyncing ? 'Syncing...' : account.status === 'error' ? 'Restore Connection' : 'Sync Account'}
                  </button>
                  <button onClick={(e) => handleDisconnect(account.id, e)} className="p-4 xl:w-full bg-slate-900/40 hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 border border-white/5 active:scale-95 group/del">
                    <Unlink className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                    <span className="hidden xl:inline">Revoke Access</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Global Metadata Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass rounded-3xl p-6 border border-white/5 flex items-center gap-5">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><Shield className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Auth</p>
               <h4 className="text-lg font-bold text-slate-100">Meta Verified</h4>
            </div>
         </div>
         <div className="glass rounded-3xl p-6 border border-white/5 flex items-center gap-5">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><HardDrive className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Residency</p>
               <h4 className="text-lg font-bold text-slate-100">AES-256 Vault</h4>
            </div>
         </div>
         <div className="glass rounded-3xl p-6 border border-white/5 flex items-center gap-5">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><Lock className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">API Status</p>
               <h4 className="text-lg font-bold text-slate-100">Graph v20.0</h4>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InstagramAccounts;
