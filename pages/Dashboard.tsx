
import React, { useState, useEffect } from 'react';
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
  History
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

const chartData = [
  { name: 'Mon', messages: 45, leads: 12 },
  { name: 'Tue', messages: 72, leads: 18 },
  { name: 'Wed', messages: 58, leads: 15 },
  { name: 'Thu', messages: 95, leads: 28 },
  { name: 'Fri', messages: 124, leads: 42 },
  { name: 'Sat', messages: 156, leads: 54 },
  { name: 'Sun', messages: 110, leads: 31 },
];

interface ActivityItem {
  id: number;
  type: 'message' | 'trigger' | 'lead' | 'system' | 'mention' | 'comment';
  text: string;
  sub: string;
  time: string;
  icon: any;
  color: string;
  actionLabel?: string;
}

const initialActivities: ActivityItem[] = [
  { id: 1, type: 'message', text: 'AI replied to @julia_art', sub: 'Course inquiry handled', time: 'Just now', icon: MessageSquare, color: 'text-blue-400', actionLabel: 'View Chat' },
  { id: 2, type: 'trigger', text: 'Keyword "price" detected', sub: 'Automation: Sales Flow v2', time: '2m ago', icon: Zap, color: 'text-amber-400', actionLabel: 'Debug' },
  { id: 3, type: 'lead', text: 'New lead captured', sub: '@tech_guru verified', time: '15m ago', icon: Users, color: 'text-emerald-400', actionLabel: 'View Profile' },
  { id: 4, type: 'system', text: 'AI Model Optimized', sub: 'Latency reduced to 1.1s', time: '1h ago', icon: Cpu, color: 'text-purple-400' },
];

const eventPool: Array<Omit<ActivityItem, 'id' | 'time'>> = [
  { text: 'AI replied to @creative_mind', sub: 'General inquiry resolved', type: 'message', icon: MessageSquare, color: 'text-blue-400', actionLabel: 'View Chat' },
  { text: 'Keyword "discount" matched', sub: 'Promotion code sent via DM', type: 'trigger', icon: Zap, color: 'text-amber-400', actionLabel: 'Debug' },
  { text: 'New lead: @marketing_pro', sub: 'High engagement score (9.2)', type: 'lead', icon: Users, color: 'text-emerald-400', actionLabel: 'View Profile' },
  { text: 'Automation: Story Mention', sub: 'Auto-reply sent to 3 users', type: 'mention', icon: Instagram, color: 'text-pink-400', actionLabel: 'View Story' },
  { text: 'New Comment Handled', sub: '@user99: "Send info!"', type: 'comment', icon: MessageCircle, color: 'text-blue-500', actionLabel: 'View Post' },
  { text: 'AI detected high intent', sub: 'Escalating @buyer_now to Priority', type: 'system', icon: Sparkles, color: 'text-purple-400', actionLabel: 'Take Over' },
];

