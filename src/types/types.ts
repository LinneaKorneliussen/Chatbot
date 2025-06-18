
export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isPinned?: boolean;
  isProfilePin?: boolean;
  tokens?: number;
  attachments?: FileAttachment[];
}

export interface Thread {
  id: string;
  title: string;
  content?: string;
  messages: Message[];
  contextSize: number;
  lastActive: Date;
  summary?: string;
  botId?: string;
}

export interface Bot {
  id: string;
  name: string;
  icon: string;
  description: string;
  abilities?: string[];
  dataSources?: string[];
  tags?: string[];
  isCustom?: boolean;
  createdBy?: string;
  createdAt: Date;
  favorites?: number;
  isFavorited?: boolean;
  isPublic?: boolean;
}

export interface CustomBotFormData {
  name: string;
  abilities: string[];
  dataSources: string[];
  tags: string[];
  isPublic: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  unit: string;
  team: string;
  competencies: string[];
}

export interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: Date;
  lastUsed?: Date;
  useCount: number;
}

export interface Preferences {
  language: string;
  theme: 'light' | 'dark';
  streamResponses: boolean;
  chatPreferencesEnabled: boolean;
  useEmojis: boolean;
  formalTone: boolean;
}