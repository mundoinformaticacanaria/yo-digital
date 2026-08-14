# Arquitectura TO-BE

## Objetivo

Mantener Yo-digital como producto web estático, sin backend propio ni tracking, pero con código fuente mantenible y responsabilidades separadas.

## Capas

- `src/domain/`: reglas puras, preguntas, señales, recomendaciones, métricas y frases de entrenamiento.
- `src/application/`: casos de uso y orquestación de consulta/entrenamiento, incluido el estado lógico del avatar.
- `src/infrastructure/`: adaptadores del navegador: Web Speech API, MediaRecorder, IndexedDB, Web Audio y exportación.
- `src/ui/`: renderizado, estilos y adaptadores puramente visuales.
- `src/main.js`: composición de dependencias.

Las capas internas no dependen de detalles del navegador. Los adaptadores implementan las capacidades externas necesarias.

## Avatar

El avatar es un punto de extensión explícito y no una dependencia de un proveedor concreto.

`AvatarController` mantiene únicamente el estado de interacción:

- `idle`;
- `listening`;
- `thinking`;
- `speaking`.

El controlador delega la representación en un renderer con el contrato `render({ state, previousState, context })`.

La implementación inicial `DomAvatarRenderer` ofrece una representación DOM estática de presencia y estado. Motores futuros —por ejemplo lip-sync local, vídeo generado o un proveedor externo— deberán implementarse detrás del mismo contrato o de una evolución compatible del puerto, evitando que el flujo de consulta conozca detalles de MuseTalk, HeyGen u otra tecnología.

La transición de estado se coordina desde la composición de la aplicación: el reconocimiento activa `listening`, la preparación de una respuesta puede activar `thinking` y los eventos reales del sintetizador activan/finalizan `speaking`.

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
- Avatar desacoplado de motores/proveedores concretos.
- Privacidad como restricción arquitectónica verificable.
- GitHub es la fuente de verdad de requisitos, decisiones, código y estado del producto.
