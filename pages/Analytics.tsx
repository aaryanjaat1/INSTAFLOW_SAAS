
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  Filter, 
  Calendar, 
  ChevronDown, 
  Instagram, 
  Zap, 
  MessageSquare, 
  Hash, 
  Camera,
  RefreshCw,
  Search,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Users,
  // Added CheckCircle2 import
  CheckCircle2
} from 'lucide-react';

interface AnalyticsProps {
  onActionInProgress: () => void;
}

const conversionData = [
  { name: 'Initial Contact', value: 1200, color: '#3b82f6' },
  { name: 'AI Response', value: 1150, color: '#a855f7' },
  { name: 'Engagement', value: 850, color: '#ec4899' },
  { name: 'Link Click', value: 420, color: '#06b6d4' },
  { name: 'Conversion', value: 210, color: '#10b981' },
];

const keywordData = [
  { word: 'Price', count: 450 },
  { word: 'How to', count: 380 },
  { word: 'Start', count: 310 },
  { word: 'Course', count: 290 },
  { word: 'Join', count: 240 },
  { word: 'Help', count: 180 },
];

const timeSeriesData = [
  { time: '00:00', value: 12 },
  { time: '04:00', value: 8 },
  { time: '08:00', value: 45 },
  { time: '12:00', value: 92 },
  { time: '16:00', value: 124 },
  { time: '20:00', value: 78 },
  { time: '23:59', value: 34 },
];

const Analytics: React.FC<AnalyticsProps> = ({ onActionInProgress }) => {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [ruleType, setRuleType] = useState('All Types');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onActionInProgress();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Performance Analytics</h1>
          <p className="text-slate-400">Deep-dive insights into your AI automation efficiency and engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={onActionInProgress}
            className="bg-blue-600 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 whitespace-nowrap active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Granular Filter Bar */}
      <div className="glass rounded-[2rem] p-6 border border-white/10 flex flex-col xl:flex-row gap-6 items-stretch xl:items-center shadow-2xl">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/50 rounded-xl border border-white/5 group transition-all focus-within:border-blue-500/50">
            <Calendar className="w-4 h-4 text-blue-400" />
            <select 
              value={dateRange}
              onChange={(e) => { setDateRange(e.target.value); onActionInProgress(); }}
              className="bg-transparent text-sm font-semibold text-slate-200 outline-none cursor-pointer pr-4"
            >
              <option value="Last 24 Hours">Last 24 Hours</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="Year to Date">Year to Date</option>
              <option value="Custom Range">Custom Range</option>
            </select>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/50 rounded-xl border border-white/5 group transition-all focus-within:border-blue-500/50">
            <Instagram className="w-4 h-4 text-pink-500" />
            <select 
              value={selectedAccount}
              onChange={(e) => { setSelectedAccount(e.target.value); onActionInProgress(); }}
              className="bg-transparent text-sm font-semibold text-slate-200 outline-none cursor-pointer pr-4"
            >
              <option value="All Accounts">All Connected Accounts</option>
              <option value="@the_ai_revolution">@the_ai_revolution</option>
              <option value="@tech_insights">@tech_insights</option>
              <option value="@design_daily">@design_daily</option>
              <option value="@marketing_pro">@marketing_pro</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide">
          {[
            { id: 'All Types', icon: Zap, label: 'All Logic' },
            { id: 'Comments', icon: MessageSquare, label: 'Comments' },
            { id: 'Keywords', icon: Hash, label: 'Keywords' },
            { id: 'Stories', icon: Camera, label: 'Stories' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => { setRuleType(type.id); onActionInProgress(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                ruleType === type.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <type.icon className="w-3.5 h-3.5" />
              {type.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            setDateRange('Last 7 Days');
            setSelectedAccount('All Accounts');
            setRuleType('All Types');
            handleRefresh();
          }}
          className="xl:ml-4 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all bg-white/5 hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Activity Line Chart */}
        <div className="glass rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group lg:col-span-2">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 relative z-10">
            <div>
              <h3 className="text-2xl font-bold">Activity Pulse</h3>
              <p className="text-sm text-slate-500 mt-1">Real-time automation volume throughout the day</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/40 p-2 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Flow</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+18.5% Growth</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 11, fontWeight: 700}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 11, fontWeight: 700}}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px'}}
                  itemStyle={{color: '#3b82f6'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="glass rounded-[2.5rem] p-10 border border-white/10 transition-all duration-300 hover:border-blue-500/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Inbound Conversion</h3>
              <p className="text-xs text-slate-500 mt-1">Lead progression through automation stages</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                  width={110}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}}
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keyword Trends */}
        <div className="glass rounded-[2.5rem] p-10 border border-white/10 transition-all duration-300 hover:border-purple-500/20 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Top Keyword Performance</h3>
              <p className="text-xs text-slate-500 mt-1">Most effective triggers by message volume</p>
            </div>
            <div className="bg-purple-500/10 p-2 rounded-xl">
              <Hash className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={keywordData}
                    dataKey="count"
                    nameKey="word"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    stroke="none"
                  >
                    {keywordData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 35}, 70%, 55%)`} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              {keywordData.slice(0, 4).map((k, i) => (
                <div key={i} onClick={onActionInProgress} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: `hsl(${220 + i * 35}, 70%, 55%)`}}></div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest group-hover:text-white transition-colors">#{k.word}</span>
                  </div>
                  <span className="text-sm font-black text-slate-100">{k.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="glass rounded-[2rem] p-8 border border-white/10 group hover:border-blue-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Response Time</p>
          <p className="text-3xl font-black text-white">1.2s</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            0.4s improvement
          </div>
        </div>

        <div className="glass rounded-[2rem] p-8 border border-white/10 group hover:border-purple-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Hand-off Rate</p>
          <p className="text-3xl font-black text-white">4.2%</p>
          <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">95.8% AI Autonomy</p>
        </div>

        <div className="glass rounded-[2rem] p-8 border border-white/10 group hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Savings</p>
          <p className="text-3xl font-black text-white">$12.4k</p>
          <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Based on manual labour hrs</p>
        </div>

        <div className="glass rounded-[2rem] p-8 border border-white/10 group hover:border-pink-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6 text-pink-500" />
          </div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">AI Accuracy</p>
          <p className="text-3xl font-black text-white">98.2%</p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-blue-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified sentiment
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
