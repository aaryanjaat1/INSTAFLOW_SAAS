import React from 'react';
import { Trash2, ShieldAlert } from 'lucide-react';

const DataDeletion: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
          <Trash2 className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Data Deletion Instructions</h1>
      </div>
      
      <div className="glass rounded-[2.5rem] p-10 space-y-8 text-slate-400 leading-relaxed border border-white/10">
        <p className="text-white font-bold">InstaFlow AI allows you to delete your personal data and disconnect from our services at any time.</p>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white">Method 1: Via InstaFlow Dashboard</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>Log in to your InstaFlow account.</li>
            <li>Go to the <strong>&apos;Accounts&apos;</strong> tab.</li>
            <li>Find the Instagram account you wish to remove.</li>
            <li>Click <strong>&apos;Revoke Access&apos;</strong>. This will delete all stored tokens and metadata related to that account.</li>
          </ol>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white">Method 2: Via Facebook Settings</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>Go to your Facebook Profile Settings &amp; Privacy.</li>
            <li>Click <strong>&apos;Settings&apos;</strong>.</li>
            <li>Navigate to <strong>&apos;Security and Login&apos;</strong> &gt; <strong>&apos;Apps and Websites&apos;</strong>.</li>
            <li>Find <strong>&apos;InstaFlow&apos;</strong> and click Remove.</li>
          </ol>
        </section>

        <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10">
          <div className="flex items-center gap-3 text-rose-400 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="font-bold">Final Removal</h3>
          </div>
          <p className="text-xs">If you wish to delete your entire platform profile including your email and activity logs, please contact support@instaflow.ai with the subject &quot;Account Deletion Request&quot;.</p>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;