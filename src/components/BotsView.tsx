import React, { useState } from 'react';
import {
  Search, ArrowLeft, Tag, Plus, X, Star, Trash2,
  Brain, FileText, Calendar, CheckSquare, PieChart,
  Database, Code, Calculator, FileSearch, Languages,
  Microscope, Globe, Lock, Unlock, User, Sparkles
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
    <div className="flex-1 bg-gradient-to-br from-background via-background to-surface overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-surface hover:bg-highlight hover:text-surface transition-all duration-200 shadow-sm hover:shadow-md border border-muted/20"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Chat</span>
          </button>
          <button
            onClick={() => setShowCustomBotModal(true)}
            className="group flex items-center gap-3 bg-gradient-to-r from-highlight to-success text-surface px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-semibold">Create Custom Bot</span>
          </button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-highlight to-success rounded-full">
              <Sparkles className="text-surface" size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent">
              AI Specialists
            </h1>
          </div>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Discover and create specialized AI assistants tailored to your needs
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-surface rounded-2xl shadow-lg border border-muted/10 mb-8 backdrop-blur-sm">
          <div className="p-6 border-b border-muted/10">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search bots by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight transition-all duration-200 text-lg bg-background/50"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  showOnlyFavorites
                    ? 'bg-gradient-to-r from-warning to-error text-surface shadow-md'
                    : 'bg-muted/10 text-secondary hover:bg-muted/20'
                }`}
              >
                <Star size={16} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
                <span>Favorites</span>
              </button>
              <button
                onClick={() => setShowOnlyMine(!showOnlyMine)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  showOnlyMine
                    ? 'bg-gradient-to-r from-highlight to-success text-surface shadow-md'
                    : 'bg-muted/10 text-secondary hover:bg-muted/20'
                }`}
              >
                <User size={16} />
                <span>My Bots</span>
              </button>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-primary to-secondary text-surface shadow-sm'
                        : 'bg-muted/10 text-secondary hover:bg-muted/20'
                    }`}
                  >
                    <Tag size={12} />
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bots Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBots.map((bot) => {
                const Icon = iconMap[bot.icon] || Brain;
                return (
                  <div
                    key={bot.id}
                    className="group bg-gradient-to-br from-surface to-background rounded-xl p-6 border border-muted/10 hover:shadow-lg hover:shadow-highlight/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-highlight to-success" />
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 relative">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="p-3 rounded-xl bg-gradient-to-r from-highlight to-success text-surface shadow-sm">
                            <Icon size={24} />
                          </div>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-highlight to-success opacity-20 blur-sm" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-primary mb-1 flex items-center gap-2 group-hover:text-highlight transition-colors duration-200">
                            {bot.name}
                            {bot.isPublic ? (
                              <Unlock size={14} className="text-success" />
                            ) : (
                              <Lock size={14} className="text-warning" />
                            )}
                          </h3>
                          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                            {bot.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => toggleBotFavorite(bot.id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            bot.isFavorited 
                              ? 'text-warning bg-warning/10 hover:bg-warning/20' 
                              : 'text-muted hover:text-warning hover:bg-warning/10'
                          }`}
                          title={bot.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star size={16} fill={bot.isFavorited ? 'currentColor' : 'none'} />
                        </button>
                        {bot.createdBy === userProfile.email && (
                          <button
                            onClick={() => deleteBot(bot.id)}
                            className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all duration-200"
                            title="Delete bot"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Abilities */}
                    {bot.abilities && bot.abilities.length > 0 && (
                      <div className="mb-4 relative">
                        <h4 className="text-sm font-semibold text-primary mb-2">Abilities</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {bot.abilities.slice(0, 3).map(ability => (
                            <span
                              key={ability}
                              className="px-2 py-1 bg-highlight/10 text-highlight rounded-md text-xs font-medium"
                            >
                              {ability}
                            </span>
                          ))}
                          {bot.abilities.length > 3 && (
                            <span className="px-2 py-1 bg-muted/10 text-muted rounded-md text-xs font-medium">
                              +{bot.abilities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-xs text-muted mb-4 relative">
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
                        {format(new Date(bot.createdAt), 'MMM dd')}
                      </span>
                    </div>

                    {/* Chat Button */}
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
                      className="w-full bg-gradient-to-r from-primary to-secondary text-surface rounded-xl py-3 font-semibold hover:from-highlight hover:to-success transition-all duration-200 hover:shadow-md transform hover:scale-105 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Start Chat</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-highlight to-success opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom Bot Modal */}
        {showCustomBotModal && (
          <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-primary mb-2">Create Custom Bot</h2>
                    <p className="text-muted">Build your specialized AI assistant</p>
                  </div>
                  <button
                    onClick={() => setShowCustomBotModal(false)}
                    className="text-muted hover:text-primary hover:bg-muted/10 p-2 rounded-lg transition-all duration-200"
                    aria-label="Close modal"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Bot Name */}
                  <div>
                    <label className="block text-primary mb-2 font-semibold" htmlFor="bot-name">
                      Bot Name
                    </label>
                    <input
                      id="bot-name"
                      type="text"
                      value={customBotData.name}
                      onChange={e => setCustomBotData({...customBotData, name: e.target.value})}
                      className="w-full border border-muted/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight transition-all duration-200"
                      placeholder="Enter a unique name for your bot"
                    />
                  </div>

                  {/* Abilities */}
                  <div>
                    <label className="block text-primary mb-3 font-semibold">
                      Abilities <span className="text-muted font-normal">(Select at least one)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
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
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            customBotData.abilities.includes(ability)
                              ? 'bg-gradient-to-r from-highlight to-success text-surface shadow-sm'
                              : 'bg-muted/10 text-secondary hover:bg-muted/20'
                          }`}
                        >
                          {ability}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Data Sources */}
                  <div>
                    <label className="block text-primary mb-3 font-semibold">
                      Data Sources <span className="text-muted font-normal">(Optional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
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
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            customBotData.dataSources.includes(source)
                              ? 'bg-gradient-to-r from-primary to-secondary text-surface shadow-sm'
                              : 'bg-muted/10 text-secondary hover:bg-muted/20'
                          }`}
                        >
                          {source}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-primary mb-2 font-semibold">Tags</label>
                    <input
                      type="text"
                      placeholder="Add tags separated by commas (e.g., finance, analysis, reports)"
                      value={customBotData.tags.join(', ')}
                      onChange={e => {
                        const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
                        setCustomBotData({...customBotData, tags});
                      }}
                      className="w-full border border-muted/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight transition-all duration-200"
                    />
                  </div>

                  {/* Public/Private */}
                  <div className="flex items-center gap-3 p-4 bg-muted/5 rounded-xl">
                    <input
                      id="isPublic"
                      type="checkbox"
                      checked={customBotData.isPublic}
                      onChange={e => setCustomBotData({...customBotData, isPublic: e.target.checked})}
                      className="w-5 h-5 text-highlight rounded focus:ring-highlight border-muted/20"
                    />
                    <label htmlFor="isPublic" className="text-primary font-medium select-none cursor-pointer">
                      Make bot public
                    </label>
                    <span className="text-muted text-sm">
                      {customBotData.isPublic ? 'Other users can discover and use this bot' : 'Only you can use this bot'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-muted/10">
                  <button
                    onClick={() => setShowCustomBotModal(false)}
                    className="px-6 py-3 rounded-xl border border-muted/20 text-secondary hover:bg-muted/10 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateBot}
                    disabled={!customBotData.name || customBotData.abilities.length === 0}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      !customBotData.name || customBotData.abilities.length === 0
                        ? 'bg-muted/20 text-muted cursor-not-allowed'
                        : 'bg-gradient-to-r from-highlight to-success text-surface hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    Create Bot
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};