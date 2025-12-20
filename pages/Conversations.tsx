
import React, { useState } from 'react';
import { Search, Send, Sparkles, User, Info, MoreVertical, Paperclip, Smile, MessageSquare, ChevronLeft } from 'lucide-react';
import { Conversation, Message } from '../types';

const mockConversations: Conversation[] = [
  {
    id: '1',
    username: 'julia_art',
    lastMessage: 'Hey! How much for the course?',
    timestamp: '2m ago',
    avatar: 'https://picsum.photos/50/50?random=10',
    unread: 1,
    messages: [
      { id: '1-1', sender: 'julia_art', avatar: 'https://picsum.photos/50/50?random=10', content: 'Hey there!', timestamp: '10:00 AM', isAI: false, status: 'received' },
      { id: '1-2', sender: 'AI Assistant', avatar: 'https://picsum.photos/50/50?random=2', content: 'Hello Julia! Thanks for reaching out. How can I help you today?', timestamp: '10:01 AM', isAI: true, status: 'sent' },
      { id: '1-3', sender: 'julia_art', avatar: 'https://picsum.photos/50/50?random=10', content: 'I saw your latest reel about the AI course. How much does it cost?', timestamp: '10:05 AM', isAI: false, status: 'received' }
    ]
  },
  {
    id: '2',
    username: 'tech_guru',
    lastMessage: 'Check this out...',
    timestamp: '15m ago',
    avatar: 'https://picsum.photos/50/50?random=11',
    unread: 0,
    messages: []
  },
  {
    id: '3',
    username: 'design_daily',
    lastMessage: 'Sent a story reply',
    timestamp: '1h ago',
    avatar: 'https://picsum.photos/50/50?random=12',
    unread: 0,
    messages: []
  },
];

interface ConversationsProps {
  onActionInProgress: () => void;
}

