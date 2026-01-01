
import React, { useState, useEffect } from 'react';
import { 
  Webhook, 
  Copy, 
  CheckCircle2, 
  Save, 
  Terminal, 
  Key, 
  Loader2, 
  Lock, 
  ShieldCheck,
  AlertCircle,
  Code,
  ArrowRight,
  Zap,
  RefreshCw,
  PlayCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '../services/supabase';

interface WebhooksProps {
  onActionInProgress: () => void;
  session: any;
}

const Webhooks: React.FC<WebhooksProps> = ({ onActionInProgress, session }) => {
  const [inboundUrl] = useState(`${window.location.origin}/api/v1/meta-callback`);
  const [outboundUrl, setOutboundUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (session) fetchConfig();
  }, [session]);

  const fetchConfig = async () => {
    const { data } = await supabase.from('profiles').select('n8n_url, api_key').eq('id', session.user.id).single();
    if (data?.n8n_url) setOutboundUrl(data.n8n_url);
    if (data?.api_key) {
      setApiKey(data.api_key);
    } else {
      const newKey = 'if_live_sk_' + Math.random().toString(36).substring(2, 15);
      setApiKey(newKey);
    }
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
    }
    setIsSaving(false);
  };

  const handleTestConnection = async () => {
    if (!outboundUrl) return;
    setIsTesting(true);
    setTestStatus('idle');
    
    try {
      // Send a test ping to n8n
      const response = await fetch(outboundUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CONNECTION_TEST', timestamp: new Date().toISOString() })
      });
      
      if (response.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('fail');
      }
    } catch (e) {
      setTestStatus('fail');
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
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Workflow Bridge</h1>
          <p className="text-slate-400">Your n8n workflow is currently: <span className="text-emerald-400 font-bold">Production Ready</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleTestConnection}
            disabled={isTesting || !outboundUrl}
            className={`px-6 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 ${
              testStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              testStatus === 'fail' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
              'bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             testStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
             testStatus === 'fail' ? <XCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            {isTesting ? 'Pinging n8n...' : testStatus === 'success' ? 'Gate Verified' : testStatus === 'fail' ? 'Gate Unreachable' : 'Test Security Gate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1 glass rounded-[2.5rem] p-8 border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Key className="w-6 h-6" />
             </div>
             <h2 className="text-xl font-bold">App Secret</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Essential for the <code className="text-blue-400">Verify Meta Signature</code> node in your n8n workflow.
          </p>
          <div className="relative group">
            <input type="password" placeholder="••••••••••••••••" className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-xs font-mono text-amber-400 outline-none" />
          </div>
        </section>

        <section className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-white/10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">n8n Webhook Target</label>
               <input type="url" value={outboundUrl} onChange={(e) => setOutboundUrl(e.target.value)} placeholder="https://your-n8n.com/webhook/..." className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-purple-300 outline-none" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dashboard API Key</label>
               <input readOnly value={apiKey} className="w-full bg-slate-950/80 border border-white/5 rounded-xl py-3 px-4 text-xs font-mono text-blue-300" />
            </div>
          </div>
          <button onClick={handleSaveOutbound} disabled={isSaving} className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-xs shadow-xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Sync Production Bridge
          </button>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Signature Logic */}
        <section className="glass rounded-[3rem] p-10 border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
           <div className="space-y-6 relative z-10">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  <h2 className="text-2xl font-bold">Gate Logic (Production)</h2>
               </div>
               <p className="text-slate-400 leading-relaxed text-sm">
                 Your n8n <strong>Verify Meta Signature</strong> node is active. This node protects your Gemini credits by ignoring any request that doesn't have a valid Meta HMAC signature.
               </p>
               <div className="bg-slate-950 rounded-[2rem] p-6 font-mono text-[10px] border border-white/5 shadow-2xl">
                 <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
{`const crypto = require('crypto');
const sig = headers['x-hub-signature-256'].split('=')[1];
const expected = crypto.createHmac('sha256', APP_SECRET)
                       .update(JSON.stringify(body))
                       .digest('hex');
return sig === expected;`}
                 </pre>
               </div>
            </div>
        </section>

        {/* Handshake Details */}
        <section className="glass rounded-[3rem] p-10 border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
           <div className="space-y-6 relative z-10">
               <div className="flex items-center gap-3">
                  <RefreshCw className="w-7 h-7 text-blue-400" />
                  <h2 className="text-2xl font-bold">Auth Handshake</h2>
               </div>
               <p className="text-slate-400 leading-relaxed text-sm">
                 The <strong>Auth Handshake</strong> flow in n8n handles the 60-day token exchange. When you click "Connect" in this dashboard, the handshake is triggered automatically.
               </p>
               <div className="space-y-3">
                  {['Exchange Short for Long Token', 'Fetch Page Access Token', 'Trigger /subscribed_apps'].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                      <div className="w-5 h-5 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                      {step}
                    </div>
                  ))}
               </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Webhooks;
