import test from "node:test";
import assert from "node:assert/strict";
import { VoiceSampleService } from "../src/application/voice-sample-service.js";

test("VoiceSampleService records and persists metadata", async () => {
  const saved = [];
  const recorder = {
    isSupported: () => true,
    start: async () => {},
    stop: async () => ({ blob: { size: 123 }, mimeType: "audio/webm", durationMs: 2500 }),
    cancel: () => {},
  };
  const repository = {
    save: async (sample) => saved.push(sample),
    findAll: async () => saved,
    remove: async () => {},
    clear: async () => {},
  };

  const service = new VoiceSampleService({
    recorder,
    repository,
    clock: () => 42,
    idFactory: () => "sample-1",
  });

  await service.startRecording();
  const sample = await service.stopAndSave({ prompt: "  frase de prueba  ", label: "  voz base " });

  assert.equal(sample.id, "sample-1");
  assert.equal(sample.timestamp, 42);
  assert.equal(sample.prompt, "frase de prueba");
  assert.equal(sample.label, "voz base");
  assert.equal(sample.durationMs, 2500);
  assert.equal(saved.length, 1);
  assert.equal(saved[0], sample);
});
