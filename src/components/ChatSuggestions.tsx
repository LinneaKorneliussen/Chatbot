import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestionItem {
  icon: React.ElementType;
  text: string;
}

interface ChatSuggestionsProps {
  suggestions: SuggestionItem[];
  onSuggestionClick: (text: string) => void;
}

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ 
  suggestions, 
  onSuggestionClick 
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-highlight/10 to-blue-500/10 rounded-full border border-blue-200/50 mb-4">
          <Sparkles size={16} className="text-highlight" />
          <span className="text-sm font-medium text-blue-700">AI Ready</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
          👋 How can I help you?
        </h2>
        
        <p className="text-base text-secondary">
          Choose a suggestion or ask me anything
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="group relative bg-surface/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200/50 hover:shadow-lg hover:shadow-highlight/5 hover:border-blue-200/50 transition-all duration-200 text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-highlight/3 via-transparent to-indigo-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-highlight/10 to-indigo-500/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Icon size={20} className="text-highlight group-hover:text-indigo-600 transition-colors" />
                </div>
                
                <div className="flex-1">
                  <p className="text-base font-medium text-primary leading-snug group-hover:text-blue-900 transition-colors">
                    {suggestion.text}
                  </p>
                </div>
                
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1">
                  <svg className="w-4 h-4 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface/60 rounded-xl border border-gray-200/30">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-secondary">Ready to chat</span>
        </div>
      </div>
    </div>
  );
};