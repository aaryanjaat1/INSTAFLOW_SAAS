
import React, { useState } from 'react';
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
  Database
} from 'lucide-react';

interface IGAccount {
  id: string;
  username: string;
  followers: string;
  avatar: string;
  status: 'active' | 'expired' | 'pending';
  lastSynced: string;
}

const InstagramAccounts: React.FC = () => {
  const [step, setStep] = useState<'initial' | 'oauth' | 'select' | 'ready'>('ready');
  const [selectedAccount, setSelectedAccount] = useState<IGAccount | null>(null);
  const [accounts, setAccounts] = useState<IGAccount[]>([
    {
      id: '1',
      username: 'the_ai_revolution',
      followers: '12.4k',
      avatar: 'https://picsum.photos/100/100?random=50',
      status: 'active',
      lastSynced: '2 mins ago'
    },
    {
      id: '4',
      username: 'expired_brand_account',
      followers: '1.2k',
      avatar: 'https://picsum.photos/100/100?random=55',
      status: 'expired',
      lastSynced: '14 days ago'
    }
  ]);

  const [discoveredAccounts] = useState<IGAccount[]>([
    { id: '2', username: 'tech_insights_daily', followers: '5.2k', avatar: 'https://picsum.photos/100/100?random=51', status: 'pending', lastSynced: 'Never' },
    { id: '3', username: 'creative_studio_ig', followers: '48.9k', avatar: 'https://picsum.photos/100/100?random=52', status: 'pending', lastSynced: 'Never' }
  ]);

  const handleStartOAuth = () => {
    setStep('oauth');
    setTimeout(() => {
      setStep('select');
    }, 1500);
  };

  const handleSelectAccount = (account: IGAccount) => {
    setAccounts([...accounts, { ...account, status: 'active', lastSynced: 'Just now' }]);
    setStep('ready');
  };

  const handleDisconnect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAccounts(accounts.filter(a => a.id !== id));
    if (accounts.length === 1) setStep('initial');
    setSelectedAccount(null);
  };

  const StatusBadge = ({ status, showPulse = true }: { status: IGAccount['status'], showPulse?: boolean }) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5">
            {showPulse && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
            <CheckCircle2 className={showPulse ? "hidden" : "w-3 h-3"} />
            Active
          </div>
        );
      case 'expired':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Action Required
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/5">
            <Clock className="w-3.5 h-3.5" />
            Verification Pending
          </div>
        );
    }
  };

  const getStatusBorder = (status: IGAccount['status']) => {
    switch (status) {
      case 'active': return 'border-emerald-500/20 hover:border-emerald-500/40';
      case 'expired': return 'border-rose-500/20 hover:border-rose-500/40';
      case 'pending': return 'border-amber-500/20 hover:border-amber-500/40';
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20">
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Instagram Accounts</h1>
          <p className="text-slate-400 text-lg">Manage official Meta connections and monitor automation health.</p>
        </div>
        
        {accounts.length > 0 && step === 'ready' && (
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex glass rounded-2xl p-1 px-4 items-center gap-6 border-white/5 h-[52px]">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{accounts.filter(a => a.status === 'active').length} Active</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{accounts.filter(a => a.status === 'expired').length} Issues</span>
                </div>
             </div>
             <button 
              onClick={handleStartOAuth}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> Connect New Account
            </button>
          </div>
        )}
      </div>

      {step === 'initial' && (
        <div className="glass rounded-[3.5rem] p-24 flex flex-col items-center text-center border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] -mr-32 -mt-32"></div>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center mb-10 shadow-2xl shadow-purple-500/30">
            <Instagram className="text-white w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Start your automation journey</h2>
          <p className="text-slate-400 max-w-lg mb-12 text-lg leading-relaxed">
            Link your first Instagram Business account to unlock human-like AI responses and seamless n8n automation.
          </p>
          <button 
            onClick={handleStartOAuth}
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-4 transition-all shadow-2xl shadow-blue-500/30 scale-110 active:scale-100"
          >
            <Facebook className="w-6 h-6 fill-white" />
            Continue with Meta
          </button>
          <div className="mt-12 flex items-center gap-4 text-slate-500">
             <ShieldCheck className="w-5 h-5 text-emerald-400" />
             <span className="text-sm font-medium">Official Meta Business Partner Application</span>
          </div>
        </div>
      )}

      {step === 'oauth' && (
        <div className="glass rounded-[3rem] p-32 flex flex-col items-center justify-center border-white/10 min-h-[500px]">
          <div className="relative mb-10 scale-125">
            <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <Facebook className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Authorizing...</h2>
          <p className="text-slate-500 max-w-sm text-center leading-relaxed">
            Please approve the connection in the secure Meta popup window to proceed.
          </p>
        </div>
      )}

      {step === 'select' && (
        <div className="animate-fade-in max-w-3xl mx-auto">
          <div className="glass rounded-[2.5rem] p-10 border-white/10 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold">Select Accounts</h2>
               <div className="flex items-center gap-2 text-slate-500">
                  <Info className="w-4 h-4" />
                  <span className="text-xs">Meta Business Suite</span>
               </div>
            </div>
            
            <div className="space-y-4">
              {discoveredAccounts.map(account => (
                <div key={account.id} className="glass-dark rounded-3xl p-6 flex items-center justify-between group hover:border-blue-500/50 transition-all cursor-pointer bg-slate-900/40" onClick={() => handleSelectAccount(account)}>
                  <div className="flex items-center gap-5">
                    <img src={account.avatar} className="w-16 h-16 rounded-2xl border-2 border-white/5 object-cover" alt={account.username} />
                    <div>
                      <h4 className="font-bold text-slate-100 text-lg">@{account.username}</h4>
                      <p className="text-xs text-slate-500 font-medium tracking-tight">Business Account • Ready to sync</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <StatusBadge status="pending" showPulse={false} />
                     <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg">
                       <Plus className="w-6 h-6" />
                     </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[11px] text-slate-500 max-w-[280px] leading-relaxed italic">
                Verified: Connection will expire after 60 days of inactivity.
              </p>
              <button onClick={() => setStep(accounts.length > 0 ? 'ready' : 'initial')} className="px-6 py-2 rounded-xl text-slate-400 hover:text-white font-bold transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {(step === 'ready' || accounts.length > 0) && step !== 'oauth' && step !== 'select' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            {accounts.map(account => (
              <div 
                key={account.id} 
                onClick={() => setSelectedAccount(account)}
                className={`glass rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 transition-all duration-500 border-2 ${getStatusBorder(account.status)} group cursor-pointer hover:bg-white/5`}
              >
                <div className="relative shrink-0">
                  <div className={`absolute -inset-4 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity ${
                    account.status === 'active' ? 'bg-emerald-500/10' : account.status === 'expired' ? 'bg-rose-500/10' : 'bg-amber-500/10'
                  }`}></div>
                  <img 
                    src={account.avatar} 
                    alt={account.username} 
                    className="relative w-28 h-28 rounded-3xl border-4 border-slate-900 object-cover shadow-2xl transition-transform group-hover:scale-105"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-4">
                    <h3 className="text-3xl font-bold tracking-tight text-white">@{account.username}</h3>
                    <StatusBadge status={account.status} />
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Followers</span>
                      <span className="font-bold text-slate-100 text-lg">{account.followers}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Last Synced</span>
                      <span className="font-bold text-slate-100 text-lg">{account.lastSynced}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                    {['DMs', 'Comments', 'Story Replies'].map(feat => (
                      <div key={feat} className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                        account.status === 'active' 
                        ? 'bg-emerald-500/5 text-emerald-500/80 border-emerald-500/10' 
                        : 'bg-slate-800 text-slate-500 border-white/5'
                      }`}>
                        {feat} {account.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-64">
                  {account.status === 'expired' ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStartOAuth(); }}
                      className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                      Re-authenticate
                    </button>
                  ) : (
                    <button className="w-full bg-slate-800/80 hover:bg-slate-700 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-white/5 group/btn">
                      <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-1000" />
                      Sync Profile
                    </button>
                  )}
                  <button 
                    onClick={(e) => handleDisconnect(account.id, e)}
                    className="w-full bg-slate-900/40 hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
                  >
                    <Unlink className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Account Detail Modal */}
          {selectedAccount && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
              <div 
                className="glass w-full max-w-3xl rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none"></div>

                <div className="p-8 sm:p-12 space-y-10">
                  {/* Modal Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                         <div className={`absolute -inset-2 blur-xl rounded-full opacity-40 ${selectedAccount.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                         <img src={selectedAccount.avatar} className="relative w-20 h-20 rounded-3xl border-2 border-white/10 shadow-xl" alt={selectedAccount.username} />
                      </div>
                      <div>
                         <h2 className="text-3xl font-bold text-white tracking-tight">@{selectedAccount.username}</h2>
                         <div className="flex items-center gap-3 mt-2">
                           <StatusBadge status={selectedAccount.status} />
                           <span className="text-xs text-slate-500 font-medium">Business ID: 192837465</span>
                         </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedAccount(null)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* API & Permission Status */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                         <Key className="w-5 h-5 text-blue-400" />
                         <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">API Intelligence</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all">
                           <div className="flex items-center gap-4">
                              <Lock className="w-5 h-5 text-slate-500" />
                              <span className="text-sm font-bold text-slate-200">Token Health</span>
                           </div>
                           <span className={`text-xs font-black uppercase ${selectedAccount.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {selectedAccount.status === 'active' ? '98.5% (Stable)' : 'EXPIRED'}
                           </span>
                        </div>
                        
                        <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
                           <div className="flex items-center gap-4 text-slate-200">
                              <ShieldCheck className="w-5 h-5 text-blue-400" />
                              <span className="text-sm font-bold">Scoped Permissions</span>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                              {['instagram_manage_messages', 'instagram_manage_comments', 'pages_show_list', 'ads_management'].map(scope => (
                                <div key={scope} className="flex items-center gap-2 text-[10px] text-slate-500 truncate">
                                   <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                   {scope}
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Usage Insights */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                         <Activity className="w-5 h-5 text-purple-400" />
                         <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Usage Insights</h3>
                      </div>
                      
                      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-6">
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-400 font-medium">Monthly Message Cap</span>
                               <span className="text-white font-bold">2,450 / 5,000</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                               <div className="w-[49%] h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">AI Replies</p>
                               <p className="text-xl font-black text-blue-400">1,248</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Leads</p>
                               <p className="text-xl font-black text-emerald-400">312</p>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Shortcuts */}
                  <div className="pt-8 border-t border-white/5">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 text-center">Quick Navigation</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                       <button className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all group">
                          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                             <BarChart3 className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Analytics</span>
                       </button>
                       <button className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all group">
                          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                             <SettingsIcon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Settings</span>
                       </button>
                       <button className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-white/10 transition-all group">
                          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                             <Zap className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Automate</span>
                       </button>
                       <button className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-rose-500/30 hover:bg-white/10 transition-all group">
                          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                             <Unlink className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Disconnect</span>
                       </button>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 bg-slate-900/80 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                     <Database className="w-5 h-5 text-slate-500" />
                     <p className="text-xs text-slate-500 font-medium">Meta Graph API v19.0 Instance</p>
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                     <button onClick={() => setSelectedAccount(null)} className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-slate-400 hover:text-white font-bold transition-colors">Close</button>
                     <button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white px-10 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Sync Everything
                     </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border-white/10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">API & Security Standards</h3>
                  <p className="text-sm text-slate-400 mt-1">Maintaining the highest security for your Instagram assets.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Verified OAuth 2.0</h4>
                   </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    InstaFlow connects via Meta's standard OAuth flow. We never handle or store your Instagram passwords.
                  </p>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Scoped Permissions</h4>
                   </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We only request the minimum permissions required for DM automation and comment management.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-[2.5rem] p-8 border-white/10 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-purple-600/5 to-transparent">
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-3">Health Monitoring</h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                  We continuously monitor API rate limits and token validity to ensure zero downtime for your automations.
                </p>
                <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
                   <Activity className="w-5 h-5 text-emerald-400" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase">99.9% API Stability</span>
                </div>
              </div>
              <button className="w-full mt-10 flex items-center justify-center gap-2 text-sm font-bold text-blue-400 hover:text-white transition-all group/link">
                View Health Logs
                <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </button>
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
