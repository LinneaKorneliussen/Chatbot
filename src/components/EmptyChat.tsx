import React from 'react';
import { MessageSquare } from 'lucide-react';

interface EmptyChatProps {
  message?: string;
}

const EmptyChat: React.FC<EmptyChatProps> = ({ 
  message = "Select or create a thread to start chatting" 
}) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center">
        <MessageSquare size={48} className="text-primary mx-auto mb-4 opacity-50" />
        <p className="text-primary text-lg">{message}</p>
      </div>
    </div>
  );
};

export default EmptyChat;
