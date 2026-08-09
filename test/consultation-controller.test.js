import test from "node:test";
import assert from "node:assert/strict";
import { ConsultationController } from "../src/application/consultation-controller.js";

test("ConsultationController starts, answers and stops voice", () => {
  let recognizerStopped = 0;
  let synthesizerStopped = 0;
  const fakeSession = {
    currentQuestion: () => ({ text: "Pregunta", index: 0, total: 1 }),
    answer: (value) => ({ diagnostico: value }),
  };

  const controller = new ConsultationController({
    recognizer: { isSupported: () => true, listen: () => {}, stop: () => recognizerStopped += 1 },
    synthesizer: { isSupported: () => true, speak: () => {}, stop: () => synthesizerStopped += 1 },
    sessionFactory: () => fakeSession,
  });

  assert.deepEqual(controller.start("app"), { text: "Pregunta", index: 0, total: 1 });
  assert.deepEqual(controller.answer("Respuesta"), { diagnostico: "Respuesta" });

  controller.reset();
  assert.equal(controller.session, null);
  assert.ok(recognizerStopped >= 2);
  assert.ok(synthesizerStopped >= 2);
});
