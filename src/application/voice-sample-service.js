export class VoiceSampleService {
  constructor({ recorder, repository, clock = () => Date.now(), idFactory = () => crypto.randomUUID() }) {
    this.recorder = recorder;
    this.repository = repository;
    this.clock = clock;
    this.idFactory = idFactory;
  }

  isRecordingSupported() {
    return this.recorder.isSupported();
  }

  async startRecording() {
    return this.recorder.start();
  }

  async stopAndSave({ prompt = "", label = "" } = {}) {
    const recording = await this.recorder.stop();
    const sample = {
      id: this.idFactory(),
      timestamp: this.clock(),
      prompt: String(prompt ?? "").trim(),
      label: String(label ?? "").trim(),
      mimeType: recording.mimeType,
      durationMs: recording.durationMs,
      blob: recording.blob,
    };

    await this.repository.save(sample);
    return sample;
  }

  cancelRecording() {
    this.recorder.cancel();
  }

  listSamples() {
    return this.repository.findAll();
  }

  removeSample(id) {
    return this.repository.remove(id);
  }

  clearSamples() {
    return this.repository.clear();
  }
}
