import React, { useState } from 'react';
import { X, Tag, Plus } from 'lucide-react';

interface SavePromptModalProps {
  onClose: () => void;
  onSave: (title: string, tags: string[]) => void;
}

const SavePromptModal: React.FC<SavePromptModalProps> = ({ onClose, onSave }) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl w-full max-w-md shadow-lg">
        <div className="p-4 border-b border-primary/20 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">Save to Prompt Library</h2>
          <button
            onClick={onClose}
            className="text-primary hover:text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter a title for your prompt..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <div
                  key={tag}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <Tag size={14} />
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tags..."
                className="flex-1 p-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddTag}
                className="p-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-primary/20 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onSave(title.trim(), tags);
                onClose();
              }
            }}
            disabled={!title.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save to Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePromptModal;
