import React, { useRef, useState, useEffect } from 'react';
import JournalPrompt from './JournalPrompt';
import ChatSettings from './ChatSettings';
import VoiceInteraction from './VoiceInteraction';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatUIProps {
  sessionId: string;
}

export default function ChatUI({ sessionId }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [throttled, setThrottled] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Start session timer when component mounts
    const startTime = new Date();
    setSessionStartTime(startTime);
    
    // Update session duration every minute
    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - startTime.getTime()) / 1000 / 60);
      setSessionDuration(duration);
    }, 60000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

  // Check if challenge mode is enabled
  const isChallengeMode = () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('psychai-challenge-mode') || 'false');
    }
    return false;
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading || throttled) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setMessageCount(prev => prev + 1);

    // Prepare payload for API
    const payload = {
      sessionId,
      userId: sessionId, // Using sessionId as userId for throttling
      messages: [...messages, userMsg],
    };

    // Stream response from /api/chat
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.body) {
      setLoading(false);
      return;
    }

    // Check if response is throttled
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const throttleData = await res.json();
      if (throttleData.type === 'throttle') {
        setMessages((prev) => [...prev, { role: 'system', content: throttleData.message }]);
        setThrottled(true);
        setTimeout(() => setThrottled(false), 15000); // 15 seconds
        setLoading(false);
        return;
      }
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let aiMsg: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, aiMsg]);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value);
      aiMsg.content += chunk;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...aiMsg };
        return updated;
      });
    }
    setLoading(false);

    // Show journal prompt every 6-10 messages
    if (messageCount > 0 && messageCount % Math.floor(Math.random() * 5) + 6 === 0) {
      setTimeout(() => setShowJournal(true), 1000);
    }

    // Trigger mood check every 10 messages
    if (messageCount > 0 && messageCount % 10 === 0) {
      // Store session analytics
      storeSessionAnalytics();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
  };

  const handleVoiceSpeak = (text: string) => {
    // This will be handled by the VoiceInteraction component
    console.log('Speaking text:', text);
  };

  const storeSessionAnalytics = async () => {
    try {
      const sessionData = {
        userId: sessionId,
        duration: sessionDuration,
        messageCount: messageCount,
        timestamp: new Date().toISOString(),
      };
      
      // Send session data to analytics API
      const response = await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        console.error('Failed to store session analytics');
      }
    } catch (error) {
      console.error('Error storing session analytics:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] w-full bg-slate-50 rounded-xl shadow-sm border border-slate-200">
      {/* Header with settings and session info */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white rounded-t-xl">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-neutral-800">PsychAI Companion</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>💬 {messageCount} messages</span>
            <span>⏱️ {formatDuration(sessionDuration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVoice(!showVoice)}
            className={`p-2 rounded-lg transition ${
              showVoice 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Voice Interaction"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Voice Interaction Panel */}
      {showVoice && (
        <div className="p-4 border-b border-slate-200 bg-blue-50">
          <VoiceInteraction
            onTranscript={handleVoiceTranscript}
            onSpeak={handleVoiceSpeak}
            isListening={isListening}
            onListeningChange={setIsListening}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-lg font-medium mb-2">Welcome to PsychAI</h3>
            <p className="text-sm">Start a conversation to begin your mental wellness journey</p>
            {showVoice && (
              <p className="text-sm text-blue-600 mt-2">💡 Try using voice input for hands-free interaction!</p>
            )}
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.role === 'system'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-white text-neutral-800 border border-slate-200'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-neutral-800 border border-slate-200 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">💭</div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={throttled ? "Take a moment to breathe..." : "Type your message..."}
            disabled={loading || throttled || isListening}
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
          <button
            type="submit"
            disabled={loading || throttled || !input.trim() || isListening}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

      {/* Modals */}
      {showJournal && (
        <JournalPrompt
          isOpen={showJournal}
          onClose={() => setShowJournal(false)}
          userId={sessionId}
        />
      )}
      
      {showSettings && (
        <ChatSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
} 