
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Zap, 
  Sparkles, 
  Instagram, 
  BarChart3, 
  Webhook, 
  Settings, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogIn,
  Library
} from 'lucide-react';
import { PageType } from '../types';
import { UserProfile } from '../App';

interface SidebarProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
  profile: UserProfile;
  session: any;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange, profile, session }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard' as PageType, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'conversations' as PageType, icon: MessageSquare, label: 'Conversations' },
    { id: 'automations' as PageType, icon: Zap, label: 'Automations' },
    { id: 'ai-settings' as PageType, icon: Sparkles, label: 'AI Reply Settings' },
    { id: 'accounts' as PageType, icon: Instagram, label: 'Instagram Accounts' },
    { id: 'analytics' as PageType, icon: BarChart3, label: 'Analytics' },
    { id: 'webhooks' as PageType, icon: Webhook, label: 'Webhooks / n8n' },
    { id: 'workflow-library' as PageType, icon: Library, label: 'Workflow Library' },
    { id: 'settings' as PageType, icon: Settings, label: 'Settings' },
    { id: 'billing' as PageType, icon: CreditCard, label: 'Billing' },
    { id: 'help' as PageType, icon: HelpCircle, label: 'Help Center' },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full glass border-r border-white/10 transition-all duration-300 z-50 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight gradient-text">InstaFlow</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 mt-6 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 group relative
              ${activePage === item.id 
                ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${activePage === item.id ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
            {collapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        {!session ? (
          <button 
            onClick={() => onPageChange('profile')}
            className="w-full bg-blue-600 hover:bg-blue-500 rounded-2xl p-4 mb-4 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            {!collapsed ? <><LogIn className="w-4 h-4" /> Sign In</> : <LogIn className="w-5 h-5" />}
          </button>
        ) : (
          !collapsed && (
            <button 
              onClick={() => onPageChange('profile')}
              className={`w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4 mb-4 border transition-all text-left group ${activePage === 'profile' ? 'border-purple-500/50 bg-white/10' : 'border-white/5'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={profile.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate text-slate-100">{profile.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{profile.plan}</p>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full w-3/4 transition-all duration-1000"></div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">750/1000 messages</p>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </button>
          )
        )}
        
        {session && collapsed && (
          <button 
            onClick={() => onPageChange('profile')}
            className="w-10 h-10 mx-auto rounded-full border-2 border-purple-500/30 hover:border-purple-500 transition-all mb-4 overflow-hidden block"
          >
             <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </button>
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
