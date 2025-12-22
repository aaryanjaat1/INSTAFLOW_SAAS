
import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Link2, 
  Webhook, 
  Key, 
  Copy, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Zap, 
  Database,
  TerminalSquare,
  FileCode,
  Shield,
  Activity,
  ChevronDown,
  // Fix: Added missing ExternalLink import
  ExternalLink
} from 'lucide-react';

interface N8nGuideProps {
  onActionInProgress: () => void;
  session: any;
}

const N8nGuide: React.FC<N8nGuideProps> = ({ onActionInProgress, session }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>('inbound');

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const apiKey = session?.user?.id ? `if_live_sk_${session.user.id.slice(0, 12)}...` : 'if_live_sk_YOUR_API_KEY';

  const sections = [
    {
      id: 'inbound',
      title: 'Inbound Synchronization (Dashboard)',
      icon: Link2,
      description: 'Send data from n8n back to your InstaFlow dashboard to update analytics, lead scores, and followers.',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      id: 'outbound',
      title: 'Outbound Triggers (Safety Gates)',
      icon: Zap,
      description: 'The app triggers your n8n workflows whenever a message or comment is detected, providing full context.',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10'
    },
    {
      id: 'auth',
      title: 'Secure Authentication & API Keys',
      icon: Shield,
      description: 'Use your rotating platform keys to authenticate requests and ensure zero unauthorized access.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">n8n Integration Hub</h1>
          <p className="text-slate-400 text-lg">Master the handshake between your frontend and n8n backend.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Ready</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {sections.map((section) => (
          <button 
            key={section.id}
            onClick={() => setOpenSection(section.id)}
            className={`text-left glass rounded-[2.5rem] p-8 border transition-all duration-300 relative overflow-hidden group ${
              openSection === section.id ? 'border-blue-500/30 ring-1 ring-blue-500/10' : 'border-white/5 hover:border-white/20'
            }`}
          >
             <div className={`w-14 h-14 rounded-2xl ${section.bg} ${section.color} flex items-center justify-center mb-6 border border-white/5`}>
                <section.icon className="w-7 h-7" />
             </div>
             <h3 className="text-xl font-bold mb-3">{section.title}</h3>
             <p className="text-xs text-slate-500 leading-relaxed mb-6">{section.description}</p>
             <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${openSection === section.id ? 'text-blue-400' : 'text-slate-600'}`}>
                {openSection === section.id ? 'Viewing Guide' : 'Open Guide'} <ArrowRight className="w-3 h-3" />
             </div>
          </button>
        ))}
      </div>

      {openSection === 'inbound' && (
        <section className="glass rounded-[3rem] p-12 border border-blue-500/10 animate-fade-in bg-slate-950/30">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><Activity className="w-6 h-6" /></div>
                  <h2 className="text-2xl font-bold text-white">Inbound Webhooks</h2>
               </div>
               <p className="text-slate-400 leading-relaxed">
                 Use the **HTTP Request** node in n8n to send real-time statistics back to your dashboard. This is critical for updating the "Engagement Pulse" chart and lead quality scores.
               </p>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dashboard Endpoint</label>
                    <div className="relative">
                      <input readOnly value={`${window.location.origin}/api/v1/meta-callback`} className="w-full bg-slate-900 border border-white/5 rounded-xl py-4 px-5 text-xs font-mono text-blue-300 outline-none" />
                      <button onClick={() => handleCopy(`${window.location.origin}/api/v1/meta-callback`, 'endpoint')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                        {copiedField === 'endpoint' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Required Header</h4>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 font-mono text-xs">
                       <span className="text-slate-500">X-API-KEY</span>
                       <span className="text-amber-400">YOUR_IF_KEY</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400">
                    <TerminalSquare className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">n8n JSON Payload Structure</span>
                  </div>
               </div>
               <div className="bg-slate-900/80 rounded-[2rem] border border-white/5 p-8 font-mono text-xs">
                  <pre className="text-blue-300 leading-relaxed">
{`{
  "status": "success",
  "followers": 12500,
  "reach": 8200,
  "engagement_rate": "5.4%",
  "lead_score": 92,
  "last_node": "SyncComplete"
}`}
                  </pre>
               </div>
               <p className="text-[10px] text-slate-500 italic text-center">
                 Note: The dashboard will automatically update whenever it receives a POST request to the callback URL with a valid API key.
               </p>
            </div>
          </div>
        </section>
      )}

      {openSection === 'outbound' && (
        <section className="glass rounded-[3rem] p-12 border border-amber-500/10 animate-fade-in bg-slate-950/30">
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400"><Webhook className="w-6 h-6" /></div>
                    <h2 className="text-2xl font-bold text-white">Outbound Triggers</h2>
                 </div>
                 <p className="text-slate-400 leading-relaxed">
                   When InstaFlow detects a new interaction, it sends a webhook to your n8n workflow. This allows you to process the message using Gemini AI or store it in your own database.
                 </p>
                 
                 <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                       <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">1</div>
                       <div>
                          <h4 className="text-sm font-bold text-white mb-1">Create Webhook Node</h4>
                          <p className="text-xs text-slate-500">Add a 'Webhook' node in n8n set to **POST** method.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                       <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">2</div>
                       <div>
                          <h4 className="text-sm font-bold text-white mb-1">Copy Webhook URL</h4>
                          <p className="text-xs text-slate-500">Copy the production URL from n8n and paste it into the **Automations** tab for each rule.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-amber-400">
                    <FileCode className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Incoming Hook Data</span>
                 </div>
                 <div className="bg-slate-900/80 rounded-[2rem] border border-white/5 p-8 font-mono text-xs">
                    <pre className="text-amber-200 leading-relaxed">
{`{
  "event": "message_received",
  "sender_id": "829384752",
  "username": "@creative_mind",
  "content": "How much for the course?",
  "timestamp": "2024-10-27T10:00:00Z",
  "safety_limit": 50,
  "current_count": 12
}`}
                    </pre>
                 </div>
              </div>
           </div>
        </section>
      )}

      {openSection === 'auth' && (
        <section className="glass rounded-[3rem] p-12 border border-emerald-500/10 animate-fade-in bg-slate-950/30">
           <div className="max-w-4xl mx-auto space-y-10">
              <div className="flex items-center gap-4 justify-center text-center">
                 <div className="p-4 rounded-[2rem] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Key className="w-8 h-8" /></div>
                 <div>
                    <h2 className="text-3xl font-black text-white">Platform Security</h2>
                    <p className="text-slate-500 text-sm">Managing your API Secret Keys securely.</p>
                 </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-slate-900/60 border border-white/10 space-y-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Personal Integration Key</label>
                    <div className="relative">
                      <input readOnly value={apiKey} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-6 text-sm font-mono text-emerald-400 outline-none" />
                      <button onClick={() => handleCopy(apiKey, 'key')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                        {copiedField === 'key' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Best Practice
                       </h4>
                       <p className="text-xs text-slate-500 leading-relaxed">
                          Never share your API key. Rotate your key every 30 days in the **Workflow Bridge** settings to ensure maximum security.
                       </p>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-emerald-500" /> n8n Variable
                       </h4>
                       <p className="text-xs text-slate-500 leading-relaxed">
                          We recommend storing this key as an n8n **Credential** or a static environment variable to keep your workflow JSON clean.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* Footer Support */}
      <div className="glass rounded-[3rem] p-12 border border-white/10 flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 rounded-[2rem] bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shrink-0">
            <Info className="w-10 h-10 text-blue-400" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Integration Questions?</h3>
            <p className="text-slate-400 leading-relaxed">
               Our technical documentation covers complex edge cases like n8n local instance port forwarding and Meta review approval processes.
            </p>
         </div>
         <button 
          onClick={() => window.open('https://ai.google.dev/gemini-api/docs', '_blank')}
          className="bg-white/5 hover:bg-white/10 px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 border border-white/10 flex items-center gap-2"
         >
            API Docs <ExternalLink className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

export default N8nGuide;
