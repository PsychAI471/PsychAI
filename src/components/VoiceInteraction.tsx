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
  isListening, 
  onListeningChange 
}: VoiceInteractionProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
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
                     (navigator as any).brave?.isBrave() || // eslint-disable-line @typescript-eslint/no-explicit-any
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
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setError(null);
      onListeningChange(true);
    };

    recognitionRef.current.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Speech recognition error:', event.error);
      setError(`Voice recognition error: ${event.error}`);
      onListeningChange(false);
    };

    recognitionRef.current.onend = () => {
      onListeningChange(false);
    };

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

  const testVoice = () => {
    speakText("Hello! I'm here to help you with your mental wellness journey. How are you feeling today?");
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
      <p className="text-sm text-gray-600 mb-4">
        Voice features require microphone access and work best in Chrome, Edge, and Safari.
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm font-medium mb-2">Voice Error:</p>
          <p className="text-red-700 text-sm mb-3">{error}</p>
          
          {error.includes('network') && (
            <div className="text-red-700 text-sm">
              <p className="font-medium mb-1">Network Error Solutions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Ensure you&apos;re using HTTPS</li>
                <li>Check browser microphone permissions</li>
              </ul>
            </div>
          )}
          
          {error.includes('not-allowed') && (
            <div className="text-red-700 text-sm">
              <p className="font-medium mb-1">Permission Error Solutions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Click the microphone icon in your browser&apos;s address bar</li>
                <li>Select &quot;Allow&quot; for microphone access</li>
                <li>Refresh the page after granting permission</li>
              </ul>
            </div>
          )}
          
          {error.includes('no-speech') && (
            <div className="text-red-700 text-sm">
              <p className="font-medium mb-1">No Speech Detected:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Speak clearly and loudly</li>
                <li>Check your microphone is working</li>
                <li>Try again in a quieter environment</li>
              </ul>
            </div>
          )}
          
          {error.includes('audio-capture') && (
            <div className="text-red-700 text-sm">
              <p className="font-medium mb-1">Audio Capture Error:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check microphone is connected and working</li>
                <li>Try a different microphone</li>
                <li>Check system audio settings</li>
              </ul>
            </div>
          )}
          
          {error.includes('service-not-allowed') && (
            <div className="text-red-700 text-sm">
              <p className="font-medium mb-1">Service Not Allowed:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>This usually means the browser blocked the feature</li>
                <li>Try a different browser (Chrome, Edge, Safari)</li>
                <li>Check browser security settings</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-3">
        <button
          onClick={startListening}
          disabled={isListening}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isListening ? 'Listening...' : 'Start Listening'}
        </button>
        
        {isListening && (
          <button
            onClick={stopListening}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Stop Listening
          </button>
        )}
        
        <button
          onClick={testVoice}
          disabled={isSpeaking}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isSpeaking ? 'Speaking...' : 'Test Voice Output'}
        </button>
        
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition"
          >
            Stop Speaking
          </button>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Brave Browser Users:</strong> If you&apos;re experiencing issues:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Disable fingerprinting protection for this site</li>
          <li>Check microphone permissions in Brave settings</li>
          <li>Try disabling Brave shields temporarily</li>
          <li>Ensure you&apos;re using HTTPS</li>
        </ul>
      </div>
    </div>
  );
} 