const SIGNAL_PATTERNS = Object.freeze({
  highScale: /1000|10k|20k|alto|escala|mucho|miles/,
  legacy: /excel|wordpress|legacy|monolito|php antiguo/,
  realtime: /tiempo real|chat|notificacion|cita|reserva|remision|veterinaria/,
  saas: /saas|b2b|suscripcion|multi-tenant|veterinaria|remisiones/,
});

export function normalizeAnswers(answers) {
  return Object.values(answers ?? {}).join(" ").toLowerCase();
}

export function detectSignals(answers) {
  const text = normalizeAnswers(answers);

  return Object.freeze({
    highScale: SIGNAL_PATTERNS.highScale.test(text),
    legacy: SIGNAL_PATTERNS.legacy.test(text),
    realtime: SIGNAL_PATTERNS.realtime.test(text),
    saas: SIGNAL_PATTERNS.saas.test(text),
  });
}
