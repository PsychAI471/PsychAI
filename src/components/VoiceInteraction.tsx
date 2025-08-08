"use client";
import { useState, useRef, useEffect } from 'react';

interface VoiceInteractionProps {
  onTranscript: (text: string) => void;
  onSpeak: (text: string) => void;
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
}

export default function VoiceInteraction({ 
  onTranscript, 
  onSpeak, 
  isListening, 
  onListeningChange 
}: VoiceInteractionProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for browser support
    const checkSupport = () => {
      const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const hasSpeechSynthesis = 'speechSynthesis' in window;
      
      setIsSupported(hasSpeechRecognition && hasSpeechSynthesis);
      
      if (!hasSpeechRecognition || !hasSpeechSynthesis) {
        setError('Voice features are not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      // Check if using Brave browser
      const isBrave = navigator.brave?.isBrave() || 
                     (navigator as any).brave?.isBrave() || 
                     window.chrome?.webstore || 
                     /Brave/.test(navigator.userAgent);
      
      if (isBrave) {
        console.log('Brave browser detected - checking additional settings...');
        setError('Brave browser detected. Voice features may require additional setup. See troubleshooting guide below.');
      }
    };

    checkSupport();
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        onListeningChange(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        // Handle specific error types with user-friendly messages
        let errorMessage = '';
        switch (event.error) {
          case 'network':
            errorMessage = 'Network error: Please check your internet connection and try again.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied: Please allow microphone permissions in your browser.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected: Please speak clearly and try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture error: Please check your microphone and try again.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not available: Please try again later.';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}. Please try again.`;
        }
        
        setError(errorMessage);
        onListeningChange(false);
      };

      recognitionRef.current.onend = () => {
        onListeningChange(false);
      };
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis;
  }, [isSupported, onTranscript, onListeningChange]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Voice recognition not available. Please refresh the page and try again.');
      return;
    }
    
    try {
      setError(null);
      
      // Check if already listening
      if (isListening) {
        recognitionRef.current.stop();
        onListeningChange(false);
        return;
      }
      
      recognitionRef.current.start();
      onListeningChange(true);
    } catch (err) {
      console.error('Voice recognition start error:', err);
      setError('Failed to start voice recognition. Please check your microphone permissions and try again.');
      onListeningChange(false);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      onListeningChange(false);
    } catch (err) {
      console.error('Voice recognition stop error:', err);
    }
  };

  const speakText = (text: string) => {
    if (!synthesisRef.current) return;

    try {
      // Stop any current speech
      synthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setError('Failed to speak text');
        setIsSpeaking(false);
      };

      synthesisRef.current.speak(utterance);
    } catch (err) {
      setError('Failed to speak text');
      console.error('Speech synthesis error:', err);
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          {error || 'Voice features are not supported in this browser. Please use Chrome, Edge, or Safari.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Voice Input Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            isListening
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={isSpeaking}
        >
          {isListening ? (
            <>
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
              Stop Listening
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Start Listening
            </>
          )}
        </button>

        {isListening && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            Listening...
          </div>
        )}
      </div>

      {/* Voice Output Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => speakText("Hello! I'm here to help you with your mental wellness journey. How are you feeling today?")}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          disabled={isSpeaking || isListening}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          Test Voice
        </button>

        {isSpeaking && (
          <>
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Stop
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Speaking...
            </div>
          </>
        )}

        {/* Debug Button for Brave Users */}
        <button
          onClick={() => {
            console.log('=== Voice Debug Info ===');
            console.log('User Agent:', navigator.userAgent);
            console.log('Speech Recognition Support:', 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
            console.log('Speech Synthesis Support:', 'speechSynthesis' in window);
            console.log('Microphone Permission:', navigator.permissions ? 'Available' : 'Not Available');
            console.log('Is Brave:', navigator.brave?.isBrave() || /Brave/.test(navigator.userAgent));
            console.log('Protocol:', window.location.protocol);
            console.log('Host:', window.location.host);
            console.log('========================');
            alert('Debug info logged to console. Press F12 to view.');
          }}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
        >
          🔧 Debug Info
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-red-800 text-sm mb-2">{error}</p>
              {error.includes('Network error') && (
                <div className="text-xs text-red-700 space-y-1">
                  <p>• Check your internet connection</p>
                  <p>• Try refreshing the page</p>
                  <p>• Ensure you're using a supported browser (Chrome, Edge, Safari)</p>
                </div>
              )}
              {error.includes('Microphone access denied') && (
                <div className="text-xs text-red-700 space-y-1">
                  <p>• Click the microphone icon in your browser's address bar</p>
                  <p>• Select "Allow" for microphone access</p>
                  <p>• Refresh the page and try again</p>
                </div>
              )}
              {error.includes('Brave browser detected') && (
                <div className="text-xs text-red-700 space-y-1">
                  <p>• Go to Brave Settings → Shields & Privacy → Site and Shield Settings</p>
                  <p>• Disable "Block fingerprinting" for this site</p>
                  <p>• Allow microphone permissions in site settings</p>
                  <p>• Try disabling Brave Shields temporarily</p>
                  <p>• Consider using Chrome or Edge for voice features</p>
                </div>
              )}
              {error.includes('Network error') && (
                <div className="text-xs text-red-700 space-y-1">
                  <p>• Check your internet connection</p>
                  <p>• Try refreshing the page</p>
                  <p>• Ensure you're using a supported browser (Chrome, Edge, Safari)</p>
                  <p>• For Brave: Try disabling all Shields for this site</p>
                  <p>• For Brave: Go to brave://settings/content/microphone and allow this site</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Voice Settings */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Voice Settings</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Click "Start Listening" to speak your message</p>
          <p>• Click "Test Voice" to hear AI responses</p>
          <p>• Voice features work best in quiet environments</p>
          <p>• Speak clearly and at a normal pace</p>
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-xs font-medium mb-1">Brave Browser Users:</p>
            <p className="text-yellow-700 text-xs mb-2">Voice features may require additional setup:</p>
            <div className="text-yellow-700 text-xs space-y-1">
              <p>1. Disable fingerprinting protection for this site</p>
              <p>2. Go to brave://settings/content/microphone and allow this site</p>
              <p>3. Try disabling all Brave Shields temporarily</p>
              <p>4. Check if HTTPS is required (try https:// instead of http://)</p>
              <p>5. Consider using Chrome or Edge for voice features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 