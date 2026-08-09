# Estado de reconstrucción

Última actualización: 2026-08-09

## Completado

- GitHub establecido como fuente de verdad.
- README, contexto operativo, arquitectura AS-IS, requisitos, reglas de negocio, roadmap y ADR inicial.
- Banco de preguntas y variantes recuperado.
- Detección de señales y motor de recomendación reconstruidos como dominio puro.
- Caso de uso de consulta reconstruido y desacoplado de la UI.
- Adaptadores Web Speech API separados para reconocimiento y síntesis en `es-ES`.
- Grabación MediaRecorder separada, con restricciones de audio equivalentes al legado.
- Persistencia local de muestras separada en repositorio IndexedDB.
- Banco exacto de 22 frases fonéticas recuperado del bundle heredado.
- Métricas del dataset recuperadas: duración, promedio, progreso y calidad.
- Exportación ZIP recuperada con JSZip opcional y fallback a audios individuales.
- Renderizado de waveform aislado mediante Web Audio API.
- Controlador de entrenamiento reconstruido.
- UI legible de consulta y entrenamiento reconstruida bajo `src/ui/`.
- Preview aislada publicada en `preview/index.html` sin sustituir producción.
- Tests de dominio, sesión, controladores, voz y dataset añadidos con `node:test`.
- CI básica mediante GitHub Actions.

## Producción

La URL principal sigue sirviendo el `index.html` heredado. La reconstrucción no ha reemplazado todavía producción.

Preview técnica de la reconstrucción:

`https://mundoinformaticacanaria.github.io/yo-digital/preview/`

## Trabajo restante antes de sustituir producción

1. Validar la preview en navegador real: desktop/móvil, micrófono, SpeechRecognition, speechSynthesis, MediaRecorder e IndexedDB.
2. Corregir cualquier incompatibilidad detectada en esa validación.
3. Recuperar/preservar detalles visuales y de contenido que aporten valor frente a la nueva UI simplificada.
4. Añadir comprobación automatizada de imports/estructura y endurecer CI.
5. Documentar arquitectura TO-BE y operación de despliegue.
6. Decidir el mecanismo final de generación del `index.html` desplegable.
7. Sustituir el bundle heredado solo tras validación funcional suficiente.

## Decisiones pendientes del cliente

Ninguna decisión de producto pendiente. La siguiente parada válida será la validación humana de la preview antes de promoverla a producción.
