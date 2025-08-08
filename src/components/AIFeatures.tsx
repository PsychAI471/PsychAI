"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import VoiceInteraction from './VoiceInteraction';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AIFeaturesProps {
  userId: string;
}

interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  intensity: number;
}

interface BiasDetection {
  bias_type: string;
  description: string;
  suggestion: string;
}

interface Pattern {
  pattern_type: string;
  frequency: number;
  description: string;
  impact: string;
}

export default function AIFeatures({ userId }: AIFeaturesProps) {
  const [emotionData, setEmotionData] = useState<EmotionAnalysis[]>([]);
  const [biasData, setBiasData] = useState<BiasDetection[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState('emotion');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    loadAIFeatures();
  }, [userId]);

  const loadAIFeatures = async () => {
    try {
      // Mock data for demonstration
      const mockEmotions: EmotionAnalysis[] = [
        { emotion: 'Anxiety', confidence: 0.85, intensity: 7 },
        { emotion: 'Frustration', confidence: 0.72, intensity: 5 },
        { emotion: 'Hope', confidence: 0.68, intensity: 6 },
        { emotion: 'Calm', confidence: 0.45, intensity: 3 },
      ];

      const mockBiases: BiasDetection[] = [
        {
          bias_type: 'Catastrophizing',
          description: 'You tend to expect the worst possible outcome in situations',
          suggestion: 'Try asking yourself: "What\'s the most likely outcome?"'
        },
        {
          bias_type: 'All-or-Nothing Thinking',
          description: 'You see things as either perfect or completely wrong',
          suggestion: 'Look for the gray areas and middle ground in situations'
        },
        {
          bias_type: 'Mind Reading',
          description: 'You assume you know what others are thinking without evidence',
          suggestion: 'Ask for clarification instead of making assumptions'
        }
      ];

      const mockPatterns: Pattern[] = [
        {
          pattern_type: 'Stress Triggers',
          frequency: 8,
          description: 'Work-related stress appears frequently in your conversations',
          impact: 'High impact on daily mood'
        },
        {
          pattern_type: 'Sleep Issues',
          frequency: 5,
          description: 'Sleep quality concerns mentioned regularly',
          impact: 'Moderate impact on overall wellness'
        },
        {
          pattern_type: 'Social Anxiety',
          frequency: 3,
          description: 'Social situations cause significant distress',
          impact: 'Medium impact on social life'
        }
      ];

      setEmotionData(mockEmotions);
      setBiasData(mockBiases);
      setPatterns(mockPatterns);
      setLoading(false);
    } catch (error) {
      console.error('Error loading AI features:', error);
      setLoading(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      'Anxiety': 'bg-red-100 text-red-700',
      'Frustration': 'bg-orange-100 text-orange-700',
      'Hope': 'bg-green-100 text-green-700',
      'Calm': 'bg-blue-100 text-blue-700',
      'Joy': 'bg-yellow-100 text-yellow-700',
      'Sadness': 'bg-purple-100 text-purple-700',
    };
    return colors[emotion] || 'bg-gray-100 text-gray-700';
  };

  const getBiasColor = (biasType: string) => {
    const colors: { [key: string]: string } = {
      'Catastrophizing': 'bg-red-50 border-red-200',
      'All-or-Nothing Thinking': 'bg-orange-50 border-orange-200',
      'Mind Reading': 'bg-yellow-50 border-yellow-200',
      'Overgeneralization': 'bg-purple-50 border-purple-200',
    };
    return colors[biasType] || 'bg-gray-50 border-gray-200';
  };

  const handleVoiceTranscript = (transcript: string) => {
    console.log('Voice transcript:', transcript);
    // In a real implementation, this would be sent to the AI for analysis
  };

  const handleVoiceSpeak = (text: string) => {
    console.log('Speaking text:', text);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading AI features...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Feature Navigation */}
      <div className="flex gap-2 bg-white rounded-xl shadow-md p-2">
        {[
          { id: 'emotion', name: 'Emotion Detection', icon: '😊' },
          { id: 'bias', name: 'Cognitive Biases', icon: '🧠' },
          { id: 'patterns', name: 'Pattern Recognition', icon: '📈' },
          { id: 'voice', name: 'Voice AI', icon: '🎤' },
          { id: 'insights', name: 'Personalized Insights', icon: '💡' },
        ].map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActiveFeature(feature.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
              activeFeature === feature.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{feature.icon}</span>
            <span className="hidden sm:inline">{feature.name}</span>
          </button>
        ))}
      </div>

      {/* Emotion Detection */}
      {activeFeature === 'emotion' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Emotion Analysis</h3>
            <p className="text-gray-600 mb-6">
              AI analysis of emotional patterns in your conversations
            </p>
            <div className="space-y-4">
              {emotionData.map((emotion, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(emotion.emotion)}`}>
                      {emotion.emotion}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${emotion.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(emotion.confidence * 100)}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">Intensity:</span>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= emotion.intensity ? 'bg-red-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cognitive Bias Detection */}
      {activeFeature === 'bias' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cognitive Bias Detection</h3>
            <p className="text-gray-600 mb-6">
              AI identifies thinking patterns that might be affecting your mental wellness
            </p>
            <div className="space-y-4">
              {biasData.map((bias, index) => (
                <div key={index} className={`p-4 border rounded-lg ${getBiasColor(bias.bias_type)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{bias.bias_type}</h4>
                    <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                      Detected
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{bias.description}</p>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 mb-1">Suggestion:</p>
                    <p className="text-sm text-gray-700">{bias.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pattern Recognition */}
      {activeFeature === 'patterns' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pattern Recognition</h3>
            <p className="text-gray-600 mb-6">
              AI identifies recurring themes and patterns in your mental wellness journey
            </p>
            <div className="space-y-4">
              {patterns.map((pattern, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{pattern.pattern_type}</h4>
                    <span className="text-sm text-gray-600">
                      {pattern.frequency} mentions
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{pattern.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Impact: {pattern.impact}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-full ${
                            pattern.impact.includes('High') && level <= 3
                              ? 'bg-red-500'
                              : pattern.impact.includes('Moderate') && level <= 2
                              ? 'bg-yellow-500'
                              : pattern.impact.includes('Medium') && level <= 2
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Voice AI */}
      {activeFeature === 'voice' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Voice AI Interaction</h3>
            <p className="text-gray-600 mb-6">
              Experience hands-free therapy with advanced voice recognition and synthesis
            </p>
            <div className="space-y-6">
              <VoiceInteraction
                onTranscript={handleVoiceTranscript}
                onSpeak={handleVoiceSpeak}
                isListening={isListening}
                onListeningChange={setIsListening}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Voice-to-Text</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Natural speech recognition</li>
                    <li>• Real-time transcription</li>
                    <li>• Multiple language support</li>
                    <li>• Noise cancellation</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Text-to-Speech</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Natural AI voice synthesis</li>
                    <li>• Adjustable speed and pitch</li>
                    <li>• Therapeutic tone optimization</li>
                    <li>• Accessibility features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Insights */}
      {activeFeature === 'insights' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Personalized Insights</h3>
            <p className="text-gray-600 mb-6">
              AI-generated insights based on your unique patterns and progress
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Progress Highlight</h4>
                <p className="text-blue-700">
                  Your mood has improved by 15% over the last 2 weeks. You're showing great progress in managing work-related stress.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Strength Recognition</h4>
                <p className="text-green-700">
                  You demonstrate excellent self-awareness and are actively working on cognitive restructuring techniques.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Growth Opportunity</h4>
                <p className="text-purple-700">
                  Consider exploring mindfulness practices to complement your current coping strategies.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Recommendation</h4>
                <p className="text-yellow-700">
                  Based on your patterns, you might benefit from setting up a consistent evening routine to improve sleep quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 