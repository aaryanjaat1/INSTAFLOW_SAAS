
import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Hash, 
  Camera, 
  MoreHorizontal, 
  Trash2,
  ExternalLink,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { AutomationRule } from '../types';

const Automations: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      title: 'Course Promo - Comment to DM',
      type: 'comment_to_dm',
      status: true,
      trigger: 'Keywords: course, ai, info',
      webhookUrl: 'https://n8n.your-domain.com/webhook/instaflow-course'
    },
    {
      id: '2',
      title: 'Support - Keyword Trigger',
      type: 'keyword',
      status: false,
      trigger: 'Keyword: help',
      webhookUrl: 'https://n8n.your-domain.com/webhook/instaflow-support'
    },
    {
      id: '3',
      title: 'Daily Reel - Story Reply',
      type: 'story_reply',
      status: true,
      trigger: 'All Story Replies',
      webhookUrl: 'https://n8n.your-domain.com/webhook/instaflow-story'
    }
  ]);

  const toggleStatus = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, status: !r.status } : r));
  };

  const getTypeIcon = (type: AutomationRule['type']) => {
    switch(type) {
      case 'comment_to_dm': return <MessageSquare className="w-5 h-5" />;
      case 'keyword': return <Hash className="w-5 h-5" />;
      case 'story_reply': return <Camera className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Automation Rules</h1>
          <p className="text-slate-400 text-sm">Configure how InstaFlow responds to your followers.</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <Plus className="w-5 h-5" />
          Create Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rules.map(rule => (
          <div key={rule.id} className="glass rounded-3xl p-6 group">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                rule.status ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {getTypeIcon(rule.type)}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleStatus(rule.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${rule.status ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.status ? 'left-7' : 'left-1'}`}></div>
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400"><MoreHorizontal className="w-5 h-5" /></button>
              </div>
            </div>

            <h3 className="font-bold text-lg mb-1">{rule.title}</h3>
            <p className="text-xs text-slate-400 mb-4">{rule.type.replace(/_/g, ' ').toUpperCase()}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">{rule.trigger}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span className="text-slate-500 truncate max-w-[200px]">{rule.webhookUrl}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-slate-800/50 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">
                Edit Flow
              </button>
              <button className="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-white/5 transition-all text-slate-500 hover:text-blue-400">
          <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Add New Rule</span>
        </button>
      </div>

      <div className="glass rounded-3xl p-8 mt-12">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">n8n Integration Guide</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              To fully utilize InstaFlow, you need to connect your n8n workspace. Every time an event occurs on Instagram, we'll send a POST request to your n8n webhook. You can then use AI nodes (like GPT or Gemini) inside n8n to process the logic.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5">
                <span className="text-2xl font-bold text-slate-700 mb-2 block">01</span>
                <p className="text-sm font-semibold">Copy Webhook</p>
                <p className="text-xs text-slate-500 mt-1">Get the unique URL for your rule.</p>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5">
                <span className="text-2xl font-bold text-slate-700 mb-2 block">02</span>
                <p className="text-sm font-semibold">Paste in n8n</p>
                <p className="text-xs text-slate-500 mt-1">Add a Webhook Trigger node in your workflow.</p>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5">
                <span className="text-2xl font-bold text-slate-700 mb-2 block">03</span>
                <p className="text-sm font-semibold">Automate!</p>
                <p className="text-xs text-slate-500 mt-1">Your logic runs instantly on every trigger.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automations;
