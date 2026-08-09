import { ConsultationController } from "./application/consultation-controller.js";
import { TrainingController } from "./application/training-controller.js";
import { VoiceSampleService } from "./application/voice-sample-service.js";
import { BrowserAudioRecorder } from "./infrastructure/browser-audio-recorder.js";
import { BrowserSpeechRecognizer } from "./infrastructure/browser-speech-recognizer.js";
import { BrowserSpeechSynthesizer } from "./infrastructure/browser-speech-synthesizer.js";
import { VoiceDatasetExporter } from "./infrastructure/voice-dataset-exporter.js";
import { IndexedDbVoiceSampleRepository } from "./infrastructure/voice-sample-repository.js";
import { WaveformRenderer } from "./infrastructure/waveform-renderer.js";
import { AppView } from "./ui/app-view.js";

const root = document.querySelector("#app");
const view = new AppView({ root });

const consultationController = new ConsultationController({
  recognizer: new BrowserSpeechRecognizer(),
  synthesizer: new BrowserSpeechSynthesizer(),
});

const voiceService = new VoiceSampleService({
  recorder: new BrowserAudioRecorder(),
  repository: new IndexedDbVoiceSampleRepository(),
});
const exporter = new VoiceDatasetExporter();
const trainingController = new TrainingController({
  service: voiceService,
  exporter,
  waveform: new WaveformRenderer(),
});

let currentQuestion = null;

function showQuestion(question) {
  currentQuestion = question;
  view.renderQuestion(question, {
    speechSupported: consultationController.recognizer?.isSupported?.() ?? false,
  });
  consultationController.speak(question.text);
}

async function showTraining() {
  consultationController.reset();
  currentQuestion = null;
  view.renderTraining(await trainingController.state());
}

function goHome() {
  consultationController.reset();
  if (trainingController.recording) trainingController.cancelRecording();
  currentQuestion = null;
  view.renderHome();
}

view.bind({
  onStart(mode) {
    try {
      showQuestion(consultationController.start(mode));
    } catch (error) {
      view.renderError(error.message);
    }
  },

  onAnswer(value) {
    try {
      const next = consultationController.answer(value);
      if (consultationController.session.isComplete) {
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
    const started = consultationController.listen({
      onInterim: (text) => view.setInterimTranscript(text),
      onFinal: (text) => view.setInterimTranscript(text),
      onError: (reason) => view.renderError(`No pude usar el micrófono: ${reason}`),
    });
    if (!started) view.renderError("El reconocimiento de voz no está disponible en este navegador.");
  },

  onSpeakResult(result) {
    consultationController.speak(`${result.diagnostico}. ${Object.values(result.roadmap).join(" ")}`);
  },

  async onTraining() {
    try {
      await showTraining();
    } catch (error) {
      view.renderError(error.message);
    }
  },

  onNextPhrase() {
    trainingController.nextPhrase();
    showTraining().catch((error) => view.renderError(error.message));
  },

  async onToggleRecording(canvas) {
    try {
      if (trainingController.recording) {
        await trainingController.stopRecording();
        trainingController.nextPhrase();
        await showTraining();
      } else {
        await trainingController.startRecording({ canvas });
        const state = await trainingController.state();
        state.recording = true;
        view.renderTraining(state);
        const liveCanvas = root.querySelector("#waveform");
        if (liveCanvas && voiceService.recorder.stream) {
          trainingController.waveform.start({
            stream: voiceService.recorder.stream,
            canvas: liveCanvas,
            active: () => trainingController.recording,
          });
        }
      }
    } catch (error) {
      trainingController.cancelRecording();
      view.renderError(error.message);
    }
  },

  async onCancelRecording() {
    trainingController.cancelRecording();
    await showTraining();
  },

  async onRemoveSample(id) {
    await trainingController.removeSample(id);
    await showTraining();
  },

  async onClearSamples() {
    if (!confirm("¿Borrar todas las grabaciones locales? No se puede deshacer.")) return;
    await trainingController.clearSamples();
    await showTraining();
  },

  async onExportZip() {
    const result = await trainingController.exportZip();
    if (result?.fallback) view.renderError("No se pudo crear el ZIP. He iniciado la descarga de audios sueltos.");
  },

  onExportFiles() {
    trainingController.exportIndividual().catch((error) => view.renderError(error.message));
  },

  async onDownloadSample(id) {
    const sample = (await voiceService.listSamples()).find((item) => item.id === id);
    if (sample) exporter.downloadSample(sample);
  },

  onHome: goHome,
});

goHome();
