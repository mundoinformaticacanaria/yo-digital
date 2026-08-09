import { ConsultationController } from "./application/consultation-controller.js";
import { BrowserSpeechRecognizer } from "./infrastructure/browser-speech-recognizer.js";
import { BrowserSpeechSynthesizer } from "./infrastructure/browser-speech-synthesizer.js";
import { AppView } from "./ui/app-view.js";

const root = document.querySelector("#app");
const view = new AppView({ root });
const controller = new ConsultationController({
  recognizer: new BrowserSpeechRecognizer(),
  synthesizer: new BrowserSpeechSynthesizer(),
});

let currentQuestion = null;

function showQuestion(question) {
  currentQuestion = question;
  view.renderQuestion(question, {
    speechSupported: controller.recognizer?.isSupported?.() ?? false,
  });
  controller.speak(question.text);
}

function goHome() {
  controller.reset();
  currentQuestion = null;
  view.renderHome();
}

view.bind({
  onStart(mode) {
    try {
      showQuestion(controller.start(mode));
    } catch (error) {
      view.renderError(error.message);
    }
  },

  onAnswer(value) {
    try {
      const next = controller.answer(value);
      if (controller.session.isComplete) {
        currentQuestion = null;
        view.renderResult(next);
      } else {
        showQuestion(next);
      }
    } catch (error) {
      view.renderError(error.message);
    }
  },

  onListen() {
    const started = controller.listen({
      onInterim: (text) => view.setInterimTranscript(text),
      onFinal: (text) => view.setInterimTranscript(text),
      onError: (reason) => view.renderError(`No pude usar el micrófono: ${reason}`),
    });
    if (!started) view.renderError("El reconocimiento de voz no está disponible en este navegador.");
  },

  onSpeakResult(result) {
    controller.speak(`${result.diagnostico}. ${Object.values(result.roadmap).join(" ")}`);
  },

  onHome: goHome,
});

goHome();
