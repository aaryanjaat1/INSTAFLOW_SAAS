
export interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isAI: boolean;
  status: 'sent' | 'received' | 'pending';
}

export interface Conversation {
  id: string;
  username: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unread: number;
  messages: Message[];
}

export interface AutomationRule {
  id: string;
  title: string;
  type: 'comment_to_dm' | 'keyword' | 'story_reply';
  status: boolean;
  trigger: string;
  webhookUrl: string;
}

export interface AnalyticsData {
  name: string;
  messages: number;
  leads: number;
  replies: number;
}

export type PageType = 
  | 'dashboard' 
  | 'conversations' 
  | 'automations' 
  | 'ai-settings' 
  | 'accounts' 
  | 'analytics' 
  | 'webhooks' 
  | 'settings' 
  | 'billing'
  | 'help';
