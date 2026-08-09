import test from "node:test";
import assert from "node:assert/strict";
import { TrainingController } from "../src/application/training-controller.js";

test("TrainingController records, advances phrases and reports dataset state", async () => {
  const samples = [];
  const service = {
    startRecording: async () => ({ id: "stream" }),
    stopAndSave: async ({ prompt }) => {
      const sample = { id: "one", prompt, durationMs: 60_000 };
      samples.push(sample);
      return sample;
    },
    cancelRecording: () => {},
    listSamples: async () => samples,
    removeSample: async () => {},
    clearSamples: async () => samples.splice(0),
  };
  const waveform = { start: () => true, stop: () => {} };
  const exporter = { downloadZip: async () => ({ fallback: false }), downloadAllIndividually: () => {} };
  const controller = new TrainingController({ service, waveform, exporter });

  const firstPhrase = controller.currentPhrase;
  await controller.startRecording({ canvas: {} });
  assert.equal(controller.recording, true);
  await controller.stopRecording();
  assert.equal(controller.recording, false);

  const state = await controller.state();
  assert.equal(state.samples.length, 1);
  assert.equal(state.samples[0].prompt, firstPhrase);
  assert.equal(state.summary.totalMinutes, 1);

  const secondPhrase = controller.nextPhrase();
  assert.notEqual(secondPhrase, firstPhrase);
});
