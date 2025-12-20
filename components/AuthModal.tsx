
import React, { useState } from 'react';
/* Added RefreshCw to the imports from lucide-react */
import { X, Mail, LogIn, Sparkles, Lock, User, ArrowLeft, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, signInWithGoogle } from '../services/supabase';

interface AuthModalProps {
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot' | 'update-password';

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setSuccessMessage('Registration successful! Please check your email for a confirmation link.');
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}?type=recovery`,
        });
        if (error) throw error;
        setSuccessMessage('Password reset link sent! Check your inbox.');
      } else if (mode === 'update-password') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setSuccessMessage('Password updated successfully!');
        setTimeout(() => setMode('signin'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (successMessage) {
      return (
        <div className="text-center py-8 space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-slate-200 font-medium">{successMessage}</p>
          {mode !== 'signup' && (
            <button 
              onClick={() => { setSuccessMessage(null); setMode('signin'); }}
              className="text-blue-400 font-bold hover:underline text-sm"
            >
              Back to Login
            </button>
          )}
        </div>
      );
    }

    return (
      <form onSubmit={handleAuth} className="space-y-4 animate-fade-in">
        {mode === 'signup' && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all"
            />
          </div>
        )}

        {mode !== 'update-password' && (
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all"
            />
          </div>
        )}

        {mode !== 'forgot' && (
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="password" 
              placeholder={mode === 'update-password' ? "New Password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all"
            />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-xs font-medium bg-rose-400/10 p-3 rounded-xl border border-rose-400/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {mode === 'signin' && <><LogIn className="w-5 h-5" /> Sign In</>}
              {mode === 'signup' && <><User className="w-5 h-5" /> Create Account</>}
              {mode === 'forgot' && <><RefreshCw className="w-5 h-5" /> Reset Password</>}
              {mode === 'update-password' && <><Lock className="w-5 h-5" /> Update Password</>}
            </>
          )}
        </button>

        <div className="flex flex-col gap-3 mt-4">
          {mode === 'signin' && (
            <>
              <button 
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
              >
                Forgot your password?
              </button>
              <p className="text-xs text-slate-500">
                Don't have an account? {' '}
                <button type="button" onClick={() => setMode('signup')} className="text-blue-400 font-bold hover:underline">Sign Up</button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p className="text-xs text-slate-500">
              Already have an account? {' '}
              <button type="button" onClick={() => setMode('signin')} className="text-blue-400 font-bold hover:underline">Log In</button>
            </p>
          )}
          {mode === 'forgot' && (
            <button 
              type="button"
              onClick={() => setMode('signin')}
              className="flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </button>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-md rounded-[2.5rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 blur-3xl"></div>

        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 text-slate-500 transition-all z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Get Started'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'update-password' && 'New Password'}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {mode === 'signin' && 'Sign in to access your dashboard'}
            {mode === 'signup' && 'Create an account to start automating'}
            {mode === 'forgot' && "We'll send you a magic recovery link"}
            {mode === 'update-password' && 'Enter a strong new password'}
          </p>
        </div>

        {mode !== 'forgot' && mode !== 'update-password' && (
          <div className="space-y-4 mb-6">
            <button 
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">or email</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>
          </div>
        )}

        {renderForm()}

        <p className="text-center text-[10px] text-slate-600 mt-8 leading-relaxed">
          Secure authentication powered by Supabase. Your data is encrypted and safe.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
