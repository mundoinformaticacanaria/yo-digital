import test from "node:test";
import assert from "node:assert/strict";
import { WaveformRenderer } from "../src/infrastructure/waveform-renderer.js";

test("waveform renderer delegates animation frame through injected wrappers", () => {
  let requested = 0;
  let cancelled = 0;
  let closed = 0;

  class FakeAudioContext {
    createMediaStreamSource() {
      return { connect() {} };
    }
    createAnalyser() {
      return {
        fftSize: 0,
        frequencyBinCount: 4,
        getByteTimeDomainData(values) {
          values.fill(128);
        },
      };
    }
    close() {
      closed += 1;
    }
  }

  const renderer = new WaveformRenderer({
    AudioContextRef: FakeAudioContext,
    requestFrame: () => {
      requested += 1;
      return 42;
    },
    cancelFrame: (id) => {
      assert.equal(id, 42);
      cancelled += 1;
    },
  });

  const canvas = {
    width: 100,
    height: 40,
    getContext() {
      return {
        fillStyle: "",
        strokeStyle: "",
        lineWidth: 0,
        fillRect() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        stroke() {},
      };
    },
  };

  assert.equal(renderer.start({ stream: {}, canvas }), true);
  assert.equal(requested, 1);
  renderer.stop();
  assert.equal(cancelled, 1);
  assert.equal(closed, 1);
});
