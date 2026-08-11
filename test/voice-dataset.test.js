import test from "node:test";
import assert from "node:assert/strict";
import { extensionForMimeType, summarizeVoiceDataset } from "../src/domain/voice-dataset.js";

test("summarizeVoiceDataset calculates duration and cloning readiness", () => {
  const summary = summarizeVoiceDataset([
    { durationMs: 180_000 },
    { durationMs: 180_000 },
  ]);

  assert.equal(summary.count, 2);
  assert.equal(summary.totalMinutes, 6);
  assert.equal(summary.averageSeconds, 180);
  assert.equal(summary.quality, "Listo para probar clonación instantánea — sigue grabando para mayor fidelidad");
  assert.equal(summary.instantProgressPercent, 100);
  assert.equal(summary.professionalProgressPercent, 20);
  assert.equal(summary.progressPercent, 20);
});

test("summarizeVoiceDataset marks 30 minutes as professional candidate", () => {
  const summary = summarizeVoiceDataset([{ durationMs: 30 * 60_000 }]);
  assert.equal(summary.quality, "Dataset amplio — candidato a clonación profesional");
  assert.equal(summary.professionalProgressPercent, 100);
});

test("extensionForMimeType maps browser audio types", () => {
  assert.equal(extensionForMimeType("audio/webm;codecs=opus"), "webm");
  assert.equal(extensionForMimeType("audio/mp4"), "mp4");
  assert.equal(extensionForMimeType("audio/ogg"), "ogg");
  assert.equal(extensionForMimeType("audio/wav"), "wav");
});
