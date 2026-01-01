
import React, { useState } from 'react';
import { 
  ChevronDown,
  HelpCircle,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Facebook,
  Layout,
  MousePointer2,
  Rocket,
  Video,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { PageType } from '../types';

interface HelpProps {
  onActionInProgress: () => void;
  onNavigate: (page: PageType) => void;
}

const faqs = [
  {
    question: "How do I move from Development to Production?",
    answer: "You must complete Business Verification in the Meta Business Manager and submit for 'instagram_manage_messages' App Review."
  },
  {
    question: "Why aren't my webhooks firing?",
    answer: "Ensure you've called the /subscribed_apps endpoint (happens automatically when you link via this dashboard) and that your n8n URL is accessible to the public internet."
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
    redirectUri: "https://xnkbfwqadcvpvtbmeldl.supabase.co/auth/v1/callback",
    privacy: `${window.location.origin}/privacy`,
    terms: `${window.location.origin}/terms`,
    deletion: `${window.location.origin}/data-deletion`,
    appDomain: window.location.hostname
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto pb-32">
      <div>
        <h1 className="text-5xl font-black tracking-tighter mb-2">Production Deployment</h1>
        <p className="text-slate-400 text-lg">Follow this guide to take your automation live for real customers.</p>
      </div>

      {/* Production Readiness Checklist */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Video, label: 'Screencast', desc: 'Record yourself using the bot to show Meta how it works.' },
          { icon: FileCheck, label: 'Review', desc: 'Apply for instagram_manage_messages scope.' },
          { icon: Rocket, label: 'Live Mode', desc: 'Toggle your App from Development to Live mode.' }
        ].map((item, i) => (
          <div key={i} className="glass rounded-3xl p-8 border border-white/5 hover:border-blue-500/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">{item.label}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Meta OAuth Setup Card */}
      <section className="glass rounded-[3rem] p-12 border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2] border border-[#1877F2]/20">
              <Facebook className="w-7 h-7 fill-current" />
           </div>
           <div>
              <h2 className="text-2xl font-black">Meta App Configuration</h2>
              <p className="text-slate-500 text-sm">Essential values for your Meta Developer Dashboard.</p>
           </div>
        </div>

        <div className="space-y-6 max-w-3xl">
           <div className="p-6 rounded-[2rem] bg-slate-900 border border-white/10 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                 <MousePointer2 className="w-4 h-4 text-blue-400" /> OAuth Redirect URI
              </h4>
              <div className="relative">
                <input readOnly value={config.redirectUri} className="w-full bg-slate-950 border border-white/10 rounded-xl py-4 px-5 text-xs font-mono text-blue-300 outline-none" />
                <button onClick={() => handleCopy(config.redirectUri, 'oauth_uri')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  {copiedField === 'oauth_uri' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {[
            { label: 'Privacy Policy', value: config.privacy },
            { label: 'Data Deletion', value: config.deletion }
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{item.label}</label>
              <div className="relative">
                <input readOnly value={item.value} className="w-full bg-slate-900/80 border border-white/5 rounded-xl py-3 px-4 text-xs font-mono text-slate-400 outline-none" />
                <button onClick={() => handleCopy(item.value, `meta_${i}`)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {copiedField === `meta_${i}` ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass rounded-3xl overflow-hidden border border-white/5">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5">
              <span className="font-bold text-slate-200">{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === i && <div className="px-8 pb-6 text-sm text-slate-400 leading-relaxed animate-fade-in">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
