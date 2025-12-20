
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
  HelpCircle
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

const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Help & Knowledge Base</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Search our documentation or browse categories to find answers to your questions.
        </p>
        <div className="relative max-w-2xl mx-auto mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search for guides, articles, FAQs..." 
            className="w-full glass bg-white/5 border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-1 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="glass rounded-3xl p-8 hover:glow-purple transition-all duration-300 cursor-pointer group">
            <div className={`w-14 h-14 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
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
          <h2 className="text-2xl font-bold">Latest Video Tutorials</h2>
          <div className="space-y-4">
            <div className="glass rounded-3xl p-4 flex gap-4 group cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-32 h-20 bg-slate-800 rounded-xl relative overflow-hidden shrink-0">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <Video className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 py-1">
                <h4 className="font-bold text-slate-200 mb-1">Mastering n8n AI Nodes</h4>
                <p className="text-xs text-slate-500">Learn how to build advanced decision logic inside your n8n workflows.</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Advanced</span>
                  <span className="text-[10px] text-slate-500">12:45 mins</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-4 flex gap-4 group cursor-pointer hover:bg-white/5 transition-colors">
              <div className="w-32 h-20 bg-slate-800 rounded-xl relative overflow-hidden shrink-0">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <Video className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 py-1">
                <h4 className="font-bold text-slate-200 mb-1">Setting up Meta Business Suite</h4>
                <p className="text-xs text-slate-500">Step-by-step guide to configuring your Instagram permissions correctly.</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Beginner</span>
                  <span className="text-[10px] text-slate-500">08:20 mins</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Still need help?</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Our support team is available 24/7 for Pro and Enterprise members. Open a ticket or start a live chat.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-colors">
                Contact Support
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                Documentation <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
