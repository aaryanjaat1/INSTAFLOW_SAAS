
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
  Trash
} from 'lucide-react';
import { AutomationRule } from '../types';
import { supabase } from '../services/supabase';

interface AutomationsProps {
  session: any;
  onAuthRequired: () => void;
  addActivity: (event: string, description: string, type: any, icon: any, color: string) => void;
}

const Automations: React.FC<AutomationsProps> = ({ session, onAuthRequired, addActivity }) => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newRule, setNewRule] = useState({
    title: '',
    type: 'comment_to_dm' as AutomationRule['type'],
    trigger: '',
    webhookUrl: ''
  });

  useEffect(() => {
    if (session) {
      fetchRules();
    } else {
      setRules([
        { id: '1', title: 'Demo Rule (Sign in to edit)', type: 'comment_to_dm', status: true, trigger: 'Keywords: price', webhookUrl: 'https://n8n.example.com/webhook/...' }
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
      setNewRule({ title: '', type: 'comment_to_dm', trigger: '', webhookUrl: '' });
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
        <div><h1 className="text-4xl font-black tracking-tight mb-2">Automation Rules</h1><p className="text-slate-400">Configure real-time responses and lead logic for your IG presence.</p></div>
        <button onClick={() => !session ? onAuthRequired() : setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 font-bold shadow-xl shadow-blue-600/20 active:scale-95"><Plus className="w-5 h-5" />Create Rule</button>
      </div>
      {loading && rules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /><p className="text-slate-500 font-medium">Syncing with database...</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {rules.map(rule => (
            <div key={rule.id} className="glass rounded-[2.5rem] p-8 group border border-white/5 hover:border-white/10 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${rule.status ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>{getTypeIcon(rule.type)}</div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStatus(rule.id)} className={`w-12 h-6 rounded-full transition-colors relative ${rule.status ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-700'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.status ? 'left-7' : 'left-1'}`}></div></button>
                  <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-1 group-hover:text-white transition-colors">{rule.title}</h3>
              <p className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-widest">{rule.type.replace(/_/g, ' ')}</p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-sm"><div className="p-1.5 rounded-lg bg-white/5"><Zap className="w-4 h-4 text-amber-400" /></div><span className="text-slate-300 font-medium">{rule.trigger || 'No trigger set'}</span></div>
                <div className="flex items-center gap-3 text-sm"><div className="p-1.5 rounded-lg bg-white/5"><ExternalLink className="w-4 h-4 text-slate-500" /></div><span className="text-slate-500 truncate font-mono text-xs">{rule.webhookUrl || 'No webhook URL'}</span></div>
              </div>
              <div className="flex gap-3"><button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-2xl text-xs font-bold transition-all border border-white/5">Edit Flow</button><button onClick={() => handleDelete(rule.id)} className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500/20 transition-all border border-rose-500/10"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          ))}
          <button onClick={() => !session ? onAuthRequired() : setIsModalOpen(true)} className="border-2 border-dashed border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/[0.02] transition-all text-slate-600 hover:text-blue-400 group"><div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl"><Plus className="w-8 h-8" /></div><span className="font-bold uppercase tracking-widest text-xs">Deploy New Automation</span></button>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
          <div className="glass w-full max-w-xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
            <div className="p-10">
              <div className="flex items-center justify-between mb-8"><h2 className="text-3xl font-black text-white">New Rule</h2><button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all"><X className="w-6 h-6" /></button></div>
              <form onSubmit={handleCreateRule} className="space-y-6">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rule Title</label><input required type="text" placeholder="e.g. Price Inquiry Flow" value={newRule.title} onChange={e => setNewRule({...newRule, title: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-blue-500/50 outline-none transition-all" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Trigger Type</label><select value={newRule.type} onChange={e => setNewRule({...newRule, type: e.target.value as any})} className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-blue-500/50 outline-none transition-all appearance-none"><option value="comment_to_dm">Comment → DM</option><option value="keyword">Keyword Match</option><option value="story_reply">Story Reply</option></select></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Trigger Keywords</label><input type="text" placeholder="e.g. price, info, help" value={newRule.trigger} onChange={e => setNewRule({...newRule, trigger: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-blue-500/50 outline-none transition-all" /></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">n8n Webhook URL</label><input required type="url" placeholder="https://n8n.yourserver.com/webhook/..." value={newRule.webhookUrl} onChange={e => setNewRule({...newRule, webhookUrl: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 px-5 text-sm font-mono text-blue-400 focus:border-blue-500/50 outline-none transition-all" /></div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 mt-4">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Deploy Rule</>}</button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="glass rounded-[3rem] p-12 mt-12 border border-white/5 bg-gradient-to-br from-indigo-600/5 to-transparent">
        <div className="flex flex-col md:flex-row items-start gap-10">
          <div className="w-20 h-20 rounded-[2rem] bg-slate-950 flex items-center justify-center border border-white/10 shrink-0 shadow-2xl"><Zap className="w-10 h-10 text-amber-400" /></div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">n8n Workflow Setup</h2>
            <p className="text-slate-400 leading-relaxed mb-10 max-w-2xl">Every automation rule here connects to an external n8n webhook. When a follower triggers a rule, InstaFlow sends the conversation context to your n8n workflow.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[ { step: '01', title: 'Webhook', desc: 'Copy the URL from n8n Webhook node and paste it in your rule.' }, { step: '02', title: 'Logic', desc: 'Add Gemini or GPT nodes in n8n to generate human-like replies.' }, { step: '03', title: 'Action', desc: 'Send the response back to Instagram via InstaFlow API.' }].map((item, i) => (
                <div key={i} className="space-y-3"><span className="text-3xl font-black text-slate-800 tracking-tighter">{item.step}</span><h4 className="font-bold text-white text-lg">{item.title}</h4><p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automations;
