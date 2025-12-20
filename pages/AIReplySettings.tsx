
import React, { useState } from 'react';
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
  Volume2
} from 'lucide-react';
import { generateAIReply } from '../services/geminiService';

const AIReplySettings: React.FC = () => {
  const [tone, setTone] = useState('Friendly');
  const [brandVoice, setBrandVoice] = useState("We're a friendly tech startup that loves helping businesses grow. Our tone is casual but professional.");
  const [creativity, setCreativity] = useState(70);
  const [responseLength, setResponseLength] = useState(50);
  
  const [allowedPhrases, setAllowedPhrases] = useState(['Thanks for reaching out', 'Happy to help', 'Let me know']);
  const [blockedPhrases, setBlockedPhrases] = useState(['Buy now', 'Limited time', 'Act fast']);
  const [newAllowed, setNewAllowed] = useState('');
  const [newBlocked, setNewBlocked] = useState('');

  const [useEmojis, setUseEmojis] = useState(true);
  const [addSignature, setAddSignature] = useState(false);
  const [includeCTA, setIncludeCTA] = useState(true);

  const [previewResponse, setPreviewResponse] = useState("Hey there! 👋 Thanks for reaching out! Our pricing starts at $29/month for the Starter plan, which is perfect for individuals. Our most popular Pro plan is $79/month and includes all features. Would you like me to share more details about what's included?");
  const [isLoading, setIsLoading] = useState(false);

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

  const Toggle = ({ enabled, setEnabled, label }: any) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          enabled ? 'bg-purple-600' : 'bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Settings */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tone of Voice */}
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
                    tone === t.name ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <t.icon className="w-5 h-5" />
                  </div>
                  <span className={`font-bold ${tone === t.name ? 'text-white' : 'text-slate-300'}`}>{t.name}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{t.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Brand Voice */}
          <section className="glass rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Brand Voice</h2>
            </div>
            <textarea
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:ring-1 focus:ring-purple-500 outline-none min-h-[120px] resize-none"
              placeholder="Describe your brand voice..."
            />
            <p className="text-[10px] text-slate-500 mt-3">This helps the AI understand how to communicate as your brand</p>
          </section>

          {/* Response Settings */}
          <section className="glass rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Response Settings</h2>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-300">Creativity</span>
                  <span className="text-slate-500 font-mono">{creativity}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={creativity}
                  onChange={(e) => setCreativity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-300">Response Length</span>
                  <span className="text-slate-500 font-mono">{responseLength} words avg.</span>
                </div>
                <input 
                  type="range" 
                  min="10" max="150" 
                  value={responseLength}
                  onChange={(e) => setResponseLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                  <span>Short</span>
                  <span>Long</span>
                </div>
              </div>
            </div>
          </section>

          {/* Phrase Controls */}
          <section className="glass rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Phrase Controls</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Allowed Phrases</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newAllowed}
                    onChange={(e) => setNewAllowed(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPhrase('allowed')}
                    placeholder="Add allowed phrase..."
                    className="flex-1 bg-slate-900/60 border border-white/5 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <button onClick={() => addPhrase('allowed')} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-colors border border-white/5">
                    <Plus className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allowedPhrases.map((p, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                      {p}
                      <button onClick={() => removePhrase('allowed', i)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-rose-500 uppercase tracking-widest">Blocked Phrases</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newBlocked}
                    onChange={(e) => setNewBlocked(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPhrase('blocked')}
                    placeholder="Add blocked phrase..."
                    className="flex-1 bg-slate-900/60 border border-white/5 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-rose-500 outline-none"
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

        {/* Right Column: Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-[2.5rem] p-8 border border-white/10 sticky top-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold">Preview</h2>
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

            {/* Chat Preview */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/10">
                  <span className="text-[10px] text-slate-400">User</span>
                </div>
                <div className="bg-slate-800/80 rounded-2xl p-4 text-sm text-slate-200 max-w-[85%] border border-white/5">
                  Hi! I'm interested in your product. How much does it cost?
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end">
                <div className="relative group max-w-[85%]">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-4 text-sm text-white shadow-xl shadow-blue-500/10 min-h-[80px]">
                    {isLoading ? (
                      <div className="flex gap-1 h-full items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    ) : (
                      <p className="leading-relaxed">
                        {previewResponse}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary List */}
            <div className="bg-slate-900/60 rounded-3xl p-6 border border-white/5 space-y-4 mb-10">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Tone</span>
                <span className="text-slate-200">{tone}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Creativity</span>
                <span className="text-slate-200">{creativity}%</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Target Length</span>
                <span className="text-slate-200">{responseLength} words</span>
              </div>
            </div>

            {/* Switches */}
            <div className="space-y-2 pt-6 border-t border-white/5">
              <Toggle enabled={useEmojis} setEnabled={setUseEmojis} label="Use Emojis" />
              <Toggle enabled={addSignature} setEnabled={setAddSignature} label="Add Signature" />
              <Toggle enabled={includeCTA} setEnabled={setIncludeCTA} label="Include CTA" />
            </div>

            <button className="w-full mt-8 bg-blue-600 hover:bg-blue-500 py-4 rounded-[2rem] font-bold text-white transition-all shadow-lg shadow-blue-600/20 active:scale-95">
              Apply Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIReplySettings;
