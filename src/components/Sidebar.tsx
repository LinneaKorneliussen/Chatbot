import { useState } from 'react';
import { BookOpen, Bot, Pin, User, Trash, ChevronDown, ChevronRight, Settings, MessageSquarePlusIcon } from 'lucide-react';
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
  const [isThreadsExpanded, setIsThreadsExpanded] = useState(false);
  const [isPinsExpanded, setIsPinsExpanded] = useState(false);
  const navigate = useNavigate();

  const generateThreadTitle = (content: string) => {
    if (!content) return 'New Thread';
    const firstLine = content.split('\n')[0];
    return firstLine.length > 50 ? firstLine.slice(0, 50) + '...' : firstLine;
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

  return (
    <div className="w-64 bg-primary h-screen flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-secondary/30">
        <h1 className="text-surface text-xl font-bold">Ollama Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Profile button */}
          <button
            onClick={() => setShowProfilePopup(true)}
            className="w-full mb-5 p-3 bg-primary/30 rounded-lg text-surface hover:bg-secondary/50 transition-colors flex items-center gap-3"
          >
            <div className="p-2 rounded-full bg-surface/10">
              <User size={20} />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">{userProfile.name}</div>
              <div className="text-sm opacity-75">{userProfile.team}</div>
            </div>
          </button>

          {/* Separator line */}
          <div className="border-b border-secondary/40 mb-4" />

          {/* New Chat button */}
          <button
            onClick={createThread}
            className="w-full flex items-center justify-center gap-4 p-2 mb-6 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg transition-transform duration-200 hover:scale-105 hover:brightness-110"
            title="Create new thread"
          >
            <MessageSquarePlusIcon size={22} />
            <span>New Chat</span>
          </button>

          {/* Separator line */}
          <div className="border-b border-secondary/40 mb-4" />

          {/* Profile pins */}
          <div className="mb-6">
            <button
              onClick={() => setIsPinsExpanded(!isPinsExpanded)}
              className="w-full text-surface text-sm font-semibold mb-2 flex items-center justify-between hover:bg-secondary/20 p-2 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <Pin size={16} />
                <span>Profile Pins</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs bg-secondary/40 rounded-full px-2 py-0.5 mr-2">
                  {profilePins.length}
                </span>
                {isPinsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>

            <div
              className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${isPinsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              {profilePins.length > 0 ? (
                profilePins.map((pin) => (
                  <div
                    key={pin.id}
                    className="bg-primary/30 rounded-lg p-3 text-surface text-sm"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs opacity-75">
                        {format(pin.timestamp, 'MMM d, HH:mm')}
                      </span>
                      <button
                        onClick={() => deleteProfilePin(pin.id)}
                        className="text-surface hover:text-red-500 transition-colors"
                        title="Delete pin"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <p className="line-clamp-2">{pin.content}</p>
                  </div>
                ))
              ) : (
                <div className="bg-primary/30 rounded-lg p-2 text-surface text-sm">
                  No pinned messages in your profile yet
                </div>
              )}
            </div>
          </div>

          {/* Threads */}
          <div className="mb-6">
            <button
              onClick={() => setIsThreadsExpanded(!isThreadsExpanded)}
              className="w-full text-surface text-sm font-semibold mb-2 flex items-center justify-between hover:bg-secondary/20 p-2 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Chats</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs bg-secondary/40 rounded-full px-2 py-0.5 mr-2">
                  {threads.length}
                </span>
                {isThreadsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>

            <div
              className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${isThreadsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              {threads.map((thread) => (
                <div key={thread.id} className="flex items-center mb-2 gap-2">
                  {editingThreadId === thread.id ? (
                    <input
                      className="flex-1 p-1 rounded text-black"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      onBlur={() => saveTitle(thread.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          saveTitle(thread.id);
                        } else if (e.key === 'Escape') {
                          setEditingThreadId(null);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setCurrentThread(thread.id)}
                      onDoubleClick={() =>
                        startEditing(thread.id, thread.title || generateThreadTitle(''))
                      }
                      className={`flex-1 text-left p-2 rounded transition-colors ${currentThreadId === thread.id
                        ? 'bg-secondary text-surface'
                        : 'text-surface hover:bg-accent/50'
                        }`}
                      title="Double click to edit title"
                    >
                      {thread.title?.trim() || generateThreadTitle('')}
                    </button>
                  )}
                  <button
                    onClick={() => deleteThread(thread.id)}
                    className="text-surface hover:text-red-500 transition-colors"
                    title="Delete thread"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-secondary/30 space-y-2">
        <button
          className="sidebar-button text-surface hover:bg-accent/50 transition-colors flex items-center gap-2 w-full px-3 py-2 rounded"
          onClick={() => navigate('/prompts')}
        >
          <BookOpen size={20} />
          <span>Prompt Library</span>
        </button>

        <button
          className="sidebar-button text-surface hover:bg-accent/50 transition-colors flex items-center gap-2 w-full px-3 py-2 rounded"
          onClick={() => navigate('/bots')}
        >
          <Bot size={20} />
          <span>Bots</span>
        </button>

        <button
          className="sidebar-button text-surface hover:bg-accent/50 transition-colors flex items-center gap-2 w-full px-3 py-2 rounded"
          onClick={() => setShowSettingsPopup(true)}
        >
          <Settings size={20} />
          <span>Preferences</span>
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