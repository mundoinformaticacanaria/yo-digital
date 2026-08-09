import test from "node:test";
import assert from "node:assert/strict";

import { ConsultationSession } from "../src/application/consultation-session.js";

test("session progresses through exactly five answers", () => {
  const session = new ConsultationSession({ random: () => 0 });

  assert.equal(session.currentQuestion().key, "negocio");

  session.answer("Empresa B2B");
  session.answer("Trabajo manual en Excel");
  session.answer("1000 operaciones al mes");
  session.answer("Excel y Holded");
  const result = session.answer("Reducir 30% el tiempo administrativo");

  assert.equal(session.isComplete, true);
  assert.ok(result.diagnostico);
  assert.ok(result.arquitectura);
  assert.ok(result.roadmap);
});

test("session rejects empty answers", () => {
  const session = new ConsultationSession();
  assert.throws(() => session.answer("   "), /cannot be empty/);
});

test("result is unavailable before qualification completes", () => {
  const session = new ConsultationSession();
  assert.throws(() => session.result(), /not complete/);
});
