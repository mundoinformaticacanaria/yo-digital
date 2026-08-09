# ADR-002 — Preview antes de promoción

## Estado

Aceptada — 2026-08-09.

## Contexto

La producción actual es un bundle heredado autocontenido. La reconstrucción modular necesita validación funcional antes de sustituirlo, especialmente por las APIs dependientes del navegador: micrófono, reconocimiento de voz, síntesis, MediaRecorder, Web Audio e IndexedDB.

## Decisión

Mantener `index.html` heredado como producción mientras la nueva implementación se publica aisladamente bajo `/preview/`.

La promoción solo ocurrirá después de:

1. `npm run verify` satisfactorio;
2. validación humana en navegador real de los flujos principales;
3. corrección de incidencias de compatibilidad;
4. comprobación de privacidad y ausencia de dependencias no autorizadas.

## Consecuencias

- No hay riesgo de romper la URL principal durante la reconstrucción.
- La nueva arquitectura puede evolucionar de forma incremental.
- Existe temporalmente duplicidad entre implementación heredada y reconstruida.
- La validación humana es un gate explícito antes de producción.
