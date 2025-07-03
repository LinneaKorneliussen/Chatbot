import React, { useState } from 'react';
import { Pin, BookOpen, FileText, Volume2, XCircle, Download, ExternalLink, Image as ImageIcon, File } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types/types';

interface MessageBubbleProps {
  message: Message;
  onTogglePin: (messageId: string, isProfilePin?: boolean) => void;
  onSavePrompt: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
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
      utterance.lang = 'en-US'; 
      utterance.onend = () => {
        setIsPlaying(false);
      };
      window.speechSynthesis.speak(utterance);
      synthRef.current = utterance;
      setIsPlaying(true);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return <ImageIcon size={20} className="text-highlight" />;
    }
    return <File size={20} className="text-muted" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } mb-6`}
    >
      <div
        className={`relative max-w-[85%] lg:max-w-[70%] p-6 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-200 hover:shadow-xl ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-highlight to-highlight/90 text-white border-highlight/30'
            : 'bg-surface/90 text-primary border-muted/50 dark:bg-secondary/90 dark:text-surface dark:border-muted/30'
        }`}
      >
        {/* Timestamp and controls */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${
              message.role === 'user' ? 'text-white/80' : 'text-muted dark:text-muted'
            }`}>
              {format(message.timestamp, 'HH:mm')}
            </span>
            {message.tokens && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                message.role === 'user' 
                  ? 'bg-white/20 text-white/90' 
                  : 'bg-background text-secondary dark:bg-primary dark:text-surface'
              }`}>
                {message.tokens} tokens
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSavePrompt(message.id)}
              className={`hover:scale-110 p-2 rounded-full transition-all duration-200 ${
                message.role === 'user' 
                  ? 'hover:bg-white/20 text-white/90' 
                  : 'hover:bg-background text-secondary dark:hover:bg-primary dark:text-surface'
              }`}
              title="Save to prompt library"
            >
              <BookOpen size={16} />
            </button>
            <button
              onClick={() => onTogglePin(message.id, true)}
              className={`hover:scale-110 p-2 rounded-full transition-all duration-200 ${
                message.isProfilePin 
                  ? 'text-warning scale-105' 
                  : message.role === 'user' 
                    ? 'hover:bg-white/20 text-white/90' 
                    : 'hover:bg-background text-secondary dark:hover:bg-primary dark:text-surface'
              }`}
              title="Pin to profile"
            >
              <Pin size={16} className="rotate-45" />
            </button>
            <button
              onClick={() => onTogglePin(message.id)}
              className={`hover:scale-110 p-2 rounded-full transition-all duration-200 ${
                message.isPinned 
                  ? 'text-error scale-105' 
                  : message.role === 'user' 
                    ? 'hover:bg-white/20 text-white/90' 
                    : 'hover:bg-background text-secondary dark:hover:bg-primary dark:text-surface'
              }`}
              title="Pin to thread"
            >
              <Pin size={16} />
            </button>
            <button
              onClick={handleListenMessage}
              className={`hover:scale-110 p-2 rounded-full transition-all duration-200 ${
                isPlaying 
                  ? 'text-success scale-105' 
                  : message.role === 'user' 
                    ? 'hover:bg-white/20 text-white/90' 
                    : 'hover:bg-background text-secondary dark:hover:bg-primary dark:text-surface'
              }`}
              title={isPlaying ? 'Stop playback' : 'Listen to message'}
            >
              {isPlaying ? <XCircle size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>

        {/* Message content */}
        <div className={`prose prose-sm max-w-none ${
          message.role === 'user' 
            ? 'prose-invert' 
            : 'dark:prose-invert'
        }`}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for markdown elements
              h1: ({children}) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
              h2: ({children}) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
              h3: ({children}) => <h3 className="text-base font-medium mb-2">{children}</h3>,
              code: ({children}) => (
                <code className={`px-2 py-1 rounded text-sm font-mono ${
                  message.role === 'user' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-background text-primary dark:bg-primary dark:text-surface'
                }`}>
                  {children}
                </code>
              ),
              pre: ({children}) => (
                <pre className={`p-4 rounded-lg overflow-x-auto text-sm font-mono ${
                  message.role === 'user' 
                    ? 'bg-white/10 text-white' 
                    : 'bg-background text-primary dark:bg-primary dark:text-surface'
                }`}>
                  {children}
                </pre>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className={`mt-6 p-4 rounded-xl border-2 border-dashed transition-all duration-200 ${
            message.role === 'user'
              ? 'bg-white/10 border-white/30'
              : 'bg-background border-muted/50 dark:bg-primary/50 dark:border-muted/30'
          }`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
              message.role === 'user' ? 'text-white/90' : 'text-secondary dark:text-surface'
            }`}>
              <FileText size={16} />
              Attachments ({message.attachments.length})
            </h4>
            <div className="grid gap-3">
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                    message.role === 'user'
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-surface hover:bg-background border border-muted/30 dark:bg-secondary dark:hover:bg-primary dark:border-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(attachment.name)}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        message.role === 'user' ? 'text-white' : 'text-primary dark:text-surface'
                      }`}>
                        {attachment.name}
                      </p>
                      {attachment.size && (
                        <p className={`text-xs ${
                          message.role === 'user' ? 'text-white/70' : 'text-muted dark:text-muted'
                        }`}>
                          {formatFileSize(attachment.size)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(attachment.url, '_blank')}
                      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                        message.role === 'user'
                          ? 'hover:bg-white/20 text-white/90'
                          : 'hover:bg-background text-secondary dark:hover:bg-primary dark:text-surface'
                      }`}
                      title="Open in new tab"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <a
                      href={attachment.url}
                      download={attachment.name}
                      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                        message.role === 'user'
                          ? 'hover:bg-white/20 text-white/90'
                          : 'hover:bg-background text-secondary dark:hover:bg-primary dark:text-surface'
                      }`}
                      title="Download file"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};