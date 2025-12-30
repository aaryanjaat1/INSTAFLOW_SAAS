
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
  Database,
  ArrowRight,
  ShieldAlert,
  Layout,
  MousePointer2,
  Facebook
} from 'lucide-react';
import { PageType } from '../types';

interface HelpProps {
  onActionInProgress: () => void;
  onNavigate: (page: PageType) => void;
}

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

const Help: React.FC<HelpProps> = ({ onActionInProgress, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const config = {
    jsOrigin: window.location.origin,
    redirectUri: "https://xnkbfwqadcvpvtbmeldl.supabase.co/auth/v1/callback",
    privacy: `${window.location.origin}/privacy`,
    terms: `${window.location.origin}/terms`,
    deletion: `${window.location.origin}/data-deletion`,
    appDomain: window.location.hostname
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">Setup Guide</h1>
          <p className="text-slate-400 text-lg">Complete these steps to activate your Instagram automation.</p>
        </div>
      </div>

      {/* Meta OAuth Setup Card */}
      <section className="glass rounded-[3rem] p-12 border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] -mr-32 -mt-32 pointer-events-none"></div>
        
        <div className="flex items-center gap-4 mb-10">
           <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2] border border-[#1877F2]/20">
              <Facebook className="w-7 h-7 fill-current" />
           </div>
           <div>
              <h2 className="text-2xl font-black">Meta OAuth Setup</h2>
              <p className="text-slate-500 text-sm">Vital step to allow Instagram login within the app.</p>
           </div>
        </div>

        <div className="space-y-6 max-w-3xl">
           <div className="p-6 rounded-[2rem] bg-slate-900 border border-white/10 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                 <MousePointer2 className="w-4 h-4 text-blue-400" /> 1. Add Valid OAuth Redirect URI
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                 In your Meta Developer Portal, go to **Facebook Login &gt; Settings** and paste this URL into the **Valid OAuth Redirect URIs** field:
              </p>
              <div className="relative group">
                <input 
                  readOnly 
                  value={config.redirectUri} 
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-4 px-5 text-xs font-mono text-blue-300 outline-none" 
                />
                <button 
                  onClick={() => handleCopy(config.redirectUri, 'oauth_uri')} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {copiedField === 'oauth_uri' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
           </div>

           <div className="p-6 rounded-[2rem] bg-slate-900 border border-white/10 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" /> 2. App Status
              </h4>
              <p className="text-sm text-slate-300">
                Ensure your app is in **Live** mode (top right toggle in Meta Dashboard) and your Business Verification is complete.
              </p>
           </div>
        </div>
      </section>

      {/* Meta App Basic Settings Quick Copy */}
      <section className="glass rounded-[3rem] p-12 border border-slate-500/10">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/10">
              <Layout className="w-7 h-7" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-white">App Compliance Details</h2>
              <p className="text-slate-500 text-sm">Values for your "Basic Settings" page.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: 'Privacy Policy URL', value: config.privacy },
            { label: 'Terms of Service URL', value: config.terms },
            { label: 'Data Deletion URL', value: config.deletion },
            { label: 'App Domain', value: config.appDomain }
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">{item.label}</label>
              <div className="relative">
                <input readOnly value={item.value} className="w-full bg-slate-900/80 border border-white/5 rounded-xl py-3 px-4 text-xs font-mono text-slate-400 outline-none" />
                <button onClick={() => handleCopy(item.value, `meta_${i}`)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {copiedField === `meta_${i}` ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass rounded-3xl overflow-hidden border border-white/5">
            <button 
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-bold text-slate-200">{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === i && (
              <div className="px-8 pb-6 text-sm text-slate-400 leading-relaxed animate-fade-in">
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
