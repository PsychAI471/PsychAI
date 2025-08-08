// Web Speech API TypeScript declarations
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechSynthesisUtterance extends EventTarget {
  text: string;
  lang: string;
  pitch: number;
  rate: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
  onstart: ((event: SpeechSynthesisEvent) => void) | null;
  onend: ((event: SpeechSynthesisEvent) => void) | null;
  onerror: ((event: SpeechSynthesisErrorEvent) => void) | null;
}

interface SpeechSynthesisEvent extends Event {
  utterance: SpeechSynthesisUtterance;
  charIndex: number;
  elapsedTime: number;
  name: string;
}

interface SpeechSynthesisErrorEvent extends SpeechSynthesisEvent {
  error: string;
}

interface SpeechSynthesisVoice {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

interface SpeechSynthesis extends EventTarget {
  speaking: boolean;
  pending: boolean;
  paused: boolean;
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  getVoices(): SpeechSynthesisVoice[];
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
    speechSynthesis: SpeechSynthesis;
    chrome?: {
      webstore?: any;
    };
  }

  interface Navigator {
    brave?: {
      isBrave(): boolean;
    };
  }
}

export {}; 