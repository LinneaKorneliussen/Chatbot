import React, { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import type { UserProfile } from '../types/types';

interface Props {
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const ProfilePopup: React.FC<Props> = ({ onClose, profile, onUpdateProfile }) => {
  const [editedProfile, setEditedProfile] = useState(profile);
  const [newCompetency, setNewCompetency] = useState('');

  const handleAddCompetency = () => {
    if (newCompetency.trim()) {
      setEditedProfile(prev => ({
        ...prev,
        competencies: [...prev.competencies, newCompetency.trim()]
      }));
      setNewCompetency('');
    }
  };

  const handleRemoveCompetency = (competency: string) => {
    setEditedProfile(prev => ({
      ...prev,
      competencies: prev.competencies.filter(c => c !== competency)
    }));
  };

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden transform transition-all duration-400 animate-scaleIn dark:border dark:border-gray-700">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close profile settings"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <input
                type="text"
                value={editedProfile.unit}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your unit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team
              </label>
              <input
                type="text"
                value={editedProfile.team}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, team: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your team"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Competencies
            </label>
            <div className="flex flex-wrap gap-3 mb-4">
              {editedProfile.competencies.map((competency) => (
                <div
                  key={competency}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full shadow-sm select-none"
                >
                  <Tag size={16} className="text-gray-600 dark:text-gray-400" />
                  <span>{competency}</span>
                  <button
                    onClick={() => handleRemoveCompetency(competency)}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    aria-label={`Remove competency ${competency}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCompetency}
                onChange={(e) => setNewCompetency(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCompetency()}
                placeholder="Add new competency..."
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddCompetency}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="Add competency"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="ml-3 px-5 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};