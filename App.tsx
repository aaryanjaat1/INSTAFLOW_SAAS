
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import Automations from './pages/Automations';
import AIReplySettings from './pages/AIReplySettings';
import InstagramAccounts from './pages/InstagramAccounts';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';
import Help from './pages/Help';
import N8nGuide from './pages/N8nGuide';
import Webhooks from './pages/Webhooks';
import WorkflowLibrary from './pages/WorkflowLibrary';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AuthModal from './components/AuthModal';
import { PageType } from './types';
import { supabase, signInWithMeta } from './services/supabase';
import { Sparkles, X, User, Zap, Shield, Instagram, Loader2, LogIn } from 'lucide-react';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  timezone: string;
  tone?: string;
  brand_voice?: string;
  creativity?: number;
}

export interface ActivityLog {
  id: string;
  event: string;
  description: string;
  timestamp: string;
  type: 'message' | 'trigger' | 'lead' | 'system' | 'mention' | 'comment' | 'update' | 'security';
  icon: any;
  color: string;
}

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [isAuthenticatingMeta, setIsAuthenticatingMeta] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProgressToast, setShowProgressToast] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Guest User',
    email: 'guest@instaflow.ai',
    avatar: 'https://picsum.photos/160/160?random=1',
    plan: 'Free Trial',
    timezone: 'UTC'
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: 'start-1', event: 'System Online', description: 'InstaFlow engine initialized successfully.', timestamp: 'Just now', type: 'system', icon: Shield, color: 'text-purple-400' },
  ]);

  const addActivity = useCallback((event: string, description: string, type: ActivityLog['type'], icon: any, color: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      event,
      description,
      timestamp: 'Just now',
      type,
      icon,
      color
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const checkInstagramConnection = useCallback(async (userId: string) => {
    const { data } = await supabase.from('instagram_accounts').select('id').eq('user_id', userId).limit(1);
    setInstagramConnected(!!data && data.length > 0);
  }, []);

  const fetchProfile = useCallback(async (userId: string, metadata: any) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: userId,
          name: metadata?.full_name || metadata?.email?.split('@')[0] || 'New User',
          email: metadata?.email || '',
          avatar: metadata?.avatar_url || `https://picsum.photos/160/160?random=${userId.slice(0, 5)}`,
          plan: 'Pro Plan',
          timezone: 'UTC'
        };
        await supabase.from('profiles').insert([newProfile]);
        setUserProfile(newProfile);
      } else if (data) {
        setUserProfile(data);
      }
      checkInstagramConnection(userId);
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  }, [checkInstagramConnection]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id, session.user.user_metadata);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id, session.user.user_metadata);
        setShowAuthModal(false);
        if (event === 'SIGNED_IN') {
           addActivity('Login Successful', 'Authenticated platform session.', 'security', Shield, 'text-emerald-400');
        }
      } else {
        setUserProfile({
          name: 'Guest User',
          email: 'guest@instaflow.ai',
          avatar: 'https://picsum.photos/160/160?random=1',
          plan: 'Free Trial',
          timezone: 'UTC'
        });
        setInstagramConnected(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [addActivity, fetchProfile]);

  const handleMetaAuth = async () => {
    if (!session) return setShowAuthModal(true);
    setIsAuthenticatingMeta(true);
    const { error } = await signInWithMeta();
    if (error) {
      console.error("Meta redirect failed:", error);
      setIsAuthenticatingMeta(false);
    }
  };

  const notifyInProgress = () => {
    setShowProgressToast(true);
    setTimeout(() => setShowProgressToast(false), 4000);
  };

  const renderPage = () => {
    const commonProps = { 
      session, 
      onAuthRequired: handleMetaAuth, 
      onActionInProgress: notifyInProgress, 
      navigate: setActivePage,
      addActivity,
      activityLogs
    };

    // Stage 1 Gating: Require Platform Login (Email/Google)
    const platformAuthRequiredPages: PageType[] = ['conversations', 'automations', 'ai-settings', 'accounts', 'analytics', 'webhooks', 'n8n-guide', 'billing', 'settings'];
    if (!session && platformAuthRequiredPages.includes(activePage)) {
      return (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-[2rem] bg-blue-600/10 flex items-center justify-center mb-8 border border-blue-500/20 shadow-2xl">
            <LogIn className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-black mb-4">Platform Sign-In Required</h2>
          <p className="text-slate-400 max-w-sm mb-10 leading-relaxed">Please sign in with your Google account or email to access this workspace.</p>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/30 transition-all active:scale-95"
          >
            Open Sign-In Portal
          </button>
        </div>
      );
    }

    // Stage 2 Gating: Require Instagram Connection (Meta OAuth)
    const igRequiredPages: PageType[] = ['conversations', 'automations', 'accounts'];
    if (session && !instagramConnected && igRequiredPages.includes(activePage)) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
          <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 flex items-center justify-center mb-10 shadow-2xl shadow-purple-500/20">
            <Instagram className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">Link Instagram</h2>
          <p className="text-slate-400 max-w-sm mb-12 leading-relaxed text-sm md:text-lg">Now that you're in, connect your Instagram Business account via Meta Graph API to enable automations.</p>
          <button 
            onClick={handleMetaAuth} 
            disabled={isAuthenticatingMeta}
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-3"
          >
            {isAuthenticatingMeta ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Instagram className="w-5 h-5" /> Connect with Meta</>}
          </button>
        </div>
      );
    }

    switch(activePage) {
      case 'dashboard': return <Dashboard {...commonProps} />;
      case 'conversations': return <Conversations {...commonProps} />;
      case 'automations': return <Automations {...commonProps} />;
      case 'ai-settings': return <AIReplySettings session={session} onAuthRequired={handleMetaAuth} />;
      case 'accounts': return <InstagramAccounts {...commonProps} />;
      case 'analytics': return <Analytics onActionInProgress={notifyInProgress} />;
      case 'webhooks': return <Webhooks onActionInProgress={notifyInProgress} session={session} />;
      case 'n8n-guide': return <N8nGuide onActionInProgress={notifyInProgress} session={session} />;
      case 'workflow-library': return <WorkflowLibrary {...commonProps} />;
      case 'settings': return <Settings profile={userProfile} onSave={fetchProfile as any} onActionInProgress={notifyInProgress} session={session} onAuthRequired={handleMetaAuth} activityLogs={activityLogs} />;
      case 'billing': return <Billing {...commonProps} />;
      case 'help': return <Help onActionInProgress={notifyInProgress} />;
      case 'profile': return <Profile profile={userProfile} onNavigate={setActivePage} onSignOut={() => supabase.auth.signOut()} />;
      default: return <Dashboard {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50 selection:bg-blue-500 selection:text-white">
      <Sidebar 
        profile={userProfile} 
        activePage={activePage} 
        onPageChange={setActivePage} 
        onAuthRequired={() => setShowAuthModal(true)} 
        onSignOut={() => supabase.auth.signOut()}
        session={session} 
      />
      
      <main className={`flex-1 transition-all duration-300 lg:pl-64 pt-20 lg:pt-6 pb-10 px-4 md:px-12 overflow-x-hidden`}>
        <div className="max-w-[1500px] mx-auto">{renderPage()}</div>
      </main>
      
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
      {isAuthenticatingMeta && (
        <div className="fixed inset-0 z-[500] bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
           <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mb-8"></div>
           <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Meta Handshake</h2>
           <p className="text-slate-500 text-sm">Authorizing Instagram Graph API scopes...</p>
        </div>
      )}

      {showProgressToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-fade-in pointer-events-none w-[calc(100%-2rem)] max-w-md">
          <div className="glass border border-blue-500/30 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl backdrop-blur-2xl bg-slate-900/80 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-blue-400" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Module Restricted</p>
              <p className="text-xs text-slate-400 truncate">Feature is active in full deployment mode.</p>
            </div>
            <button onClick={() => setShowProgressToast(false)} className="p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
