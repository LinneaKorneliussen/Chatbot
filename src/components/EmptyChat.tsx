import React from 'react';
import { MessageSquare, Sparkles, ArrowRight } from 'lucide-react';

interface EmptyChatProps {
  message?: string;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({ 
  message = "Select or create a thread to start chatting" 
}) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-highlight blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-accent blur-3xl"></div>
      </div>
      
      <div className="text-center relative z-10 max-w-md mx-auto px-6">
        {/* Icon Container */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-2xl border border-accent/30">
            <MessageSquare size={32} className="text-surface" />
          </div>
          
          {/* Floating accent */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-highlight rounded-full flex items-center justify-center shadow-lg">
            <Sparkles size={14} className="text-surface" />
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 w-20 h-20 bg-highlight/20 rounded-2xl blur-xl mx-auto"></div>
        </div>

        {/* Main Message */}
        <h2 className="text-2xl font-semibold text-primary mb-3 leading-tight">
          Ready to Chat?
        </h2>
        
        <p className="text-secondary text-lg mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Hints */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 text-sm text-accent bg-surface/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-muted/30 shadow-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Choose a conversation to continue</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <span>or create a new thread</span>
            <ArrowRight size={14} className="text-highlight" />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 bg-gradient-to-br from-highlight/10 to-accent/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};