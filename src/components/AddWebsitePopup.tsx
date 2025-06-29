import React, { useState } from 'react';
import { 
  X, Globe, ExternalLink, 
  Code, Palette, Camera, Music, 
  ShoppingCart, BookOpen, Gamepad2, Heart,
  Coffee, Briefcase, GraduationCap, Newspaper,
  Zap, Star, Rocket, Target,
  Monitor, Smartphone, Headphones, Film
} from 'lucide-react';

interface AddWebsitePopupProps {
  onClose: () => void;
  onAdd: (website: {
    name: string;
    url: string;
    icon: string;
    color: string;
    description: string;
  }) => void;
}

const iconOptions = [
  { key: 'globe', icon: Globe, name: 'Globe', category: 'General' },
  { key: 'code', icon: Code, name: 'Code', category: 'Development' },
  { key: 'palette', icon: Palette, name: 'Design', category: 'Creative' },
  { key: 'camera', icon: Camera, name: 'Photography', category: 'Creative' },
  { key: 'music', icon: Music, name: 'Music', category: 'Entertainment' },
  { key: 'shopping-cart', icon: ShoppingCart, name: 'Shopping', category: 'Commerce' },
  { key: 'book-open', icon: BookOpen, name: 'Education', category: 'Learning' },
  { key: 'gamepad2', icon: Gamepad2, name: 'Gaming', category: 'Entertainment' },
  { key: 'heart', icon: Heart, name: 'Health', category: 'Lifestyle' },
  { key: 'coffee', icon: Coffee, name: 'Food & Drink', category: 'Lifestyle' },
  { key: 'briefcase', icon: Briefcase, name: 'Business', category: 'Work' },
  { key: 'graduation-cap', icon: GraduationCap, name: 'Learning', category: 'Education' },
  { key: 'newspaper', icon: Newspaper, name: 'News', category: 'Information' },
  { key: 'zap', icon: Zap, name: 'Energy', category: 'Tech' },
  { key: 'star', icon: Star, name: 'Favorites', category: 'General' },
  { key: 'rocket', icon: Rocket, name: 'Startup', category: 'Business' },
  { key: 'target', icon: Target, name: 'Goals', category: 'Productivity' },
  { key: 'monitor', icon: Monitor, name: 'Tech', category: 'Technology' },
  { key: 'smartphone', icon: Smartphone, name: 'Mobile', category: 'Technology' },
  { key: 'headphones', icon: Headphones, name: 'Audio', category: 'Entertainment' },
  { key: 'film', icon: Film, name: 'Video', category: 'Entertainment' },
];

export const AddWebsitePopup: React.FC<AddWebsitePopupProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('globe');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      return;
    }

    // Ensure URL has protocol
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onAdd({
      name: name.trim(),
      url: formattedUrl,
      description: description.trim() || 'Custom website',
      icon: selectedIcon,
      color: 'text-blue-500 hover:bg-blue-50'
    });

    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Website</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Website Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Portfolio"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., myportfolio.com"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <ExternalLink size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Personal portfolio website"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Icon
              </label>
              <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
                {iconOptions.map(({ key, icon: Icon, name, category }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedIcon(key)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border-2 ${
                      selectedIcon === key
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-white text-gray-600 hover:shadow-sm'
                    }`}
                    title={`${name} (${category})`}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {iconOptions.find(opt => opt.key === selectedIcon)?.name} - {iconOptions.find(opt => opt.key === selectedIcon)?.category}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!name.trim() || !url.trim()}
              >
                Add Website
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};