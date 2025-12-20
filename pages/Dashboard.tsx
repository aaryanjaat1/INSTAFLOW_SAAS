
import React, { useState, useEffect, useRef } from 'react';
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
  UserPlus
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

const StatCard = ({ icon: Icon, title, value, change, isPositive }: any) => (
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
  </div>
);

interface DashboardProps {
  onActionInProgress: () => void;
  navigate: (page: PageType) => void;
  activityLogs: ActivityLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ onActionInProgress, navigate, activityLogs }) => {
  const [localActivities, setLocalActivities] = useState<ActivityLog[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [newestId, setNewestId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with real activity logs
  useEffect(() => {
    setLocalActivities(prev => {
      // Merge unique activities
      const existingIds = new Set(prev.map(a => a.id));
      const newItems = activityLogs.filter(a => !existingIds.has(a.id));
      return [...newItems, ...prev].slice(0, 20);
    });
  }, [activityLogs]);

  // Organic Simulation Engine
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
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setNewestId(current => current === id ? null : current);
      }, 3000);

      // Random delay between 4s and 12s for natural feel
      const nextDelay = Math.floor(Math.random() * 8000) + 4000;
      simulationTimeout = setTimeout(generateEvent, nextDelay);
    };

    let simulationTimeout = setTimeout(generateEvent, 3000);

    return () => clearTimeout(simulationTimeout);
  }, [isPaused]);

  const getActionTarget = (type: ActivityLog['type']): PageType | null => {
    switch(type) {
      case 'message': return 'conversations';
      case 'trigger': return 'automations';
      case 'lead': return 'analytics';
      case 'mention': return 'automations';
      case 'update': return 'webhooks';
      default: return null;
    }
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Nexus Dashboard</h1>
          <p className="text-slate-400 text-sm md:text-lg">Intelligent monitoring for @the_ai_revolution.</p>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
           <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-3 shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] md:text-xs font-bold text-slate-300">Meta API Live</span>
           </div>
           <button 
            onClick={onActionInProgress}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2 shrink-0 text-sm"
           >
              <Zap className="w-4 h-4 fill-white" />
              Quick Deploy
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={MessageSquare} title="Conversations" value="4,821" change="12.5" isPositive={true} />
        <StatCard icon={Sparkles} title="AI Accuracy" value="98.2%" change="1.4" isPositive={true} />
        <StatCard icon={Users} title="Qualified Leads" value="892" change="22.1" isPositive={true} />
        <StatCard icon={Clock} title="Avg. Response" value="1.1s" change="5.2" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 glass rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 relative z-10 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Automation Velocity</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">Message volume vs lead conversion efficacy.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onActionInProgress} className="flex-1 sm:flex-none bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-[10px] md:text-xs font-bold hover:bg-slate-800 transition-colors">Daily</button>
              <button onClick={() => {}} className="flex-1 sm:flex-none bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-xs font-bold text-white shadow-lg">Weekly</button>
            </div>
          </div>
          <div className="h-[250px] md:h-[400px] w-full relative z-10 -ml-4 md:-ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px'}} />
                <Area type="monotone" dataKey="messages" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMessages)" strokeWidth={3} />
                <Area type="monotone" dataKey="leads" stroke="#a855f7" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-Time Activity Feed */}
        <div className="glass rounded-[2.5rem] md:rounded-[2.5rem] flex flex-col border border-white/10 overflow-hidden bg-slate-950/20">
          <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 relative">
                <Activity className="w-5 h-5" />
                {!isPaused && (
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                )}
              </div>
              <h2 className="text-lg md:text-xl font-bold">Activity Feed</h2>
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={() => setIsPaused(!isPaused)} 
                className={`p-2.5 rounded-xl transition-all ${isPaused ? 'bg-emerald-500/10 text-emerald-500' : 'hover:bg-white/5 text-slate-500'}`}
                title={isPaused ? "Resume Feed" : "Pause Feed"}
               >
                 {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
               </button>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4 max-h-[400px] lg:max-h-[500px]"
          >
            {localActivities.length > 0 ? (
              localActivities.map((item) => {
                const target = getActionTarget(item.type);
                const isNew = newestId === item.id;
                
                return (
                  <div 
                    key={item.id} 
                    className={`group flex gap-4 p-4 rounded-[1.5rem] transition-all duration-700 border ${
                      isNew 
                      ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)] scale-[1.02]' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                    } relative overflow-hidden animate-fade-in`}
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 border border-white/5 transition-transform group-hover:scale-110 ${item.color}`}>
                      <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="text-xs md:text-sm font-bold truncate text-slate-100">{item.event}</p>
                          {isNew && (
                            <span className="text-[8px] font-black bg-blue-500 text-white px-1.5 py-0.5 rounded-full animate-pulse shrink-0">NEW</span>
                          )}
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black text-slate-600 whitespace-nowrap uppercase tracking-tighter bg-slate-900 px-2 py-0.5 rounded-lg border border-white/5">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-500 truncate mt-1">{item.description}</p>
                      
                      <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         {target ? (
                           <button onClick={() => navigate(target)} className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-all">
                             Deep Link <ArrowUpRight className="w-3 h-3" />
                           </button>
                         ) : <div />}
                         <button onClick={onActionInProgress} className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-all">Report</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-600 opacity-50">
                 <RefreshCw className="w-10 h-10 mb-4 animate-spin-slow" />
                 <p className="text-sm font-bold uppercase tracking-widest">Awaiting Live Events...</p>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-slate-950/40 border-t border-white/5">
            <button 
              onClick={() => navigate('profile')} 
              className="w-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all py-3 flex items-center justify-center gap-2 group"
            >
              <History className="w-4 h-4" /> Comprehensive Audit Log <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
