
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
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';

interface WebhooksProps {
  onActionInProgress: () => void;
}

type ConnectionStatus = 'connected' | 'pending' | 'error';

const Webhooks: React.FC<WebhooksProps> = ({ onActionInProgress }) => {
  const [webhookUrl] = useState('https://n8n.your-instaflow-backend.com/webhook/main-inbound');
  const [secret] = useState('whsec_5f8d9e2a1b3c4d5e6f7g8h9i0j');
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');

  // Simulated status monitoring
  useEffect(() => {
    const statuses: ConnectionStatus[] = ['connected', 'pending', 'error'];
    const interval = setInterval(() => {
      // Randomly fluctuate status for demo purposes, but mostly stay connected
      const rand = Math.random();
      if (rand > 0.95) {
        setConnectionStatus('error');
      } else if (rand > 0.85) {
        setConnectionStatus('pending');
      } else {
        setConnectionStatus('connected');
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logs = [
    { id: '1', event: 'instagram.comment', status: 200, time: '2m ago', latency: '124ms' },
    { id: '2', event: 'instagram.message', status: 200, time: '15m ago', latency: '142ms' },
    { id: '3', event: 'instagram.story_reply', status: 400, time: '1h ago', latency: '89ms' },
    { id: '4', event: 'instagram.message', status: 200, time: '2h ago', latency: '156ms' },
    { id: '5', event: 'instagram.comment', status: 200, time: '4h ago', latency: '131ms' },
  ];

  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-fade-in" aria-live="polite">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Connected
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest animate-fade-in" aria-live="polite">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse"></span>
            </span>
            Pending
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest animate-fade-in" aria-live="polite">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            Error
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Webhooks & Backend</h1>
          <p className="text-slate-400">Configure how InstaFlow communicates with your n8n instance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setConnectionStatus('pending'); setTimeout(() => setConnectionStatus('connected'), 2000); }}
            className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-2 transition-colors px-4 py-2 rounded-xl bg-white/5 border border-white/5"
          >
            <RefreshCw className={`w-3 h-3 ${connectionStatus === 'pending' ? 'animate-spin' : ''}`} />
            Check Connection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Webhook className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">Main Inbound Webhook</h2>
              </div>
              {getStatusIndicator()}
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
                    aria-label="Webhook URL"
                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm font-mono text-blue-300 focus:outline-none"
                  />
                  <div className="absolute right-4 flex items-center gap-2">
                    <button 
                      onClick={handleCopy}
                      aria-label="Copy Webhook URL"
                      className="text-slate-500 hover:text-white transition-colors p-1"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-bold text-slate-300">Signing Secret</span>
                </div>
                <button onClick={onActionInProgress} className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Rotate Secret
                </button>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 font-mono text-xs text-slate-500 blur-[2px] hover:blur-none transition-all cursor-pointer">
                {secret}
              </div>
              <p className="text-[10px] text-slate-500 italic">Verify webhook authenticity in n8n using this secret to prevent unauthorized requests.</p>
            </div>
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold">Recent Deliveries</h3>
              </div>
              <button onClick={onActionInProgress} className="text-xs text-slate-400 hover:text-white transition-colors">Clear Logs</button>
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
                        <button onClick={onActionInProgress} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300">
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
            <button onClick={onActionInProgress} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2">
              Import Template <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="glass rounded-3xl p-8 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Backend Health</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">API Latency</span>
                <span className="text-xs font-black text-emerald-400">Optimal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Delivery Rate</span>
                <span className="text-xs font-black text-blue-400">99.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Memory Usage</span>
                <span className="text-xs font-black text-slate-300">12%</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-3">Integration Checklist</h4>
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
    </div>
  );
};

export default Webhooks;
