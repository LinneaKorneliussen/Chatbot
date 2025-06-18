import React, { useState } from 'react';
import {
  Search, ArrowLeft, Tag, Plus, X, Star, Trash2,
  Brain, FileText, Calendar, CheckSquare, PieChart,
  Database, Code, Calculator, FileSearch, Languages,
  Microscope, Globe, Lock, Unlock, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/store';
import type { CustomBotFormData } from '../types/types';
import { format } from 'date-fns';

const ABILITIES = [
  'Budget Analysis',
  'Text Sentiment Analysis',
  'Data Visualization',
  'Code Review',
  'Document Summarization',
  'Language Translation',
  'Statistical Analysis',
  'Market Research',
  'Technical Writing',
  'Scientific Research'
];

const DATA_SOURCES = [
  'Financial Reports',
  'Social Media Data',
  'Scientific Papers',
  'Code Repositories',
  'Market Data',
  'Customer Feedback',
  'Technical Documentation',
  'Research Papers'
];

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  code: Code,
  'bar-chart': PieChart,
  file: FileText,
  calendar: Calendar,
  check: CheckSquare,
  database: Database,
  calculator: Calculator,
  search: FileSearch,
  language: Languages,
  microscope: Microscope,
  globe: Globe
};

export const BotsView = () => {
  const navigate = useNavigate();
  const [showCustomBotModal, setShowCustomBotModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const bots = useChatStore((state) => state.bots);
  const userProfile = useChatStore((state) => state.userProfile);
  const addBot = useChatStore((state) => state.addBot);
  const toggleBotFavorite = useChatStore((state) => state.toggleBotFavorite);
  const deleteBot = useChatStore((state) => state.deleteBot);
  const createThread = useChatStore((state) => state.createThread);
  const addMessage = useChatStore((state) => state.addMessage);

  const [customBotData, setCustomBotData] = useState<CustomBotFormData>({
    name: '',
    abilities: [],
    dataSources: [],
    tags: [],
    isPublic: true
  });

  const allTags = Array.from(
    new Set(bots.flatMap(bot => bot.tags || []))
  );

  const filteredBots = bots.filter(bot => {
    const matchesSearch = searchQuery === '' ||
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bot.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => bot.tags?.includes(tag));

    const matchesFavorites = !showOnlyFavorites || bot.isFavorited;
    const matchesMine = !showOnlyMine || bot.createdBy === userProfile.email;

    return matchesSearch && matchesTags && matchesFavorites && matchesMine;
  });

  const handleCreateBot = () => {
    if (!customBotData.name || customBotData.abilities.length === 0) return;

    const botId = `custom-${Date.now()}`;
    addBot({
      id: botId,
      name: customBotData.name,
      icon: 'brain',
      description: `Custom bot with abilities: ${customBotData.abilities.join(', ')}`,
      abilities: customBotData.abilities,
      dataSources: customBotData.dataSources,
      tags: customBotData.tags,
      isCustom: true,
      createdBy: userProfile.email,
      createdAt: new Date(),
      favorites: 0,
      isPublic: customBotData.isPublic
    });

    setShowCustomBotModal(false);
    setCustomBotData({
      name: '',
      abilities: [],
      dataSources: [],
      tags: [],
      isPublic: true
    });
  };

  return (
    <div className="flex-1 bg-background overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Chat</span>
          </button>
          <button
            onClick={() => setShowCustomBotModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Plus size={20} />
            <span>Create Custom Bot</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">AI Specialists</h1>
          <p className="text-primary/70">
            Discover and create specialized AI assistants
          </p>
        </div>

        <div className="bg-surface rounded-xl shadow-sm mb-8">
          <div className="p-4 border-b border-accent/20">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
                <input
                  type="text"
                  placeholder="Search bots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                  showOnlyFavorites
                    ? 'bg-primary text-white'
                    : 'bg-accent/20 text-primary'
                }`}
              >
                <Star size={16} />
                <span>Favorites</span>
              </button>
              <button
                onClick={() => setShowOnlyMine(!showOnlyMine)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                  showOnlyMine
                    ? 'bg-primary text-white'
                    : 'bg-accent/20 text-primary'
                }`}
              >
                <User size={16} />
                <span>My Bots</span>
              </button>
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
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-accent/20 text-primary'
                  }`}
                >
                  <Tag size={14} />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredBots.map((bot) => {
              const Icon = iconMap[bot.icon] || Brain;
              return (
                <div
                  key={bot.id}
                  className="bg-background rounded-xl p-6 hover:shadow-md transition-shadow relative group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary text-white">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-2">
                          {bot.name}
                          {bot.isPublic ? (
                            <Unlock size={14} className="text-accent" />
                          ) : (
                            <Lock size={14} className="text-accent" />
                          )}
                        </h3>
                        <p className="text-sm text-primary/70 line-clamp-2">
                          {bot.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => toggleBotFavorite(bot.id)}
                        className={`p-1 rounded hover:bg-accent/20 transition-colors ${
                          bot.isFavorited ? 'text-yellow-500' : 'text-primary/50'
                        }`}
                        title={bot.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star size={18} fill={bot.isFavorited ? 'currentColor' : 'none'} />
                      </button>
                      {bot.createdBy === userProfile.email && (
                        <button
                          onClick={() => deleteBot(bot.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete bot"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {bot.abilities && bot.abilities.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-primary mb-2">Abilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {bot.abilities.map(ability => (
                          <span
                            key={ability}
                            className="px-2 py-0.5 bg-accent/20 text-primary rounded-full text-xs"
                          >
                            {ability}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-primary/60 mb-2">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {bot.createdBy === 'system' ? 'System' : 'Custom'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={12} />
                      {bot.favorites || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {format(new Date(bot.createdAt), 'yyyy-MM-dd')}
                    </span>
                  </div>

                   <button
                    onClick={() => {
                      const threadId = createThread();
                      addMessage(threadId, {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: `Hi! I'm ${bot.name}. ${bot.description} How can I help you today?`,
                        timestamp: new Date(),
                        isPinned: false
                      });
                      navigate('/');
                    }}
                    className="w-full bg-primary text-white rounded-lg py-2 hover:bg-accent transition-colors"
                  >
                    Chat
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal for creating custom bot */}
        {showCustomBotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-primary">Create Custom Bot</h2>
                <button
                  onClick={() => setShowCustomBotModal(false)}
                  className="text-primary hover:text-accent transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-primary mb-1 font-medium" htmlFor="bot-name">Bot Name</label>
                <input
                  id="bot-name"
                  type="text"
                  value={customBotData.name}
                  onChange={e => setCustomBotData({...customBotData, name: e.target.value})}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter bot name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-primary mb-1 font-medium">Abilities</label>
                <div className="flex flex-wrap gap-2">
                  {ABILITIES.map(ability => (
                    <button
                      key={ability}
                      type="button"
                      onClick={() => {
                        setCustomBotData(prev => {
                          const has = prev.abilities.includes(ability);
                          return {
                            ...prev,
                            abilities: has
                              ? prev.abilities.filter(a => a !== ability)
                              : [...prev.abilities, ability]
                          };
                        });
                      }}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        customBotData.abilities.includes(ability)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-background text-primary border-accent'
                      }`}
                    >
                      {ability}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-primary mb-1 font-medium">Data Sources</label>
                <div className="flex flex-wrap gap-2">
                  {DATA_SOURCES.map(source => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => {
                        setCustomBotData(prev => {
                          const has = prev.dataSources.includes(source);
                          return {
                            ...prev,
                            dataSources: has
                              ? prev.dataSources.filter(d => d !== source)
                              : [...prev.dataSources, source]
                          };
                        });
                      }}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        customBotData.dataSources.includes(source)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-background text-primary border-accent'
                      }`}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-primary mb-1 font-medium">Tags</label>
                <input
                  type="text"
                  placeholder="Add tags separated by commas"
                  value={customBotData.tags.join(', ')}
                  onChange={e => {
                    const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
                    setCustomBotData({...customBotData, tags});
                  }}
                  className="w-full border border-accent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mb-6 flex items-center gap-2">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={customBotData.isPublic}
                  onChange={e => setCustomBotData({...customBotData, isPublic: e.target.checked})}
                  className="accent-primary"
                />
                <label htmlFor="isPublic" className="text-primary select-none">Make bot public</label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowCustomBotModal(false)}
                  className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBot}
                  disabled={!customBotData.name || customBotData.abilities.length === 0}
                  className={`px-6 py-2 rounded-lg text-white transition-colors ${
                    !customBotData.name || customBotData.abilities.length === 0
                      ? 'bg-primary/50 cursor-not-allowed'
                      : 'bg-primary hover:bg-accent'
                  }`}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
