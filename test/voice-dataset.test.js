import test from "node:test";
import assert from "node:assert/strict";
import { extensionForMimeType, summarizeVoiceDataset } from "../src/domain/voice-dataset.js";

test("summarizeVoiceDataset calculates duration and quality", () => {
  const summary = summarizeVoiceDataset([
    { durationMs: 180_000 },
    { durationMs: 180_000 },
  ]);

  assert.equal(summary.count, 2);
  assert.equal(summary.totalMinutes, 6);
  assert.equal(summary.averageSeconds, 180);
  assert.equal(summary.quality, "Muy bueno — válido para clonación");
  assert.equal(summary.progressPercent, 60);
});

test("extensionForMimeType maps browser audio types", () => {
  assert.equal(extensionForMimeType("audio/webm;codecs=opus"), "webm");
  assert.equal(extensionForMimeType("audio/mp4"), "mp4");
  assert.equal(extensionForMimeType("audio/ogg"), "ogg");
  assert.equal(extensionForMimeType("audio/wav"), "wav");
});
