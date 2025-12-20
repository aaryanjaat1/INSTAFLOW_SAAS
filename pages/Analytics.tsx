
import React from 'react';
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
import { Download, Filter, Calendar } from 'lucide-react';

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
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
          <p className="text-slate-400">Deep dive into your automation performance and insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition-colors">
            <Calendar className="w-5 h-5 text-slate-400" />
          </button>
          <button className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition-colors">
            <Filter className="w-5 h-5 text-slate-400" />
          </button>
          <button className="bg-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-8">Conversion Funnel</h3>
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

        <div className="glass rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-8">Keyword Trends</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={keywordData}
                  dataKey="count"
                  nameKey="word"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {keywordData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 30}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {keywordData.map((k, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-800/50">
                <span className="text-slate-400">#{k.word}</span>
                <span className="font-bold">{k.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
