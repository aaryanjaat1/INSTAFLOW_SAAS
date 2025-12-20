
import React, { useState, useEffect } from 'react';
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

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  timezone: string;
}

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Guest User',
    email: 'guest@instaflow.ai',
    avatar: 'https://picsum.photos/160/160?random=1',
    plan: 'Free Trial',
    timezone: 'UTC'
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setShowAuthModal(false);
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
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: userId,
          name: session?.user?.user_metadata?.full_name || 'New User',
          email: session?.user?.email || '',
          avatar: session?.user?.user_metadata?.avatar_url || 'https://picsum.photos/160/160?random=1',
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
    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', session.user.id);
    
    if (!error) setUserProfile(updatedProfile);
  };

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard />;
      case 'conversations': return <Conversations session={session} onAuthRequired={() => setShowAuthModal(true)} />;
      case 'automations': return <Automations session={session} onAuthRequired={() => setShowAuthModal(true)} />;
      case 'ai-settings': return <AIReplySettings session={session} onAuthRequired={() => setShowAuthModal(true)} />;
      case 'accounts': return <InstagramAccounts session={session} onAuthRequired={() => setShowAuthModal(true)} />;
      case 'analytics': return <Analytics />;
      case 'webhooks': return <Webhooks session={session} onAuthRequired={() => setShowAuthModal(true)} />;
      case 'workflow-library': return <WorkflowLibrary session={session} onAuthRequired={() => setShowAuthModal(true)} />;
      case 'settings': return <Settings profile={userProfile} onSave={handleUpdateProfile} />;
      case 'billing': return <Billing session={session} onAuthRequired={() => setShowAuthModal(true)} />;
      case 'help': return <Help />;
      case 'profile': return <Profile profile={userProfile} onNavigate={setActivePage} onSignOut={() => supabase.auth.signOut()} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50 selection:bg-blue-500 selection:text-white">
      <Sidebar profile={userProfile} activePage={activePage} onPageChange={setActivePage} session={session} />
      
      <main className={`flex-1 transition-all duration-300 px-8 py-10 ml-64 overflow-x-hidden`}>
        <div className="max-w-[1400px] mx-auto">
          {renderPage()}
        </div>
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default App;
