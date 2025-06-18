import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { useChatStore } from '../store/store';
import MessageBubble from './MessageBubble';
import SavePromptModal from './SavePromptModal';
import ChatSuggestions from './ChatSuggestions';
import PinnedMessages from './PinnedMessages';
import ChatInput from './ChatInput';
import ChatContext from './ChatContext';
import EmptyChat from './EmptyChat';

const SUGGESTIONS = [
  { icon: MessageSquarePlus, text: "What project are you working on? I can help you plan and organize it." },
  { icon: MessageSquarePlus, text: "Need help with code? I can assist with programming in various languages." },
  { icon: MessageSquarePlus, text: "Would you like to analyze some data or create visualizations?" },
  { icon: MessageSquarePlus, text: "Need help writing or reviewing documentation?" },
];

export const ChatArea: React.FC = () => {
  const [showPins, setShowPins] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [showSavePromptModal, setShowSavePromptModal] = useState(false);
  
  const currentThreadId = useChatStore(state => state.currentThreadId);
  const threads = useChatStore(state => state.threads);
  const addMessage = useChatStore(state => state.addMessage);
  const togglePin = useChatStore(state => state.togglePin);
  const savePrompt = useChatStore(state => state.savePrompt);

  const currentThread = threads.find(t => t.id === currentThreadId);
  const pinnedMessages = currentThread?.messages.filter(m => m.isPinned) || [];

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !currentThreadId) return;

    const message = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
      isPinned: false,
    };

    addMessage(currentThreadId, message);
  };

  const handleTogglePin = (messageId: string, isProfilePin?: boolean) => {
    if (currentThreadId) {
      togglePin(currentThreadId, messageId, isProfilePin);
    }
  };

  const handleSavePrompt = (messageId: string) => {
    setActiveMessageId(messageId);
    setShowSavePromptModal(true);
  };

  if (!currentThread) return <EmptyChat />;

  return (
    <div className="flex flex-1 bg-background text-primary">
      <div className="flex-1 flex flex-col">
        <ChatContext summary={currentThread.summary || null} />
        
        <div className="flex-1 overflow-y-auto p-4">
          {currentThread.messages.length === 0 ? (
            <ChatSuggestions 
              suggestions={SUGGESTIONS} 
              onSuggestionClick={handleSendMessage} 
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {currentThread.messages.map(message => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onTogglePin={handleTogglePin}
                  onSavePrompt={handleSavePrompt}
                />
              ))}
            </div>
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      <PinnedMessages
        showPins={showPins}
        pinnedMessages={pinnedMessages}
        onToggleShowPins={() => setShowPins(!showPins)}
        onTogglePin={handleTogglePin}
      />

      {showSavePromptModal && activeMessageId && (
        <SavePromptModal
          onClose={() => {
            setShowSavePromptModal(false);
            setActiveMessageId(null);
          }}
          onSave={(title, tags) => {
            savePrompt(activeMessageId, title, tags);
          }}
        />
      )}
    </div>
  );
};

export default ChatArea;
