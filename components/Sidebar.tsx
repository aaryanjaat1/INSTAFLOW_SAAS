
import React, { useState, useEffect } from 'react';
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
  Library,
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { PageType } from '../types';
import { UserProfile } from '../App';

interface SidebarProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
  onAuthRequired: () => void;
  onSignOut: () => void;
  profile: UserProfile;
  session: any;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange, onAuthRequired, onSignOut, profile, session }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const primaryItems = [
    { id: 'dashboard' as PageType, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'conversations' as PageType, icon: MessageSquare, label: 'Inbox' },
    { id: 'automations' as PageType, icon: Zap, label: 'Automations' },
    { id: 'analytics' as PageType, icon: BarChart3, label: 'Analytics' },
  ];

  const secondaryItems = [
    { id: 'ai-settings' as PageType, icon: Sparkles, label: 'AI Settings' },
    { id: 'accounts' as PageType, icon: Instagram, label: 'Accounts' },
    { id: 'webhooks' as PageType, icon: Webhook, label: 'n8n Config' },
    { id: 'workflow-library' as PageType, icon: Library, label: 'Workflow Library' },
    { id: 'settings' as PageType, icon: Settings, label: 'Settings' },
    { id: 'billing' as PageType, icon: CreditCard, label: 'Billing' },
    { id: 'help' as PageType, icon: HelpCircle, label: 'Help & Support' },
  ];

  const handleNav = (id: PageType) => {
    onPageChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <aside className={`fixed top-0 left-0 h-full glass border-r border-white/10 transition-all duration-300 z-50 hidden lg:flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
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

        <nav className="flex-1 px-4 mt-6 overflow-y-auto custom-scrollbar space-y-1">
          {primaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${activePage === item.id 
                  ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${activePage === item.id ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}

          <div className="my-4 border-t border-white/5 mx-2"></div>

          {secondaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative
                ${activePage === item.id 
                  ? 'bg-white/5 text-white border border-white/5' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon className={`w-4 h-4 transition-colors ${activePage === item.id ? 'text-purple-400' : 'group-hover:text-purple-400'}`} />
              {!collapsed && <span className="font-medium text-[13px]">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          {!session ? (
            <button 
              onClick={onAuthRequired}
              className="w-full bg-blue-600 hover:bg-blue-500 rounded-2xl p-4 mb-4 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95 text-white"
            >
              {!collapsed ? <><LogIn className="w-4 h-4" /> Sign In</> : <LogIn className="w-5 h-5" />}
            </button>
          ) : (
            !collapsed ? (
              <button 
                onClick={() => handleNav('profile')}
                className={`w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4 mb-4 border transition-all text-left group ${activePage === 'profile' ? 'border-purple-500/50 bg-white/10' : 'border-white/5'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={profile.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate text-slate-100">{profile.name}</p>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{profile.plan}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full w-3/4 transition-all duration-1000"></div>
                </div>
              </button>
            ) : (
               <button onClick={() => handleNav('profile')} className="w-10 h-10 mx-auto rounded-full border-2 border-purple-500/30 mb-4 overflow-hidden">
                  <img src={profile.avatar} className="w-full h-full object-cover" alt="User" />
               </button>
            )
          )}
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      <nav className={`fixed top-0 left-0 w-full h-16 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 flex lg:hidden items-center justify-around px-4 z-[100] transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="flex items-center gap-2 absolute left-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-black text-[10px] tracking-tighter uppercase text-white hidden xs:block">InstaFlow</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button onClick={() => handleNav('dashboard')} className={`p-2 transition-colors ${activePage === 'dashboard' ? 'text-blue-400' : 'text-slate-500'}`}>
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <button onClick={() => handleNav('conversations')} className={`p-2 transition-colors ${activePage === 'conversations' ? 'text-blue-400' : 'text-slate-500'}`}>
            <MessageSquare className="w-5 h-5" />
          </button>
          <button onClick={() => handleNav('automations')} className={`p-2 transition-colors ${activePage === 'automations' ? 'text-blue-400' : 'text-slate-500'}`}>
            <Zap className="w-5 h-5" />
          </button>
          <button onClick={() => handleNav('billing')} className={`p-2 transition-colors ${activePage === 'billing' ? 'text-blue-400' : 'text-slate-500'}`}>
            <CreditCard className="w-5 h-5" />
          </button>
        </div>

        <button onClick={() => setMobileMenuOpen(true)} className="absolute right-4 p-2 text-slate-500">
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute bottom-0 left-0 w-full glass rounded-t-[3rem] border-t border-white/10 p-8 flex flex-col max-h-[90vh] overflow-y-auto shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8"></div>
            
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                  <img src={profile.avatar} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/5" alt="User" />
                  <div>
                    <h3 className="font-bold text-lg text-white">{profile.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{profile.plan}</p>
                  </div>
               </div>
               <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-white/5 rounded-2xl">
                  <X className="w-6 h-6 text-slate-400" />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {secondaryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all ${
                    activePage === item.id 
                    ? 'bg-blue-600/10 border-blue-500/50 text-white' 
                    : 'bg-white/5 border-white/5 text-slate-400'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">{item.label}</span>
                </button>
              ))}
            </div>

            {!session ? (
               <button 
                onClick={() => { onAuthRequired(); setMobileMenuOpen(false); }}
                className="w-full bg-blue-600 py-5 rounded-2xl font-bold text-white shadow-xl shadow-blue-600/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
               >
                 <LogIn className="w-5 h-5" /> Sign In to Platform
               </button>
            ) : (
              <button 
                onClick={() => { onSignOut(); setMobileMenuOpen(false); }}
                className="w-full bg-rose-500/10 text-rose-500 py-5 rounded-2xl font-bold border border-rose-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
