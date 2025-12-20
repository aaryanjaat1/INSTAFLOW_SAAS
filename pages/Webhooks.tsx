
import React, { useState } from 'react';
import { 
  Webhook, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Code,
  Shield,
  Activity
} from 'lucide-react';

const Webhooks: React.FC = () => {
  const [webhookUrl] = useState('https://n8n.your-instaflow-backend.com/webhook/main-inbound');
  const [secret] = useState('whsec_5f8d9e2a1b3c4d5e6f7g8h9i0j');
  const [copied, setCopied] = useState(false);

  const logs = [
    { id: '1', event: 'instagram.comment', status: 200, time: '2m ago', latency: '124ms' },
    { id: '2', event: 'instagram.message', status: 200, time: '15m ago', latency: '142ms' },
    { id: '3', event: 'instagram.story_reply', status: 400, time: '1h ago', latency: '89ms' },
    { id: '4', event: 'instagram.message', status: 200, time: '2h ago', latency: '156ms' },
    { id: '5', event: 'instagram.comment', status: 200, time: '4h ago', latency: '131ms' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Webhooks & Backend</h1>
          <p className="text-slate-400">Configure how InstaFlow communicates with your n8n instance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            Connected to n8n
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Webhook className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold">Main Inbound Webhook</h2>
            </div>
            
            <p className="text-sm text-slate-400">
              Provide this URL to n8n as your primary Webhook Trigger endpoint. All Instagram events for your connected accounts will be forwarded here.
            </p>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-all rounded-full"></div>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    readOnly 
                    value={webhookUrl}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm font-mono text-blue-300 focus:outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className="absolute right-4 text-slate-500 hover:text-white transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-bold text-slate-300">Signing Secret</span>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Rotate Secret
                </button>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 font-mono text-xs text-slate-500 blur-[2px] hover:blur-none transition-all cursor-pointer">
                {secret}
              </div>
              <p className="text-[10px] text-slate-500 italic">Verify webhook authenticity in n8n using this secret.</p>
            </div>
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold">Recent Deliveries</h3>
              </div>
              <button className="text-xs text-slate-400 hover:text-white transition-colors">Clear Logs</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Latency</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          log.status === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {log.status} {log.status === 200 ? 'OK' : 'ERR'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-300">{log.event}</td>
                      <td className="px-6 py-4 text-slate-500">{log.latency}</td>
                      <td className="px-6 py-4 text-slate-500">{log.time}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 bg-gradient-to-br from-indigo-600/10 to-transparent">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
              <Code className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold mb-3">n8n Node Template</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              We've created a custom n8n workflow template to help you get started with InstaFlow in seconds.
            </p>
            <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2">
              Import Template <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="glass rounded-3xl p-8 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Integration Checklist</h4>
            <div className="space-y-3">
              {[
                { label: 'Set Webhook Method to POST', done: true },
                { label: 'Enable JSON Parsing', done: true },
                { label: 'Add Gemini API Key to n8n', done: false },
                { label: 'Configure Error Handling', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600"></div>
                  )}
                  <span className={`text-xs ${item.done ? 'text-slate-300' : 'text-slate-500'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webhooks;
