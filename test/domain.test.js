import test from "node:test";
import assert from "node:assert/strict";

import { QUESTION_BANK, CONSULTATION_MODES } from "../src/domain/questions.js";
import { detectSignals } from "../src/domain/signals.js";
import { buildRecommendation } from "../src/domain/recommendation-engine.js";

test("each consultation mode keeps five qualification questions", () => {
  assert.equal(QUESTION_BANK.app.length, 5);
  assert.equal(QUESTION_BANK.arch.length, 5);
  assert.deepEqual(
    QUESTION_BANK.app.map((question) => question.key),
    ["negocio", "problema", "volumen", "stack", "objetivo"],
  );
});

test("legacy and scale signals reproduce inherited heuristics", () => {
  const signals = detectSignals({
    problema: "Tenemos mucho trabajo manual",
    volumen: "10k operaciones",
    stack: "Excel y WordPress legacy",
  });

  assert.equal(signals.highScale, true);
  assert.equal(signals.legacy, true);
});

test("realtime and SaaS signals detect inherited domain keywords", () => {
  const signals = detectSignals({
    negocio: "SaaS B2B veterinaria",
    problema: "Necesitamos notificacion en tiempo real",
  });

  assert.equal(signals.realtime, true);
  assert.equal(signals.saas, true);
});

test("app recommendation selects high-scale backend when signal is present", () => {
  const result = buildRecommendation(
    {
      negocio: "SaaS B2B",
      problema: "Procesos manuales",
      volumen: "20k transacciones",
      stack: "Excel",
      objetivo: "automatizar",
    },
    CONSULTATION_MODES.APP,
  );

  assert.match(result.arquitectura.backend, /NestJS/);
  assert.match(result.arquitectura.backend, /BullMQ\/Redis/);
});

test("architecture mode produces audit roadmap", () => {
  const result = buildRecommendation(
    {
      negocio: "ERP",
      problema: "deploys con miedo",
      volumen: "300 usuarios",
      stack: "Laravel + MySQL",
      objetivo: "99.9% uptime",
    },
    CONSULTATION_MODES.ARCHITECTURE,
  );

  assert.match(result.roadmap.fase1, /Auditoría 360º/);
  assert.equal(result.proximos.length, 3);
});

test("unsupported consultation mode fails explicitly", () => {
  assert.throws(
    () => buildRecommendation({}, "unknown"),
    /Unsupported consultation mode/,
  );
});
