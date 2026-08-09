export class BrowserAudioRecorder {
  constructor({ navigatorRef = globalThis.navigator, MediaRecorderRef = globalThis.MediaRecorder } = {}) {
    this.navigatorRef = navigatorRef;
    this.MediaRecorderRef = MediaRecorderRef;
    this.mediaDevices = navigatorRef?.mediaDevices ?? null;
    this.getUserMedia = this.mediaDevices?.getUserMedia
      ? this.mediaDevices.getUserMedia.bind(this.mediaDevices)
      : null;
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
    this.startedAt = null;
  }

  isSupported() {
    return Boolean(this.getUserMedia && this.MediaRecorderRef);
  }

  async start() {
    if (!this.isSupported()) {
      throw new Error("Audio recording is not supported by this browser");
    }
    if (this.recorder?.state === "recording") {
      throw new Error("Audio recording is already in progress");
    }

    this.stream = await this.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    this.chunks = [];
    this.startedAt = Date.now();
    this.recorder = new this.MediaRecorderRef(this.stream);
    this.recorder.ondataavailable = (event) => {
      if (event.data?.size) this.chunks.push(event.data);
    };
    this.recorder.start();
    return this.stream;
  }

  async stop() {
    if (!this.recorder || this.recorder.state !== "recording") {
      throw new Error("No audio recording is in progress");
    }

    const recorder = this.recorder;
    const mimeType = recorder.mimeType || "audio/webm";

    const blob = await new Promise((resolve, reject) => {
      recorder.onerror = (event) => reject(event.error ?? new Error("Audio recording failed"));
      recorder.onstop = () => resolve(new Blob(this.chunks, { type: mimeType }));
      recorder.stop();
    });

    const durationMs = this.startedAt ? Date.now() - this.startedAt : 0;
    this.release();

    return { blob, mimeType, durationMs };
  }

  cancel() {
    if (this.recorder?.state === "recording") {
      try {
        this.recorder.stop();
      } catch {
        // Ignore browsers that already transitioned state.
      }
    }
    this.release();
  }

  release() {
    this.stream?.getTracks?.().forEach((track) => track.stop());
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
    this.startedAt = null;
  }
}
