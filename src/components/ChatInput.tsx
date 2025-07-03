import React, { useState, useRef } from 'react';
import { Paperclip, Send, Mic, X, File, Image } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string, files?: File[] | { id: string; name: string; size: number; type: string; }[]) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleSend = () => {
    if (!input.trim() && files.length === 0) return;

    const attachments = files.map((file, i) => ({
      id: `${Date.now()}_${i}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    onSendMessage(input.trim(), attachments);
    setInput('');
    setFiles([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
      event.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return <Image size={16} className="text-highlight" />;
    }
    return <File size={16} className="text-muted" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-muted/30 p-4 dark:bg-primary/95 dark:border-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* File attachments preview */}
        {files.length > 0 && (
          <div className="mb-4 p-4 bg-surface/90 border border-muted/30 rounded-xl shadow-sm backdrop-blur-sm dark:bg-secondary/90 dark:border-muted/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-primary dark:text-surface flex items-center gap-2">
                <Paperclip size={16} />
                Attached Files ({files.length})
              </h4>
              <button
                onClick={() => setFiles([])}
                className="text-muted hover:text-error transition-colors duration-200 p-1 rounded-full hover:bg-error/10"
                title="Remove all files"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-muted/20 hover:border-highlight/30 transition-all duration-200 dark:bg-primary dark:border-muted/20"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-primary dark:text-surface">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-muted hover:text-error transition-colors duration-200 p-2 rounded-full hover:bg-error/10 hover:scale-110"
                    title="Remove file"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main input area */}
        <div className="relative bg-surface/90 rounded-2xl shadow-lg border border-muted/30 backdrop-blur-sm transition-all duration-200 focus-within:border-highlight/50 focus-within:shadow-xl dark:bg-secondary/90 dark:border-muted/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())
            }
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            className="w-full p-4 pr-32 rounded-2xl focus:outline-none resize-none min-h-[120px] bg-transparent text-primary placeholder-muted/70 dark:text-surface dark:placeholder-muted/50"
            style={{ scrollbarWidth: 'thin' }}
          />

          {/* Action buttons */}
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {/* Voice recording button */}
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                isRecording 
                  ? 'text-error bg-error/10 animate-pulse scale-105' 
                  : 'text-muted hover:text-highlight hover:bg-highlight/10'
              }`}
              title={isRecording ? 'Stop recording' : 'Record voice message'}
              type="button"
            >
              <Mic size={20} />
            </button>

            {/* File attachment button */}
            <label className="cursor-pointer p-3 rounded-xl text-muted hover:text-highlight hover:bg-highlight/10 transition-all duration-200 hover:scale-110">
              <Paperclip size={20} />
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={handleFileUpload}
                accept="*/*"
              />
            </label>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() && files.length === 0}
              className={`p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                input.trim() || files.length > 0
                  ? 'bg-gradient-to-r from-highlight to-highlight/90 text-white hover:scale-110 hover:from-highlight/90 hover:to-highlight'
                  : 'bg-muted/30 text-muted/50 cursor-not-allowed'
              }`}
              title="Send message"
              type="button"
            >
              <Send size={20} />
            </button>
          </div>

          {/* Character count indicator */}
          {input.length > 0 && (
            <div className="absolute left-4 bottom-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                input.length > 1000 
                  ? 'bg-warning/20 text-warning' 
                  : 'bg-muted/20 text-muted'
              }`}>
                {input.length} chars
              </span>
            </div>
          )}
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="mt-3 flex items-center justify-center gap-2 text-error">
            <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording... Click mic to stop</span>
            <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
          </div>
        )}

        {/* Keyboard shortcuts hint */}
        <div className="mt-2 text-center">
          <p className="text-xs text-muted/70">
            <kbd className="px-2 py-1 bg-muted/20 rounded text-xs">Enter</kbd> to send • 
            <kbd className="px-2 py-1 bg-muted/20 rounded text-xs ml-1">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};