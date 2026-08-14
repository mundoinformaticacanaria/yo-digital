import { AvatarController } from "./application/avatar-controller.js";
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
import { DomAvatarRenderer } from "./ui/dom-avatar-renderer.js";

const root = document.querySelector("#app");
const view = new AppView({ root });
const avatar = new AvatarController({
  renderer: new DomAvatarRenderer({ root: document.querySelector("#avatar-root") }),
});

const consultationController = new ConsultationController({
  recognizer: new BrowserSpeechRecognizer({ maxDurationMs: 60_000 }),
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

const MAX_TRAINING_RECORDING_MS = 60_000;
let recordingTimeoutId = null;
let currentQuestion = null;

function clearRecordingTimeout() {
  if (recordingTimeoutId !== null) {
    globalThis.clearTimeout(recordingTimeoutId);
    recordingTimeoutId = null;
  }
}

function setConsultationMicState(listening) {
  const button = root.querySelector('[data-action="listen"]');
  if (!button) return;
  button.textContent = listening ? "⏹ Terminar voz" : "🎙 Hablar";
  button.setAttribute("aria-pressed", String(listening));
}

function speakWithAvatar(text) {
  const spoken = consultationController.speak(text, {
    onStart: () => avatar.speaking({ source: "tts" }),
    onEnd: () => avatar.idle({ reason: "speech-ended" }),
    onError: () => avatar.idle({ reason: "speech-error" }),
  });

  if (!spoken) avatar.idle({ reason: "speech-unavailable" });
  return spoken;
}

function showQuestion(question) {
  currentQuestion = question;
  view.renderQuestion(question, {
    speechSupported: consultationController.recognizer?.isSupported?.() ?? false,
  });
  avatar.thinking({ reason: "prepare-question-speech" });
  speakWithAvatar(question.text);
}

async function showTraining() {
  consultationController.reset();
  avatar.idle({ reason: "training" });
  currentQuestion = null;
  view.renderTraining(await trainingController.state());
}

async function finishTrainingRecording({ automatic = false } = {}) {
  if (!trainingController.recording) return;

  clearRecordingTimeout();
  await trainingController.stopRecording();
  trainingController.nextPhrase();
  await showTraining();

  if (automatic) {
    view.renderError("Grabación guardada automáticamente al alcanzar el límite de 60 segundos.");
  }
}

function scheduleRecordingLimit() {
  clearRecordingTimeout();
  recordingTimeoutId = globalThis.setTimeout(() => {
    finishTrainingRecording({ automatic: true }).catch((error) => {
      trainingController.cancelRecording();
      console.error("Automatic voice training stop failed", error);
      view.renderError(`${error.name || "Error"}: ${error.message}`);
    });
  }, MAX_TRAINING_RECORDING_MS);
}

function goHome() {
  clearRecordingTimeout();
  consultationController.reset();
  avatar.reset();
  if (trainingController.recording) trainingController.cancelRecording();
  currentQuestion = null;
  view.renderHome();
}

view.bind({
  onStart(mode) {
    try {
      showQuestion(consultationController.start(mode));
    } catch (error) {
      avatar.idle({ reason: "start-error" });
      view.renderError(error.message);
    }
  },

  onAnswer(value) {
    try {
      avatar.thinking({ reason: "processing-answer" });
      const next = consultationController.answer(value);
      if (consultationController.session.isComplete) {
        currentQuestion = null;
        view.renderResult(next);
        avatar.idle({ reason: "result-ready" });
      } else {
        showQuestion(next);
      }
    } catch (error) {
      avatar.idle({ reason: "answer-error" });
      view.renderError(error.message);
    }
  },

  onListen() {
    if (consultationController.isListening) {
      consultationController.stopListening({ notifyEnd: true });
      avatar.idle({ reason: "listening-stopped" });
      setConsultationMicState(false);
      return;
    }

    const started = consultationController.listen({
      onInterim: (text) => view.setInterimTranscript(text),
      onFinal: (text) => view.setInterimTranscript(text),
      onError: (reason) => {
        avatar.idle({ reason: "listening-error" });
        if (reason !== "aborted") view.renderError(`No pude usar el micrófono: ${reason}`);
      },
      onEnd: (text) => {
        if (text) view.setInterimTranscript(text);
        avatar.idle({ reason: "listening-ended" });
        setConsultationMicState(false);
      },
    });

    if (!started) {
      avatar.idle({ reason: "listening-unavailable" });
      view.renderError("El reconocimiento de voz no está disponible en este navegador.");
      return;
    }

    avatar.listening({ source: "microphone" });
    setConsultationMicState(true);
  },

  onSpeakResult(result) {
    avatar.thinking({ reason: "prepare-result-speech" });
    speakWithAvatar(`${result.diagnostico}. ${Object.values(result.roadmap).join(" ")}`);
  },

  async onTraining() {
    try {
      await showTraining();
    } catch (error) {
      avatar.idle({ reason: "training-error" });
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
        await finishTrainingRecording();
      } else {
        await trainingController.startRecording({ canvas });
        scheduleRecordingLimit();
        const state = await trainingController.state();
        state.recording = true;
        view.renderTraining(state);
      }
    } catch (error) {
      clearRecordingTimeout();
      trainingController.cancelRecording();
      console.error("Voice training recording failed", error);
      view.renderError(`${error.name || "Error"}: ${error.message}`);
    }
  },

  async onCancelRecording() {
    clearRecordingTimeout();
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
