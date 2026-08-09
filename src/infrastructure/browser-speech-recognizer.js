export class BrowserSpeechRecognizer {
  constructor({ windowRef = globalThis.window, language = "es-ES" } = {}) {
    this.windowRef = windowRef;
    this.language = language;
    this.recognition = null;
  }

  isSupported() {
    return Boolean(
      this.windowRef?.SpeechRecognition || this.windowRef?.webkitSpeechRecognition,
    );
  }

  listen({ onInterim = () => {}, onFinal = () => {}, onError = () => {}, onEnd = () => {} } = {}) {
    if (!this.isSupported()) {
      throw new Error("Speech recognition is not supported by this browser");
    }

    this.stop();

    const Recognition =
      this.windowRef.SpeechRecognition || this.windowRef.webkitSpeechRecognition;
    const recognition = new Recognition();

    recognition.lang = this.language;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript ?? "";
        if (event.results[index].isFinal) final += transcript;
        else interim += transcript;
      }

      if (interim.trim()) onInterim(interim.trim());
      if (final.trim()) onFinal(final.trim());
    };

    recognition.onerror = (event) => onError(event.error ?? "speech-recognition-error");
    recognition.onend = () => {
      if (this.recognition === recognition) this.recognition = null;
      onEnd();
    };

    this.recognition = recognition;
    recognition.start();
  }

  stop() {
    if (!this.recognition) return;

    const recognition = this.recognition;
    this.recognition = null;

    try {
      recognition.stop();
    } catch {
      // Browsers may throw if recognition has already ended.
    }
  }
}
