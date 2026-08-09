# ADR-001 — Fuente de verdad y reconstrucción

## Estado
Aceptada — 2026-08-09

## Contexto
La aplicación publicada existe como un único `index.html` compilado/minificado. Ese artefacto mezcla framework, estilos, lógica de negocio, almacenamiento y APIs del navegador.

## Decisión
- GitHub será la fuente de verdad del producto.
- Se reconstruirá una fuente modular y legible sin sustituir producción hasta alcanzar equivalencia funcional.
- `index.html` seguirá publicándose durante la transición y terminará siendo un artefacto generado.
- Las decisiones relevantes se registrarán en `docs/decisiones/`.
- Se priorizará preservación de comportamiento sobre reescritura estética.

## Consecuencias
Positivas:
- Trazabilidad y continuidad sin depender de memoria externa.
- Testabilidad y mantenimiento real.
- Reducción del riesgo al evolucionar el producto.

Coste:
- Durante un periodo coexistirán bundle heredado y fuente reconstruida.
