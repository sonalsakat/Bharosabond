import { useCallback, useEffect, useRef, useState } from 'react';
import { speechLocales, type Language } from './i18n';

type ResultRow = ArrayLike<{ transcript: string }>;
type RecognitionEventLike = { results: ArrayLike<ResultRow> };
type RecognitionErrorLike = { error?: string };
type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onerror: ((event: RecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionConstructor = new () => RecognitionLike;
type SpeechWindow = Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };

export function useSpeechInput(language: Language) {
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [fallback, setFallback] = useState(false);

  const stop = useCallback(() => {
    const active = recognitionRef.current;
    if (active) {
      try { active.stop(); } catch { /* Recognition may already have stopped. */ }
    }
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setFallback(true);
      return;
    }
    try {
      recognitionRef.current?.stop();
      const recognition = new Recognition();
      recognitionRef.current = recognition;
      recognition.lang = speechLocales[language];
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const words = Array.from(event.results, (row) => row[0]?.transcript?.trim() ?? '').filter(Boolean);
        setText(words.join(' '));
      };
      recognition.onerror = (event) => {
        setListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture' || event.error === 'network') setFallback(true);
      };
      recognition.onend = () => setListening(false);
      setText('');
      setFallback(false);
      setListening(true);
      recognition.start();
    } catch {
      setListening(false);
      setFallback(true);
    }
  }, [language]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop(); } catch { /* Ignore cleanup after a browser stop. */ }
    };
  }, []);

  return { text, setText, listening, fallback, setFallback, start, stop, toggle };
}
