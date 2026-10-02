/**
 * Text-to-Speech service using Web Speech Synthesis API.
 * Reads text aloud in Turkish to help grandmother hear what was recognized.
 */
class SpeechSynthesisService {
  speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.9; // Slightly slower, calm speaking rate for clarity
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Metin seslendirilemedi:', e);
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
