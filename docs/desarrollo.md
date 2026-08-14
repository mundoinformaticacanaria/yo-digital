# Desarrollo / Programador — Yo-digital

Última actualización: 2026-08-14

Este documento es el punto de entrada operativo para una persona que vaya a programar en Yo-digital. Debe permitir comenzar a trabajar con el contexto esencial sin depender de conversaciones externas.

## Ejecutor actual

Hasta que se incorpore un desarrollador dedicado, el Tech Lead ejecuta temporalmente también las issues de Desarrollo / Programador.

El proceso no cambia por esta acumulación temporal de funciones: toda tarea de desarrollo debe existir previamente como issue y llevar la etiqueta `PROGRAMADOR`. Cuando entre un desarrollador, asumirá estas issues sin necesidad de redefinir la gobernanza ni el contrato de ejecución.

## Antes de tocar código

1. Lee `README.md`.
2. Lee `docs/contexto-proyecto.md`.
3. Lee `docs/tech-lead.md`.
4. Revisa `docs/arquitectura-as-is.md`, `docs/arquitectura-to-be.md`, `docs/requisitos.md` y `docs/reglas-negocio.md` según el área que vayas a modificar.
5. Lee la issue asignada completa.
6. Confirma que la issue lleva la etiqueta `PROGRAMADOR`.
7. No amplíes el alcance de la issue de forma silenciosa. Si descubres trabajo adicional, comunícalo al Tech Lead para crear o ajustar la trazabilidad correspondiente.

## Regla principal de ejecución

No se desarrolla nada que no esté previamente identificado mediante una issue.

Una issue `PROGRAMADOR` es el contrato de trabajo del cambio: objetivo, alcance, criterios de aceptación y validaciones esperadas. El código, tests y documentación que se modifiquen deben poder relacionarse con ella.

## Producto y restricciones

Yo-digital es un consultor tecnológico digital orientado principalmente a:

- desarrollo de aplicaciones a medida;
- consultoría y arquitectura tecnológica.

Restricciones vigentes:

- aplicación web estática compatible con GitHub Pages;
- producción estable en `main` / raíz;
- sin backend propio ni tracking salvo decisión explícita;
- no enviar datos del usuario a terceros sin decisión explícita;
- privacidad por diseño;
- respuestas de consultoría no persistentes en servidor;
- grabaciones de entrenamiento almacenadas localmente en IndexedDB;
- datasets y audios biométricos privados nunca se suben al repositorio.

## Estado de la aplicación

Hay dos realidades que no deben confundirse:

### Producción heredada

`index.html` es actualmente el artefacto publicado y contiene el bundle heredado. No es la fuente mantenible que debe evolucionarse manualmente.

### Reconstrucción mantenible

La fuente legible vive en `src/` y la preview técnica en `preview/`. La reconstrucción no sustituirá producción hasta alcanzar equivalencia y validación suficientes.

No edites el bundle heredado como mecanismo ordinario para desarrollar nuevas funcionalidades.

## Arquitectura de código

- `src/domain/`: reglas puras, preguntas, señales, recomendaciones, métricas y datos de dominio.
- `src/application/`: casos de uso y orquestación de consultas/entrenamiento.
- `src/infrastructure/`: adaptadores del navegador, voz, MediaRecorder, IndexedDB, Web Audio y exportación.
- `src/ui/`: presentación y controladores de interfaz.
- `src/main.js`: composición de dependencias.

Regla de dependencia: el dominio y los casos de uso no deben quedar acoplados a APIs concretas del navegador. Los detalles externos se aíslan en adaptadores.

## Avatar y presencia visual

El flujo conversacional no debe depender de MuseTalk, HeyGen ni de ningún proveedor concreto.

- `src/application/avatar-controller.js` mantiene los estados `idle`, `listening`, `thinking` y `speaking`.
- El renderer de avatar implementa `render({ state, previousState, context })`.
- `src/ui/dom-avatar-renderer.js` es la implementación visual inicial para la preview.
- `src/main.js` coordina los estados con reconocimiento y síntesis de voz.

Si se incorpora un nuevo motor de avatar, debe adaptarse detrás de este punto de extensión. No introduzcas llamadas específicas de proveedor dentro de `ConsultationController`, `AppView` o lógica de dominio.

El contexto de `speaking` está preparado para evolucionar y transportar datos necesarios por futuros motores (por ejemplo una referencia de audio), sin que el resto de la aplicación conozca cómo se genera el vídeo.

### PoC MuseTalk

La primera evaluación de lip-sync fotorrealista sin coste recurrente está documentada en `docs/musetalk-poc.md` y corresponde a la issue #7.

Reglas durante la PoC:

