# Roadmap técnico

## Fase 0 — Fuente de verdad
**Estado: en curso**

- README y contexto operativo.
- Arquitectura AS-IS.
- Requisitos y reglas heredadas.
- Decisiones técnicas versionadas.

## Fase 1 — Reconstrucción de fuente
**Objetivo:** disponer de código legible sin alterar producción.

- Extraer banco de preguntas y textos.
- Extraer motor de reglas a dominio puro.
- Aislar adaptadores de voz y almacenamiento.
- Crear casos de uso de sesión.
- Añadir tests de compatibilidad.

## Fase 2 — UI mantenible

- Reconstruir componentes de presentación.
- Mantener diseño dark premium y responsive.
- Eliminar acoplamientos con APIs del navegador.
- Corregir metadatos (`title`, idioma, accesibilidad básica).

## Fase 3 — Build y despliegue

- Generar automáticamente el artefacto estático.
- Mantener GitHub Pages.
- Añadir comprobaciones automáticas antes de publicar.
- Dejar `index.html` como salida de build, no como fuente editable.

## Fase 4 — Evolución de producto

Solo después de equivalencia funcional:

- Mejorar motor de consultoría.
- Eliminar sesgos/referencias de dominio no justificadas.
- Mejorar experiencia conversacional.
- Preparar integración de clon de voz cuando exista proveedor decidido.

## Criterio de finalización de la reconstrucción

La reconstrucción se considera completada cuando:

1. El comportamiento principal está representado en fuente legible.
2. Las reglas críticas tienen tests.
3. La publicación se genera de forma reproducible.
4. La documentación describe el sistema real.
5. No se necesita editar manualmente el bundle compilado para evolucionar el producto.
