import React from 'react';
import { Pin, X } from 'lucide-react';
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

const PinnedMessages: React.FC<PinnedMessagesProps> = ({
  showPins,
  pinnedMessages,
  onToggleShowPins,
  onTogglePin,
}) => {
  return (
    <>
      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full bg-surface dark:bg-gray-900 border-l border-muted/50
          shadow-lg flex flex-col transition-transform duration-300 ease-in-out
          ${showPins ? 'translate-x-0 w-72' : 'translate-x-full w-0'}
          overflow-hidden z-40
        `}
      >
        {/* Litet diskret kryss i panelens övre högra hörn */}
        {showPins && (
          <button
            onClick={onToggleShowPins}
            className="absolute top-2 right-2 bg-secondary/10 text-primary p-1 rounded-full hover:bg-secondary/20 transition-colors"
            aria-label="Close pinned messages panel"
          >
            <X size={14} />
          </button>
        )}
        <div className="flex-grow p-4 overflow-y-auto mt-8">
          {pinnedMessages.length > 0 ? (
            pinnedMessages.map((message) => (
              <div
                key={message.id}
                className="bg-muted/30 dark:bg-muted/50 p-4 rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-primary dark:text-primary/80 select-none">
                    {format(message.timestamp, 'MMM d, HH:mm')}
                  </span>
                  <button
                    onClick={() => onTogglePin(message.id)}
                    className="text-accent hover:bg-secondary/20 dark:hover:bg-secondary/40 p-1 rounded-full transition-colors"
                    aria-label="Unpin message"
                    title="Unpin message"
                  >
                    <Pin size={14} />
                  </button>
                </div>
                <div className="prose prose-sm max-w-none text-primary dark:text-primary/90 break-words">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 select-none flex flex-col items-center justify-center text-muted dark:text-muted/70">
              <Pin size={32} className="mb-4" />
              <p className="text-sm">No pinned messages in this thread</p>
            </div>
          )}
        </div>
      </div>

      {/* Bokmärkesknappen */}
      {!showPins && (
        <button
          onClick={onToggleShowPins}
          className="fixed top-1/2 transform -translate-y-1/2 right-0 bg-secondary/80 text-surface p-3 rounded-l-md shadow-md hover:bg-secondary/90 transition-colors z-50"
          aria-label="Open pinned messages panel"
        >
          <Pin size={20} />
        </button>
      )}
    </>
  );
};

export default PinnedMessages;
