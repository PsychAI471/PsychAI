"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface JournalPromptProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function JournalPrompt({ isOpen, onClose, userId }: JournalPromptProps) {
  const [entry, setEntry] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!entry.trim()) return;
    
    setSaving(true);
    try {
      await supabase.from('journal_entries').insert([
        {
          user_id: userId,
          entry: entry.trim(),
        },
      ]);
      setEntry('');
      onClose();
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-in fade-in duration-200">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">
          Take a moment to reflect
        </h3>
        <p className="text-neutral-600 mb-4">
          What did you take away from this conversation? What might you try differently next time?
        </p>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          rows={4}
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-neutral-600 hover:text-neutral-800 transition"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !entry.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
} 