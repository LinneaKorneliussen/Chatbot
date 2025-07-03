import React, { useState } from 'react';
import { X, Tag, Plus, Sparkles, BookOpen, Zap } from 'lucide-react';

interface SavePromptModalProps {
  onClose: () => void;
  onSave: (title: string, tags: string[]) => void;
}

export const SavePromptModal: React.FC<SavePromptModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-surface via-surface to-background rounded-2xl w-full max-w-lg shadow-2xl border border-muted/20 transform animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Decorative Header Background */}
        <div className="relative bg-gradient-to-r from-highlight via-success to-warning p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-highlight/20 to-success/20 backdrop-blur-sm" />
          <div className="absolute top-2 right-2 opacity-20">
            <Sparkles size={40} className="text-surface animate-pulse" />
          </div>
          <div className="absolute bottom-2 left-2 opacity-10">
            <BookOpen size={32} className="text-surface" />
          </div>
          
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface/20 rounded-xl backdrop-blur-sm">
                <Zap className="text-surface" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-surface">Save to Library</h2>
                <p className="text-surface/80 text-sm">Preserve your brilliant prompt</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-surface/80 hover:text-surface hover:bg-surface/20 rounded-xl transition-all duration-200 hover:rotate-90 transform"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-primary">
              <BookOpen size={16} className="text-highlight" />
              Give your prompt a catchy title
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 border-2 border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight transition-all duration-200 text-lg bg-background/50 placeholder-muted"
                placeholder="✨ My amazing prompt..."
                autoFocus
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-highlight/5 to-success/5 pointer-events-none" />
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Tag size={16} className="text-success" />
              Add some colorful tags
            </label>
            
            {/* Existing Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-muted/5 to-highlight/5 rounded-xl border border-muted/10">
                {tags.map((tag, index) => (
                  <div
                    key={tag}
                    className="group bg-gradient-to-r from-highlight to-success text-surface px-4 py-2 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <Tag size={14} />
                    <span className="font-medium">{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-surface/20 rounded-full p-1 transition-all duration-200 hover:rotate-90 transform"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add New Tag */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="🏷️ Add a tag..."
                  className="w-full p-3 border-2 border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-all duration-200 bg-background/50 placeholder-muted"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-success/5 to-warning/5 pointer-events-none" />
              </div>
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
                className="group p-3 bg-gradient-to-r from-success to-warning text-surface rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Fun Stats */}
          <div className="flex items-center justify-center gap-6 p-4 bg-gradient-to-r from-muted/5 to-highlight/5 rounded-xl border border-muted/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-highlight">{title.length}</div>
              <div className="text-xs text-muted">characters</div>
            </div>
            <div className="w-px h-8 bg-muted/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{tags.length}</div>
              <div className="text-xs text-muted">tags</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gradient-to-r from-background/50 to-surface/50 border-t border-muted/10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-secondary hover:text-primary hover:bg-muted/10 rounded-xl transition-all duration-200 font-medium border border-muted/20 hover:border-muted/40"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onSave(title.trim(), tags);
                onClose();
              }
            }}
            disabled={!title.trim()}
            className="group px-8 py-3 bg-gradient-to-r from-highlight to-success text-surface rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center gap-2"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-200" />
            Save to Library
          </button>
        </div>
      </div>
    </div>
  );
};