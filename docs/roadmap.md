# Roadmap técnico

Última actualización: 2026-08-14

## Prioridad actual

Yo-digital es actualmente un proyecto personal de exploración y construcción tecnológica. La prioridad inmediata no es la captación comercial, sino conseguir una base adaptable y escalable para evolucionar hacia un "yo digital" visual y vocalmente creíble.

Orden actual:

1. mantener la arquitectura de avatar desacoplada e intercambiable;
2. validar lip-sync fotorrealista con coste recurrente 0 €, empezando por MuseTalk 1.5;
3. mejorar progresivamente la presencia visual (`idle`, `listening`, `thinking`, `speaking`);
4. evolucionar la voz en paralelo y utilizar la mejor voz disponible en cada momento;
5. continuar la reconstrucción, validación de navegador y build reproducible;
6. abordar persistencia y captación comercial cuando se conviertan en prioridad de producto.

Cada paso ejecutable debe estar previamente representado mediante una issue; si corresponde a Desarrollo, llevará `PROGRAMADOR`.

## Fase 0 — Fuente de verdad
**Estado: en curso**

- README y contexto operativo.
- Arquitectura AS-IS.
- Requisitos y reglas heredadas.
- Decisiones técnicas versionadas.
- Gobernanza Tech Lead / Desarrollo e issues como unidad de trabajo.

## Fase 1 — Reconstrucción de fuente
**Objetivo:** disponer de código legible sin alterar producción.

- Extraer banco de preguntas y textos.
- Extraer motor de reglas a dominio puro.
- Aislar adaptadores de voz y almacenamiento.
- Crear casos de uso de sesión.
- Añadir tests de compatibilidad.

## Fase 2 — UI y presencia mantenibles

- Reconstruir componentes de presentación.
- Mantener diseño dark premium y responsive.
- Eliminar acoplamientos con APIs del navegador.
- Corregir metadatos (`title`, idioma, accesibilidad básica).
- Mantener el avatar detrás de un contrato independiente de proveedor.
- Estados de presencia `idle`, `listening`, `thinking` y `speaking`: **base implementada**.
- Validar un primer motor fotorrealista/lip-sync gratuito mediante PoC local.
- Evolucionar la representación visual sin acoplar el producto a MuseTalk, HeyGen u otro proveedor.

## Fase 3 — Build y despliegue

- Generar automáticamente el artefacto estático.
- Mantener GitHub Pages.
- Añadir comprobaciones automáticas antes de publicar.
- Dejar `index.html` como salida de build, no como fuente editable.

## Fase 4 — Evolución de producto

Después de disponer de una base suficientemente mantenible:

- Mejorar motor de consultoría.
- Eliminar sesgos/referencias de dominio no justificadas.
- Mejorar experiencia conversacional.
- Integrar voz natural mediante un adaptador que, si el avatar lo requiere, pueda exponer audio como fichero o stream.
- Integrar el motor de avatar que supere las PoC de calidad, rendimiento, privacidad y coste.
- Añadir persistencia/captación cuando exista prioridad funcional para explotar comercialmente las conversaciones.

## Criterio de finalización de la reconstrucción

La reconstrucción se considera completada cuando:

1. El comportamiento principal está representado en fuente legible.
2. Las reglas críticas tienen tests.
3. La publicación se genera de forma reproducible.
4. La documentación describe el sistema real.
5. No se necesita editar manualmente el bundle compilado para evolucionar el producto.
