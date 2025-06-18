import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

interface SuggestionItem {
  icon: React.ElementType;
  text: string;
}

interface ChatSuggestionsProps {
  suggestions: SuggestionItem[];
  onSuggestionClick: (text: string) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ 
  suggestions, 
  onSuggestionClick 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mt-8">
      <div className="col-span-full">
        <h2 className="text-2xl font-semibold text-primary text-center mb-2">
          👋 Welcome! How can I help you today?
        </h2>
        <p className="text-primary/70 text-center mb-8">
          Choose a suggestion or type your own question
        </p>
      </div>
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-center gap-3 p-4 rounded-lg shadow-2xl hover:shadow-md transition-all hover:scale-[1.02] group"
          >
            <div className="p-2 rounded-full bg-primary/10 group-hover:bg-secondary/20 transition-colors">
              <Icon size={24} className="text-primary" />
            </div>
            <p className="text-primary text-left">{suggestion.text}</p>
          </button>
        );
      })}
    </div>
  );
};

export default ChatSuggestions;
