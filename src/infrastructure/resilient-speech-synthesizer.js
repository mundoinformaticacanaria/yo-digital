export class ResilientSpeechSynthesizer {
  constructor({ primary, fallback } = {}) {
    this.primary = primary ?? null;
    this.fallback = fallback ?? null;
  }

  isSupported() {
    return Boolean(
      this.primary?.isSupported?.()
      || this.fallback?.isSupported?.()
    );
  }

  speak(text, handlers = {}) {
    this.stop();

    if (!this.primary?.isSupported?.()) {
      return this.speakFallback(text, handlers);
    }

    let primaryStarted = false;
    let fallbackStarted = false;

    const primaryHandlers = {
      ...handlers,
      onStart: (context) => {
        primaryStarted = true;
        handlers.onStart?.(context);
      },
      onError: (error) => {
        if (!primaryStarted && !fallbackStarted) {
          fallbackStarted = this.speakFallback(text, handlers);
          if (fallbackStarted) return;
        }
        handlers.onError?.(error);
      },
    };

    try {
      const started = this.primary.speak(text, primaryHandlers);
      if (started === false && !fallbackStarted) {
        fallbackStarted = this.speakFallback(text, handlers);
        return fallbackStarted;
      }
      return true;
    } catch (error) {
      if (!fallbackStarted) {
        fallbackStarted = this.speakFallback(text, handlers);
        if (fallbackStarted) return true;
      }
      handlers.onError?.(error);
      return false;
    }
  }

  speakFallback(text, handlers) {
    if (!this.fallback?.isSupported?.()) return false;
    const started = this.fallback.speak(text, handlers);
    return started !== false;
  }

  stop() {
    this.primary?.stop?.();
    this.fallback?.stop?.();
  }
}
