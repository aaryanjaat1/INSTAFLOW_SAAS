
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  Users, 
  ShoppingBag, 
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Code,
  Layers,
  Clock,
  ArrowUpRight,
  X
} from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Sales' | 'Support' | 'Engagement' | 'Security';
  complexity: 'Easy' | 'Intermediate' | 'Advanced';
  nodes: number;
  icon: any;
  color: string;
  json: string;
}

const templates: WorkflowTemplate[] = [
  {
    id: '1',
    title: 'Smart Lead Qualification',
    description: 'Automatically score leads based on DM content and sync high-value prospects to your CRM or Google Sheets.',
    category: 'Sales',
    complexity: 'Intermediate',
    nodes: 8,
    icon: Users,
    color: 'text-blue-400',
    json: JSON.stringify({ name: 'Smart Lead Qualification', nodes: ['Webhook', 'Gemini AI', 'Conditional', 'Google Sheets'], version: 1.0 }, null, 2)
  },
  {
    id: '2',
    title: 'Instant Support Responder',
    description: 'Uses Gemini to provide accurate answers to common product questions using your custom knowledge base.',
    category: 'Support',
    complexity: 'Intermediate',
    nodes: 6,
    icon: MessageSquare,
    color: 'text-purple-400',
    json: JSON.stringify({ name: 'Instant Support Responder', nodes: ['Webhook', 'Vector Store Search', 'Gemini AI', 'InstaFlow Outbound'], version: 1.2 }, null, 2)
  },
  {
    id: '3',
    title: 'Story-to-Discount Flow',
    description: 'Triggered by Story Mentions. Sends a personalized thank you and a time-limited discount code to boost sales.',
    category: 'Sales',
    complexity: 'Easy',
    nodes: 4,
    icon: ShoppingBag,
    color: 'text-emerald-400',
    json: JSON.stringify({ name: 'Story-to-Discount Flow', nodes: ['Webhook', 'Story Mention Filter', 'Wait Node', 'DM Reply'], version: 1.0 }, null, 2)
  },
  {
    id: '4',
    title: 'Toxic Sentiment Filter',
    description: 'Monitors incoming comments for negative sentiment or spam. Automatically hides or flags for human review.',
    category: 'Security',
    complexity: 'Advanced',
    nodes: 10,
    icon: ShieldAlert,
    color: 'text-rose-400',
    json: JSON.stringify({ name: 'Toxic Sentiment Filter', nodes: ['Comment Webhook', 'Sentiment Analysis', 'Moderation Logic', 'Discord Alert'], version: 2.1 }, null, 2)
  },
  {
    id: '5',
    title: 'Engagement Booster',
    description: 'Identifies top fans based on recurring interactions and invites them to a private "Close Friends" group or community.',
    category: 'Engagement',
    complexity: 'Intermediate',
    nodes: 7,
    icon: Sparkles,
    color: 'text-amber-400',
    json: JSON.stringify({ name: 'Engagement Booster', nodes: ['Webhook', 'Supabase Lookup', 'Counter Node', 'DM Offer'], version: 1.1 }, null, 2)
  },
  {
    id: '6',
    title: 'Appointment Setter',
    description: 'Handles the back-and-forth of scheduling. Checks availability via Calendly API and confirms directly in DMs.',
    category: 'Sales',
    complexity: 'Advanced',
    nodes: 12,
    icon: Clock,
    color: 'text-indigo-400',
    json: JSON.stringify({ name: 'Appointment Setter', nodes: ['Webhook', 'Calendly API', 'Gemini Reasoning', 'Confirmation Loop'], version: 1.4 }, null, 2)
  }
];

interface WorkflowLibraryProps {
  session: any;
  onAuthRequired: () => void;
  onActionInProgress: () => void;
}

