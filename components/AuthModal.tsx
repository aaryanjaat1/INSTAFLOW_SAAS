
import React, { useState } from 'react';
import { X, Mail, Github, LogIn, Sparkles } from 'lucide-react';
import { supabase, signInWithGoogle } from '../services/supabase';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-md rounded-[2.5rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 blur-3xl"></div>

        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 text-slate-500 transition-all">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to InstaFlow</h2>
          <p className="text-slate-400 mt-2">Sign in to unlock all premium features.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs font-bold uppercase tracking-widest">or email</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : <><LogIn className="w-5 h-5" /> Send Magic Link</>}
            </button>
          </form>

          {message && <p className="text-center text-xs font-medium text-emerald-400 animate-fade-in">{message}</p>}
        </div>

        <p className="text-center text-[10px] text-slate-500 mt-8 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