const Conversations: React.FC<ConversationsProps> = ({ onActionInProgress }) => {
  const [activeChat, setActiveChat] = useState<Conversation | null>(mockConversations[0]);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [inputText, setInputText] = useState('');
  const [aiSuggestion] = useState('Sure! Our AI course starts at $197. It covers everything from prompt engineering to full automation workflows. Would you like a checkout link?');

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Me',
      avatar: 'https://picsum.photos/160/160?random=1',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: false,
      status: 'sent'
    };
    setActiveChat({
      ...activeChat,
      messages: [...activeChat.messages, newMessage]
    });
    setInputText('');
  };

  const handleApplyAiSuggestion = () => {
    setInputText(aiSuggestion);
  };

  const handleSelectChat = (chat: Conversation) => {
    setActiveChat(chat);
    setShowChatOnMobile(true);
  };

  return (
    <div className="h-[calc(100vh-160px)] lg:h-[calc(100vh-120px)] flex gap-6 animate-fade-in relative overflow-hidden">
      {/* Sidebar - Conversations List (Responsive Toggle) */}
      <div className={`w-full lg:w-96 glass rounded-3xl overflow-hidden flex flex-col shrink-0 transition-all duration-300 ${showChatOnMobile ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold mb-4">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              onChange={onActionInProgress}
              className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {mockConversations.map(chat => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`w-full p-4 flex gap-4 transition-all duration-200 border-l-4 ${activeChat?.id === chat.id ? 'bg-white/10 border-blue-500' : 'hover:bg-white/5 border-transparent'}`}
            >
              <div className="relative shrink-0">
                <img src={chat.avatar} alt={chat.username} className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-lg" />
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-slate-900 shadow-xl">
                    {chat.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span className="font-bold text-sm truncate text-white">@{chat.username}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter whitespace-nowrap">{chat.timestamp}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread > 0 ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area (Responsive Toggle) */}
      <div className={`flex-1 glass rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ${showChatOnMobile ? 'flex' : 'hidden lg:flex'}`}>
        {activeChat ? (
          <>
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowChatOnMobile(false)} className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-xl text-slate-400">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="relative">
                  <img src={activeChat.avatar} alt={activeChat.username} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-xl"></div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm lg:text-base truncate">@{activeChat.username}</h3>
                  <p className="text-[10px] lg:text-xs font-black uppercase text-emerald-400 tracking-widest">Active Insight</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button onClick={onActionInProgress} className="p-2.5 hover:bg-white/10 rounded-xl transition-all"><Info className="w-5 h-5" /></button>
                <button onClick={onActionInProgress} className="p-2.5 hover:bg-white/10 rounded-xl transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 custom-scrollbar bg-slate-950/20">
              {activeChat.messages.length > 0 ? activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isAI || msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] lg:max-w-[70%] rounded-[2rem] p-5 text-sm shadow-xl ${
                    msg.isAI || msg.sender === 'Me'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none' 
                    : 'bg-slate-900/80 text-slate-200 border border-white/5 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.content}</p>
                    <div className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-40 text-right`}>
                      {msg.timestamp} {msg.isAI ? '• AI ASSISTED' : ''}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                   <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                   <p className="text-xs font-bold uppercase tracking-widest">No history found</p>
                </div>
              )}
            </div>

            <div className="p-4 lg:p-6 border-t border-white/5 bg-slate-900/60">
              <div className="flex flex-col gap-4">
                {/* AI Quick Response suggestion bar - desktop only */}
                <div className="hidden lg:flex items-center justify-between bg-purple-500/10 border border-purple-500/20 p-3 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <p className="text-xs text-slate-300 italic truncate max-w-lg">{aiSuggestion}</p>
                   </div>
                   <button onClick={handleApplyAiSuggestion} className="px-3 py-1 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-purple-400 transition-all">Use AI</button>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1 bg-slate-950/80 border border-white/10 rounded-3xl p-2 focus-within:border-blue-500/50 transition-all">
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a secure message..."
                      className="w-full bg-transparent border-none resize-none px-4 py-3 text-sm focus:outline-none min-h-[44px] max-h-32 custom-scrollbar text-white"
                    />
                    <div className="flex items-center justify-between px-3 pb-2 pt-1">
                      <div className="flex gap-2">
                        <button onClick={onActionInProgress} className="p-2 hover:bg-white/10 rounded-xl text-slate-500 transition-all"><Paperclip className="w-4 h-4" /></button>
                        <button onClick={onActionInProgress} className="p-2 hover:bg-white/10 rounded-xl text-slate-500 transition-all"><Smile className="w-4 h-4" /></button>
                      </div>
                      <button 
                        onClick={handleSend}
                        className="bg-blue-600 p-2.5 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 active:scale-90"
                      >
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-950/20">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-center mb-6 shadow-2xl opacity-40">
               <MessageSquare className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-400">Secure Direct Messaging</h4>
            <p className="text-xs max-w-xs mt-2 leading-relaxed opacity-60 font-medium">Select a lead from your inbox to view conversation history and automation metrics.</p>
          </div>
        )}
      </div>

      {/* Right Sidebar - AI Context - Hidden on Desktop/Mobile toggle-ready */}
      <div className="w-80 space-y-6 hidden xl:block shrink-0 overflow-y-auto custom-scrollbar">
        <div className="glass rounded-[2rem] p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><Sparkles className="w-5 h-5" /></div>
            <h3 className="font-bold">Lead Intelligence</h3>
          </div>
          <div className="space-y-6">
            <div className="p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5">
               <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Suggested Strategy</p>
               <p className="text-xs text-slate-300 leading-relaxed italic">"Lead expressed interest in course pricing. Recommend offering the limited-time discount code."</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Lead Score</span>
                <span className="text-emerald-400">88/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                 <div className="w-[88%] h-full bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <button 
            onClick={onActionInProgress}
            className="w-full mt-8 bg-white/5 hover:bg-white/10 py-4 rounded-2xl text-xs font-bold transition-all border border-white/5"
          >
            Open Meta Analytics
          </button>
        </div>

        <div className="glass rounded-[2rem] p-6 border border-white/10">
          <h3 className="font-bold mb-6 flex items-center gap-2">Account Metadata</h3>
          <div className="space-y-5">
            {[
              { label: 'Followers', value: '12.4k' },
              { label: 'Follows You', value: 'Yes', color: 'text-emerald-400' },
              { label: 'Story Engagement', value: 'High' }
            ].map((meta, i) => (
              <div key={i} className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-widest">{meta.label}</span>
                <span className={meta.color || 'text-slate-100'}>{meta.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
