export class BrowserSpeechRecognizer {
  constructor({ windowRef = globalThis.window, language = "es-ES", maxDurationMs = 60000 } = {}) {
    this.windowRef = windowRef;
    this.language = language;
    this.maxDurationMs = maxDurationMs;
    this.recognition = null;
    this.active = false;
    this.timeoutId = null;
    this.finalText = "";
    this.handlers = null;
  }

  isSupported() {
    return Boolean(
      this.windowRef?.SpeechRecognition || this.windowRef?.webkitSpeechRecognition,
    );
  }

  get isListening() {
    return this.active;
  }

  listen({ onInterim = () => {}, onFinal = () => {}, onError = () => {}, onEnd = () => {} } = {}) {
    if (!this.isSupported()) {
      throw new Error("Speech recognition is not supported by this browser");
    }

    this.stop();
    this.active = true;
    this.finalText = "";
    this.handlers = { onInterim, onFinal, onError, onEnd };

    this.timeoutId = this.windowRef.setTimeout(() => {
      if (!this.active) return;
      this.stop({ notifyEnd: true });
    }, this.maxDurationMs);

    this.#startRecognitionCycle();
  }

  #startRecognitionCycle() {
    if (!this.active) return;

    const Recognition =
      this.windowRef.SpeechRecognition || this.windowRef.webkitSpeechRecognition;
    const recognition = new Recognition();

    recognition.lang = this.language;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = "";
      let newFinal = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript ?? "";
        if (event.results[index].isFinal) newFinal += `${transcript} `;
        else interim += transcript;
      }

      if (newFinal.trim()) {
        this.finalText = `${this.finalText} ${newFinal}`.trim();
        this.handlers?.onFinal?.(this.finalText);
      }

      const combined = `${this.finalText} ${interim}`.trim();
      if (combined) this.handlers?.onInterim?.(combined);
    };

    recognition.onerror = (event) => {
      const reason = event.error ?? "speech-recognition-error";
      // `aborted` is expected when we explicitly stop a recognition cycle.
      if (reason !== "aborted" || this.active) this.handlers?.onError?.(reason);
    };

    recognition.onend = () => {
      if (this.recognition === recognition) this.recognition = null;
      // Mobile browsers may end recognition after a pause even in continuous mode.
      // Restart while the user has not explicitly finished and the 60s limit remains active.
      if (this.active) {
        this.windowRef.setTimeout(() => this.#startRecognitionCycle(), 120);
      }
    };

    this.recognition = recognition;
    recognition.start();
  }

  stop({ notifyEnd = false } = {}) {
    const wasActive = this.active;
    this.active = false;

    if (this.timeoutId !== null) {
      this.windowRef.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    const recognition = this.recognition;
    this.recognition = null;

    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Browsers may throw if recognition has already ended.
      }
    }

    if (wasActive && notifyEnd) this.handlers?.onEnd?.(this.finalText);
    this.handlers = null;
    return this.finalText;
  }
}
