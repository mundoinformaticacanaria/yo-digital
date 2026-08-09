# Estado de reconstrucción

Última actualización: 2026-08-09

## Completado

- GitHub establecido como fuente de verdad.
- README de proyecto.
- Contexto operativo persistente.
- Arquitectura AS-IS.
- Requisitos funcionales base.
- Reglas de negocio heredadas.
- Roadmap técnico.
- ADR-001 sobre reconstrucción y fuente de verdad.
- Banco de preguntas extraído a `src/domain/questions.js`.
- Detección de señales extraída a `src/domain/signals.js`.
- Motor de recomendación reconstruido en `src/domain/recommendation-engine.js`.
- Caso de uso de sesión reconstruido en `src/application/consultation-session.js`.
- Repositorio IndexedDB reconstruido en `src/infrastructure/voice-sample-repository.js`.
- Tests de dominio y sesión añadidos con `node:test`.
- CI básica añadida con GitHub Actions.

## Producción

La web publicada sigue usando el `index.html` heredado. No se ha cambiado el comportamiento de producción durante esta fase.

## Siguiente trabajo

1. Completar adaptadores de voz de navegador.
2. Reconstruir grabación/waveform/exportación.
3. Reconstruir UI en fuente legible.
4. Añadir tests de integración y compatibilidad.
5. Definir build reproducible.
6. Comparar nueva build contra comportamiento heredado.
7. Sustituir el bundle heredado únicamente cuando exista equivalencia suficiente.

## Decisiones pendientes del cliente

Ninguna en este momento.
