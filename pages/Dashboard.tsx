
import React from 'react';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Zap, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  // Added missing Sparkles import
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

const data = [
  { name: 'Mon', messages: 45, leads: 12 },
  { name: 'Tue', messages: 72, leads: 18 },
  { name: 'Wed', messages: 58, leads: 15 },
  { name: 'Thu', messages: 95, leads: 28 },
  { name: 'Fri', messages: 124, leads: 42 },
  { name: 'Sat', messages: 156, leads: 54 },
  { name: 'Sun', messages: 110, leads: 31 },
];

const StatCard = ({ icon: Icon, title, value, change, isPositive }: any) => (
  <div className="glass rounded-2xl p-6 transition-all duration-300 hover:glow-purple group">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {change}%
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold mt-1 tracking-tight">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back, Alex</h1>
        <p className="text-slate-400">Here's what's happening with your Instagram automation today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={MessageCircle} 
          title="Messages Handled" 
          value="1,284" 
          change="12.5" 
          isPositive={true} 
        />
        <StatCard 
          icon={Users} 
          title="Leads Captured" 
          value="452" 
          change="8.2" 
          isPositive={true} 
        />
        <StatCard 
          icon={TrendingUp} 
          title="Conversion Rate" 
          value="35.2%" 
          change="2.4" 
          isPositive={false} 
        />
        <StatCard 
          icon={Zap} 
          title="Automation Speed" 
          value="1.2s" 
          change="18.5" 
          isPositive={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold">Activity Overview</h2>
              <p className="text-sm text-slate-400">Message volume vs lead capture</p>
            </div>
            <select className="bg-slate-800 border-none rounded-lg px-3 py-1 text-sm focus:ring-1 focus:ring-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                  itemStyle={{color: '#f8fafc'}}
                />
                <Area type="monotone" dataKey="messages" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMessages)" strokeWidth={3} />
                <Area type="monotone" dataKey="leads" stroke="#a855f7" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Real-time Status</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">n8n Workflow: Webhook Active</p>
                <p className="text-xs text-slate-400">Response time: 450ms</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Meta API: Healthy</p>
                <p className="text-xs text-slate-400">Tokens valid for 52 days</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Daily Limit: 75% Used</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1">
                  <div className="bg-amber-400 h-1.5 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 relative overflow-hidden">
            <Sparkles className="absolute -right-2 -bottom-2 w-24 h-24 text-white/10 rotate-12" />
            <h3 className="text-white font-bold text-lg mb-2 relative z-10">Upgrade to Scale</h3>
            <p className="text-indigo-100 text-sm mb-4 relative z-10">Get unlimited AI responses and multi-account support.</p>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors relative z-10">
              Go Enterprise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
