
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Zap, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  MessageSquare,
  Clock,
  Cpu,
  ChevronRight,
  MousePointer2,
  Bell,
  CheckCircle2,
  Instagram,
  Pause,
  Play,
  History,
  ShieldCheck,
  RefreshCw,
  HandMetal,
  Webhook as WebhookIcon,
  Search,
  MessageCircleQuestion,
  UserPlus,
  LogIn,
  Loader2,
  Unlink,
  Target,
  ShieldAlert
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { PageType } from '../types';
import { ActivityLog } from '../App';
import { syncAccountData, IGAccountStats } from '../services/syncService';
import { supabase } from '../services/supabase';

const chartData = [
  { name: 'Mon', messages: 45, leads: 12 },
  { name: 'Tue', messages: 72, leads: 18 },
  { name: 'Wed', messages: 58, leads: 15 },
  { name: 'Thu', messages: 95, leads: 28 },
  { name: 'Fri', messages: 124, leads: 42 },
  { name: 'Sat', messages: 156, leads: 54 },
  { name: 'Sun', messages: 110, leads: 31 },
];

const eventPool: Array<Omit<ActivityLog, 'id' | 'timestamp'>> = [
  { event: 'AI Response', description: 'AI replied to @creative_mind', type: 'message', icon: MessageSquare, color: 'text-blue-400' },
  { event: 'Trigger Match', description: 'Keyword "discount" matched', type: 'trigger', icon: Zap, color: 'text-amber-400' },
  { event: 'Lead Captured', description: 'New prospect: @marketing_pro', type: 'lead', icon: UserPlus, color: 'text-emerald-400' },
  { event: 'Story Mention', description: 'Handled story tag from @user_99', type: 'mention', icon: Instagram, color: 'text-pink-400' },
  { event: 'Hand-off Request', description: 'User requested human support', type: 'system', icon: MessageCircleQuestion, color: 'text-rose-400' },
  { event: 'Webhook Handshake', description: 'Successful ping from n8n backend', type: 'update', icon: WebhookIcon, color: 'text-purple-400' },
  { event: 'Security Audit', description: 'Account access token refreshed', type: 'security', icon: ShieldCheck, color: 'text-slate-400' },
];

const StatCard = ({ icon: Icon, title, value, change, isPositive, subtitle }: any) => (
  <div className="glass rounded-[2rem] p-6 transition-all duration-500 hover:glow-purple group border border-white/5 hover:bg-white/[0.05] cursor-default">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600/10 transition-all border border-white/10 group-hover:border-blue-500/30">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</h3>
    <p className="text-2xl md:text-3xl font-black mt-2 tracking-tighter text-white">{value}</p>
    {subtitle && <p className="text-[10px] text-slate-600 font-bold uppercase mt-2 tracking-widest">{subtitle}</p>}
  </div>
);

