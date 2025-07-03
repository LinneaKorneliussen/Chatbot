import { useState } from 'react';
import { BookOpen, ArrowLeft, Search, Tag, Plus, X, Edit2, Trash2, MessageSquare, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/store';
import { SavedPrompt } from '../types/types';
import { format } from 'date-fns';
import { clsx } from 'clsx';

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
    <div className="">
      <div className="px-6 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 px-6 py-3 text-secondary hover:text-primary bg-surface/70 backdrop-blur-sm rounded-xl border
             border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 text-lg"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Back to Chat</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-highlight/10 to-blue-500/10 rounded-full border border-blue-200/50 mb-8">
            <Sparkles size={20} className="text-highlight" />
            <span className="text-base font-medium text-blue-700">Your Personal Prompt Collection</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 bg-gradient-to-r from-primary via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Prompt Library
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed">
            Organize, search, and reuse your most effective prompts. Build your personal AI toolkit.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-surface/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 mb-12 overflow-hidden">
          <div className="p-8 lg:p-10">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search your prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-lg bg-background/50 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-highlight/20 focus:border-blue-300 transition-all duration-200 text-primary placeholder-muted"
              />
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-accent flex items-center gap-3">
                <Tag size={20} />
                Filter by Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )}
                    className={clsx(
                      "px-5 py-3 rounded-full text-base font-medium flex items-center gap-2 border transition-all duration-200",
                      selectedTags.includes(tag)
                        ? "bg-gradient-to-r from-highlight to-indigo-500 text-white border-transparent shadow-md shadow-highlight/25"
                        : "bg-background text-accent border-gray-200 hover:bg-surface hover:border-gray-300 hover:shadow-sm"
                    )}
                  >
                    <Tag size={16} />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPrompts.map(prompt => (
              <div
                key={prompt.id}
                className="group bg-surface/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 hover:shadow-xl hover:shadow-highlight/5 hover:border-blue-200/50 transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-primary text-xl leading-snug group-hover:text-blue-900 transition-colors line-clamp-2 flex-1 mr-4">
                      {prompt.title}
                    </h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleUsePrompt(prompt)}
                        className="p-3 text-highlight hover:bg-blue-50 rounded-xl transition-colors"
                        title="Use prompt"
                      >
                        <MessageSquare size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPrompt(prompt);
                          setShowEditModal(true);
                        }}
                        className="p-3 text-secondary hover:bg-background rounded-xl transition-colors"
                        title="Edit prompt"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => deletePrompt(prompt.id)}
                        className="p-3 text-error hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete prompt"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <p className="text-secondary text-base leading-relaxed mb-6 line-clamp-4">
                    {prompt.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {prompt.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-background text-accent rounded-lg text-sm font-medium border border-gray-200/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between text-sm text-muted pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2">
                        <Clock size={14} />
                        {format(prompt.timestamp, 'MMM d')}
                      </span>
                      {prompt.lastUsed && (
                        <span className="flex items-center gap-2">
                          <TrendingUp size={14} />
                          {format(prompt.lastUsed, 'MMM d')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                      <span className="w-2 h-2 bg-success rounded-full"></span>
                      <span className="font-medium">{prompt.useCount || 0} uses</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-background rounded-3xl mb-8 shadow-sm">
              <BookOpen size={40} className="text-muted" />
            </div>
            <h3 className="text-2xl font-semibold text-accent mb-4">No prompts found</h3>
            <p className="text-lg text-muted max-w-lg mx-auto">
              {searchQuery || selectedTags.length > 0 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Start building your prompt library by saving prompts from your conversations."
              }
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingPrompt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-surface rounded-3xl w-full max-w-3xl shadow-2xl border border-gray-200/50 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-primary">Edit Prompt</h2>
                <p className="text-muted mt-2 text-lg">Update your prompt details</p>
              </div>
              <button
                onClick={() => {
                  setEditingPrompt(null);
                  setShowEditModal(false);
                }}
                className="p-3 text-muted hover:text-secondary hover:bg-background rounded-xl transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Title Field */}
              <div>
                <label className="block text-base font-semibold text-accent mb-3">
                  Title
                </label>
                <input
                  type="text"
                  value={editingPrompt.title}
                  onChange={(e) => setEditingPrompt({
                    ...editingPrompt,
                    title: e.target.value
                  })}
                  className="w-full p-5 text-lg bg-background/50 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-highlight/20 focus:border-blue-300 transition-all duration-200"
                  placeholder="Enter a descriptive title"
                />
              </div>

              {/* Content Field */}
              <div>
                <label className="block text-base font-semibold text-accent mb-3">
                  Content
                </label>
                <textarea
                  value={editingPrompt.content}
                  onChange={(e) => setEditingPrompt({
                    ...editingPrompt,
                    content: e.target.value
                  })}
                  rows={8}
                  className="w-full p-5 text-lg bg-background/50 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-highlight/20 focus:border-blue-300 transition-all duration-200 resize-none"
                  placeholder="Enter your prompt content"
                />
              </div>

              {/* Tags Field */}
              <div>
                <label className="block text-base font-semibold text-accent mb-4">
                  Tags
                </label>
                
                {/* Existing Tags */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {editingPrompt.tags.map(tag => (
                    <div
                      key={tag}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2.5 rounded-xl flex items-center gap-3 border border-blue-200/50"
                    >
                      <Tag size={16} />
                      <span className="font-medium text-base">{tag}</span>
                      <button
                        onClick={() => setEditingPrompt({
                          ...editingPrompt,
                          tags: editingPrompt.tags.filter(t => t !== tag)
                        })}
                        className="hover:text-error transition-colors ml-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Tag */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Add a new tag..."
                    className="flex-1 p-4 text-lg bg-background/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-highlight/20 focus:border-blue-300 transition-all duration-200"
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
                      const input = document.querySelector('input[placeholder="Add a new tag..."]') as HTMLInputElement;
                      const newTag = input.value.trim();
                      if (newTag && !editingPrompt.tags.includes(newTag)) {
                        setEditingPrompt({
                          ...editingPrompt,
                          tags: [...editingPrompt.tags, newTag]
                        });
                        input.value = '';
                      }
                    }}
                    className="px-6 py-4 bg-gradient-to-r from-highlight to-indigo-500 text-white rounded-xl hover:shadow-lg hover:shadow-highlight/25 transition-all duration-200 flex items-center"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-100 flex justify-end gap-4">
              <button
                onClick={() => {
                  setEditingPrompt(null);
                  setShowEditModal(false);
                }}
                className="px-8 py-4 text-lg text-secondary hover:text-primary hover:bg-background rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingPrompt.id, {
                  title: editingPrompt.title,
                  content: editingPrompt.content,
                  tags: editingPrompt.tags
                })}
                className="px-8 py-4 text-lg bg-gradient-to-r from-highlight to-indigo-500 text-white rounded-xl hover:shadow-lg hover:shadow-highlight/25 transition-all duration-200 font-medium"
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