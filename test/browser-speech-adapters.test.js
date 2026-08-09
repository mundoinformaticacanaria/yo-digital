import test from "node:test";
import assert from "node:assert/strict";
import { BrowserSpeechRecognizer } from "../src/infrastructure/browser-speech-recognizer.js";
import { BrowserSpeechSynthesizer } from "../src/infrastructure/browser-speech-synthesizer.js";

test("BrowserSpeechRecognizer reports support and configures Spanish recognition", () => {
  let instance;
  class FakeRecognition {
    constructor() { instance = this; }
    start() { this.started = true; }
    stop() { this.stopped = true; }
  }
  const recognizer = new BrowserSpeechRecognizer({ windowRef: { SpeechRecognition: FakeRecognition } });
  let final = "";
  recognizer.listen({ onFinal: (value) => final = value });

  assert.equal(recognizer.isSupported(), true);
  assert.equal(instance.lang, "es-ES");
  assert.equal(instance.interimResults, true);
  assert.equal(instance.started, true);

  instance.onresult({
    resultIndex: 0,
    results: Object.assign([[{ transcript: "hola mundo" }]], { length: 1 }),
  });
  instance.results = undefined;

  // Simulate the final flag on the array-like result entry.
  const entry = [{ transcript: "respuesta final" }];
  entry.isFinal = true;
  instance.onresult({ resultIndex: 0, results: [entry] });
  assert.equal(final, "respuesta final");
});

test("BrowserSpeechSynthesizer speaks in Spanish and can cancel", () => {
  const calls = [];
  class FakeUtterance {
    constructor(text) { this.text = text; }
  }
  const windowRef = {
    SpeechSynthesisUtterance: FakeUtterance,
    speechSynthesis: {
      speak: (utterance) => calls.push(utterance),
      cancel: () => calls.push("cancel"),
    },
  };
  const synthesizer = new BrowserSpeechSynthesizer({ windowRef });
  synthesizer.speak("Hola");

  assert.equal(calls[0], "cancel");
  assert.equal(calls[1].text, "Hola");
  assert.equal(calls[1].lang, "es-ES");
  synthesizer.stop();
  assert.equal(calls.at(-1), "cancel");
});
