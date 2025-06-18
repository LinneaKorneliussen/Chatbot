import { create } from 'zustand';
import { checkOllamaConnection, generateResponse, streamResponse } from '../services/ollamaService';
import { Message, Thread, Bot, UserProfile, SavedPrompt, Preferences } from '../types/types';
import { countTokens } from '../utils/tokenizer';

interface ChatState {
  threads: Thread[];
  currentThreadId: string | null;
  bots: Bot[];
  profilePins: Message[];
  userProfile: UserProfile;
  savedPrompts: SavedPrompt[];
  preferences: Preferences;
  updatePreferences: (updates: Partial<Preferences>) => void;

  addMessage: (threadId: string, message: Message) => void;
  createThread: () => string;
  deleteThread: (threadId: string) => void;
  setThreadTitle: (threadId: string, title: string) => void;
  togglePin: (threadId: string, messageId: string, isProfilePin?: boolean) => void;
  toggleProfilePin: (threadId: string, messageId: string) => void;
  deleteProfilePin: (pinId: string) => void;
  setCurrentThread: (threadId: string) => void;
  initializeStore: () => void;

  addBot: (bot: Bot) => void;
  toggleBotFavorite: (botId: string) => void;
  deleteBot: (botId: string) => void;
  updateBot: (botId: string, updates: Partial<Bot>) => void;

