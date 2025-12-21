
import React, { useState, useEffect } from 'react';
import { 
  Webhook, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Code, 
  Shield, 
  Activity, 
  Save, 
  Link2, 
  Terminal, 
  Database, 
  Key, 
  FileCode, 
  ArrowRight, 
  Zap, 
  Info,
  Loader2,
  SendHorizontal,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { supabase } from '../services/supabase';

interface WebhooksProps {
  onActionInProgress: () => void;
  session: any;
}

const Webhooks: React.FC<WebhooksProps> = ({ onActionInProgress, session }) => {
  const [inboundUrl] = useState(`${window.location.origin}/api/v1/meta-callback`);
  const [outboundUrl, setOutboundUrl] = useState('');
  const [apiKey, setApiKey] = useState('if_live_sk_' + Math.random().toString(36).substring(2, 15));
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<'none' | 'success' | 'fail'>('none');

  useEffect(() => {
    if (session) {
      fetchConfig();
    }
  }, [session]);

  const fetchConfig = async () => {
    const { data } = await supabase.from('profiles').select('n8n_url, api_key').eq('id', session.user.id).single();
    if (data?.n8n_url) setOutboundUrl(data.n8n_url);
    if (data?.api_key) setApiKey(data.api_key);
  };

  const handleSaveOutbound = async () => {
    if (!session) return;
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update({ 
      n8n_url: outboundUrl,
      api_key: apiKey 
    }).eq('id', session.user.id);
    
    if (!error) {
      onActionInProgress();
      setTestResult('success');
      setTimeout(() => setTestResult('none'), 3000);
    }
    setIsSaving(false);
  };

  const handleTestConnection = async () => {
    if (!outboundUrl) return;
    setIsTesting(true);
    setTestResult('none');
    
    try {
      // Simulate n8n 'Webhook Trigger' handshake
      const response = await fetch(outboundUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'HANDSHAKE_TEST', timestamp: Date.now() })
      });
      
      setTestResult(response.ok ? 'success' : 'fail');
    } catch (e) {
      setTestResult('fail');
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Workflow Bridge</h1>
          <p className="text-slate-400">Synchronize your n8n safety gates and anti-ban parameters.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 transition-all ${testResult === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-white/5 text-slate-500'}`}>
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {testResult === 'success' ? 'Handshake Verified' : 'System Ready'}
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Keys */}
        <section className="lg:col-span-1 glass rounded-[2.5rem] p-8 border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Key className="w-6 h-6" />
             </div>
             <h2 className="text-xl font-bold">API Authentication</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Used by n8n <strong>HTTP Request</strong> nodes to securely post analytics back to this dashboard.
          </p>
          
          <div className="space-y-4">
             <div className="relative group">
                <input 
                  type="password" 
                  readOnly 
                  value={apiKey}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-xs font-mono text-amber-400 outline-none"
                />
                <button onClick={() => handleCopy(apiKey, 'key')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {copiedField === 'key' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
             </div>
             <button onClick={() => setApiKey('if_live_sk_' + Math.random().toString(36).substring(2, 20))} className="text-[10px] font-black uppercase text-blue-400 tracking-widest hover:text-white transition-colors flex items-center gap-2">
                <RefreshCw className="w-3 h-3" /> Rotate Credentials
             </button>
          </div>
        </section>

        {/* Bridge */}
        <section className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-white/10 space-y-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="flex items-center gap-3 text-blue-400">
                  <Link2 className="w-5 h-5" />
                  <h3 className="font-bold text-white uppercase tracking-tighter text-sm">Dashboard Endpoint</h3>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Inbound URL</label>
                  <div className="relative">
                    <input readOnly value={inboundUrl} className="w-full bg-slate-950/80 border border-white/5 rounded-xl py-3 px-4 text-xs font-mono text-blue-300 outline-none" />
                    <button onClick={() => handleCopy(inboundUrl, 'in')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                      {copiedField === 'in' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3 text-purple-400">
                  <Webhook className="w-5 h-5" />
                  <h3 className="font-bold text-white uppercase tracking-tighter text-sm">n8n Trigger</h3>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Production Webhook</label>
                  <input 
                    type="url" 
                    value={outboundUrl}
                    onChange={(e) => setOutboundUrl(e.target.value)}
                    placeholder="Paste n8n Webhook Trigger URL here..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-purple-300 outline-none focus:border-purple-500/50 transition-all" 
                  />
               </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleSaveOutbound}
              disabled={isSaving}
              className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Synchronize Configuration
            </button>
            <button 
              onClick={handleTestConnection}
              disabled={isTesting || !outboundUrl}
              className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all active:scale-95 border ${testResult === 'fail' ? 'border-rose-500 text-rose-500' : 'border-white/10 text-slate-300 hover:bg-white/5'}`}
            >
              {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
              Ping n8n Node
            </button>
          </div>
        </section>
      </div>

      <section className="glass rounded-[3rem] p-12 border border-white/10 bg-slate-950/40">
         <div className="flex flex-col xl:flex-row gap-12 items-start">
            <div className="xl:w-1/2 space-y-6">
               <div className="flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold">The n8n Handshake Guide</h2>
               </div>
               <p className="text-slate-400 leading-relaxed text-sm">
                 The <strong>"Send to InstaFlow Inbound API"</strong> node at the end of your workflow must be an <strong>HTTP Request</strong> node configured as follows:
               </p>
               
               <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 text-xs font-black">GET</div>
                    <div>
                      <h4 className="text-xs font-bold text-white mb-1">Payload Requirements</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Followers, Reach, Engagement Rate, Lead Score</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 text-xs font-black">X-KEY</div>
                    <div>
                      <h4 className="text-xs font-bold text-white mb-1">Header Authentication</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Add Header: X-API-KEY with your rotating key</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="xl:w-1/2 w-full bg-slate-900/80 rounded-[2rem] border border-white/5 p-8 font-mono text-xs">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-emerald-400">
                     <Terminal className="w-4 h-4" />
                     <span className="text-slate-500 uppercase tracking-widest font-black text-[10px]">n8n JSON Terminal Output</span>
                  </div>
               </div>
               <pre className="text-emerald-400 leading-relaxed overflow-auto">
{`{
  "status": "success",
  "followers": 12450,
  "reach": 8200,
  "engagement_rate": "5.4%",
  "lead_score": 92,
  "active_rules": 3,
  "last_node": "SyncComplete"
}`}
               </pre>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Webhooks;
