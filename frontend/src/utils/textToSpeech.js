export function stopSpeech() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}

export function speakText(text, handlers = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text || !text.trim()) {
    handlers.onError?.();
    return false;
  }

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => handlers.onStart?.();
  utterance.onend = () => handlers.onEnd?.();
  utterance.onerror = () => handlers.onError?.();

  window.speechSynthesis.speak(utterance);
  return true;
}
