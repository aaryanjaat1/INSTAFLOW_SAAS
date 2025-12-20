
import React, { useState } from 'react';
import { Instagram, Facebook, CheckCircle2, AlertCircle, RefreshCw, Unlink } from 'lucide-react';

const InstagramAccounts: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate OAuth Flow
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Instagram Accounts</h1>
        <p className="text-slate-400">Manage your connected Business accounts and permissions.</p>
      </div>

      {!isConnected ? (
        <div className="glass rounded-3xl p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center mb-8 shadow-xl shadow-purple-500/20">
            <Instagram className="text-white w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Connect your Instagram Business Account</h2>
          <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
            InstaFlow uses the official Meta Graph API to securely manage your messages. 
            No passwords are saved, and you can revoke access at any time.
          </p>
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-blue-500/20"
          >
            {isConnecting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Facebook className="w-5 h-5 fill-white" />
            )}
            {isConnecting ? 'Authenticating...' : 'Continue with Meta'}
          </button>
          <p className="mt-6 text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Official Meta Business Partner Security
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 group">
            <div className="relative">
              <img 
                src="https://picsum.photos/100/100?random=50" 
                alt="Brand" 
                className="w-24 h-24 rounded-full border-4 border-slate-800"
              />
              <div className="absolute bottom-1 right-1 bg-emerald-500 border-4 border-[#0f172a] w-6 h-6 rounded-full"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h3 className="text-xl font-bold">@the_ai_revolution</h3>
                <CheckCircle2 className="w-5 h-5 text-blue-400 fill-blue-400/20" />
              </div>
              <p className="text-slate-400 mb-4">Business Account • 12,450 Followers</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-slate-300">DMs ACTIVE</span>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-slate-300">COMMENTS ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Token
              </button>
              <button 
                onClick={() => setIsConnected(false)}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-6 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Unlink className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-500 mb-1 text-sm">Action Required: Webhook Setup</h4>
              <p className="text-xs text-amber-500/80 leading-relaxed">
                You haven't configured your main Webhook URL yet. To receive real-time messages, go to the Webhooks page and provide your n8n endpoint.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h3 className="font-bold mb-6">Permission Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Manage DMs', status: true },
            { label: 'Manage Comments', status: true },
            { label: 'Access Public Metadata', status: true },
            { label: 'Story Management', status: false }
          ].map((perm, i) => (
            <div key={i} className="glass rounded-2xl p-4 flex items-center justify-between">
              <span className="text-sm font-medium">{perm.label}</span>
              {perm.status ? (
                <div className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">GRANTED</div>
              ) : (
                <div className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded text-[10px] font-bold">REQUIRED</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramAccounts;
