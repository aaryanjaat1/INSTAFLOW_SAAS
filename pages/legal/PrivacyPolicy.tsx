
import React from 'react';
import { Shield, Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
      </div>
      
      <div className="glass rounded-[2.5rem] p-10 space-y-8 text-slate-400 leading-relaxed border border-white/10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Introduction</h2>
          <p>InstaFlow AI respects your privacy. This policy explains how we handle your data when you use our Instagram automation services.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Data Collection via Meta Graph API</h2>
          <p>We only access data you explicitly authorize via the Meta OAuth handshake. This includes message text, sender IDs, and account metadata required to run your automations.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. Data Security</h2>
          <p>Your access tokens are encrypted using AES-256 and stored in a secure Supabase vault. We do not share your tokens or private messages with any third parties other than Google Gemini for text processing.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">4. User Rights</h2>
          <p>You can revoke access to your Instagram account at any time through our 'Accounts' dashboard or by removing the InstaFlow app from your Facebook Settings.</p>
        </section>

        <div className="pt-10 border-t border-white/5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <p className="text-xs uppercase font-black tracking-widest text-slate-600">Last Updated: October 2024</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
