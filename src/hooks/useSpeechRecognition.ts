import { useState, useEffect, useRef, useCallback } from 'react';
import { toTurkishUpper } from '../utils/turkishUpper';
import { audioFeedback } from '../services/audioFeedback';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
}

export function useSpeechRecognition(options?: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const onResultRef = useRef(options?.onResult);
  onResultRef.current = options?.onResult;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'tr-TR';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        audioFeedback.playMicStart();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        const upper = toTurkishUpper(currentText);
        setTranscript(upper);

        if (finalTranscript && onResultRef.current) {
          onResultRef.current(upper);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Ses tanıma hatası:', event.error);
        if (event.error === 'not-allowed') {
          setError('Mikrofon izni verilmedi. Lütfen tarayıcıdan mikrofona izin verin.');
        } else if (event.error === 'no-speech') {
          setError('Ses duyulmadı, lütfen tekrar deneyin.');
        } else {
          setError(`Ses algılanamadı (${event.error})`);
        }
        setIsListening(false);
        audioFeedback.playMicStop();
      };

      recognition.onend = () => {
        setIsListening(false);
        audioFeedback.playMicStop();
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Speech recognition başlatılamadı:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Ses tanıma bu cihazda desteklenmiyor.');
      return;
    }

    setError(null);
    setTranscript('');

    try {
      recognitionRef.current.start();
    } catch {
      // If already started or aborting, abort and retry
      try {
        recognitionRef.current.abort();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        recognitionRef.current.abort();
      }
    }
    setIsListening(false);
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  const setManualText = useCallback((text: string) => {
    setTranscript(toTurkishUpper(text));
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setManualText,
  };
}
