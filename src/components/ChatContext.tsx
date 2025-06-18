import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ChatContextProps {
  summary: string | null;
}

const ChatContext: React.FC<ChatContextProps> = ({ summary }) => {
  if (!summary) return null;
  
  return (
    <div className="bg-surface/50 p-4 mx-4 mt-4 rounded-lg flex items-start gap-3 shadow-sm">
      <AlertCircle size={24} className="text-primary flex-shrink-0 mt-1" />
      <div>
        <p className="text-sm font-medium text-primary mb-2">Context Summary</p>
        <p className="text-sm text-primary/80 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
};

export default ChatContext;
