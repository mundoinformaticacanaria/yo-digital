import { ConsultationSession } from "./consultation-session.js";

export class ConsultationController {
  constructor({ recognizer, synthesizer, sessionFactory = (mode) => new ConsultationSession({ mode }) } = {}) {
    this.recognizer = recognizer;
    this.synthesizer = synthesizer;
    this.sessionFactory = sessionFactory;
    this.session = null;
  }

  start(mode = "app") {
    this.stopVoice();
    this.session = this.sessionFactory(mode);
    return this.session.currentQuestion();
  }

  answer(value) {
    if (!this.session) throw new Error("Consultation has not started");
    this.stopListening();
    return this.session.answer(value);
  }

  speak(text, handlers = {}) {
    if (!this.synthesizer?.isSupported?.()) return false;
    this.synthesizer.speak(text, handlers);
    return true;
  }

  get isListening() {
    return Boolean(this.recognizer?.isListening);
  }

  listen(handlers = {}) {
    if (!this.recognizer?.isSupported?.()) return false;
    // Chrome/Android may abort recognition when speechSynthesis is still active.
    this.synthesizer?.stop?.();
    this.recognizer.listen(handlers);
    return true;
  }

  stopListening({ notifyEnd = false } = {}) {
    return this.recognizer?.stop?.({ notifyEnd }) ?? "";
  }

  stopVoice() {
    this.stopListening();
    this.synthesizer?.stop?.();
  }

  reset() {
    this.stopVoice();
    this.session = null;
  }
}
