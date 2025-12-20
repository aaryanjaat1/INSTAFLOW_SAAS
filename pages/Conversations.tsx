
import React, { useState } from 'react';
import { Search, Send, Sparkles, User, Info, MoreVertical, Paperclip, Smile, MessageSquare } from 'lucide-react';
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

const Conversations: React.FC = () => {
  const [activeChat, setActiveChat] = useState<Conversation>(mockConversations[0]);
  const [inputText, setInputText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('Sure! Our AI course starts at $197. It covers everything from prompt engineering to full automation workflows. Would you like a checkout link?');

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 animate-fade-in">
      {/* Sidebar - Conversations List */}
      <div className="w-80 glass rounded-3xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-slate-800/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {mockConversations.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full p-4 flex gap-3 transition-colors ${activeChat?.id === chat.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.username} className="w-12 h-12 rounded-full" />
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#0f172a]">
                    {chat.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm truncate max-w-[100px]">{chat.username}</span>
                  <span className="text-[10px] text-slate-500">{chat.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col">
        {activeChat ? (
          <>
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={activeChat.avatar} alt={activeChat.username} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-bold">{activeChat.username}</h3>
                  <p className="text-xs text-emerald-400">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <button className="p-2 hover:bg-white/5 rounded-lg"><Info className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-white/5 rounded-lg"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-900/20">
              {activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isAI || msg.sender === 'System' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl p-4 text-sm ${
                    msg.isAI 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white' 
                    : 'bg-slate-800 text-slate-200'
                  }`}>
                    {msg.content}
                    <div className={`text-[10px] mt-2 opacity-60 text-right`}>{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-slate-900/40">
              <div className="flex items-end gap-3">
                <div className="flex-1 glass-dark rounded-2xl p-2 focus-within:ring-1 ring-blue-500 transition-all">
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-transparent border-none resize-none px-3 py-2 text-sm focus:outline-none min-h-[44px] max-h-32 custom-scrollbar"
                  />
                  <div className="flex items-center justify-between px-2 pb-1 border-t border-white/5 pt-2">
                    <div className="flex gap-2">
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400"><Paperclip className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400"><Smile className="w-4 h-4" /></button>
                    </div>
                    <button className="bg-blue-600 p-2 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      {/* Right Sidebar - AI Suggestions & Profile */}
      <div className="w-80 space-y-6">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold">AI Suggestion</h3>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 mb-4">
            <p className="text-sm leading-relaxed text-purple-100">
              {aiSuggestion}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-purple-600/20 border border-purple-500/30 py-2 rounded-xl text-xs font-bold text-purple-300 hover:bg-purple-600/30 transition-all">
              Copy to Input
            </button>
            <button className="bg-blue-600 py-2 rounded-xl text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
              Send Now
            </button>
          </div>
          <button className="w-full mt-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors">
            Regenerate response
          </button>
        </div>

        <div className="glass rounded-3xl p-6">
          <h3 className="font-bold mb-4">Lead Info</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Account Type</span>
              <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">BUSINESS</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Followers</span>
              <span className="font-medium">12.4k</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Lead Score</span>
              <div className="flex gap-1 text-amber-400">
                <Sparkles className="w-3 h-3 fill-amber-400" />
                <span className="font-bold">8.5</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 bg-slate-800 py-3 rounded-2xl text-sm font-bold hover:bg-slate-700 transition-colors">
            View Instagram Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
