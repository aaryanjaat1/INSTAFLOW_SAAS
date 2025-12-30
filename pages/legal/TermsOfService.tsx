
import React from 'react';
import { FileText, Scale } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
      </div>
      
      <div className="glass rounded-[2.5rem] p-10 space-y-8 text-slate-400 leading-relaxed border border-white/10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>By using InstaFlow AI, you agree to comply with Meta's Platform Terms and our Service Terms.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Automation Limits</h2>
          <p>You agree not to use InstaFlow for spam or unsolicited mass messaging. You are responsible for ensuring your automation rules comply with Instagram's community guidelines.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. Platform Changes</h2>
          <p>We are not liable for changes to the Meta Graph API that may affect service availability. We provide our tool as-is for business growth optimization.</p>
        </section>

        <div className="pt-10 border-t border-white/5 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <p className="text-xs uppercase font-black tracking-widest text-slate-600">InstaFlow AI Legal Division</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
