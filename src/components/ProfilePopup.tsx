import React, { useState, useEffect } from 'react';
import { X, Plus, Tag, Monitor, Globe, User } from 'lucide-react';
import type { UserProfile } from '../types/types';

interface Props {
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

interface SystemInfo {
  hostname: string;
  ipAddress: string;
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screenResolution: string;
  browserName: string;
  osName: string;
}

export const ProfilePopup: React.FC<Props> = ({ onClose, profile, onUpdateProfile }) => {
  const [editedProfile, setEditedProfile] = useState(profile);
  const [newCompetency, setNewCompetency] = useState('');
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    hostname: 'Unknown',
    ipAddress: 'Fetching...',
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    browserName: 'Unknown',
    osName: 'Unknown'
  });

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setSystemInfo(prev => ({ ...prev, ipAddress: data.ip }));
      })
      .catch(() => {
        setSystemInfo(prev => ({ ...prev, ipAddress: 'Unable to fetch' }));
      });
    if (window.location.hostname) {
      setSystemInfo(prev => ({ ...prev, hostname: window.location.hostname }));
    }

    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let osName = 'Unknown';

    if (userAgent.includes('Chrome')) browserName = 'Chrome';
    else if (userAgent.includes('Firefox')) browserName = 'Firefox';
    else if (userAgent.includes('Safari')) browserName = 'Safari';
    else if (userAgent.includes('Edge')) browserName = 'Edge';

    if (userAgent.includes('Windows')) osName = 'Windows';
    else if (userAgent.includes('Mac')) osName = 'macOS';
    else if (userAgent.includes('Linux')) osName = 'Linux';
    else if (userAgent.includes('Android')) osName = 'Android';
    else if (userAgent.includes('iOS')) osName = 'iOS';

    setSystemInfo(prev => ({ ...prev, browserName, osName }));
  }, []);

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

  const generateSmartProfile = () => {
    const hostname = systemInfo.hostname !== 'Unknown' ? systemInfo.hostname : 'localhost';
    const osUser = systemInfo.osName !== 'Unknown' ? systemInfo.osName : 'System';
    
    let generatedName = 'User';
    if (hostname.includes('.')) {
      generatedName = hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
    } else if (hostname !== 'localhost' && hostname !== 'Unknown') {
      generatedName = hostname.charAt(0).toUpperCase() + hostname.slice(1);
    }

    let generatedEmail = `user@${hostname}`;
    if (hostname === 'localhost' || hostname === 'Unknown') {
      generatedEmail = `user@${systemInfo.osName.toLowerCase()}.local`;
    }

    const generatedTeam = `${systemInfo.osName} ${systemInfo.browserName} Team`;
    
    const region = systemInfo.timezone.split('/')[0] || 'Global';
    const generatedUnit = `${region} Operations`;

    const generatedCompetencies = [
      systemInfo.osName,
      systemInfo.browserName,
      'Web Development',
      systemInfo.language.includes('sv') ? 'Swedish' : 'English'
    ].filter(Boolean);

    setEditedProfile(prev => ({
      ...prev,
      name: generatedName,
      email: generatedEmail,
      unit: generatedUnit,
      team: generatedTeam,
      competencies: [...new Set([...prev.competencies, ...generatedCompetencies])]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-primary w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden transform transition-all duration-400 animate-scaleIn border border-secondary/30 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-secondary/20 p-5 bg-secondary/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-highlight/20 flex items-center justify-center">
              <User size={18} className="text-highlight" />
            </div>
            <h2 className="text-xl font-semibold text-surface">Profile Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-muted hover:text-surface transition-colors p-2 rounded-lg hover:bg-secondary/30"
            aria-label="Close profile settings"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* System Information */}
          <div className="bg-secondary/20 rounded-lg p-4 border border-secondary/20">
            <div className="flex items-center gap-2 mb-3">
              <Monitor size={16} className="text-accent" />
              <h3 className="text-sm font-semibold text-surface">System Information</h3>
              <button
                onClick={generateSmartProfile}
                className="ml-auto text-xs bg-highlight hover:bg-highlight/90 text-surface px-3 py-1.5 rounded-full transition-colors font-medium"
              >
                Generate Smart Profile
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted">IP Address:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Globe size={14} className="text-success" />
                  <span className="text-surface font-mono">{systemInfo.ipAddress}</span>
                </div>
              </div>
              <div>
                <span className="text-muted">Operating System:</span>
                <div className="text-surface mt-1">{systemInfo.osName}</div>
              </div>
              <div>
                <span className="text-muted">Browser:</span>
                <div className="text-surface mt-1">{systemInfo.browserName}</div>
              </div>
              <div>
                <span className="text-muted">Hostname:</span>
                <div className="text-surface mt-1 font-mono">{systemInfo.hostname}</div>
              </div>
              <div>
                <span className="text-muted">Timezone:</span>
                <div className="text-surface mt-1">{systemInfo.timezone}</div>
              </div>
              <div>
                <span className="text-muted">Screen:</span>
                <div className="text-surface mt-1">{systemInfo.screenResolution}</div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface mb-2">
                Name
              </label>
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 bg-secondary/20 border border-secondary/20 rounded-lg text-surface placeholder-muted focus:border-highlight/50 focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface mb-2">
                Email
              </label>
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 bg-secondary/20 border border-secondary/20 rounded-lg text-surface placeholder-muted focus:border-highlight/50 focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface mb-2">
                Unit
              </label>
              <input
                type="text"
                value={editedProfile.unit}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full p-3 bg-secondary/20 border border-secondary/20 rounded-lg text-surface placeholder-muted focus:border-highlight/50 focus:outline-none transition-colors"
                placeholder="Your unit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface mb-2">
                Team
              </label>
              <input
                type="text"
                value={editedProfile.team}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, team: e.target.value }))}
                className="w-full p-3 bg-secondary/20 border border-secondary/20 rounded-lg text-surface placeholder-muted focus:border-highlight/50 focus:outline-none transition-colors"
                placeholder="Your team"
              />
            </div>
          </div>

          {/* Competencies */}
          <div>
            <label className="block text-sm font-medium text-surface mb-3">
              Competencies
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {editedProfile.competencies.map((competency) => (
                <div
                  key={competency}
                  className="flex items-center gap-2 px-3 py-1.5 bg-secondary/30 text-surface rounded-full border border-secondary/20 group hover:border-error/30 transition-colors"
                >
                  <Tag size={14} className="text-accent" />
                  <span className="text-sm">{competency}</span>
                  <button
                    onClick={() => handleRemoveCompetency(competency)}
                    className="text-muted hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Remove competency ${competency}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCompetency}
                onChange={(e) => setNewCompetency(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCompetency()}
                placeholder="Add new competency..."
                className="flex-1 p-3 bg-secondary/20 border border-secondary/20 rounded-lg text-surface placeholder-muted focus:border-highlight/50 focus:outline-none transition-colors"
              />
              <button
                onClick={handleAddCompetency}
                className="p-3 bg-highlight text-surface rounded-lg hover:bg-highlight/90 transition-colors"
                aria-label="Add competency"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary/20 p-5 flex justify-end gap-3 bg-secondary/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-secondary/30 text-surface font-medium rounded-lg hover:bg-secondary/40 transition-colors border border-secondary/20"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-highlight text-surface font-medium rounded-lg hover:bg-highlight/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};