
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import Automations from './pages/Automations';
import AIReplySettings from './pages/AIReplySettings';
import InstagramAccounts from './pages/InstagramAccounts';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';
import { PageType } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>('dashboard');

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard />;
      case 'conversations': return <Conversations />;
      case 'automations': return <Automations />;
      case 'ai-settings': return <AIReplySettings />;
      case 'accounts': return <InstagramAccounts />;
      case 'analytics': return <Analytics />;
      case 'billing': return <Billing />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50 selection:bg-blue-500 selection:text-white">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      
      <main className={`flex-1 transition-all duration-300 px-8 py-10 ml-64 overflow-x-hidden`}>
        <div className="max-w-[1400px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
