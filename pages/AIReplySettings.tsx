
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Shield, 
  RotateCcw, 
  Smile, 
  Briefcase, 
  Hand, 
  Coins, 
  HeartHandshake,
  Plus,
  X,
  Volume2,
  Loader2,
  Save
} from 'lucide-react';
import { generateAIReply } from '../services/geminiService';
import { supabase } from '../services/supabase';

interface AIReplySettingsProps {
  session: any;
  onAuthRequired: () => void;
}

const AIReplySettings: React.FC<AIReplySettingsProps> = ({ session, onAuthRequired }) => {
  const [tone, setTone] = useState('Friendly');
  const [brandVoice, setBrandVoice] = useState("We're a friendly tech startup that loves helping businesses grow.");
  const [creativity, setCreativity] = useState(70);
  const [responseLength, setResponseLength] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewResponse, setPreviewResponse] = useState("Hey there! 👋 Thanks for reaching out! Our pricing starts at $29/month...");

  const [allowedPhrases, setAllowedPhrases] = useState(['Thanks for reaching out', 'Happy to help']);
  const [blockedPhrases, setBlockedPhrases] = useState(['Buy now', 'Act fast']);
  const [newAllowed, setNewAllowed] = useState('');
  const [newBlocked, setNewBlocked] = useState('');

  useEffect(() => {
    if (session) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('tone, brand_voice, creativity, blocked_phrases')
      .eq('id', session.user.id)
      .single();
    
    if (data && !error) {
      if (data.tone) setTone(data.tone);
      if (data.brand_voice) setBrandVoice(data.brand_voice);
      if (data.creativity) setCreativity(data.creativity);
      if (data.blocked_phrases) setBlockedPhrases(data.blocked_phrases);
    }
  };

  const handleSave = async () => {
    if (!session) return onAuthRequired();
    setIsSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        tone,
        brand_voice: brandVoice,
        creativity,
        blocked_phrases: blockedPhrases
      })
      .eq('id', session.user.id);
    
    if (!error) {
      alert("Settings saved. Your n8n nodes will now use these updated parameters.");
    }
    setIsSaving(false);
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    const reply = await generateAIReply(
      "Hi! I'm interested in your product. How much does it cost?", 
      tone, 
      brandVoice, 
      blockedPhrases
    );
    setPreviewResponse(reply);
    setIsLoading(false);
  };

  const addPhrase = (type: 'allowed' | 'blocked') => {
    if (type === 'allowed' && newAllowed.trim()) {
      setAllowedPhrases([...allowedPhrases, newAllowed.trim()]);
      setNewAllowed('');
    } else if (type === 'blocked' && newBlocked.trim()) {
      setBlockedPhrases([...blockedPhrases, newBlocked.trim()]);
      setNewBlocked('');
    }
  };

  const removePhrase = (type: 'allowed' | 'blocked', index: number) => {
    if (type === 'allowed') {
      setAllowedPhrases(allowedPhrases.filter((_, i) => i !== index));
    } else {
      setBlockedPhrases(blockedPhrases.filter((_, i) => i !== index));
    }
  };

  const tones = [
    { name: 'Friendly', icon: Smile, desc: 'Warm and approachable' },
    { name: 'Professional', icon: Briefcase, desc: 'Business-like tone' },
    { name: 'Casual', icon: Hand, desc: 'Relaxed and informal' },
    { name: 'Sales', icon: Coins, desc: 'Persuasive and goal-oriented' },
    { name: 'Support', icon: HeartHandshake, desc: 'Helpful and empathetic' },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">AI Intelligence Configuration</h1>
          <p className="text-slate-400">Values here feed your n8n "Map Tone and Strength" node.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 font-bold shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 transition-all"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Sync with n8n
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <section className="glass rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-6">
              <Volume2 className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Tone of Voice</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tones.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTone(t.name)}
                  className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left group ${
                    tone === t.name 
                    ? 'bg-purple-600/10 border-purple-500/50 ring-1 ring-purple-500/20' 
                    : 'bg-slate-800/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    tone === t.name ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    <t.icon className="w-5 h-5" />
                  </div>
                  <span className={`font-bold ${tone === t.name ? 'text-white' : 'text-slate-300'}`}>{t.name}</span>
                  <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">{t.desc}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="glass rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Brand Voice</h2>
            </div>
            <textarea
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 outline-none min-h-[120px] resize-none"
              placeholder="Describe your brand voice..."
            />
          </section>

          <section className="glass rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Inference Strength</h2>
            </div>
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-300">Creativity (n8n Prompt Weight)</span>
                  <span className="text-slate-500 font-mono">{creativity}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={creativity}
                  onChange={(e) => setCreativity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </section>

          <section className="glass rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Phrase Controls</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-rose-500 uppercase tracking-widest">Blocked Phrases (n8n Safety Check)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" value={newBlocked}
                    onChange={(e) => setNewBlocked(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPhrase('blocked')}
                    placeholder="Add restricted phrase..."
                    className="flex-1 bg-slate-900/60 border border-white/5 rounded-xl px-4 py-2 text-sm outline-none"
                  />
                  <button onClick={() => addPhrase('blocked')} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-colors border border-white/5">
                    <Plus className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blockedPhrases.map((p, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                      {p}
                      <button onClick={() => removePhrase('blocked', i)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-[2.5rem] p-8 border border-white/10 sticky top-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold">Live Preview</h2>
              </div>
              <button 
                onClick={handleRegenerate}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-black">User</span>
                </div>
                <div className="bg-slate-800/80 rounded-2xl p-4 text-sm text-slate-200 max-w-[85%] border border-white/5">
                  Hi! I'm interested in your product. How much does it cost?
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end">
                <div className="relative group max-w-[85%]">
                  <div className="relative bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-4 text-sm text-white shadow-xl shadow-blue-500/10 min-h-[80px]">
                    {isLoading ? (
                      <div className="flex gap-1 h-full items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    ) : (
                      <p className="leading-relaxed">{previewResponse}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-3xl p-6 border border-white/5 space-y-4 mb-10">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Active Tone</span>
                <span className="text-slate-200">{tone}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-widest">AI Strength</span>
                <span className="text-slate-200">{creativity}%</span>
              </div>
            </div>

            <button onClick={handleSave} className="w-full mt-8 bg-blue-600 hover:bg-blue-500 py-4 rounded-[2rem] font-bold text-white transition-all shadow-lg active:scale-95">
              Sync with Production Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIReplySettings;
