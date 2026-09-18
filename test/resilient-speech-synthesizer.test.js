import test from "node:test";
import assert from "node:assert/strict";

import { ResilientSpeechSynthesizer } from "../src/infrastructure/resilient-speech-synthesizer.js";

test("uses fallback when primary TTS fails before audio starts", () => {
  const calls = [];
  const primary = {
    isSupported: () => true,
    stop() {},
    speak(_text, handlers) {
      handlers.onError(new Error("network"));
      return true;
    },
  };
  const fallback = {
    isSupported: () => true,
    stop() {},
    speak(text, handlers) {
      calls.push(text);
      handlers.onStart?.({ source: "browser-tts" });
      handlers.onEnd?.({ source: "browser-tts" });
      return true;
    },
  };

  const synthesizer = new ResilientSpeechSynthesizer({ primary, fallback });
  const events = [];

  assert.equal(
    synthesizer.speak("Hola", {
      onStart: () => events.push("start"),
      onEnd: () => events.push("end"),
      onError: () => events.push("error"),
    }),
    true,
  );

  assert.deepEqual(calls, ["Hola"]);
  assert.deepEqual(events, ["start", "end"]);
});

test("uses fallback directly when primary is not configured", () => {
  let spoken = "";
  const synthesizer = new ResilientSpeechSynthesizer({
    primary: { isSupported: () => false, stop() {} },
    fallback: {
      isSupported: () => true,
      stop() {},
      speak(text) {
        spoken = text;
        return true;
      },
    },
  });

  assert.equal(synthesizer.speak("Pregunta"), true);
  assert.equal(spoken, "Pregunta");
});
