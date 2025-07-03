import React from 'react';
import { Pin, X, MessageCircle, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types/types';

interface PinnedMessagesProps {
  showPins: boolean;
  pinnedMessages: Message[];
  onToggleShowPins: () => void;
  onTogglePin: (messageId: string) => void;
}

export const PinnedMessages: React.FC<PinnedMessagesProps> = ({
  showPins,
  pinnedMessages,
  onToggleShowPins,
  onTogglePin,
}) => {
  return (
    <>
      {/* Backdrop overlay */}
      {showPins && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 animate-fade-in"
          onClick={onToggleShowPins}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full bg-surface/95 dark:bg-secondary/95 backdrop-blur-sm
          border-l border-muted/30 dark:border-muted/20 shadow-2xl flex flex-col 
          transition-all duration-300 ease-out z-40
          ${showPins ? 'translate-x-0 w-80' : 'translate-x-full w-0'}
          overflow-hidden
        `}
      >
        {/* Header */}
        {showPins && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-highlight/5 to-accent/5 dark:from-highlight/10 dark:to-accent/10 border-b border-muted/20 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-highlight/10 dark:bg-highlight/20 rounded-full">
                <Pin size={16} className="text-highlight" />
              </div>
              <div>
                <h3 className="font-semibold text-primary dark:text-surface text-sm">
                  Pinned Messages
                </h3>
                <p className="text-xs text-muted dark:text-muted/80">
                  {pinnedMessages.length} pinned
                </p>
              </div>
            </div>
            <button
              onClick={onToggleShowPins}
              className="p-2 text-muted hover:text-primary dark:hover:text-surface hover:bg-muted/10 dark:hover:bg-muted/20 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Close pinned messages panel"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-grow p-4 overflow-y-auto animate-fade-in">
          {pinnedMessages.length > 0 ? (
            <div className="space-y-4">
              {pinnedMessages.map((message, index) => (
                <div
                  key={message.id}
                  className="group bg-surface/80 dark:bg-primary/30 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-light transition-all duration-200 hover:scale-[1.02] border border-muted/10 dark:border-muted/10"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-highlight rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted dark:text-muted/80 font-medium">
                        {format(message.timestamp, 'MMM d, HH:mm')}
                      </span>
                    </div>
                    <button
                      onClick={() => onTogglePin(message.id)}
                      className="opacity-0 group-hover:opacity-100 text-highlight hover:text-highlight/80 dark:hover:text-highlight/60 p-1.5 rounded-full hover:bg-highlight/10 dark:hover:bg-highlight/20 transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label="Unpin message"
                      title="Unpin message"
                    >
                      <Pin size={14} fill="currentColor" />
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none text-primary dark:text-surface/90 break-words">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 select-none flex flex-col items-center justify-center animate-fade-in">
              <div className="relative mb-6">
                <div className="p-6 bg-gradient-to-br from-highlight/10 to-accent/10 dark:from-highlight/20 dark:to-accent/20 rounded-full">
                  <MessageCircle size={32} className="text-muted dark:text-muted/70" />
                </div>
                <div className="absolute -top-1 -right-1 p-1 bg-highlight/20 dark:bg-highlight/30 rounded-full">
                  <Sparkles size={12} className="text-highlight" />
                </div>
              </div>
              <h4 className="font-medium text-primary dark:text-surface mb-2">
                No pinned messages yet
              </h4>
              <p className="text-sm text-muted dark:text-muted/70 max-w-48 leading-relaxed">
                Pin important messages to keep them easily accessible
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      {!showPins && (
        <button
          onClick={onToggleShowPins}
          className="fixed top-[70%] transform -translate-y-1/2 right-0 bg-gradient-to-br from-highlight via-highlight/90 to-highlight/80 text-surface p-4 rounded-l-2xl shadow-xl hover:shadow-2xl transition-all duration-300 z-50 group hover:scale-105 active:scale-95 border-l-4 border-highlight/30"
          style={{ 
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4), 0 4px 15px rgba(59, 130, 246, 0.2)'
          }}
        >
          <div className="relative flex items-center justify-center">
            <Pin size={20} className="transition-transform duration-200 group-hover:rotate-12 drop-shadow-sm" />
            {pinnedMessages.length > 0 && (
              <div className="absolute -top-5 -right-3 min-w-[22px] h-6 bg-warning text-surface text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-surface/20">
                {pinnedMessages.length > 50 ? '50+' : pinnedMessages.length}
              </div>
            )}
          </div>
        </button>
      )}
    </>
  );
};