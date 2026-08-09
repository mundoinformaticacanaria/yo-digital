# Incidencia: Illegal invocation al iniciar grabación

Fecha: 2026-08-09
Estado: corrección aplicada, pendiente validación en navegador real.

## Síntoma
En la sección "Construye tu dataset de voz", al pulsar el botón de grabación el navegador mostraba `Illegal invocation`.

## Correcciones aplicadas
- `getUserMedia` se enlaza explícitamente a `navigator.mediaDevices` para evitar invocaciones sin contexto en navegadores estrictos.
- El waveform pasa a ser una mejora no bloqueante: un fallo de Web Audio no debe impedir grabar.
- Eliminado el segundo arranque redundante del waveform desde `src/main.js`.
- Los errores de grabación ahora muestran `name + message` y se registran en consola para mejorar diagnóstico.

## Criterio de aceptación
Al pulsar grabar debe iniciarse MediaRecorder aunque la visualización de onda no esté disponible. Al detener, la muestra debe persistirse en IndexedDB.
