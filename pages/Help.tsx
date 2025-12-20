
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
  Cpu
} from 'lucide-react';

const categories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics and connect your first account.',
    icon: Book,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    title: 'n8n Integration',
    description: 'Connect InstaFlow to your automation backend.',
    icon: Zap,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  {
    title: 'AI Reply Tuning',
    description: 'Optimize your AI personality and response quality.',
    icon: MessageCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  }
];

const faqs = [
  {
    question: "Is InstaFlow compliant with Meta's terms?",
    answer: "Yes, we exclusively use the official Meta Graph API. We do not use scraping or private APIs that could jeopardize your account safety."
  },
  {
    question: "How do I connect my n8n instance?",
    answer: "Go to the 'Automations' page, copy your rule's unique webhook URL, and paste it into a Webhook Trigger node in n8n. Set the method to POST."
  },
  {
    question: "Can I use multiple Instagram accounts?",
    answer: "Yes, our Pro and Enterprise plans allow you to connect multiple Business accounts and manage them from a single dashboard."
  },
  {
    question: "What happens if I reach my message limit?",
    answer: "Automations will pause until the next billing cycle or until you upgrade your plan. Manual messaging remains available."
  }
];

// Updated model to 'gemini-3-flash-preview' per guidelines
const n8nTemplateJSON = `{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "instaflow-trigger",
        "options": {}
      },
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "model": "gemini-3-flash-preview",
        "prompt": "={{$json.body.message}}",
        "systemInstruction": "You are a helpful assistant..."
      },
      "name": "Gemini AI",
      "type": "n8n-nodes-base.googleGemini",
      "typeVersion": 1,
      "position": [450, 300]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [[{ "node": "Gemini AI", "type": "main", "index": 0 }]]
    }
  }
}`;

interface HelpProps {
  onActionInProgress: () => void;
}

const Help: React.FC<HelpProps> = ({ onActionInProgress }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(n8nTemplateJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const popularSearches = ['Connect Meta', 'n8n Webhooks', 'AI Tone', 'Billing'];

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto pb-20">
      {/* Hero Search Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] glass p-12 text-center border border-white/10 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight">How can we help you?</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Search our extensive knowledge base for tutorials, guides, and troubleshooting tips.
          </p>
          
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl group-focus-within:bg-blue-500/30 transition-all rounded-full"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-6 w-6 h-6 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onActionInProgress()}
                placeholder="Search articles, FAQs, and documentation..." 
                className="w-full bg-slate-900/80 border-2 border-white/10 group-focus-within:border-blue-500/50 rounded-[2rem] py-6 pl-16 pr-8 text-lg font-medium shadow-2xl focus:outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Popular:</span>
            </div>
            {popularSearches.map(term => (
              <button 
                key={term}
                onClick={() => { setSearchQuery(term); onActionInProgress(); }}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div key={i} onClick={onActionInProgress} className="glass rounded-3xl p-8 hover:glow-purple transition-all duration-300 cursor-pointer group border border-white/5 hover:border-white/10">
            <div className={`w-14 h-14 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 border border-white/5`}>
              <cat.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              {cat.title}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">{cat.description}</p>
          </div>
        ))}
      </div>

      {/* n8n Integration Deep Dive Guide */}
      <section className="glass rounded-[2.5rem] overflow-hidden border border-white/10 scroll-mt-10" id="n8n-guide">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-10 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900/50 flex items-center justify-center border border-white/10 shadow-2xl">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold">Complete n8n Integration Guide</h2>
                <p className="text-slate-400 mt-1">Deploy production-ready automation workflows in minutes.</p>
              </div>
            </div>
            <button 
              onClick={handleCopyTemplate}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20"
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              {copied ? 'Copied Workflow!' : 'Download Template'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Step by Step */}
          <div className="p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <ListOrdered className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">Implementation Steps</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { step: '01', title: 'Create Webhook Node', text: 'Open n8n and add a Webhook node. Set the HTTP Method to POST and Authentication to None (or Header Auth).' },
                { step: '02', title: 'Get Production URL', text: 'Save your workflow and copy the "Production URL" from the Webhook node settings.' },
                { step: '03', title: 'Link to InstaFlow', text: 'Go to your Automations page in InstaFlow, create a new rule, and paste your n8n URL.' },
                { step: '04', title: 'Configure AI Logic', text: 'Use n8n AI nodes (Gemini/GPT) to process the incoming "message" field from the webhook body.' },
                { step: '05', title: 'Send Response Back', text: 'Use an HTTP Request node to POST the final reply back to the InstaFlow Outbound API.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="text-2xl font-black text-slate-800 group-hover:text-blue-500/20 transition-colors select-none">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-200">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code & Preview */}
          <div className="p-10 bg-slate-900/40">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Workflow JSON (Copy-Paste)</span>
              </div>
              <button 
                onClick={handleCopyTemplate}
                className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3 h-3" /> {copied ? 'COPIED' : 'COPY ALL'}
              </button>
            </div>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-slate-950 border border-white/5 rounded-2xl p-6 font-mono text-sm overflow-x-auto max-h-[400px] custom-scrollbar">
                <pre className="text-blue-300">
                  {n8nTemplateJSON}
                </pre>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-300">Technical Note</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The payload sent from InstaFlow contains <code>user_id</code>, <code>username</code>, and <code>message_content</code>. Ensure your Gemini prompt references these dynamic values for personalization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        {/* FAQ Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <button onClick={onActionInProgress} className="text-sm text-blue-400 font-bold hover:underline">See all FAQs</button>
          </div>
          <div className="space-y-4">
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

        {/* Video Tutorials */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Video Tutorials</h2>
            <button onClick={onActionInProgress} className="text-sm text-blue-400 font-bold hover:underline">Browse Video Library</button>
          </div>
          <div className="space-y-4">
            <div onClick={onActionInProgress} className="glass rounded-3xl p-4 flex gap-4 group cursor-pointer hover:bg-white/5 transition-colors border border-white/5 hover:border-white/10">
              <div className="w-32 h-24 bg-slate-800 rounded-2xl relative overflow-hidden shrink-0 border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 py-1">
                <h4 className="font-bold text-slate-200 mb-1 group-hover:text-blue-400 transition-colors">Mastering n8n AI Nodes</h4>
                <p className="text-xs text-slate-500 line-clamp-2">Build advanced decision logic inside your n8n workflows for complex DM scenarios.</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider bg-blue-400/10 px-2 py-0.5 rounded">Advanced</span>
                  <span className="text-[10px] text-slate-500 font-medium italic">12:45 mins</span>
                </div>
              </div>
            </div>

            <div onClick={onActionInProgress} className="glass rounded-3xl p-4 flex gap-4 group cursor-pointer hover:bg-white/5 transition-colors border border-white/5 hover:border-white/10">
              <div className="w-32 h-24 bg-slate-800 rounded-2xl relative overflow-hidden shrink-0 border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 py-1">
                <h4 className="font-bold text-slate-200 mb-1 group-hover:text-blue-400 transition-colors">Setting up Meta Business Suite</h4>
                <p className="text-xs text-slate-500 line-clamp-2">Step-by-step guide to configuring your Instagram permissions correctly for the first time.</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded">Beginner</span>
                  <span className="text-[10px] text-slate-500 font-medium italic">08:20 mins</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/20 shadow-2xl shadow-blue-500/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shadow-inner">
                <HelpCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Still need help?</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Our support team is available 24/7 for Pro and Enterprise members. Open a ticket or start a live chat.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={onActionInProgress} className="bg-blue-600 px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Contact Support
              </button>
              <button onClick={onActionInProgress} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
                Full Documentation <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
