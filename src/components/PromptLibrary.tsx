import { useState } from 'react';
import { BookOpen, ArrowLeft, Search, Tag, Plus, X, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/store';
import { SavedPrompt } from '../types/types';
import { format } from 'date-fns';

interface PromptFormData {
  title: string;
  content: string;
  tags: string[];
}

export const PromptLibrary = () => {
  const navigate = useNavigate();
  const savedPrompts = useChatStore((state) => state.savedPrompts);
  const updatePrompt = useChatStore((state) => state.updatePrompt);
  const deletePrompt = useChatStore((state) => state.deletePrompt);
  const createThread = useChatStore((state) => state.createThread);
  const addMessage = useChatStore((state) => state.addMessage);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<SavedPrompt | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const allTags = Array.from(
    new Set(savedPrompts.flatMap(prompt => prompt.tags))
  );

  const filteredPrompts = savedPrompts.filter(prompt => {
    const matchesSearch = searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => prompt.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const handleUsePrompt = (prompt: SavedPrompt) => {
    const threadId = createThread();
    addMessage(threadId, {
      id: Date.now().toString(),
      role: 'user',
      content: prompt.content,
      timestamp: new Date(),
      isPinned: false
    });
    updatePrompt(prompt.id, {
      lastUsed: new Date(),
      useCount: (prompt.useCount || 0) + 1
    });
    navigate('/');
  };

  const handleSaveEdit = (promptId: string, updates: Partial<PromptFormData>) => {
    updatePrompt(promptId, updates);
    setEditingPrompt(null);
    setShowEditModal(false);
  };

  return (
    <div className="flex-1 bg-background overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Chat</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Prompt Library</h1>
          <p className="text-muted">
            Manage and reuse your saved prompts
          </p>
        </div>

        <div className="bg-surface rounded-xl shadow-md mb-8">
          <div className="p-4 border-b border-muted">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  )}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-surface border-primary'
                      : 'bg-accent text-primary border-accent hover:bg-secondary'
                  }`}
                >
                  <Tag size={14} />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-muted">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map(prompt => (
                <div
                  key={prompt.id}
                  className="p-4 hover:bg-background transition-colors rounded-md cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-primary">{prompt.title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUsePrompt(prompt)}
                        className="p-1 text-primary hover:bg-accent rounded transition-colors"
                        title="Use prompt"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPrompt(prompt);
                          setShowEditModal(true);
                        }}
                        className="p-1 text-secondary hover:bg-surface rounded transition-colors"
                        title="Edit prompt"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deletePrompt(prompt.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete prompt"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted mb-3 line-clamp-2">
                    {prompt.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>Created: {format(prompt.timestamp, 'MMM d, yyyy')}</span>
                    {prompt.lastUsed && (
                      <span>Last used: {format(prompt.lastUsed, 'MMM d, yyyy')}</span>
                    )}
                    <span>Used {prompt.useCount || 0} times</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prompt.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-accent text-primary rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted">
                <BookOpen size={48} className="mx-auto mb-4" />
                <p>No prompts found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && editingPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl w-full max-w-2xl shadow-lg">
            <div className="p-4 border-b border-muted flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary">Edit Prompt</h2>
              <button
                onClick={() => {
                  setEditingPrompt(null);
                  setShowEditModal(false);
                }}
                className="text-secondary hover:text-primary transition-colors"
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
                  value={editingPrompt.title}
                  onChange={(e) => setEditingPrompt({
                    ...editingPrompt,
                    title: e.target.value
                  })}
                  className="w-full p-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Content
                </label>
                <textarea
                  value={editingPrompt.content}
                  onChange={(e) => setEditingPrompt({
                    ...editingPrompt,
                    content: e.target.value
                  })}
                  rows={5}
                  className="w-full p-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingPrompt.tags.map(tag => (
                    <div
                      key={tag}
                      className="bg-accent text-primary px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <Tag size={14} />
                      <span>{tag}</span>
                      <button
                        onClick={() => setEditingPrompt({
                          ...editingPrompt,
                          tags: editingPrompt.tags.filter(t => t !== tag)
                        })}
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
                    placeholder="Add new tag..."
                    className="flex-1 p-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget;
                        const newTag = input.value.trim();
                        if (newTag && !editingPrompt.tags.includes(newTag)) {
                          setEditingPrompt({
                            ...editingPrompt,
                            tags: [...editingPrompt.tags, newTag]
                          });
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add new tag..."]') as HTMLInputElement;
                      const newTag = input.value.trim();
                      if (newTag && !editingPrompt.tags.includes(newTag)) {
                        setEditingPrompt({
                          ...editingPrompt,
                          tags: [...editingPrompt.tags, newTag]
                        });
                        input.value = '';
                      }
                    }}
                    className="p-2 bg-primary text-surface rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-muted flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingPrompt(null);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 text-secondary hover:bg-surface rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingPrompt.id, {
                  title: editingPrompt.title,
                  content: editingPrompt.content,
                  tags: editingPrompt.tags
                })}
                className="px-4 py-2 bg-primary text-surface rounded-lg hover:bg-secondary transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};