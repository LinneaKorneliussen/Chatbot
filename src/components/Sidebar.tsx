import { useState } from 'react';
import { BookOpen, Bot, Pin, User, Trash, ChevronDown, ChevronRight, Settings, MessageSquarePlusIcon, Search, Circle } from 'lucide-react';
import { useChatStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ProfilePopup } from './ProfilePopup';
import { SettingsPopup } from './SettingsPopup';

export const Sidebar = () => {
  const threads = useChatStore((state) => state.threads);
  const currentThreadId = useChatStore((state) => state.currentThreadId);
  const setCurrentThread = useChatStore((state) => state.setCurrentThread);
  const createThread = useChatStore((state) => state.createThread);
  const deleteThread = useChatStore((state) => state.deleteThread);
  const setThreadTitle = useChatStore((state) => state.setThreadTitle);
  const profilePins = useChatStore((state) => state.profilePins);
  const userProfile = useChatStore((state) => state.userProfile);
  const updateUserProfile = useChatStore((state) => state.updateUserProfile);
  const deleteProfilePin = useChatStore((state) => state.deleteProfilePin);

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [isThreadsExpanded, setIsThreadsExpanded] = useState(true);
  const [isPinsExpanded, setIsPinsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const generateThreadTitle = (content: string) => {
    if (!content) return 'New Chat';
    const firstLine = content.split('\n')[0];
    return firstLine.length > 40 ? firstLine.slice(0, 40) + '...' : firstLine;
  };

  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');

  const startEditing = (threadId: string, currentTitle: string) => {
    setEditingThreadId(threadId);
    setTitleInput(currentTitle);
  };

  const saveTitle = (threadId: string) => {
    const trimmedTitle = titleInput.trim();
    if (trimmedTitle.length > 0) {
      setThreadTitle(threadId, trimmedTitle);
    }
    setEditingThreadId(null);
  };

  const filteredThreads = threads.filter(thread => 
    (thread.title || generateThreadTitle('')).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-60 bg-primary h-screen flex flex-col border-r border-secondary/20">
      {/* Header */}
      <div className="p-4 border-b border-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-highlight flex items-center justify-center">
              <Bot size={14} className="text-surface" />
            </div>
            <h1 className="text-surface text-lg font-semibold">Ollama Chat</h1>
          </div>
          <div className="flex items-center gap-1">
            <Circle size={8} className="text-success fill-success animate-pulse" />
            <span className="text-xs text-success font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-4">
          
          {/* User Profile */}
          <button
            onClick={() => setShowProfilePopup(true)}
            className="w-full p-3 bg-secondary/20 rounded-lg text-surface hover:bg-secondary/30 transition-colors flex items-center gap-3 border border-secondary/20"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-highlight/20 flex items-center justify-center">
                <User size={16} className="text-highlight" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-primary"></div>
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{userProfile.name}</div>
              <div className="text-xs text-muted truncate">{userProfile.team}</div>
            </div>
          </button>

          {/* Separator */}
          <div className="border-t border-secondary/20"></div>

          {/* New Chat */}
          <button
            onClick={createThread}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-highlight text-surface font-medium transition-all duration-200 hover:bg-highlight/90 hover:scale-[1.02]"
          >
            <MessageSquarePlusIcon size={16} />
            <span>New Chat</span>
          </button>

          {/* Separator */}
          <div className="border-t border-secondary/20"></div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-secondary/20 border border-secondary/20 rounded-lg text-surface text-sm placeholder-muted focus:border-highlight/50 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-surface transition-colors"
              >
                ×
              </button>
            )}
          </div>

          {/* Chats Section */}
          <div>
            <button
              onClick={() => setIsThreadsExpanded(!isThreadsExpanded)}
              className="w-full text-surface text-sm font-medium flex items-center justify-between hover:bg-secondary/20 p-2 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-success" />
                <span>Chats</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-success/20 rounded-full px-2 py-0.5 text-success">
                  {searchQuery ? filteredThreads.length : threads.length}
                </span>
                {isThreadsExpanded ? 
                  <ChevronDown size={14} className="text-muted" /> : 
                  <ChevronRight size={14} className="text-muted" />
                }
              </div>
            </button>

            {isThreadsExpanded && (
              <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                {(searchQuery ? filteredThreads : threads).map((thread) => (
                  <div key={thread.id} className="flex items-center gap-1 group">
                    {editingThreadId === thread.id ? (
                      <input
                        className="flex-1 p-2 rounded bg-secondary text-surface border border-secondary focus:border-highlight focus:outline-none text-sm"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        onBlur={() => saveTitle(thread.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveTitle(thread.id);
                          if (e.key === 'Escape') setEditingThreadId(null);
                        }}
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setCurrentThread(thread.id)}
                        onDoubleClick={() => startEditing(thread.id, thread.title || generateThreadTitle(''))}
                        className={`flex-1 text-left p-2 rounded text-sm transition-colors min-w-0 ${
                          currentThreadId === thread.id
                            ? 'bg-highlight/20 text-surface border border-highlight/30'
                            : 'text-surface hover:bg-secondary/30'
                        }`}
                      >
                        <span className="truncate block">{thread.title?.trim() || generateThreadTitle('')}</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteThread(thread.id)}
                      className="text-muted hover:text-error transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
                
                {searchQuery && filteredThreads.length === 0 && (
                  <div className="text-muted text-sm text-center py-4 bg-secondary/10 rounded-lg border border-secondary/20">
                    No chats found for "<span className="text-surface font-medium">{searchQuery}</span>"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pins Section */}
          <div>
            <button
              onClick={() => setIsPinsExpanded(!isPinsExpanded)}
              className="w-full text-surface text-sm font-medium flex items-center justify-between hover:bg-secondary/20 p-2 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <Pin size={14} className="text-warning" />
                <span>Pinned</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-warning/20 rounded-full px-2 py-0.5 text-warning">
                  {profilePins.length}
                </span>
                {isPinsExpanded ? 
                  <ChevronDown size={14} className="text-muted" /> : 
                  <ChevronRight size={14} className="text-muted" />
                }
              </div>
            </button>

            {isPinsExpanded && (
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {profilePins.length > 0 ? (
                  profilePins.map((pin) => (
                    <div key={pin.id} className="bg-secondary/20 rounded p-2 text-sm group border border-secondary/20">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-muted bg-secondary/30 px-2 py-0.5 rounded">
                          {format(pin.timestamp, 'MMM d, HH:mm')}
                        </span>
                        <button
                          onClick={() => deleteProfilePin(pin.id)}
                          className="text-muted hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                      <p className="text-surface line-clamp-2 text-xs leading-relaxed">{pin.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-muted text-xs text-center py-3 bg-secondary/10 rounded border border-secondary/20">
                    No pinned messages
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-secondary/20 space-y-1">
        <button
          onClick={() => navigate('/prompts')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-surface hover:bg-secondary/30 transition-colors text-sm"
        >
          <BookOpen size={16} className="text-highlight" />
          <span>Prompt Library</span>
        </button>

        <button
          onClick={() => navigate('/bots')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-surface hover:bg-secondary/30 transition-colors text-sm"
        >
          <Bot size={16} className="text-accent" />
          <span>Bots</span>
        </button>

        <button
          onClick={() => setShowSettingsPopup(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-surface hover:bg-secondary/30 transition-colors text-sm"
        >
          <Settings size={16} className="text-success" />
          <span>Settings</span>
        </button>
      </div>

      {showProfilePopup && (
        <ProfilePopup
          onClose={() => setShowProfilePopup(false)}
          profile={userProfile}
          onUpdateProfile={updateUserProfile}
        />
      )}

      {showSettingsPopup && (
        <SettingsPopup
          onClose={() => setShowSettingsPopup(false)}
        />
      )}
    </div>
  );
};