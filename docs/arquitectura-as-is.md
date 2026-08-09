# Arquitectura AS-IS

## Resumen

La versión heredada es una SPA empaquetada dentro de un único `index.html`. Incluye React, estilos Tailwind compilados, lógica de negocio, acceso a APIs del navegador y UI.

## Bloques funcionales

### 1. Interfaz
- Hero/cabecera dark premium.
- Selector de modo `App a medida` / `Consultoría`.
- Chat guiado.
- Progreso de 5 preguntas.
- Panel de recomendación final.
- Panel opcional de entrenamiento de voz.

### 2. Flujo de consultoría
- Banco de cinco preguntas por modo.
- Cada pregunta tiene variantes aleatorias.
- Las respuestas se mantienen en memoria de la sesión.
- Tras la quinta respuesta se ejecuta el motor local de recomendación.

### 3. Motor de recomendación
Motor determinista basado en texto y expresiones regulares. Detecta señales como:
- volumen/escala;
- legado/Excel/WordPress/monolito;
- tiempo real/notificaciones/reservas;
- SaaS/B2B/multitenancy.

Con esas señales compone diagnóstico, arquitectura, roadmap y siguientes pasos mediante plantillas predefinidas.

No se ha identificado un LLM detrás del diagnóstico actual.

### 4. Voz conversacional
- `SpeechRecognition` o `webkitSpeechRecognition`.
- Idioma `es-ES`.
- Reconocimiento no continuo con resultados intermedios.
- `speechSynthesis` para leer respuestas.

### 5. Entrenamiento de voz
- `getUserMedia` para micrófono.
- `MediaRecorder` con negociación de MIME.
- Web Audio API para waveform.
- Persistencia local con IndexedDB.
- Base: `yo_digital_voice_v2`.
- Object store: `samples`.
- Alta, listado, borrado individual y borrado total de muestras.
- Exportación del dataset desde el navegador.

## Problemas estructurales

- Lógica de dominio mezclada con UI y APIs del navegador.
- Código minificado sin fuente legible versionada.
- Dependencia del bundle como fuente de mantenimiento.
- Motor de reglas difícil de probar o ampliar de forma segura.
- Persistencia local y privacidad acopladas a componentes UI.
- El título HTML heredado sigue siendo `React Artifact`.

## Riesgo principal

El riesgo no es funcional sino de mantenibilidad: modificar directamente el bundle puede introducir regresiones difíciles de detectar.

## Arquitectura objetivo

Separar progresivamente:

- `domain/`: preguntas, respuestas, señales, diagnóstico y recomendación.
- `application/`: casos de uso y orquestación de sesión.
- `infrastructure/`: SpeechRecognition, speechSynthesis, MediaRecorder, IndexedDB y exportación.
- `ui/`: componentes y estado de presentación.
- `config/`: textos, variantes y configuración.

`index.html` será un artefacto generado y no la fuente principal de desarrollo.
