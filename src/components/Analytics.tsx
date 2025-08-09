"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface MoodEntry {
  id: string;
  mood_score: number;
  notes: string;
  created_at: string;
}

interface AnalyticsProps {
  userId: string;
}

export default function Analytics({ userId }: AnalyticsProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState<number>(5);
  const [moodNotes, setMoodNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMoodEntries();
  }, [userId]);

  const fetchMoodEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    }
  };

  const addMoodEntry = async () => {
    if (!currentMood) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: userId,
          mood_score: currentMood,
          notes: moodNotes
        });

      if (error) throw error;
      
      setMoodNotes('');
      fetchMoodEntries();
    } catch (error) {
      console.error('Error adding mood entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageMood = moodEntries.length > 0 
    ? (moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length).toFixed(1)
    : 'N/A';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Mental Wellness Insights</h1>
        <p className="text-gray-600">Track your mood and progress over time</p>
      </div>

      {/* Mood Input */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">How are you feeling today?</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">😢</span>
            <input
              type="range"
              min="1"
              max="10"
              value={currentMood}
              onChange={(e) => setCurrentMood(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600">😊</span>
            <span className="text-lg font-semibold text-blue-600 ml-2">{currentMood}</span>
          </div>
          <input
            type="text"
            placeholder="Add notes (optional)"
            value={moodNotes}
            onChange={(e) => setMoodNotes(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addMoodEntry}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Saving...' : 'Save Mood'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{averageMood}</div>
          <div className="text-gray-600">Average Mood</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{moodEntries.length}</div>
          <div className="text-gray-600">Mood Entries</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
          <div className="text-gray-600">Total Sessions</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">24m</div>
          <div className="text-gray-600">Avg Session Length</div>
        </div>
      </div>

      {/* Mood Trends */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Mood Trends</h3>
        <div className="space-y-3">
          {moodEntries.slice(0, 7).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {entry.mood_score <= 3 ? '😢' : entry.mood_score <= 6 ? '😐' : '😊'}
                </span>
                <span className="font-medium">{entry.mood_score}/10</span>
                {entry.notes && <span className="text-gray-600 text-sm">- {entry.notes}</span>}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {moodEntries.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">📊</div>
              <p>No mood entries yet. Start tracking your daily mood!</p>
            </div>
          )}
        </div>
      </div>

      {/* Session Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Activity</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => {
            const day = new Date();
            day.setDate(day.getDate() - i);
            const sessions = Math.floor(Math.random() * 5) + 1; // Mock data
            return (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-xs font-medium text-blue-600">
                  {sessions}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
