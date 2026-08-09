export class WaveformRenderer {
  constructor({
    AudioContextRef = globalThis.AudioContext || globalThis.webkitAudioContext,
    requestFrame = (callback) => globalThis.requestAnimationFrame(callback),
    cancelFrame = (frameId) => globalThis.cancelAnimationFrame(frameId),
  } = {}) {
    this.AudioContextRef = AudioContextRef;
    this.requestFrame = requestFrame;
    this.cancelFrame = cancelFrame;
    this.audioContext = null;
    this.analyser = null;
    this.frameId = null;
  }

  isSupported() {
    return Boolean(this.AudioContextRef && this.requestFrame && this.cancelFrame);
  }

  start({ stream, canvas, active = () => true } = {}) {
    if (!this.isSupported() || !stream || !canvas) return false;
    this.stop();

    this.audioContext = new this.AudioContextRef();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    source.connect(this.analyser);

    const context = canvas.getContext("2d");
    const values = new Uint8Array(this.analyser.frequencyBinCount);

    const draw = () => {
      this.frameId = this.requestFrame(draw);
      this.analyser.getByteTimeDomainData(values);
      context.fillStyle = "#141416";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 2;
      context.strokeStyle = active() ? "#34d399" : "#52525b";
      context.beginPath();
      const sliceWidth = canvas.width / values.length;
      let x = 0;
      for (let index = 0; index < values.length; index += 1) {
        const y = (values[index] / 128) * (canvas.height / 2);
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
        x += sliceWidth;
      }
      context.stroke();
    };

    draw();
    return true;
  }

  stop() {
    if (this.frameId !== null) this.cancelFrame?.(this.frameId);
    this.frameId = null;
    this.analyser = null;
    this.audioContext?.close?.();
    this.audioContext = null;
  }
}