const WorkflowLibrary: React.FC<WorkflowLibraryProps> = ({ session, onAuthRequired, onActionInProgress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyJson = (template: WorkflowTemplate) => {
    if (!session) return onAuthRequired();
    navigator.clipboard.writeText(template.json);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', 'Sales', 'Support', 'Engagement', 'Security'];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            Workflow Library
          </h1>
          <p className="text-slate-400 text-lg">Import pre-built n8n automations to supercharge your Instagram growth.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-3">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-300">6 Templates Available</span>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search templates (e.g. Sales, Gemini, Support)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto whitespace-nowrap scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map(template => (
          <div 
            key={template.id} 
            className="glass rounded-[2.5rem] p-8 border border-white/5 hover:border-white/20 transition-all duration-500 group relative flex flex-col h-full overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] pointer-events-none -mr-16 -mt-16 transition-opacity duration-700 opacity-10 group-hover:opacity-30 ${template.color.replace('text', 'bg')}`}></div>
            
            <div className="flex items-start justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform ${template.color}`}>
                <template.icon className="w-7 h-7" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors">
                  {template.category}
                </span>
                <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${
                  template.complexity === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  template.complexity === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {template.complexity}
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{template.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-1">
              {template.description}
            </p>

            <div className="flex items-center justify-between py-6 border-t border-white/5 mt-auto">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-500">{template.nodes} Nodes</span>
              </div>
              <button 
                onClick={() => setSelectedTemplate(template)}
                className="text-xs font-bold text-blue-400 hover:text-white transition-colors flex items-center gap-1 group/btn"
              >
                View Workflow <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            <button 
              onClick={() => handleCopyJson(template)}
              className="w-full bg-white/5 hover:bg-blue-600 hover:text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-white/5 hover:border-blue-500 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {copiedId === template.id ? (
                <><CheckCircle2 className="w-4 h-4" /> JSON Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Import to n8n</>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="glass rounded-[3rem] p-24 text-center border-white/10 flex flex-col items-center">
          <Search className="w-16 h-16 text-slate-700 mb-6" />
          <h3 className="text-2xl font-bold text-slate-400">No templates found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search query or filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-8 text-blue-400 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Template Details Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="glass w-full max-w-5xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Info */}
              <div className="p-12 space-y-10">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-3xl bg-slate-950 flex items-center justify-center border border-white/10 ${selectedTemplate.color}`}>
                    <selectedTemplate.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">{selectedTemplate.title}</h2>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedTemplate.category}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                       <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{selectedTemplate.complexity}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">About this workflow</h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedTemplate.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">Workflow Components</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['Webhook Trigger', 'AI Processor', 'Database Sync', 'DM Response', 'Slack/Discord Alert', 'Logic Gate'].map((node, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-200">{node}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => handleCopyJson(selectedTemplate)}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    {copiedId === selectedTemplate.id ? (
                      <><CheckCircle2 className="w-5 h-5" /> Copied to Clipboard</>
                    ) : (
                      <><Copy className="w-5 h-5" /> Copy JSON for n8n Import</>
                    )}
                  </button>
                </div>
              </div>

              {/* Right: Code Preview / Visualization */}
              <div className="p-12 bg-slate-900/40 border-l border-white/5 relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Workflow JSON</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                    v{Math.floor(Math.random() * 3) + 1}.0 Ready
                  </div>
                </div>

                <div className="flex-1 glass-dark rounded-3xl p-6 font-mono text-xs text-blue-300 border border-white/10 overflow-auto custom-scrollbar max-h-[500px]">
                  <pre>{selectedTemplate.json}</pre>
                </div>

                <div className="mt-8 p-6 rounded-3xl bg-blue-600/10 border border-blue-600/20 flex gap-4">
                  <Sparkles className="w-6 h-6 text-blue-400 shrink-0" />
                  <div>
                    <h5 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">AI Recommendation</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      We recommend pairing this with <strong>Gemini 3 Flash</strong> for low-latency responses and cost-efficiency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="glass rounded-[2.5rem] p-12 border border-white/10 bg-gradient-to-br from-blue-600/5 to-transparent">
        <div className="flex flex-col md:flex-row items-center gap-10">
           <div className="w-20 h-20 rounded-[2rem] bg-slate-950 flex items-center justify-center border border-white/10 shrink-0">
              <Zap className="w-10 h-10 text-amber-400" />
           </div>
           <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Need a custom workflow?</h3>
              <p className="text-slate-400 leading-relaxed">
                Our engineering team can build bespoke n8n automations for your specific business logic. Available exclusively for Enterprise members.
              </p>
           </div>
           <button 
            onClick={onActionInProgress}
            className="bg-white text-slate-950 px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-2xl"
           >
              Talk to an Expert
           </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default WorkflowLibrary;
