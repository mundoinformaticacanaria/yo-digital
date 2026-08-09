import { TRAINING_PHRASES } from "../domain/training-phrases.js";
import { summarizeVoiceDataset } from "../domain/voice-dataset.js";

export class TrainingController {
  constructor({ service, exporter, waveform, random = Math.random } = {}) {
    this.service = service;
    this.exporter = exporter;
    this.waveform = waveform;
    this.random = random;
    this.phraseIndex = 0;
    this.recording = false;
  }

  get currentPhrase() {
    return TRAINING_PHRASES[this.phraseIndex];
  }

  nextPhrase() {
    this.phraseIndex = (this.phraseIndex + 1) % TRAINING_PHRASES.length;
    return this.currentPhrase;
  }

  selectPhrase(index) {
    if (!Number.isInteger(index) || index < 0 || index >= TRAINING_PHRASES.length) {
      throw new RangeError("Invalid training phrase index");
    }
    this.phraseIndex = index;
    return this.currentPhrase;
  }

  async startRecording() {
    await this.service.startRecording();
    this.recording = true;
    // Waveform is intentionally disabled while validating Android/browser recording.
    // Recording must never depend on Web Audio rendering.
    return this.currentPhrase;
  }

  async stopRecording() {
    const sample = await this.service.stopAndSave({ prompt: this.currentPhrase, label: `Frase ${this.phraseIndex + 1}` });
    this.recording = false;
    return sample;
  }

  cancelRecording() {
    this.recording = false;
    this.service.cancelRecording();
  }

  async state() {
    const samples = await this.service.listSamples();
    return {
      samples,
      summary: summarizeVoiceDataset(samples),
      phrase: this.currentPhrase,
      phraseIndex: this.phraseIndex,
      phraseCount: TRAINING_PHRASES.length,
      recording: this.recording,
    };
  }

  async removeSample(id) {
    await this.service.removeSample(id);
    return this.state();
  }

  async clearSamples() {
    await this.service.clearSamples();
    return this.state();
  }

  async exportZip() {
    const samples = await this.service.listSamples();
    return this.exporter.downloadZip(samples);
  }

  async exportIndividual() {
    const samples = await this.service.listSamples();
    this.exporter.downloadAllIndividually(samples);
  }
}
