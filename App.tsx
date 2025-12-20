
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
import Webhooks from './pages/Webhooks';
import WorkflowLibrary from './pages/WorkflowLibrary';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AuthModal from './components/AuthModal';
import { PageType } from './types';
import { supabase } from './services/supabase';
import { Sparkles, X, User, Zap, Link, Trash2, Shield, Settings as SettingsIcon } from 'lucide-react';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  timezone: string;
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
    { id: 'start-2', event: 'Welcome', description: 'Logged in as guest user.', timestamp: '1m ago', type: 'security', icon: User, color: 'text-blue-400' },
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        addActivity('Session Restored', 'Welcome back to your dashboard.', 'security', Shield, 'text-emerald-400');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setShowAuthModal(false);
        addActivity('Login Successful', 'Authenticated via secure provider.', 'security', Shield, 'text-emerald-400');
      } else {
        setUserProfile({
          name: 'Guest User',
          email: 'guest@instaflow.ai',
          avatar: 'https://picsum.photos/160/160?random=1',
          plan: 'Free Trial',
          timezone: 'UTC'
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [addActivity]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: userId,
          name: session?.user?.user_metadata?.full_name || 'New User',
          email: session?.user?.email || '',
          avatar: session?.user?.user_metadata?.avatar_url || `https://picsum.photos/160/160?random=${userId.slice(0, 5)}`,
          plan: 'Pro Plan',
          timezone: 'UTC'
        };
        await supabase.from('profiles').insert([newProfile]);
        setUserProfile(newProfile);
      } else if (data) {
        setUserProfile(data);
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  };

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    const { error } = await supabase.from('profiles').update({
      name: updatedProfile.name,
      email: updatedProfile.email,
      avatar: updatedProfile.avatar,
      timezone: updatedProfile.timezone
    }).eq('id', session.user.id);
    
    if (!error) {
      setUserProfile(updatedProfile);
      addActivity('Profile Updated', 'Your personal information was refreshed.', 'update', User, 'text-blue-400');
    }
  };

  const notifyInProgress = () => {
    setShowProgressToast(true);
    setTimeout(() => setShowProgressToast(false), 4000);
  };

  const renderPage = () => {
    const commonProps = { 
      session, 
      onAuthRequired: () => setShowAuthModal(true), 
      onActionInProgress: notifyInProgress, 
      navigate: setActivePage,
      addActivity,
      activityLogs
    };
    
    const protectedPages: PageType[] = ['conversations', 'automations', 'ai-settings', 'accounts', 'webhooks'];
    if (!session && protectedPages.includes(activePage)) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
            <Sparkles className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-4">Authentication Required</h2>
          <p className="text-slate-400 max-w-sm mb-10 leading-relaxed text-sm md:text-base">Please sign in to access your {activePage.replace('-', ' ')} and manage your automations.</p>
          <button onClick={() => setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-[1.5rem] font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-95">Sign In Now</button>
        </div>
      );
    }

    switch(activePage) {
      case 'dashboard': return <Dashboard {...commonProps} />;
      case 'conversations': return <Conversations {...commonProps} />;
      case 'automations': return <Automations {...commonProps} />;
      case 'ai-settings': return <AIReplySettings />;
      case 'accounts': return <InstagramAccounts {...commonProps} />;
      case 'analytics': return <Analytics onActionInProgress={notifyInProgress} />;
      case 'webhooks': return <Webhooks onActionInProgress={notifyInProgress} />;
      case 'workflow-library': return <WorkflowLibrary {...commonProps} />;
      case 'settings': return <Settings profile={userProfile} onSave={handleUpdateProfile} onActionInProgress={notifyInProgress} session={session} onAuthRequired={() => setShowAuthModal(true)} activityLogs={activityLogs} />;
      case 'billing': return <Billing {...commonProps} />;
      case 'help': return <Help onActionInProgress={notifyInProgress} />;
      case 'profile': return <Profile profile={userProfile} onNavigate={setActivePage} onSignOut={() => supabase.auth.signOut()} activityLogs={activityLogs} />;
      default: return <Dashboard {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50 selection:bg-blue-500 selection:text-white">
      {/* Passed onSignOut prop to Sidebar */}
      <Sidebar 
        profile={userProfile} 
        activePage={activePage} 
        onPageChange={setActivePage} 
        onAuthRequired={() => setShowAuthModal(true)} 
        onSignOut={() => supabase.auth.signOut()}
        session={session} 
      />
      {/* 
        LAYOUT REFRESH: 
        lg:pl-64 preserves the desktop side margin.
        pt-20 on mobile creates space for the TOP navigation bar.
        pb-10 is standard spacing for the footer area.
      */}
      <main className={`flex-1 transition-all duration-300 lg:pl-64 pt-20 lg:pt-6 pb-10 px-4 md:px-12 overflow-x-hidden`}>
        <div className="max-w-[1500px] mx-auto">{renderPage()}</div>
      </main>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showProgressToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-fade-in pointer-events-none w-[calc(100%-2rem)] max-w-md">
          <div className="glass border border-blue-500/30 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl backdrop-blur-2xl bg-slate-900/80 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-blue-400" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Feature in Progress</p>
              <p className="text-xs text-slate-400 truncate">Our engineers are working on this module.</p>
            </div>
            <button onClick={() => setShowProgressToast(false)} className="p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
