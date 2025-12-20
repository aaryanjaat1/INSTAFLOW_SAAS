
import React, { useState } from 'react';
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
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { PageType } from './types';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: string;
  timezone: string;
}

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Rivera',
    email: 'alex@instaflow.ai',
    avatar: 'https://picsum.photos/160/160?random=1',
    plan: 'Pro Plan',
    timezone: 'Pacific Time (PT) - Los Angeles'
  });

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard />;
      case 'conversations': return <Conversations />;
      case 'automations': return <Automations />;
      case 'ai-settings': return <AIReplySettings />;
      case 'accounts': return <InstagramAccounts />;
      case 'analytics': return <Analytics />;
      case 'webhooks': return <Webhooks />;
      case 'settings': return <Settings profile={userProfile} onSave={handleUpdateProfile} />;
      case 'billing': return <Billing />;
      case 'help': return <Help />;
      case 'profile': return <Profile profile={userProfile} onNavigate={setActivePage} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50 selection:bg-blue-500 selection:text-white">
      <Sidebar profile={userProfile} activePage={activePage} onPageChange={setActivePage} />
      
      <main className={`flex-1 transition-all duration-300 px-8 py-10 ml-64 overflow-x-hidden`}>
        <div className="max-w-[1400px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
