export class BrowserSpeechSynthesizer {
  constructor({ windowRef = globalThis.window, language = "es-ES", rate = 1, pitch = 1 } = {}) {
    this.windowRef = windowRef;
    this.language = language;
    this.rate = rate;
    this.pitch = pitch;
  }

  isSupported() {
    return Boolean(this.windowRef?.speechSynthesis && this.windowRef?.SpeechSynthesisUtterance);
  }

  speak(text, { onStart = () => {}, onEnd = () => {}, onError = () => {} } = {}) {
    const value = String(text ?? "").trim();
    if (!value) return;
    if (!this.isSupported()) throw new Error("Speech synthesis is not supported by this browser");

    this.stop();

    const utterance = new this.windowRef.SpeechSynthesisUtterance(value);
    utterance.lang = this.language;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = (event) => onError(event.error ?? "speech-synthesis-error");

    this.windowRef.speechSynthesis.speak(utterance);
  }

  stop() {
    this.windowRef?.speechSynthesis?.cancel();
  }
}
