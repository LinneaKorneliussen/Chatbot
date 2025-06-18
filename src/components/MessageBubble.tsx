import React, { useState } from 'react';
import { Pin, BookOpen, FileText, Volume2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types/types';

interface MessageBubbleProps {
  message: Message;
  onTogglePin: (messageId: string, isProfilePin?: boolean) => void;
  onSavePrompt: (messageId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onTogglePin, 
  onSavePrompt 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  const handleListenMessage = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'sv-SE'; 
      utterance.onend = () => {
        setIsPlaying(false);
      };
      window.speechSynthesis.speak(utterance);
      synthRef.current = utterance;
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`relative max-w-[90%] p-5 rounded-3xl shadow-lg transition-transform transform hover:scale-105 ${
          message.role === 'user'
            ? 'bg-secondary text-surface'
            : 'bg-surface text-primary'
        } ${
          message.role === 'user' ? 'shadow-md shadow-secondary/50' : 'shadow-md shadow-primary/20'
        }`}
        style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)' }}
      >
        {/* Tidsstämpel och kontroller */}
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs gap-2 font-medium text-muted">
            {format(message.timestamp, 'HH:mm')}
          </span>
          <div className="flex items-center gap-2">
            {message.tokens && (
              <span className="text-xs bg-muted/20 px-3 py-1 rounded-full text-muted">
                {message.tokens} tokens
              </span>
            )}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSavePrompt(message.id)}
                className="hover:bg-muted/10 p-1 rounded-full transition"
                title="Save to prompt library"
              >
                <BookOpen size={16} />
              </button>
              <button
                onClick={() => onTogglePin(message.id, true)}
                className={`hover:bg-muted/10 p-1 rounded-full transition ${
                  message.isProfilePin ? 'text-accent' : ''
                }`}
                title="Pin to profile"
              >
                <Pin size={16} className="rotate-45" />
              </button>
              <button
                onClick={() => onTogglePin(message.id)}
                className={`hover:bg-muted/10 p-1 rounded-full transition ${
                  message.isPinned ? 'text-primary' : ''
                }`}
                title="Pin to thread"
              >
                <Pin size={16} />
              </button>
              <button
                onClick={handleListenMessage}
                className={`hover:bg-muted/10 p-1 rounded-full transition ${
                  isPlaying ? 'text-accent' : ''
                }`}
                title={isPlaying ? 'Stoppa uppläsning' : 'Lyssna på meddelande'}
              >
                {isPlaying ? <XCircle size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Meddelandeinnehåll */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Bilagor */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-4 bg-muted/10 p-3 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-muted">Bilagor:</h4>
            <ul className="space-y-2">
              {message.attachments.map((attachment, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 bg-muted/20 p-2 rounded-lg"
                >
                  <FileText size={20} className="text-secondary" />
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:underline text-primary"
                  >
                    {attachment.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;