- MuseTalk se instala en un workspace/entorno Python independiente del repositorio y de OpenVoice.
- No se añade MuseTalk como dependencia de runtime de Yo-digital hasta demostrar su viabilidad.
- Retratos, vídeos, WAV, frames, embeddings, cachés de avatar y resultados permanecen fuera de GitHub.
- Las métricas y conclusiones sí se documentan en GitHub.

### Audio necesario para lip-sync

El sintetizador actual basado en Web Speech API reproduce voz, pero no proporciona a la aplicación un fichero o stream de audio reutilizable.

Un motor como MuseTalk necesita audio como entrada. Por eso una integración real deberá respetar una secuencia equivalente a:

```text
texto → TTS que devuelve audio → motor de avatar → reproducción
```

No intentes resolver esta limitación acoplando MuseTalk a `ConsultationController`. Cuando la PoC visual sea viable, la capacidad de TTS que expone audio deberá tratarse mediante su propia issue y adaptador.

## Stack y comandos

Requisito: Node.js >= 20.

Instala dependencias solo si la issue lo requiere. El proyecto actual utiliza ES modules y scripts npm mínimos.

Validación estándar antes de dar una tarea por terminada:

```bash
npm run verify
```

Equivale a:

```bash
npm run check
npm test
```

Los tests usan `node:test`.

## Áreas sensibles

### Voz de consulta

- Entrada mediante `SpeechRecognition` / `webkitSpeechRecognition` en `es-ES`.
- La sesión de voz la termina el usuario mediante `Terminar voz` o automáticamente a los 60 segundos.
- Las pausas naturales no deben cerrar la intervención; el adaptador puede reiniciar el reconocimiento mientras la sesión siga activa.
- Antes de reconocer voz se cancela síntesis en curso para evitar conflictos observados en Chrome/Android.

### Entrenamiento de voz

- Grabación mediante `MediaRecorder`.
- Persistencia local mediante IndexedDB.
- Waveform mediante Web Audio API.
- Exportación ZIP con JSZip cuando esté disponible y fallback a descarga individual.
- No introducir audios reales, datasets privados, embeddings de voz ni otros artefactos biométricos en Git.

### Clonación de voz

Las PoC de motores de clonación son una línea experimental separada. OpenVoice V2 ya ha demostrado funcionamiento técnico local, pero no la naturalidad requerida. No integres un motor, servicio, secreto o flujo de datos biométricos en la aplicación sin una issue y las decisiones de producto/arquitectura correspondientes.

## Criterios de implementación

- Preserva comportamiento antes de refactorizarlo, salvo que la issue autorice el cambio funcional.
- Prefiere funciones y módulos pequeños con responsabilidades claras.
- Mantén lógica de negocio fuera del DOM y de APIs del navegador.
- Añade o actualiza tests cuando cambies reglas, casos de uso o adaptadores sensibles.
- No añadas dependencias por comodidad si la plataforma nativa resuelve el problema de forma suficiente.
- No hagas refactorizaciones oportunistas amplias dentro de una issue pequeña.
- Si detectas deuda técnica relevante, informa al Tech Lead para que quede registrada como issue.
- Si una decisión cambia arquitectura o establece un precedente duradero, debe documentarse mediante ADR.

## Finalización de una issue

Antes de entregar:

1. comprueba todos los criterios de aceptación;
2. ejecuta `npm run verify`;
3. realiza las validaciones manuales específicas de la issue;
4. revisa que no se hayan incluido secretos, datasets o artefactos privados;
5. actualiza documentación si el cambio modifica el sistema conocido;
6. informa de cualquier riesgo, limitación o trabajo descubierto que quede fuera de alcance.

Una tarea no está terminada únicamente porque compile o pase tests: debe satisfacer la issue y dejar el repositorio en un estado comprensible para la siguiente persona.

## Producción y despliegue

`main` representa el estado estable del repositorio y GitHub Pages publica desde `main` / raíz. Durante la reconstrucción, la preview modular se mantiene separada de la producción heredada.

No sustituyas `index.html` ni promociones la reconstrucción a producción salvo que una issue lo contemple explícitamente y el Tech Lead haya validado las condiciones de promoción.

## Dónde buscar contexto

- Estado de reconstrucción: `docs/estado-reconstruccion.md`.
- Roadmap: `docs/roadmap.md`.
- Decisiones: `docs/decisiones/` y `docs/adr/`.
- Incidencias técnicas documentadas: `docs/incidencias/`.
- Experimentos de voz: documentación `docs/*voice*` y ADR relacionados.
- Experimento de avatar/lip-sync: `docs/musetalk-poc.md`.

Ante una contradicción entre documentación y código, no elijas silenciosamente una versión: comunícalo al Tech Lead y trátalo como una discrepancia que debe quedar trazada.
