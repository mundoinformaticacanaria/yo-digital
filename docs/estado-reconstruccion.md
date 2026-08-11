# Estado de reconstrucción

Última actualización: 2026-08-11

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
- Métricas del dataset recuperadas y corregidas para distinguir prueba instantánea de objetivo profesional.
- Exportación ZIP recuperada con JSZip opcional y fallback a audios individuales.
- Renderizado de waveform aislado mediante Web Audio API.
- Controlador de entrenamiento reconstruido.
- UI legible de consulta y entrenamiento reconstruida bajo `src/ui/`.
- Preview aislada publicada en `preview/index.html` sin sustituir producción.
- Tests de dominio, sesión, controladores, voz, dataset y waveform añadidos con `node:test`.
- CI básica mediante GitHub Actions.
- Reglas `.gitignore` añadidas para evitar publicar accidentalmente material biométrico de voz.
- Dataset privado externo v1 preparado con 43 clips y ~6,19 min de voz útil.
- Subconjunto privado IVC v1 preparado con 14 clips y ~1,90 min para una primera prueba de clonación instantánea.
- Evaluación inicial de proveedores documentada en `docs/adr/004-voice-cloning-provider-evaluation.md`.

## Incidencias de validación

### 2026-08-09 · Micrófono en navegador real

Se observaron dos síntomas distintos:

1. Entrenamiento de voz: `Illegal invocation` al iniciar la grabación.
2. Consulta "Aplicación a medida": Web Speech API devolvía `aborted`.

Correcciones aplicadas:

- `getUserMedia` se invoca con `mediaDevices` como contexto explícito y el grabador informa ahora de la fase exacta (`getUserMedia` o `MediaRecorder`) si vuelve a fallar.
- La visualización waveform queda temporalmente desacoplada y desactivada durante esta validación para demostrar que MediaRecorder funciona de forma independiente.
- Antes de iniciar SpeechRecognition se cancela cualquier `speechSynthesis` en curso, evitando que Chrome/Android aborte el reconocimiento por conflicto de audio.

### 2026-08-09 · Regla de duración de voz en todas las consultas

Decisión de producto: la entrada por voz no debe finalizar por una pausa natural del usuario.

Comportamiento requerido y aplicado:

- En "Aplicación a medida" y "Arquitectura / consultoría", pulsar `Hablar` inicia una sesión de dictado.
- El botón cambia a `Terminar voz` y el usuario decide cuándo cerrar la intervención.
- Si el navegador corta internamente SpeechRecognition por silencio, el adaptador reinicia el ciclo mientras la sesión siga activa.
- El texto final e intermedio se acumula en el mismo campo de respuesta.
- Existe un límite máximo de 60 segundos; al alcanzarlo, la sesión se cierra automáticamente conservando el texto reconocido.
- El entrenamiento de dataset mantiene la misma filosofía: parada manual o automática a los 60 segundos.

## Voz clonada

El propietario aportó 8 audios y confirmó que contienen exclusivamente su voz. En los dos audios largos, las pausas corresponden a intervenciones telefónicas de otra persona que no quedaron registradas.

Los originales no se modifican ni se suben al repositorio público. El procesamiento local produjo un dataset maestro normalizado y un subconjunto reducido para IVC. La siguiente acción externa requiere autorización expresa porque implica enviar material biométrico a un proveedor de voz y posiblemente contratar un plan de pago.

## Producción

La URL principal sigue sirviendo el `index.html` heredado. La reconstrucción no ha reemplazado todavía producción.

Preview técnica de la reconstrucción:

`https://mundoinformaticacanaria.github.io/yo-digital/preview/`

## Trabajo restante antes de sustituir producción

1. Revalidar en navegador real los flujos de voz con parada manual y pausas naturales.
2. Validar persistencia IndexedDB y exportación del dataset.
3. Corregir cualquier incompatibilidad restante.
4. Reintegrar waveform una vez demostrada la grabación base.
5. Recuperar/preservar detalles visuales y de contenido que aporten valor frente a la nueva UI simplificada.
6. Endurecer CI y documentar operación de despliegue.
7. Definir el mecanismo final de generación del artefacto desplegable.
8. Crear una primera voz clonada cuando el cliente autorice el proveedor y el envío del audio.
9. Diseñar proxy/tokenización para TTS dinámico sin exponer claves en GitHub Pages.
10. Sustituir el bundle heredado solo tras validación funcional suficiente.

## Decisiones pendientes del cliente

- Autorizar o rechazar el uso de un proveedor externo para crear la primera voz clonada, aceptando el envío de muestras biométricas y el coste/retención aplicables.
