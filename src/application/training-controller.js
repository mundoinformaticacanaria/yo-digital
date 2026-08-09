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

  async startRecording({ canvas } = {}) {
    const stream = await this.service.startRecording();
    this.recording = true;
    this.waveform?.start?.({ stream, canvas, active: () => this.recording });
    return this.currentPhrase;
  }

  async stopRecording() {
    const sample = await this.service.stopAndSave({ prompt: this.currentPhrase, label: `Frase ${this.phraseIndex + 1}` });
    this.recording = false;
    this.waveform?.stop?.();
    return sample;
  }

  cancelRecording() {
    this.recording = false;
    this.waveform?.stop?.();
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
