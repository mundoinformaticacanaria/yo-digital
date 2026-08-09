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
- Tests de dominio, sesión, controladores, voz, dataset y waveform añadidos con `node:test`.
- CI básica mediante GitHub Actions.

## Incidencias de validación

### 2026-08-09 · Micrófono en navegador real

Se observaron dos síntomas distintos:

1. Entrenamiento de voz: `Illegal invocation` al iniciar la grabación.
2. Consulta "Aplicación a medida": Web Speech API devolvía `aborted`.

Correcciones aplicadas:

- `getUserMedia` se invoca con `mediaDevices` como contexto explícito y el grabador informa ahora de la fase exacta (`getUserMedia` o `MediaRecorder`) si vuelve a fallar.
- La visualización waveform queda temporalmente desacoplada y desactivada durante esta validación para demostrar que MediaRecorder funciona de forma independiente.
- Antes de iniciar SpeechRecognition se cancela cualquier `speechSynthesis` en curso, evitando que Chrome/Android aborte el reconocimiento por conflicto de audio.

Estado: correcciones publicadas en `main`; pendiente revalidación humana en GitHub Pages.

## Producción

La URL principal sigue sirviendo el `index.html` heredado. La reconstrucción no ha reemplazado todavía producción.

Preview técnica de la reconstrucción:

`https://mundoinformaticacanaria.github.io/yo-digital/preview/`

## Trabajo restante antes de sustituir producción

1. Revalidar en navegador real los dos flujos de micrófono tras las correcciones actuales.
2. Validar persistencia IndexedDB y exportación del dataset.
3. Corregir cualquier incompatibilidad restante.
4. Reintegrar waveform una vez demostrada la grabación base.
5. Recuperar/preservar detalles visuales y de contenido que aporten valor frente a la nueva UI simplificada.
6. Endurecer CI y documentar operación de despliegue.
7. Definir el mecanismo final de generación del artefacto desplegable.
8. Sustituir el bundle heredado solo tras validación funcional suficiente.

## Decisiones pendientes del cliente

Ninguna decisión de producto pendiente. La siguiente parada válida es la revalidación humana del micrófono en la preview.
