"use client";
import { useState, useEffect } from 'react';

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSettings({ isOpen, onClose }: ChatSettingsProps) {
  const [challengeMode, setChallengeMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('psychai-challenge-mode');
    if (saved) {
      setChallengeMode(JSON.parse(saved));
    }
  }, []);

  const handleChallengeModeToggle = (enabled: boolean) => {
    setChallengeMode(enabled);
    localStorage.setItem('psychai-challenge-mode', JSON.stringify(enabled));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-in fade-in duration-200">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">
          Chat Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-neutral-800">Challenge Mode</h4>
              <p className="text-sm text-neutral-600">
                Enable more thought-provoking questions
              </p>
            </div>
            <button
              onClick={() => handleChallengeModeToggle(!challengeMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                challengeMode ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  challengeMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-slate-100 text-neutral-700 rounded-lg hover:bg-slate-200 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
} 