interface DashboardProps {
  onAuthRequired: () => void;
  onActionInProgress: () => void;
  navigate: (page: PageType) => void;
  activityLogs: ActivityLog[];
  session: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onAuthRequired, onActionInProgress, navigate, activityLogs, session }) => {
  const [localActivities, setLocalActivities] = useState<ActivityLog[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newestId, setNewestId] = useState<string | null>(null);
  const [liveStats, setLiveStats] = useState<IGAccountStats | null>(null);
  const [syncError, setSyncError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const triggerLiveSync = useCallback(async () => {
    if (!session) return onAuthRequired();
    setIsSyncing(true);
    setSyncError(false);
    
    try {
      const { data: profile } = await supabase.from('profiles').select('n8n_url').eq('id', session.user.id).single();
      
      if (profile?.n8n_url) {
        const stats = await syncAccountData('primary_account', profile.n8n_url);
        if (stats) {
          setLiveStats(stats);
          onActionInProgress();
        } else {
          setSyncError(true);
        }
      } else {
        navigate('webhooks');
      }
    } catch (e) {
      setSyncError(true);
    } finally {
      setIsSyncing(false);
    }
  }, [session, onAuthRequired, onActionInProgress, navigate]);

  useEffect(() => {
    setLocalActivities(prev => {
      const existingIds = new Set(prev.map(a => a.id));
      const newItems = activityLogs.filter(a => !existingIds.has(a.id));
      return [...newItems, ...prev].slice(0, 20);
    });
  }, [activityLogs]);

  useEffect(() => {
    if (isPaused) return;

    const generateEvent = () => {
      const randomEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
      const id = `sim-${Date.now()}`;
      const newActivity: ActivityLog = {
        id,
        event: randomEvent.event,
        description: randomEvent.description,
        type: randomEvent.type,
        icon: randomEvent.icon,
        color: randomEvent.color,
        timestamp: 'Just now'
      };

      setNewestId(id);
      setLocalActivities(prev => [newActivity, ...prev].slice(0, 15));
      
      setTimeout(() => {
        setNewestId(current => current === id ? null : current);
      }, 3000);

      const nextDelay = Math.floor(Math.random() * 8000) + 4000;
      simulationTimeout = setTimeout(generateEvent, nextDelay);
    };

    let simulationTimeout = setTimeout(generateEvent, 3000);
    return () => clearTimeout(simulationTimeout);
  }, [isPaused]);

  return (
    <div className="space-y-8 md:space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Nexus Dashboard</h1>
            {session && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Production Ready</span>
              </div>
            )}
          </div>
          <p className="text-slate-400 text-sm md:text-lg">{session ? 'Intelligent monitoring for your workspace.' : 'Sign in to start automating your growth.'}</p>
        </div>
        <div className="flex items-center gap-3">
           {!session ? (
             <button 
              onClick={onAuthRequired}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2 text-sm"
             >
                <LogIn className="w-4 h-4" />
                Sign In to Platform
             </button>
           ) : (
             <>
               <button 
                onClick={triggerLiveSync}
                disabled={isSyncing}
                className={`px-6 py-3 rounded-2xl bg-slate-900 border flex items-center gap-3 transition-all hover:bg-slate-800 ${isSyncing ? 'border-blue-500/50' : syncError ? 'border-rose-500/50' : 'border-white/5'}`}
               >
                  {isSyncing ? <Loader2 className="w-4 h-4 text-blue-400 animate-spin" /> : <RefreshCw className={`w-4 h-4 ${syncError ? 'text-rose-400' : 'text-emerald-400'}`} />}
                  <div className="flex flex-col items-start leading-none">
                     <span className="text-[10px] md:text-xs font-bold text-slate-100">{isSyncing ? 'Handshaking n8n...' : syncError ? 'Sync Failed' : 'Fetch Meta Stats'}</span>
                     <span className="text-[8px] font-black uppercase text-slate-500 tracking-tighter mt-1">{syncError ? 'Check Webhook URL' : 'Real-time Fetch'}</span>
                  </div>
               </button>
               <button 
                onClick={() => navigate('webhooks')}
                className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2 text-sm"
               >
                  <WebhookIcon className="w-4 h-4" />
                  Connect Backend
               </button>
             </>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={MessageSquare} title="Conversations" value={liveStats ? liveStats.reach.toLocaleString() : (session ? "4,821" : "---")} change="12.5" isPositive={true} subtitle={liveStats ? `Last Sync: ${liveStats.last_updated}` : null} />
        <StatCard icon={Target} title="Lead Quality Score" value={liveStats ? `${liveStats.lead_score_avg}/100` : (session ? "82/100" : "---")} change="4.1" isPositive={true} subtitle="Calculated by n8n Logic" />
        <StatCard icon={Users} title="Audience" value={liveStats ? liveStats.followers.toLocaleString() : (session ? "12.4k" : "---")} change="2.1" isPositive={true} subtitle="Official Meta Data" />
        <StatCard icon={Zap} title="Engagement Rate" value={liveStats ? liveStats.engagement_rate : (session ? "4.2%" : "---")} change="5.2" isPositive={true} subtitle="Interaction Intensity" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 glass rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 relative z-10 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Engagement Pulse</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">Real-time visualization of Meta Graph data provided by n8n.</p>
            </div>
            {session && (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 rounded-xl border border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    {isSyncing ? 'Syncing Backend' : 'Signature Gate Verified'}
                  </span>
               </div>
            )}
          </div>
          <div className="h-[250px] md:h-[400px] w-full relative z-10 -ml-4 md:-ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px'}} />
                <Area type="monotone" dataKey="messages" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMessages)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] md:rounded-[2.5rem] flex flex-col border border-white/10 overflow-hidden bg-slate-950/20">
          <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 relative">
                <Activity className="w-5 h-5" />
                {session && !isPaused && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>}
              </div>
              <h2 className="text-lg md:text-xl font-bold">Inbound Flow Logs</h2>
            </div>
            {session && (
              <button onClick={() => setIsPaused(!isPaused)} className={`p-2.5 rounded-xl transition-all ${isPaused ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-white/5 text-slate-500'}`}>
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4 max-h-[400px] lg:max-h-[500px]">
            {session ? localActivities.map((item) => (
              <div key={item.id} className={`group flex gap-4 p-4 rounded-[1.5rem] transition-all duration-700 border ${newestId === item.id ? 'bg-blue-600/10 border-blue-500/40' : 'bg-white/[0.02] border-white/5'} relative animate-fade-in`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 border border-white/5 ${item.color}`}><item.icon className="w-5 h-5 md:w-6 md:h-6" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs md:text-sm font-bold truncate text-slate-100">{item.event}</p>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-tighter bg-slate-900 px-2 py-0.5 rounded-lg">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] md:text-xs text-slate-500 truncate mt-1 font-medium">{item.description}</p>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 py-10 opacity-50">
                 <ShieldCheck className="w-12 h-12 mb-4" />
                 <p className="text-xs font-black uppercase tracking-widest">Sign in to view live logs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
