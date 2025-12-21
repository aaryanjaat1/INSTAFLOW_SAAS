
import React, { useState } from 'react';
import { X, Sparkles, Instagram, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase, signInWithGoogle } from '../services/supabase';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        alert('Verification email sent!');
      }
      onClose();
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      <div 
        className="glass w-full max-w-lg rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden bg-slate-900/60" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 blur-[80px] -ml-16 -mb-16"></div>

        <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-xl hover:bg-white/5 text-slate-500 transition-all z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 mt-2 text-sm">Join the next generation of Instagram automation.</p>
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
            Sign in with Google
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.2em]"><span className="bg-[#121a2c] px-4 text-slate-500">Or use Secure Email</span></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500/50 transition-all text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500/50 transition-all text-white"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-medium text-center">
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

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-8 leading-relaxed uppercase tracking-tighter">
          Platform session secured with AES-256 via Supabase.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
