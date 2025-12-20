
import React, { useState } from 'react';
import { Sparkles, MessageSquare, Shield, Play, Save, RotateCcw } from 'lucide-react';
import { generateAIReply } from '../services/geminiService';

const AIReplySettings: React.FC = () => {
  const [tone, setTone] = useState('friendly');
  const [brandVoice, setBrandVoice] = useState('Professional yet casual, focused on empowering the user.');
  const [blockedPhrases, setBlockedPhrases] = useState('buy now, act fast, limited time');
  const [testPrompt, setTestPrompt] = useState('How can I start learning AI?');
  const [previewResponse, setPreviewResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = async () => {
    setIsLoading(true);
    const phrases = blockedPhrases.split(',').map(p => p.trim());
    const reply = await generateAIReply(testPrompt, tone, brandVoice, phrases);
    setPreviewResponse(reply);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Personality</h1>
        <p className="text-slate-400">Define how your AI assistant communicates with your audience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="glass rounded-3xl p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <label className="font-bold">Conversation Tone</label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['friendly', 'professional', 'enthusiastic'].map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`py-3 rounded-2xl text-sm font-bold capitalize transition-all border ${
                    tone === t ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <label className="font-bold">Brand Voice Description</label>
            </div>
            <textarea
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              className="w-full bg-slate-800/50 border-white/5 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-blue-500 min-h-[120px]"
              placeholder="e.g. Modern, tech-focused, helpful..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-rose-400" />
              <label className="font-bold">Safety & Constraints</label>
            </div>
            <p className="text-xs text-slate-400 mb-2">Blocked phrases (comma separated):</p>
            <input
              type="text"
              value={blockedPhrases}
              onChange={(e) => setBlockedPhrases(e.target.value)}
              className="w-full bg-slate-800/50 border-white/5 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. spam, crypto, buy now"
            />
          </div>

          <div className="pt-4">
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              <Save className="w-5 h-5" />
              Save Configuration
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Live AI Preview</h2>
              <button 
                onClick={() => setPreviewResponse('')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Test Message</label>
                <div className="relative">
                  <input
                    type="text"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    className="w-full bg-slate-800/50 border-white/5 rounded-2xl p-4 pr-16 text-sm focus:ring-1 focus:ring-blue-500"
                    placeholder="Type a message to test AI..."
                  />
                  <button 
                    onClick={handlePreview}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2.5 rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Generated Response</label>
                <div className="min-h-[160px] bg-slate-900/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  {isLoading && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                  {previewResponse ? (
                    <p className="text-sm leading-relaxed text-slate-200">{previewResponse}</p>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Configure your settings and click play to see the AI in action...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 bg-gradient-to-br from-slate-900 to-indigo-900/20">
            <h3 className="font-bold mb-4">Pro Tips</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                <p className="text-xs text-slate-400">Use "Brand Voice" to specify your business hours so AI doesn't promise immediate human support.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5"></div>
                <p className="text-xs text-slate-400">Keep constraints minimal. Over-constraining can lead to repetitive or unnatural sounding replies.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIReplySettings;
