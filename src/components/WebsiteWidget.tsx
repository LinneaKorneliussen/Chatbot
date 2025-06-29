import React, { useState } from 'react';
import { 
  Globe, Github, Youtube, Twitter, Linkedin, Mail, ExternalLink, X, Plus,
  Code, Palette, Camera, Music, 
  ShoppingCart, BookOpen, Gamepad2, Heart,
  Coffee, Briefcase, GraduationCap, Newspaper,
  Zap, Star, Rocket, Target,
  Monitor, Smartphone, Headphones, Film,
} from 'lucide-react';
import { AddWebsitePopup } from './AddWebsitePopup';
import { Website } from '../types/types';

const iconMap: Record<string, React.ElementType> = {
  globe: Globe,
  github: Github,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  mail: Mail,
  code: Code,
  palette: Palette,
  camera: Camera,
  music: Music,
  'shopping-cart': ShoppingCart,
  'book-open': BookOpen,
  gamepad2: Gamepad2,
  heart: Heart,
  coffee: Coffee,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  newspaper: Newspaper,
  zap: Zap,
  star: Star,
  rocket: Rocket,
  target: Target,
  monitor: Monitor,
  smartphone: Smartphone,
  headphones: Headphones,
  film: Film,
};

const initialWebsites: Website[] = [
  {
    id: '1',
    name: 'GitHub',
    url: 'https://github.com',
    icon: 'github',
    color: 'text-gray-800 hover:bg-gray-100',
    description: 'Code repositories'
  },
  {
    id: '2',
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: 'youtube',
    color: 'text-red-600 hover:bg-red-50',
    description: 'Video platform'
  },
  {
    id: '3',
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: 'twitter',
    color: 'text-blue-500 hover:bg-blue-50',
    description: 'Social media'
  },
  {
    id: '4',
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'linkedin',
    color: 'text-blue-700 hover:bg-blue-50',
    description: 'Professional network'
  },
  {
    id: '5',
    name: 'Gmail',
    url: 'https://gmail.com',
    icon: 'mail',
    color: 'text-red-500 hover:bg-red-50',
    description: 'Email service'  
  },
  {
    id: '6',
    name: 'Portfolio',
    url: 'https://example.com',
    icon: 'globe',
    color: 'text-green-600 hover:bg-green-50',
    description: 'Personal website'
  }
];

export const WebsiteWidget = () => { 
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const handleWebsiteClick = (website: Website) => {
    window.open(website.url, '_blank', 'noopener,noreferrer');
  };

  const handleAddWebsite = (newWebsite: Omit<Website, 'id'>) => {
    const website: Website = {
      ...newWebsite,
      id: Date.now().toString()
    };
    setWebsites(prev => [...prev, website]);
  };

  const handleRemoveWebsite = (websiteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWebsites(prev => prev.filter(w => w.id !== websiteId));
  };

  return (
    <>
      <div className="w-20 bg-slate-900 h-screen flex flex-col border-r border-slate-700 shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto border border-blue-500/30">
            <Globe size={20} className="text-blue-400" />
          </div>
        </div>

        {/* Website Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-3 px-3">
            {websites.map((website) => {
              const Icon = iconMap[website.icon] || Globe;

              return (
                <button
                  key={website.id}
                  onClick={() => handleWebsiteClick(website)}
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 bg-slate-800 hover:bg-slate-700 text-white hover:scale-105 border border-slate-600/50 hover:border-slate-500 group relative"
                  title={`${website.name} - ${website.description}`}
                >
                  <Icon size={22} className="transition-colors" />
                  
                  {/* Remove button for custom websites (id > 6) */}
                  {parseInt(website.id) > 6 && (
                    <button
                      onClick={(e) => handleRemoveWebsite(website.id, e)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-white shadow-lg border border-red-400"
                    >
                      <X size={12} />
                    </button>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-xl">
                    <div className="font-medium">{website.name}</div>
                    <div className="text-slate-400 text-xs mt-1">{website.description}</div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-600 rotate-45"></div>
                  </div>

                  {/* External link indicator */}
                  <ExternalLink size={10} className="absolute -top-1 -right-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>
          

          {/* Divider */}
          <div className="mx-6 border-t border-slate-600/50"></div>

          {/* Add Website Button */}
          <div className="p-3">
            <button
              onClick={() => setShowAddPopup(true)}
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-2 border-dashed border-blue-500/30 hover:border-blue-400/50 mx-auto hover:scale-105"
              title="Add new website"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

      {/* Popups */}
      {showAddPopup && (
        <AddWebsitePopup
          onClose={() => setShowAddPopup(false)}
          onAdd={handleAddWebsite}
        />
      )}
    </>
  );
};