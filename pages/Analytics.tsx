
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
  Pie
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
  Camera 
} from 'lucide-react';

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

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [ruleType, setRuleType] = useState('All Types');

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
          <p className="text-slate-400">Deep dive into your automation performance and insights.</p>
        </div>
        <button className="bg-blue-600 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Enhanced Filter Bar */}
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400 mr-2">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        {/* Date Range Picker */}
        <div className="relative group">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="appearance-none bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl px-4 py-2 pr-10 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer"
          >
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Custom Range</option>
          </select>
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        {/* Account Selector */}
        <div className="relative group">
          <select 
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="appearance-none bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl px-4 py-2 pr-10 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer"
          >
            <option>All Accounts</option>
            <option>@the_ai_revolution</option>
            <option>@tech_insights</option>
            <option>@design_daily</option>
          </select>
          <Instagram className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        {/* Rule Type Filter */}
        <div className="flex items-center bg-slate-800/40 border border-white/5 p-1 rounded-xl">
          {[
            { id: 'All Types', icon: Zap },
            { id: 'Comments', icon: MessageSquare },
            { id: 'Keywords', icon: Hash },
            { id: 'Stories', icon: Camera }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setRuleType(type.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                ruleType === type.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <type.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{type.id}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            setDateRange('Last 7 Days');
            setSelectedAccount('All Accounts');
            setRuleType('All Types');
          }}
          className="ml-auto text-xs text-slate-500 hover:text-blue-400 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Funnel */}
        <div className="glass rounded-3xl p-8 transition-all duration-300 hover:border-blue-500/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Conversion Funnel</h3>
              <p className="text-xs text-slate-400 mt-1">Efficiency across the customer journey</p>
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
              +12.4% vs Prev Period
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  width={100}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keyword Trends */}
        <div className="glass rounded-3xl p-8 transition-all duration-300 hover:border-purple-500/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Keyword Trends</h3>
              <p className="text-xs text-slate-400 mt-1">Most frequent triggers identified</p>
            </div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-blue-500 flex items-center justify-center text-[10px] font-bold">#1</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-purple-500 flex items-center justify-center text-[10px] font-bold">#2</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-pink-500 flex items-center justify-center text-[10px] font-bold">#3</div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={keywordData}
                  dataKey="count"
                  nameKey="word"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                >
                  {keywordData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 35}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {keywordData.map((k, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-800/40 border border-white/5 hover:border-blue-500/30 transition-colors">
                <span className="text-slate-400 font-medium">#{k.word}</span>
                <span className="font-bold text-slate-100">{k.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border-l-4 border-blue-500">
          <p className="text-sm text-slate-400 mb-1">Avg. Response Time</p>
          <p className="text-2xl font-bold">1.2 seconds</p>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            0.4s faster than last week
          </div>
        </div>
        <div className="glass rounded-2xl p-6 border-l-4 border-purple-500">
          <p className="text-sm text-slate-400 mb-1">Hand-off Rate</p>
          <p className="text-2xl font-bold">4.2%</p>
          <p className="mt-2 text-xs text-slate-500 italic">Messages requiring human intervention</p>
        </div>
        <div className="glass rounded-2xl p-6 border-l-4 border-emerald-500">
          <p className="text-sm text-slate-400 mb-1">Estimated ROI</p>
          <p className="text-2xl font-bold">$12,450.00</p>
          <p className="mt-2 text-xs text-slate-500">Based on converted leads and product cost</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