const StatCard = ({ icon: Icon, title, value, change, isPositive }: any) => (
  <div className="glass rounded-3xl p-6 transition-all duration-500 hover:glow-purple group border border-white/5 hover:bg-white/[0.05] cursor-default">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600/10 transition-all border border-white/10 group-hover:border-blue-500/30">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">{title}</h3>
    <p className="text-3xl font-black mt-2 tracking-tighter text-white">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const randomEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
      const newActivity: ActivityItem = {
        id: Date.now(),
        ...randomEvent,
        time: 'Just now'
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev.map(a => ({
          ...a,
          time: a.time === 'Just now' ? '1m ago' : (a.time === '1m ago' ? '2m ago' : a.time)
        }))];
        return updated.slice(0, 10);
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Nexus Dashboard</h1>
          <p className="text-slate-400 text-lg">Central nervous system for your Instagram automation.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-300">Live Sync Active</span>
           </div>
           <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2">
              <Zap className="w-4 h-4 fill-white" />
              Quick Deploy
           </button>
        </div>
      </div>

      {/* Row 1: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={MessageSquare} 
          title="Total Conversations" 
          value="4,821" 
          change="12.5" 
          isPositive={true} 
        />
        <StatCard 
          icon={Sparkles} 
          title="AI Accuracy" 
          value="98.2%" 
          change="1.4" 
          isPositive={true} 
        />
        <StatCard 
          icon={Users} 
          title="Qualified Leads" 
          value="892" 
          change="22.1" 
          isPositive={true} 
        />
        <StatCard 
          icon={Clock} 
          title="Avg. Response" 
          value="1.1s" 
          change="5.2" 
          isPositive={true} 
        />
      </div>

      {/* Row 2: Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000"></div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h2 className="text-2xl font-bold">Automation Performance</h2>
              <p className="text-sm text-slate-500 mt-1">Real-time engagement and lead generation metrics.</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold hover:bg-slate-800 transition-colors">Daily</button>
              <button className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg">Weekly</button>
            </div>
          </div>
          
          <div className="h-[400px] w-full relative z-10 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}
                  itemStyle={{fontSize: '11px', fontWeight: 800, padding: '2px 0'}}
                />
                <Area type="monotone" dataKey="messages" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMessages)" strokeWidth={4} />
                <Area type="monotone" dataKey="leads" stroke="#a855f7" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="glass rounded-[2.5rem] flex flex-col border border-white/10 overflow-hidden bg-slate-950/20">
          <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold">Activity Feed</h2>
            </div>
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="p-2.5 rounded-xl hover:bg-white/5 text-slate-500 transition-all active:scale-90"
              title={isPaused ? "Resume Stream" : "Pause Stream"}
            >
              {isPaused ? <Play className="w-4 h-4 fill-emerald-500 text-emerald-500" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 max-h-[500px]">
            {activities.map((item) => (
              <div 
                key={item.id} 
                className="group flex gap-4 p-4 rounded-3xl hover:bg-white/[0.04] transition-all duration-500 border border-transparent hover:border-white/5 relative overflow-hidden animate-fade-in"
              >
                <div className={`w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 border border-white/5 transition-transform group-hover:scale-110 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold truncate text-slate-100">{item.text}</p>
                    <span className="text-[10px] font-black text-slate-600 whitespace-nowrap uppercase tracking-tighter bg-slate-900 px-2 py-0.5 rounded-lg border border-white/5">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-1">{item.sub}</p>
                  
                  {item.actionLabel && (
                    <button className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-400 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0">
                      {item.actionLabel}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-950/40 border-t border-white/5">
            <button className="w-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all py-3 flex items-center justify-center gap-2 group">
              <History className="w-4 h-4" />
              Full Audit History
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Insights & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Activity className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="text-xl font-bold">Inbound Efficiency</h3>
                  <p className="text-sm text-slate-500">Node throughput and latency.</p>
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                     <span>AI Logic Success</span>
                     <span className="text-emerald-400">99.4%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                     <div className="w-[99.4%] h-full bg-emerald-500"></div>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                     <span>n8n Webhook Latency</span>
                     <span className="text-blue-400">142ms</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                     <div className="w-[15%] h-full bg-blue-500"></div>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-[2rem] bg-slate-900/40 border border-white/5">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Engagement Peaks</h4>
            <div className="space-y-5">
              {[
                { label: 'Prime Time', value: '8:00 PM - 11:00 PM', trend: '+14%' },
                { label: 'Hot Keyword', value: '#pricing', trend: 'Trending' },
                { label: 'Story Completion', value: '84%', trend: 'High' },
              ].map((insight, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">{insight.label}</p>
                    <p className="font-bold text-slate-200">{insight.value}</p>
                  </div>
                  <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {insight.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-10 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none -mr-32 -mt-32 transition-all group-hover:bg-purple-600/20"></div>
           
           <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/20 group-hover:rotate-6 transition-transform">
                 <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Scaling Required?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                You've handled 750 messages this week. You're approaching your Pro limit. Upgrade for unlimited throughput and multi-agent training.
              </p>
           </div>
           
           <button className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-2xl relative z-10 mt-10">
              View Plans & Limits
           </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
