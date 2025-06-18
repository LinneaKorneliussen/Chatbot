import { useState, useEffect } from 'react';
import { X, Languages, Sun, Moon, MessageSquare, Smile } from 'lucide-react';
import { useChatStore } from '../store/store';

interface SettingsPopupProps {
  onClose: () => void;
}

export const SettingsPopup = ({ onClose }: SettingsPopupProps) => {
  const preferences = useChatStore((state) => state.preferences);
  const updatePreferences = useChatStore((state) => state.updatePreferences);
  
  // Get current theme from DOM on component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if ((isDark && preferences.theme !== 'dark') || 
        (!isDark && preferences.theme !== 'light')) {
      updatePreferences({ theme: isDark ? 'dark' : 'light' });
    }
  }, []);

  // Local state for chatbot preferences
  const [chatPreferences, setChatPreferences] = useState({
    useEmojis: preferences.useEmojis,
    formalTone: preferences.formalTone,
    activePreferences: preferences.chatPreferencesEnabled
  });

  const [localLanguage, setLocalLanguage] = useState(preferences.language);

  const toggleTheme = () => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    updatePreferences({ theme: newTheme });
    document.documentElement.classList.toggle('dark');
  };

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden transform transition-all duration-400 animate-scaleIn dark:border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Theme Toggle */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Appearance</h3>
            
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                {preferences.theme === 'light' ? 
                  <Sun size={20} className="text-amber-500" /> : 
                  <Moon size={20} className="text-indigo-400" />
                }
                <span className="text-gray-900 dark:text-white font-medium">
                  {preferences.theme === 'light' ? 'Light Theme' : 'Dark Theme'}
                </span>
              </div>
              
              <button 
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                style={{ 
                  backgroundColor: preferences.theme === 'dark' ? '#6366f1' : '#d1d5db' 
                }}
              >
                <span 
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
                    preferences.theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
                  }`}
                ></span>
              </button>
            </div>
          </div>

           {/* Language Settings */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
              Language
            </h3>

            <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Languages size={18} className="text-blue-500 dark:text-blue-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Interface Language
                </h3>
              </div>

              <select
                value={localLanguage}
                onChange={(e) => setLocalLanguage(e.target.value)} // Update local state
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="english">English</option>
                <option value="spanish">Español</option>
                <option value="french">Français</option>
                <option value="german">Deutsch</option>
                <option value="swedish">Svenska</option>
              </select>
            </div>
          </div>

          {/* Chatbot Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Chat Preferences</h3>
              
              <button 
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${chatPreferences.activePreferences ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                onClick={() => {
                  const newState = !chatPreferences.activePreferences;
                  setChatPreferences({...chatPreferences, activePreferences: newState});
                  updatePreferences({ chatPreferencesEnabled: newState });
                }}
              >
                <span 
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
                    chatPreferences.activePreferences ? 'translate-x-5' : 'translate-x-1'
                  }`}
                ></span>
              </button>
            </div>
            
            <div className={`space-y-4 transition-opacity duration-300 ${chatPreferences.activePreferences ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              {/* Stream Responses Toggle */}
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-green-500 dark:text-green-400" />
                  <span className="text-gray-900 dark:text-white font-medium">Stream responses</span>
                </div>
                
                <button 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    preferences.streamResponses ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => updatePreferences({ streamResponses: !preferences.streamResponses })}
                >
                  <span 
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
                      preferences.streamResponses ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  ></span>
                </button>
              </div>
              
              {/* Use Emojis */}
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Smile size={18} className="text-yellow-500 dark:text-yellow-400" />
                  <span className="text-gray-900 dark:text-white font-medium">Use emojis</span>
                </div>
                
                <button 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    chatPreferences.useEmojis ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => {
                    const newState = !chatPreferences.useEmojis;
                    setChatPreferences({...chatPreferences, useEmojis: newState});
                    updatePreferences({ useEmojis: newState });
                  }}
                >
                  <span 
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
                      chatPreferences.useEmojis ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  ></span>
                </button>
              </div>
              
              {/* Formal Tone */}
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-purple-500 dark:text-purple-400" />
                  <span className="text-gray-900 dark:text-white font-medium">Formal tone</span>
                </div>
                
                <button 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    chatPreferences.formalTone ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => {
                    const newState = !chatPreferences.formalTone;
                    setChatPreferences({...chatPreferences, formalTone: newState});
                    updatePreferences({ formalTone: newState });
                  }}
                >
                  <span 
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
                      chatPreferences.formalTone ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};