
import React, { useState } from 'react';
import { 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  Zap, 
  ChevronRight, 
  ExternalLink,
  ChevronDown,
  HelpCircle,
  TrendingUp,
  Download,
  Copy,
  CheckCircle2,
  ListOrdered,
  Terminal,
  Cpu,
  ShieldCheck,
  Globe,
  Settings,
  Lock,
  Code2,
  Database
} from 'lucide-react';

const categories = [
  {
    title: 'Meta Setup',
    description: 'Configure your Facebook App and IG Graph API.',
    icon: ShieldCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    title: 'n8n Logic',
    description: 'Build your automation backend in n8n.',
    icon: Zap,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  {
    title: 'AI Training',
    description: 'Tune your Gemini prompt for brand voice.',
    icon: MessageCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  }
];

const faqs = [
  {
    question: "What Meta permissions are required?",
    answer: "For full automation, you need: instagram_basic, instagram_manage_messages, instagram_manage_comments, pages_show_list, and pages_manage_metadata."
  },
  {
    question: "How do I sync my follower count?",
    answer: "Go to the Dashboard and click 'Fetch Live Data'. This sends a request to your n8n backend which queries the Meta Graph API /insights endpoint."
  }
];

const Help: React.FC<{ onActionInProgress: () => void }> = ({ onActionInProgress }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Specific URIs for the user's project
  const config = {
    jsOrigin: "http://localhost:3000",
    redirectUri: "https://xnkbfwqadcvpvtbmeldl.supabase.co/auth/v1/callback",
    supabaseRedirect: window.location.origin
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tight">Technical Implementation</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">Detailed guide for connecting Meta, n8n, and InstaFlow.</p>
      </div>

      {/* Developer Config Section */}
      <section className="glass rounded-[3rem] p-10 border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Code2 className="w-7 h-7" />
           </div>
           <div>
              <h2 className="text-2xl font-bold">OAuth Configuration (Localhost)</h2>
              <p className="text-slate-500 text-sm">Copy these values exactly into your developer consoles.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meta Developer Dashboard Side */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">1. Meta Developer Console</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Authorised JavaScript Origins</label>
                <div className="relative group">
                  <input readOnly value={config.jsOrigin} className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-blue-300 outline-none" />
                  <button onClick={() => handleCopy(config.jsOrigin, 'js')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {copiedField === 'js' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Authorised Redirect URIs</label>
                <div className="relative group">
                  <input readOnly value={config.redirectUri} className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-blue-300 outline-none" />
                  <button onClick={() => handleCopy(config.redirectUri, 'redirect')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {copiedField === 'redirect' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 italic mt-2">Note: Point this to your Supabase callback, not your localhost URL directly.</p>
              </div>
            </div>
          </div>

          {/* Supabase Dashboard Side */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">2. Supabase Dashboard</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Additional Redirect URL</label>
                <div className="relative group">
                  <input readOnly value={config.supabaseRedirect} className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-emerald-400 outline-none" />
                  <button onClick={() => handleCopy(config.supabaseRedirect, 'supa')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {copiedField === 'supa' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                 <p className="text-[11px] text-slate-400 leading-relaxed">
                   In **Supabase > Auth > URL Configuration**, add the localhost URL above to the "Redirect URLs" list so Supabase knows where to send the user after the Meta handshake.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meta API Setup Wizard (Static UI) */}
      <section className="glass rounded-[3rem] p-12 border border-white/10 relative overflow-hidden bg-gradient-to-br from-blue-600/5 to-transparent">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
        <div className="flex items-center gap-4 mb-10">
           <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Globe className="w-8 h-8" />
           </div>
           <div>
              <h2 className="text-2xl font-bold">Meta Graph API Setup Guide</h2>
              <p className="text-slate-500">Essential steps to authorize your business assets.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">1</div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">Create Facebook App</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Go to developers.facebook.com and create a "Business" type app.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">2</div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">Add Instagram Graph API</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Add the "Instagram Graph API" product to your app and configure webhooks.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">3</div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">Configure Supabase</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Enter your App ID and App Secret in the Supabase Auth > Providers > Facebook section.</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-slate-950/50 border border-white/5 space-y-6">
             <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                <Lock className="w-4 h-4" /> Required Scopes
             </div>
             <div className="flex flex-wrap gap-2">
                {['instagram_basic', 'instagram_manage_messages', 'pages_show_list', 'pages_read_engagement'].map(s => (
                  <div key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-slate-400">
                    {s}
                  </div>
                ))}
             </div>
             <p className="text-[11px] text-slate-500 italic leading-relaxed">
               * Without these approved scopes, Meta will block your App's access to user messages and analytics.
             </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden border border-white/5">
            <button 
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-semibold text-slate-200">{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === i && (
              <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed animate-fade-in">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
