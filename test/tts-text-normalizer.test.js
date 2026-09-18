import test from "node:test";
import assert from "node:assert/strict";

import { normalizeTtsText } from "../src/infrastructure/tts-text-normalizer.js";

test("normalizes Xerach only for spoken TTS text", () => {
  assert.equal(
    normalizeTtsText("Hola, soy Xerach. Encantado."),
    "Hola, soy Será. Encantado.",
  );
});

test("normalization is case-insensitive and does not alter larger words", () => {
  assert.equal(normalizeTtsText("XERACH y Xerachito"), "Será y Xerachito");
});
