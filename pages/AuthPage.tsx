
import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Github,
  CheckCircle2,
  ShieldCheck,
  Instagram
} from 'lucide-react';
import { supabase, signInWithGoogle } from '../services/supabase';

interface AuthPageProps {
  onActionInProgress: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onActionInProgress }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Branding Side */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <Sparkles className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-black tracking-tighter gradient-text">InstaFlow AI</span>
          </div>
          
          <h1 className="text-6xl font-black leading-[1.1] tracking-tight">
            Automate your <br />
            <span className="text-slate-500">Instagram Growth.</span>
          </h1>
          
          <p className="text-slate-400 text-xl leading-relaxed max-w-md">
            The professional choice for scaling DMs, comments, and story engagement using official Meta APIs.
          </p>
          
          <div className="space-y-4 pt-4">
            {[
              "Official Meta Graph API v20.0",
              "Human-like AI with Gemini 3",
              "Advanced n8n Workflow Integration",
              "Bank-grade Data Encryption"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Auth Form Side */}
        <div className="glass rounded-[3.5rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden bg-white/[0.02]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-500 text-sm">Start your 14-day free trial. No credit card required.</p>
          </div>

          <div className="space-y-6">
            {/* Google Social Auth */}
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-slate-100 active:scale-[0.98] shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-[#121a2c] px-4 text-slate-500">Or use email</span></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    required
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-4">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 opacity-40 grayscale pointer-events-none">
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-slate-300">
               <ShieldCheck className="w-4 h-4" /> SSL SECURE
             </div>
             <div className="w-px h-4 bg-white/20"></div>
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-slate-300">
               <Instagram className="w-4 h-4" /> META PARTNER
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
