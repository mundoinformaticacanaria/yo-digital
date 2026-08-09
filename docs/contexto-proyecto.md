# Contexto operativo de Yo-digital

Este documento existe para que el proyecto pueda retomarse desde GitHub sin depender de memoria conversacional.

## Producto

**Nombre:** Yo-digital  
**Responsable de producto/cliente:** Xerach Hernández  
**Responsabilidad técnica:** delegada al gestor técnico del proyecto.

Yo-digital representa un consultor tecnológico digital orientado a clientes. El foco funcional es:

1. Desarrollo de aplicaciones a medida.
2. Recomendaciones de arquitectura y consultoría técnica.

## Restricciones y criterios acordados

- La experiencia debe seguir siendo sencilla, directa, responsive y de aspecto dark premium.
- La consultoría debe cualificar antes de recomendar: negocio, problema, volumen, stack actual y objetivo.
- No introducir backend, tracking ni envío de datos a terceros sin una decisión explícita del cliente.
- Cualquier servicio futuro de voz clonada se integrará solo cuando el cliente lo indique.
- Los cambios técnicos internos pueden decidirse de forma autónoma siempre que no impliquen coste, privacidad, seguridad o cambios relevantes de producto.
- Las decisiones relevantes deben quedar documentadas en GitHub.
- Las respuestas al cliente sobre avance deben ser breves; ampliar solo cuando se solicite.

## Estado heredado

La aplicación actual está contenida en un único `index.html` compilado con React 18.3.1 y CSS Tailwind generado. El archivo incluye tanto runtime/framework como lógica de producto.

La versión actual contiene:

- Dos modos: `app` y `arch`.
- Cinco preguntas por modo con variantes aleatorias.
- Motor heurístico local que genera diagnóstico, arquitectura, roadmap y siguientes pasos.
- SpeechRecognition/webkitSpeechRecognition configurado en `es-ES`.
- `speechSynthesis` para salida de voz.
- `MediaRecorder` para grabación.
- Waveform mediante Web Audio API + canvas.
- Persistencia local de muestras de voz en IndexedDB (`yo_digital_voice_v2`, store `samples`).
- Exportación de dataset de voz.
- Sin evidencia en el artefacto revisado de backend propio ni de llamadas `fetch()` de negocio.

## Precisión de privacidad

La aplicación no debe describirse como "sin almacenamiento" porque el modo entrenamiento guarda audios en IndexedDB. La formulación correcta actualmente es: chat sin persistencia de servidor; las grabaciones de entrenamiento se guardan únicamente de forma local en el navegador hasta que el usuario las borra o exporta.

## Estrategia de reconstrucción

1. Documentar comportamiento AS-IS.
2. Congelar requisitos de compatibilidad.
3. Reconstruir código fuente legible y modular.
4. Añadir tests al dominio y adaptadores sensibles.
5. Generar `index.html` como artefacto de build para GitHub Pages.
6. Solo después, evolucionar funcionalidades.

## Fuente de verdad

Orden de prioridad:

1. Código y documentación versionados en este repositorio.
2. Decisiones registradas en `docs/decisiones/`.
3. Comportamiento verificable de la versión publicada.
4. Conversaciones externas, solo como contexto temporal hasta que se documenten aquí.
