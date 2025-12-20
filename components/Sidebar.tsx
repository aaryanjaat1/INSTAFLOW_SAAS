
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
  LogOut
} from 'lucide-react';
import { PageType } from '../types';

interface SidebarProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard' as PageType, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'conversations' as PageType, icon: MessageSquare, label: 'Conversations' },
    { id: 'automations' as PageType, icon: Zap, label: 'Automations' },
    { id: 'ai-settings' as PageType, icon: Sparkles, label: 'AI Reply Settings' },
    { id: 'accounts' as PageType, icon: Instagram, label: 'Instagram Accounts' },
    { id: 'analytics' as PageType, icon: BarChart3, label: 'Analytics' },
    { id: 'webhooks' as PageType, icon: Webhook, label: 'Webhooks / n8n' },
    { id: 'settings' as PageType, icon: Settings, label: 'Settings' },
    { id: 'billing' as PageType, icon: CreditCard, label: 'Billing' },
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
        {!collapsed && (
          <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <img src="https://picsum.photos/40/40?random=1" alt="Profile" className="w-10 h-10 rounded-full border-2 border-purple-500/30" />
              <div>
                <p className="text-sm font-semibold truncate max-w-[120px]">Alex Rivera</p>
                <p className="text-xs text-slate-400">Pro Plan</p>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full w-3/4"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">750/1000 messages</p>
          </div>
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
