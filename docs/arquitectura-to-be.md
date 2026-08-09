# Arquitectura TO-BE

## Objetivo

Mantener Yo-digital como producto web estático, sin backend propio ni tracking, pero con código fuente mantenible y responsabilidades separadas.

## Capas

- `src/domain/`: reglas puras, preguntas, señales, recomendaciones, métricas y frases de entrenamiento.
- `src/application/`: casos de uso y orquestación de consulta/entrenamiento.
- `src/infrastructure/`: adaptadores del navegador: Web Speech API, MediaRecorder, IndexedDB, Web Audio y exportación.
- `src/ui/`: renderizado y estilos.
- `src/main.js`: composición de dependencias.

Las capas internas no dependen de detalles del navegador. Los adaptadores implementan las capacidades externas necesarias.

## Persistencia

- Respuestas de consultoría: memoria de la pestaña; no persistentes.
- Muestras de voz: IndexedDB local y explícita.
- No hay cookies, tracking ni backend de producto.

## Voz

- Entrada: `SpeechRecognition` / `webkitSpeechRecognition`, `es-ES`.
- Salida: `speechSynthesis`, `es-ES`.
- Dataset: `MediaRecorder` + IndexedDB.
- Waveform: Web Audio API.
- ZIP: JSZip cargado bajo demanda. Si falla, descarga individual.

## Publicación

Durante la reconstrucción:

- `/index.html`: producción heredada estable.
- `/preview/`: reconstrucción modular para validación.

Promoción futura:

1. verificar `npm run verify`;
2. validar preview en navegadores objetivo;
3. generar/actualizar el artefacto de producción;
4. conservar la versión anterior recuperable por Git.

## Principios

- SOLID aplicado donde aporta separación real, evitando abstracción ceremonial.
- Dominio testeable sin DOM.
- Dependencias del navegador detrás de adaptadores.
- Privacidad como restricción arquitectónica verificable.
- GitHub es la fuente de verdad de requisitos, decisiones, código y estado del producto.
