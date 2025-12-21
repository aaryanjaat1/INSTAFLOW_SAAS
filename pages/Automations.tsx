
import React, { useState, useEffect } from 'react';
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
  XCircle,
  Loader2,
  X,
  Trash,
  ShieldAlert,
  BarChart2
} from 'lucide-react';
import { AutomationRule } from '../types';
import { supabase } from '../services/supabase';

interface ExtendedRule extends AutomationRule {
  daily_limit?: number;
  current_count?: number;
}

interface AutomationsProps {
  session: any;
  onAuthRequired: () => void;
  addActivity: (event: string, description: string, type: any, icon: any, color: string) => void;
}

const Automations: React.FC<AutomationsProps> = ({ session, onAuthRequired, addActivity }) => {
  const [rules, setRules] = useState<ExtendedRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newRule, setNewRule] = useState({
    title: '',
    type: 'comment_to_dm' as AutomationRule['type'],
    trigger: '',
    webhookUrl: '',
    daily_limit: 50
  });

  useEffect(() => {
    if (session) {
      fetchRules();
    } else {
      setRules([
        { id: '1', title: 'Demo Rule', type: 'comment_to_dm', status: true, trigger: 'Keywords: price', webhookUrl: 'https://n8n.io/...', daily_limit: 50, current_count: 12 }
      ]);
    }
  }, [session]);

  const fetchRules = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setRules(data);
    setLoading(false);
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return onAuthRequired();
    
    setLoading(true);
    const { data, error } = await supabase
      .from('automation_rules')
      .insert([{ ...newRule, user_id: session.user.id, status: true }])
      .select();

    if (!error && data) {
      setRules([data[0], ...rules]);
      setIsModalOpen(false);
      addActivity('New Rule Created', `Workflow "${newRule.title}" deployed successfully.`, 'trigger', Zap, 'text-amber-400');
      setNewRule({ title: '', type: 'comment_to_dm', trigger: '', webhookUrl: '', daily_limit: 50 });
    }
    setLoading(false);
  };

  const toggleStatus = async (id: string) => {
    if (!session) return onAuthRequired();
    const rule = rules.find(r => r.id === id);
    if (!rule) return;

    const { error } = await supabase.from('automation_rules').update({ status: !rule.status }).eq('id', id);
    if (!error) {
      setRules(rules.map(r => r.id === id ? { ...r, status: !r.status } : r));
      addActivity('Rule Updated', `Rule "${rule.title}" is now ${!rule.status ? 'active' : 'paused'}.`, 'update', Zap, 'text-blue-400');
    }
  };

  const handleDelete = async (id: string) => {
    if (!session) return onAuthRequired();
    const rule = rules.find(r => r.id === id);
    if (!rule || !confirm(`Delete "${rule.title}"?`)) return;
    
    const { error } = await supabase.from('automation_rules').delete().eq('id', id);
    if (!error) {
      setRules(rules.filter(r => r.id !== id));
      addActivity('Rule Removed', `Rule "${rule.title}" was deleted.`, 'update', Trash, 'text-rose-400');
    }
  };

  const getTypeIcon = (type: AutomationRule['type']) => {
    switch(type) {
      case 'comment_to_dm': return <MessageSquare className="w-5 h-5" />;
      case 'keyword': return <Hash className="w-5 h-5" />;
      case 'story_reply': return <Camera className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div><h1 className="text-4xl font-black tracking-tight mb-2">Automation Rules</h1><p className="text-slate-400">Syncs directly with your n8n workflow safety nodes.</p></div>
        <button onClick={() => !session ? onAuthRequired() : setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 font-bold shadow-xl shadow-blue-600/20 active:scale-95"><Plus className="w-5 h-5" />Create Rule</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {rules.map(rule => (
          <div key={rule.id} className="glass rounded-[2.5rem] p-8 group border border-white/5 hover:border-blue-500/20 transition-all relative overflow-hidden">
            <div className="flex items-start justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${rule.status ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>{getTypeIcon(rule.type)}</div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleStatus(rule.id)} className={`w-12 h-6 rounded-full transition-colors relative ${rule.status ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-700'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.status ? 'left-7' : 'left-1'}`}></div></button>
              </div>
            </div>
            <h3 className="font-bold text-xl mb-1 text-white">{rule.title}</h3>
            <p className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-widest">{rule.type.replace(/_/g, ' ')}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[10px] font-black uppercase text-slate-500">Daily Limit</span>
                </div>
                <span className="text-xs font-bold text-slate-300">{rule.current_count || 0} / {rule.daily_limit || 50}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 rounded-lg bg-white/5"><Zap className="w-4 h-4 text-amber-400" /></div>
                <span className="text-slate-300 font-medium truncate">{rule.trigger}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-2xl text-xs font-bold transition-all border border-white/5">Edit Flow</button>
              <button onClick={() => handleDelete(rule.id)} className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500/20 transition-all border border-rose-500/10"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
          <div className="glass w-full max-w-xl rounded-[3rem] border border-white/10 shadow-2xl p-10">
            <div className="flex items-center justify-between mb-8"><h2 className="text-3xl font-black text-white">Configure Node</h2><button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all"><X className="w-6 h-6" /></button></div>
            <form onSubmit={handleCreateRule} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                <input required type="text" value={newRule.title} onChange={e => setNewRule({...newRule, title: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                  <select value={newRule.type} onChange={e => setNewRule({...newRule, type: e.target.value as any})} className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none appearance-none">
                    <option value="comment_to_dm">Comment → DM</option>
                    <option value="keyword">Keyword Match</option>
                    <option value="story_reply">Story Reply</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Daily Safety Limit</label>
                  <input type="number" value={newRule.daily_limit} onChange={e => setNewRule({...newRule, daily_limit: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">n8n Hook URL</label>
                <input required type="url" value={newRule.webhookUrl} onChange={e => setNewRule({...newRule, webhookUrl: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-sm font-mono text-blue-400 outline-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Deploy to Cloud</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;