  updateMessageDataSources: (threadId: string, messageId: string) => void;
  updateUserProfile: (profile: UserProfile) => void;
  savePrompt: (messageId: string, title: string, tags: string[]) => void;
  updatePrompt: (promptId: string, updates: Partial<SavedPrompt>) => void;
  deletePrompt: (promptId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // #region State Initialization
  threads: [],
  currentThreadId: null,
  profilePins: [],
  savedPrompts: [],
  userProfile: {
    name: 'John Doe',
    email: 'john.doe@company.com',
    unit: 'Engineering',
    team: 'Frontend',
    competencies: ['React', 'TypeScript', 'UI/UX'],
    personalHive: [],
  },
  bots: [],
  // #endregion

  // #region Threads and Messages
  addMessage: async (threadId, message) => {
    const { preferences } = get();
    const messageWithTokens = {
      ...message,
      tokens: countTokens(message.content),
      attachments: message.attachments || [],
    };

    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id !== threadId
          ? thread
          : { ...thread, messages: [...thread.messages, messageWithTokens] }
      ),
    }));

    if (message.role === 'user') {
      try {
        const isOllamaRunning = await checkOllamaConnection();
        if (!isOllamaRunning) throw new Error('OLLAMA_NOT_RUNNING');

        const currentThread = get().threads.find((t) => t.id === threadId);
        const context = currentThread?.messages.slice(-5).map((m) => m.content) || [];
        const contextTokens = context.map(countTokens);

        // Add preferences to the context for the AI
        let systemPrompt = '';
        if (preferences.chatPreferencesEnabled) {
          systemPrompt = `Please follow these preferences:\n`;
          if (preferences.language !== 'english') {
            systemPrompt += `- Respond in ${preferences.language}\n`;
          }
          if (preferences.useEmojis) {
            systemPrompt += `- Use appropriate emojis in responses\n`;
          }
          if (preferences.formalTone) {
            systemPrompt += `- Use formal language and tone\n`;
          }
        }

        const response = await generateResponse(
          systemPrompt ? `${systemPrompt}\n\n${message.content}` : message.content,
          contextTokens
        );

        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isPinned: false,
          tokens: 0,
        };

        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id !== threadId
              ? thread
              : { ...thread, messages: [...thread.messages, assistantMessage] }
          ),
        }));

        let fullResponse = '';
        for await (const chunk of streamResponse(response)) {
          fullResponse += chunk;

          set((state) => ({
            threads: state.threads.map((thread) =>
              thread.id !== threadId
                ? thread
                : {
                  ...thread,
                  messages: thread.messages.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: fullResponse, tokens: countTokens(fullResponse) }
                      : msg
                  ),
                }
            ),
          }));
        }
      } catch (error: any) {
        console.error('Failed to get response from Ollama:', error);

        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, an error occurred while processing your message.',
          timestamp: new Date(),
          isPinned: false,
          tokens: 0,
        };

        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id !== threadId
              ? thread
              : { ...thread, messages: [...thread.messages, errorMessage] }
          ),
        }));
      }
    }
  },

  createThread: () => {
    const newThreadId = Date.now().toString();
    set((state) => ({
      threads: [
        ...state.threads,
        { id: newThreadId, title: 'New Thread', messages: [], contextSize: 0, lastActive: new Date() },
      ],
      currentThreadId: newThreadId,
    }));
    return newThreadId;
  },

  deleteThread: (threadId) => {
    set((state) => {
      const threads = state.threads.filter((t) => t.id !== threadId);
      const currentThreadId = state.currentThreadId === threadId ? null : state.currentThreadId;
      return { threads, currentThreadId };
    });
  },

  setThreadTitle: (threadId, title) =>
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId ? { ...thread, title } : thread
      ),
    })),

  setCurrentThread: (threadId) => set({ currentThreadId: threadId }),

  initializeStore: () => {
    const state = get();
    if (state.threads.length === 0) state.createThread();
  },
  // #endregion

  // #region Preferences
  preferences: {
    language: 'english',
    theme: 'dark',
    streamResponses: true,
    chatPreferencesEnabled: true,
    useEmojis: false,
    formalTone: true,
  },

  updatePreferences: (updates) => 
    set((state) => ({
      preferences: { ...state.preferences, ...updates }
    })),
  // #endregion
  
  // #region Pins
  togglePin: (threadId, messageId, isProfilePin = false) => {
    set((state) => {
      if (isProfilePin) {
        const thread = state.threads.find((t) => t.id === threadId);
        if (!thread) return state;

        const message = thread.messages.find((m) => m.id === messageId);
        if (!message) return state;

        const isPinned = state.profilePins.some((p) => p.id === messageId);
        return {
          profilePins: isPinned
            ? state.profilePins.filter((p) => p.id !== messageId)
            : [...state.profilePins, message],
        };
      }

      return {
        threads: state.threads.map((t) =>
          t.id === threadId
            ? {
              ...t,
              messages: t.messages.map((msg) =>
                msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
              ),
            }
            : t
        ),
      };
    });
  },

  toggleProfilePin: (threadId, messageId) => {
    set((state) => {
      const thread = state.threads.find((t) => t.id === threadId);
      if (!thread) return state;

      const message = thread.messages.find((m) => m.id === messageId);
      if (!message) return state;

      const isPinned = state.profilePins.some((p) => p.id === messageId);
      return {
        profilePins: isPinned
          ? state.profilePins.filter((p) => p.id !== messageId)
          : [...state.profilePins, message],
      };
    });
  },

  deleteProfilePin: (pinId: string) =>
    set((state) => ({ profilePins: state.profilePins.filter((pin) => pin.id !== pinId) })),
  // #endregion

  // #region Bots
  addBot: (bot) => set((state) => ({ bots: [...state.bots, bot] })),

  toggleBotFavorite: (botId) =>
    set((state) => ({
      bots: state.bots.map((bot) =>
        bot.id === botId
          ? { ...bot, isFavorited: !bot.isFavorited, favorites: (bot.favorites || 0) + (bot.isFavorited ? -1 : 1) }
          : bot
      ),
    })),

  deleteBot: (botId) =>
    set((state) => ({ bots: state.bots.filter((bot) => bot.id !== botId) })),

  updateBot: (botId, updates) =>
    set((state) => ({
      bots: state.bots.map((bot) => (bot.id === botId ? { ...bot, ...updates } : bot)),
    })),
  // #endregion

  // #region Prompts
  savePrompt: (messageId, title, tags) => {
    const message = get().threads.flatMap((t) => t.messages).find((m) => m.id === messageId);
    if (!message) return;

    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      title,
      content: message.content,
      tags,
      timestamp: new Date(),
      useCount: 0,
    };

    set((state) => ({ savedPrompts: [...state.savedPrompts, newPrompt] }));
  },

  updatePrompt: (promptId, updates) =>
    set((state) => ({
      savedPrompts: state.savedPrompts.map((p) =>
        p.id === promptId ? { ...p, ...updates } : p
      ),
    })),

  deletePrompt: (promptId) =>
    set((state) => ({
      savedPrompts: state.savedPrompts.filter((p) => p.id !== promptId),
    })),
  // #endregion

  // #region Utilities
  updateMessageDataSources: (threadId, messageId) =>
    set((state) => ({
      threads: state.threads.map((t) =>
        t.id === threadId
          ? {
            ...t,
            messages: t.messages.map((m) =>
              m.id === messageId ? { ...m } : m
            ),
          }
          : t
      ),
    })),

  updateUserProfile: (profile) => set(() => ({ userProfile: profile })),
  // #endregion
}));

// #region State Persistence
function serializeState(state: ChatState) {
  const plainState: Partial<ChatState> = {};
  for (const key in state) {
    if (typeof (state as any)[key] !== 'function') {
      (plainState as any)[key] = (state as any)[key];
    }
  }
  return JSON.stringify(plainState);
}

const savedState = localStorage.getItem('chat_store_state');
if (savedState) {
  useChatStore.setState(JSON.parse(savedState));
}

useChatStore.subscribe((state) => {
  localStorage.setItem('chat_store_state', serializeState(state));
});
// #endregion