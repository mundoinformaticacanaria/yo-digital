export class BrowserAudioRecorder {
  constructor({ navigatorRef = globalThis.navigator, windowRef = globalThis.window } = {}) {
    this.navigatorRef = navigatorRef;
    this.windowRef = windowRef;
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
    this.startedAt = null;
  }

  isSupported() {
    return Boolean(
      this.navigatorRef?.mediaDevices?.getUserMedia &&
      (this.windowRef?.MediaRecorder || globalThis.MediaRecorder),
    );
  }

  async start() {
    if (!this.isSupported()) {
      throw new Error("Audio recording is not supported by this browser");
    }
    if (this.recorder?.state === "recording") {
      throw new Error("Audio recording is already in progress");
    }

    let stream;
    try {
      const mediaDevices = this.navigatorRef.mediaDevices;
      stream = await mediaDevices.getUserMedia.call(mediaDevices, {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (error) {
      throw new Error(`getUserMedia: ${error?.name || "Error"}: ${error?.message || error}`);
    }

    this.stream = stream;
    this.chunks = [];
    this.startedAt = Date.now();

    try {
      const MediaRecorderCtor = this.windowRef?.MediaRecorder || globalThis.MediaRecorder;
      this.recorder = Reflect.construct(MediaRecorderCtor, [stream]);
      this.recorder.ondataavailable = (event) => {
        if (event.data?.size) this.chunks.push(event.data);
      };
      this.recorder.start();
    } catch (error) {
      this.release();
      throw new Error(`MediaRecorder: ${error?.name || "Error"}: ${error?.message || error}`);
    }

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
    if (this.stream) {
      for (const track of this.stream.getTracks()) {
        try {
          track.stop();
        } catch {
          // Best-effort cleanup.
        }
      }
    }
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
    this.startedAt = null;
  }
}
