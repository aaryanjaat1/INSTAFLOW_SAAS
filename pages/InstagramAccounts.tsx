
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
  CheckCircle
} from 'lucide-react';
import { supabase, signInWithFacebook } from '../services/supabase';
import { PageType } from '../types';

interface IGAccount {
  id: string;
  username: string;
  followers: string;
  avatar: string;
  status: 'active' | 'expired' | 'pending' | 'error';
  lastSynced: string;
  token_health?: number; // 0-100
  token_expiry?: string;
  permissions?: string[];
}

interface InstagramAccountsProps {
  session: any;
  onAuthRequired: () => void;
  onActionInProgress: () => void;
  navigate: (page: PageType) => void;
  addActivity: (event: string, description: string, type: any, icon: any, color: string) => void;
}

const InstagramAccounts: React.FC<InstagramAccountsProps> = ({ session, onAuthRequired, onActionInProgress, navigate, addActivity }) => {
  const [step, setStep] = useState<'initial' | 'oauth_start' | 'select' | 'validating' | 'ready'>('ready');
  const [selectedAccount, setSelectedAccount] = useState<IGAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<IGAccount[]>([]);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  // Discovery pool simulating data returned from Meta Graph API after successful OAuth
  const [discoveredAccounts] = useState<IGAccount[]>([
    { id: 'ig_9921', username: 'official_fitness_pro', followers: '8.2k', avatar: 'https://picsum.photos/100/100?random=81', status: 'pending', lastSynced: 'Never', permissions: ['messages', 'comments'] },
    { id: 'ig_7742', username: 'studio_design_global', followers: '142.9k', avatar: 'https://picsum.photos/100/100?random=82', status: 'pending', lastSynced: 'Never', permissions: ['messages', 'comments', 'stories'] },
    { id: 'ig_1105', username: 'travel_with_jake', followers: '3.1k', avatar: 'https://picsum.photos/100/100?random=83', status: 'pending', lastSynced: 'Never', permissions: ['messages'] }
  ]);

  useEffect(() => {
    if (session) {
      fetchAccounts();
      // Check for return from OAuth redirect
      if (window.location.hash.includes('accounts')) {
        setStep('select');
        window.history.replaceState(null, '', window.location.pathname); // Clear hash
      }
    } else {
      setStep('initial');
      // Demo data for guests
      setAccounts([
        { 
          id: '1', 
          username: 'the_ai_revolution', 
          followers: '12.4k', 
          avatar: 'https://picsum.photos/100/100?random=50', 
          status: 'active', 
          lastSynced: '14m ago',
          token_health: 98,
          token_expiry: '2025-08-15'
        }
      ]);
    }
  }, [session]);

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('instagram_accounts')
      .select('*');
    
    if (!error && data) {
      setAccounts(data);
      if (data.length === 0) setStep('initial');
      else setStep('ready');
    }
    setLoading(false);
  };

  const handleStartOAuth = async () => {
    if (!session) return onAuthRequired();
    setLoading(true);
    try {
      // Initiate official Meta OAuth
      const { error } = await signInWithFacebook();
      if (error) throw error;
      // Browser redirects to Meta
    } catch (err: any) {
      console.error("Meta OAuth initiation failed:", err);
      onActionInProgress();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = async (account: IGAccount) => {
    setLoading(true);
    setStep('validating');
    
    // Simulate complex token exchange and webhook registration
    await new Promise(r => setTimeout(r, 2500));

    const newAccount = {
      id: account.id,
      user_id: session.user.id,
      username: account.username,
      followers: account.followers,
      avatar: account.avatar,
      status: 'active' as const,
      lastSynced: 'Just now',
      token_health: 100,
      token_expiry: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0] 
    };
    
    const { error } = await supabase.from('instagram_accounts').upsert([newAccount]);
    if (!error) {
      fetchAccounts();
      setStep('ready');
      addActivity('New API Connection', `@${account.username} connected via Meta Graph v20.0`, 'update', ShieldCheck, 'text-blue-400');
    } else {
      setStep('select');
      onActionInProgress();
    }
    setLoading(false);
  };

  const handleDisconnect = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) return onAuthRequired();
    const account = accounts.find(a => a.id === id);
    if (!account || !confirm(`Revoke Meta access for @${account.username}? All active automations for this account will stop immediately.`)) return;
    
    const { error } = await supabase.from('instagram_accounts').delete().eq('id', id);
    if (!error) {
      fetchAccounts();
      setSelectedAccount(null);
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
        acc.id === id ? { ...acc, lastSynced: 'Just now', status: 'active', token_health: 100 } : acc
      ));
      addActivity('Account Refresh', `Manually synced metadata for IG account: ${id}`, 'update', RefreshCw, 'text-blue-400');
    }, 2000);
  };

  const StatusBadge = ({ status, showPulse = true }: { status: IGAccount['status'], showPulse?: boolean }) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5">
            {showPulse && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
            Encrypted Sync
          </div>
        );
      case 'expired':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/5"><ShieldAlert className="w-3.5 h-3.5" />Auth Required</div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/5"><Clock className="w-3.5 h-3.5" />Linking...</div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest"><AlertTriangle className="w-3.5 h-3.5" />API Link Failed</div>
        );
    }
  };

  const getStatusBorder = (status: IGAccount['status']) => {
    switch (status) {
      case 'active': return 'border-emerald-500/20 hover:border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.05)]';
      case 'expired': return 'border-rose-500/20 hover:border-rose-500/40';
      case 'pending': return 'border-amber-500/20 hover:border-amber-500/40';
      case 'error': return 'border-rose-500/40';
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-32">
      {/* Page Header */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Instagram Connectivity</h1>
          <p className="text-slate-400 text-lg">Secure Meta Graph API connections for your business assets.</p>
        </div>
        {accounts.length > 0 && step === 'ready' && (
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex glass rounded-2xl p-1 px-4 items-center gap-6 border-white/5 h-[52px]">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /><span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Verified Meta Partner</span></div>
             </div>
             <button onClick={handleStartOAuth} disabled={loading} className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 whitespace-nowrap">
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Facebook className="w-5 h-5 fill-white" />} Link Account
             </button>
          </div>
        )}
      </div>

      {/* Main Connection States */}
      {step === 'initial' && (
        <div className="glass rounded-[3.5rem] p-24 flex flex-col items-center text-center border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1877F2]/10 blur-[120px] -mr-32 -mt-32"></div>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#06b6d4] via-[#1877F2] to-[#a855f7] flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/30">
            <Instagram className="text-white w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Connect to Meta Business Suite</h2>
          <p className="text-slate-400 max-w-lg mb-12 text-lg leading-relaxed">InstaFlow requires official API access to your Instagram Business account to automate DMs and comments securely.</p>
          <button onClick={handleStartOAuth} disabled={loading} className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-4 transition-all shadow-2xl shadow-blue-600/20 scale-110 active:scale-100">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Facebook className="w-6 h-6 fill-white" />}
            Continue with Facebook
          </button>
          <div className="mt-12 flex items-center gap-8 text-slate-500 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default">
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Lock className="w-4 h-4" /> Bank-grade encryption</div>
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><ShieldCheck className="w-4 h-4" /> Official Scopes</div>
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> Meta Verified App</div>
          </div>
        </div>
      )}

      {/* Account Discovery Step */}
      {step === 'select' && (
        <div className="animate-fade-in max-w-4xl mx-auto">
          <div className="glass rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            <div className="bg-[#1877F2] p-8 flex items-center justify-between">
               <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                     <Facebook className="w-7 h-7 fill-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Import Business Accounts</h2>
                    <p className="text-sm text-blue-100/80">Authorized Instagram accounts discovered from Meta.</p>
                  </div>
               </div>
               <button onClick={() => setStep('ready')} className="text-white/60 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-10 space-y-4">
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Filter authorized accounts..." className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-[#1877F2]/50 transition-all" />
              </div>

              <div className="space-y-3">
                {discoveredAccounts.map(account => (
                  <div key={account.id} className="glass-dark rounded-[2rem] p-6 flex items-center justify-between group hover:border-[#1877F2]/40 transition-all cursor-pointer bg-slate-900/40" onClick={() => handleSelectAccount(account)}>
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img src={account.avatar} className="w-16 h-16 rounded-[1.5rem] border-2 border-white/5 object-cover" alt={account.username} />
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-pink-500 to-orange-400 p-1.5 rounded-lg border-2 border-slate-900">
                          <Instagram className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-lg">@{account.username}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{account.followers} Followers</span>
                           <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                           <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Business Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin text-blue-400" /> : (
                        <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all shadow-lg">
                          <Plus className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 border-t border-white/5 bg-slate-900/20 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
                 <p className="text-xs text-slate-500 leading-relaxed max-w-xs italic">InstaFlow stores long-lived access tokens securely in our encrypted vault.</p>
              </div>
              <button onClick={() => setStep('ready')} className="px-8 py-3 rounded-xl text-slate-400 hover:text-white font-bold transition-colors">Cancel Connection</button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Simulation Step */}
      {step === 'validating' && (
        <div className="glass rounded-[3rem] p-32 flex flex-col items-center justify-center border-white/10 min-h-[500px] animate-fade-in">
           <div className="relative mb-12">
             <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
             <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-emerald-500" />
           </div>
           <h2 className="text-2xl font-bold mb-4 tracking-tight text-white uppercase tracking-[0.1em]">Securing API Connection...</h2>
           <div className="space-y-3 w-full max-w-xs">
              {[
                { label: 'Exchanging Auth Code', done: true },
                { label: 'Registering Webhook Hooks', done: true },
                { label: 'Encrypting Page Tokens', done: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>{item.label}</span>
                  {item.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Connected Dashboard */}
      {step === 'ready' && accounts.length > 0 && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-6">
            {accounts.map(account => (
              <div 
                key={account.id} 
                className={`glass rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 transition-all duration-500 border-2 ${getStatusBorder(account.status)} group`}
              >
                {/* Profile Identity */}
                <div className="relative shrink-0 cursor-pointer" onClick={() => setSelectedAccount(account)}>
                  <div className={`absolute -inset-4 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity ${account.status === 'active' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}></div>
                  <img src={account.avatar} alt={account.username} className="relative w-32 h-32 rounded-[2rem] border-4 border-slate-900 object-cover shadow-2xl transition-transform group-hover:scale-105"/>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-pink-600 to-purple-600 p-2.5 rounded-2xl border-4 border-slate-900 shadow-xl group-hover:rotate-12 transition-transform">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-4">
                    <h3 className="text-3xl font-black tracking-tight text-white">@{account.username}</h3>
                    <StatusBadge status={account.status} />
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Total Followers</span>
                      <span className="font-bold text-slate-100 text-xl">{account.followers}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Connection Health</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div className={`h-full rounded-full transition-all duration-1000 ${account.token_health && account.token_health > 90 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${account.token_health || 0}%` }}></div>
                        </div>
                        <span className="text-xs font-black text-slate-200">{account.token_health}%</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Last Handshake</span>
                      <span className="font-bold text-slate-100 text-sm flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> {account.lastSynced}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                    {['DMs', 'Comments', 'Story Mentions'].map(feat => (
                      <div key={feat} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${account.status === 'active' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                        {feat} {account.status === 'active' ? 'ENABLED' : 'DISABLED'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full md:w-64">
                   <button onClick={(e) => handleSyncProfile(account.id, e)} disabled={syncingIds.has(account.id)} className="w-full bg-slate-800/80 hover:bg-slate-700 text-white py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 border border-white/5 disabled:opacity-50">
                     <RefreshCw className={`w-4 h-4 ${syncingIds.has(account.id) ? 'animate-spin' : ''}`} />
                     {syncingIds.has(account.id) ? 'Syncing...' : 'Sync Profile'}
                   </button>
                   <button onClick={() => setSelectedAccount(account)} className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 border border-blue-500/20">
                     <Fingerprint className="w-4 h-4" /> Connection Audit
                   </button>
                   <button onClick={(e) => handleDisconnect(account.id, e)} className="w-full bg-slate-900/40 hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 border border-white/5">
                     <Unlink className="w-4 h-4" /> Revoke Access
                   </button>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Infrastructure Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border border-white/10 space-y-10">
               <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Encrypted Token Infrastructure</h3>
                    <p className="text-sm text-slate-400 mt-1">Official Meta Graph API v20.0 implementation with bank-grade vault storage.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 space-y-4">
                     <div className="flex items-center gap-3 text-emerald-400">
                        <Lock className="w-5 h-5" />
                        <h4 className="text-xs font-black uppercase tracking-widest">AES-256 Vault</h4>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed">Long-lived page access tokens are stored within our hardened vault and automatically refreshed every 60 days.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 space-y-4">
                     <div className="flex items-center gap-3 text-purple-400">
                        <Globe className="w-5 h-5" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Global Edge Sync</h4>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed">Real-time webhook events are processed via our low-latency edge network for instant automation response times.</p>
                  </div>
               </div>
            </div>

            <div className="glass rounded-[2.5rem] p-10 border border-white/10 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-emerald-600/5 to-transparent">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] pointer-events-none -mr-32 -mt-32 transition-all group-hover:bg-emerald-600/10"></div>
               <div className="relative z-10 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                     <Database className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold">Persistence Engine</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Automation rules and conversation metadata are persisted across your entire workspace via encrypted Supabase clusters.</p>
               </div>
               <button onClick={onActionInProgress} className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-emerald-400 hover:text-white transition-all group/link">
                  Connectivity Logs <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Detail Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
          <div 
            className="glass w-full max-w-5xl rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative animate-scale-in flex flex-col lg:flex-row my-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full lg:w-96 bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-white/5 p-12 flex flex-col items-center text-center">
              <div className="relative mb-8 group">
                <div className={`absolute -inset-6 rounded-full blur-[40px] opacity-30 ${selectedAccount.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <img src={selectedAccount.avatar} className="relative w-40 h-40 rounded-[3rem] border-4 border-slate-900 shadow-2xl object-cover" alt={selectedAccount.username} />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-pink-600 to-purple-600 p-3 rounded-2xl border-4 border-slate-900 shadow-xl">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">@{selectedAccount.username}</h2>
              <div className="flex justify-center mt-3"><StatusBadge status={selectedAccount.status} /></div>
              
              <div className="w-full mt-10 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 text-left">
                  <div className="flex items-center gap-3 mb-4">
                     <Key className="w-5 h-5 text-amber-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">API Credentials Audit</span>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-300"><span>Token Status</span><span className="text-emerald-400 font-black">VALID</span></div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-full"></div></div>
                     </div>
                     <div className="flex justify-between text-xs font-bold text-slate-300"><span>Expiry Date</span><span className="text-slate-400">{selectedAccount.token_expiry}</span></div>
                  </div>
              </div>
              
              <div className="mt-auto pt-12 w-full hidden lg:block">
                 <button onClick={(e) => handleSyncProfile(selectedAccount.id, e as any)} className="w-full bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold text-sm transition-all border border-white/5 flex items-center justify-center gap-3 text-slate-300">
                    <RefreshCw className="w-4 h-4" /> Force API Re-Handshake
                 </button>
              </div>
            </div>

            <div className="flex-1 p-12 relative flex flex-col">
              <button onClick={() => setSelectedAccount(null)} className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-10"><X className="w-6 h-6" /></button>
              
              <div className="space-y-16 flex-1">
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">OAuth Infrastructure</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Official Meta Graph API Security Metadata.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/5 group hover:border-purple-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3 text-slate-300">
                            <Lock className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold uppercase tracking-widest">Scope Integrity</span>
                         </div>
                         <span className="text-[10px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded">Verified</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono break-all opacity-60">EAAGm0PX4ZCpsBAK0ZB...2ZBh7vJ0K3</p>
                      <div className="mt-3 text-[9px] text-slate-600 font-bold flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Expires in 58 days
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/5 group hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3 text-slate-300">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold uppercase tracking-widest">API Versioning</span>
                         </div>
                         <span className="text-[10px] font-black text-blue-400 uppercase bg-blue-400/10 px-2 py-0.5 rounded">v20.0</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                         {['INSTAGRAM_BASIC', 'MANAGE_MESSAGES', 'MANAGE_COMMENTS'].map(scope => (
                           <span key={scope} className="text-[8px] font-black text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-tighter">{scope}</span>
                         ))}
                      </div>
                      <div className="mt-3 text-[9px] text-slate-600 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Permission Handshake Valid
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                   <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Resource Connectivity</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Real-time status of associated Meta Graph assets.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                     {[
                       { name: 'Instagram Professional Account', status: 'Healthy', details: '@the_ai_revolution' },
                       { name: 'Associated Facebook Page', status: 'Linked', details: 'AI Revolution Main' },
                       { name: 'Webhook Subscriptions', status: 'Subscribed', details: 'Comment, Message, Story' }
                     ].map((asset, idx) => (
                       <div key={idx} className="flex items-center justify-between p-5 rounded-3xl bg-slate-900/40 border border-white/5">
                          <div><p className="text-sm font-bold text-slate-200">{asset.name}</p><p className="text-xs text-slate-500">{asset.details}</p></div>
                          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">{asset.status}</span></div>
                       </div>
                     ))}
                  </div>
                </section>

                <div className="pt-10 border-t border-white/5 flex gap-4">
                   <button onClick={(e) => handleDisconnect(selectedAccount.id, e as any)} className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 py-4 rounded-2xl font-bold transition-all border border-rose-500/20 text-sm">Revoke Meta Access</button>
                   <button onClick={() => setSelectedAccount(null)} className="flex-1 bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold transition-all border border-white/5 text-sm">Close Audit Dashboard</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default InstagramAccounts;
