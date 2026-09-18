import test from "node:test";
import assert from "node:assert/strict";

import { HttpAudioSpeechSynthesizer } from "../src/infrastructure/http-audio-speech-synthesizer.js";
import { normalizeTtsText } from "../src/infrastructure/tts-text-normalizer.js";

const tick = () => new Promise((resolve) => setImmediate(resolve));

test("HTTP TTS posts normalized text and exposes reusable audio", async () => {
  const requests = [];
  const revoked = [];
  const events = [];
  const blob = new Blob(["audio"], { type: "audio/mpeg" });

  const synthesizer = new HttpAudioSpeechSynthesizer({
    endpoint: "https://tts.example.test/speak",
    normalizeText: normalizeTtsText,
    fetchFn: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, status: 200, blob: async () => blob };
    },
    urlApi: {
      createObjectURL: () => "blob:test-audio",
      revokeObjectURL: (url) => revoked.push(url),
    },
    abortControllerFactory: () => new AbortController(),
    createAudio: (url) => ({
      url,
      onplay: null,
      onended: null,
      onerror: null,
      pause() {},
      async play() {
        this.onplay?.();
        queueMicrotask(() => this.onended?.());
      },
    }),
  });

  const started = synthesizer.speak("Hola, soy Xerach.", {
    onAudioReady: (context) => events.push(["ready", context]),
    onStart: (context) => events.push(["start", context]),
    onEnd: (context) => events.push(["end", context]),
    onError: (error) => events.push(["error", error]),
  });

  assert.equal(started, true);
  await tick();

  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://tts.example.test/speak");
  assert.deepEqual(JSON.parse(requests[0].options.body), { text: "Hola, soy Será." });
  assert.equal(events[0][0], "ready");
  assert.equal(events[0][1].audio.blob, blob);
  assert.equal(events[0][1].audio.url, "blob:test-audio");
  assert.deepEqual(events.map(([name]) => name), ["ready", "start", "end"]);
  assert.deepEqual(revoked, ["blob:test-audio"]);
});

test("HTTP TTS reports request failures before playback starts", async () => {
  const errors = [];
  const synthesizer = new HttpAudioSpeechSynthesizer({
    endpoint: "https://tts.example.test/speak",
    fetchFn: async () => ({ ok: false, status: 503 }),
    urlApi: {
      createObjectURL: () => "blob:unused",
      revokeObjectURL() {},
    },
    abortControllerFactory: () => new AbortController(),
    createAudio: () => ({ play: async () => {}, pause() {} }),
  });

  assert.equal(synthesizer.speak("Hola", { onError: (error) => errors.push(error) }), true);
  await tick();

  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /503/);
});
