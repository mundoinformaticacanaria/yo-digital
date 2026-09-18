export class HttpAudioSpeechSynthesizer {
  constructor({
    endpoint = "",
    fetchFn = globalThis.fetch?.bind(globalThis),
    createAudio = (url) => new globalThis.Audio(url),
    urlApi = globalThis.URL,
    abortControllerFactory = () => new globalThis.AbortController(),
    normalizeText = (text) => String(text ?? "").trim(),
  } = {}) {
    this.endpoint = String(endpoint ?? "").trim();
    this.fetchFn = fetchFn;
    this.createAudio = createAudio;
    this.urlApi = urlApi;
    this.abortControllerFactory = abortControllerFactory;
    this.normalizeText = normalizeText;

    this.abortController = null;
    this.audio = null;
    this.objectUrl = "";
    this.operationId = 0;
  }

  isSupported() {
    return Boolean(
      this.endpoint
      && typeof this.fetchFn === "function"
      && typeof this.createAudio === "function"
      && typeof this.urlApi?.createObjectURL === "function"
      && typeof this.urlApi?.revokeObjectURL === "function"
      && typeof this.abortControllerFactory === "function"
    );
  }

  speak(text, {
    onAudioReady = () => {},
    onStart = () => {},
    onEnd = () => {},
    onError = () => {},
  } = {}) {
    const value = String(text ?? "").trim();
    if (!value || !this.isSupported()) return false;

    this.stop();
    const operationId = ++this.operationId;
    const controller = this.abortControllerFactory();
    this.abortController = controller;

    this.generateAndPlay({
      text: value,
      operationId,
      controller,
      onAudioReady,
      onStart,
      onEnd,
      onError,
    });

    return true;
  }

  async generateAndPlay({
    text,
    operationId,
    controller,
    onAudioReady,
    onStart,
    onEnd,
    onError,
  }) {
    let objectUrl = "";

    try {
      const spokenText = this.normalizeText(text);
      const response = await this.fetchFn(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "audio/mpeg,audio/*",
        },
        body: JSON.stringify({ text: spokenText }),
        signal: controller.signal,
      });

      if (!response?.ok) {
        const status = response?.status ? ` (${response.status})` : "";
        throw new Error(`TTS request failed${status}`);
      }

      const blob = await response.blob();
      if (operationId !== this.operationId || controller.signal?.aborted) return;

      objectUrl = this.urlApi.createObjectURL(blob);
      const audio = this.createAudio(objectUrl);
      this.audio = audio;
      this.objectUrl = objectUrl;

      const audioContext = {
        source: "http-tts",
        audio: { blob, url: objectUrl },
        spokenText,
      };

      onAudioReady(audioContext);

      audio.onplay = () => {
        if (operationId === this.operationId) onStart(audioContext);
      };

      audio.onended = () => {
        if (operationId !== this.operationId) return;
        onEnd(audioContext);
        this.releaseAudio();
      };

      audio.onerror = () => {
        if (operationId !== this.operationId) return;
        const error = new Error("TTS audio playback failed");
        this.releaseAudio();
        onError(error);
      };

      await audio.play();
    } catch (error) {
      if (operationId !== this.operationId || controller.signal?.aborted) {
        if (objectUrl) this.urlApi.revokeObjectURL(objectUrl);
        return;
      }

      this.releaseAudio();
      onError(error);
    }
  }

  releaseAudio() {
    if (this.audio) {
      this.audio.onplay = null;
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio = null;
    }

    if (this.objectUrl) {
      this.urlApi.revokeObjectURL(this.objectUrl);
      this.objectUrl = "";
    }

    this.abortController = null;
  }

  stop() {
    this.operationId += 1;

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.audio) {
      this.audio.pause?.();
    }

    this.releaseAudio();
  }
}
