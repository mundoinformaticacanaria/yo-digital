# Investigación de clonación de voz local/gratuita

Última actualización: 2026-08-11

## Objetivo

Encontrar una alternativa gratuita o local a ElevenLabs para generar la voz de Yo-digital sin publicar el dataset biométrico ni introducir una suscripción recurrente durante la fase de validación.

## Candidatos evaluados

### 1. Chatterbox Multilingual V3 — candidato principal

Repositorio oficial: https://github.com/resemble-ai/chatterbox
Modelo general: https://huggingface.co/ResembleAI/chatterbox
Modelo específico España: https://huggingface.co/ResembleAI/Chatterbox-Multilingual-es-es

Motivos:

- Código y modelos publicados con licencia MIT.
- Voice cloning mediante un audio de referencia.
- Soporte oficial de español.
- Existe un modelo específico `es-ES`, orientado a español de España.
- El modelo general es de 0.5B parámetros y soporta ejecución `cuda`, `cpu` y `mps` según el repositorio oficial.
- V3 prioriza mayor similitud de hablante, menor alucinación y habla más natural que las versiones previas.
- El modelo oficial incluye watermarking de audio.

Limitaciones:

- Los assets del modelo específico `es-ES` ocupan varios GB.
- Para una experiencia interactiva razonable es preferible GPU; CPU es posible pero debe medirse en el hardware real.
- GitHub Pages no puede ejecutar este modelo directamente: la síntesis dinámica necesitará un proceso local o un backend de inferencia.

### 2. OpenVoice V2 — fallback ligero y comercialmente permisivo

Repositorio oficial: https://github.com/myshell-ai/OpenVoice
Uso oficial: https://github.com/myshell-ai/OpenVoice/blob/main/docs/USAGE.md

Motivos:

- MIT; uso comercial permitido explícitamente por el proyecto.
- Clonación instantánea a partir de un clip corto.
- Español soportado de forma nativa en V2.
- Control de tono, acento, ritmo, pausas e intonación.
- Arquitectura útil como fallback si Chatterbox resulta demasiado pesado.

Limitaciones:

- Menor foco actual que Chatterbox en calidad conversacional moderna.
- Instalación V2 depende también de MeloTTS.
- Igual que Chatterbox, no puede ejecutarse directamente desde GitHub Pages como solución dinámica completa.

### 3. F5-TTS — descartado para Yo-digital comercial

Repositorio oficial: https://github.com/SWivid/F5-TTS

- El código es MIT.
- Sin embargo, los modelos preentrenados oficiales están bajo CC-BY-NC debido al dataset de entrenamiento.
- Por ello no se selecciona como base de un producto comercial.

### 4. GPT-SoVITS — no seleccionado como primera opción

Repositorio oficial: https://github.com/RVC-Boss/GPT-SoVITS

- MIT y muy potente para few-shot/zero-shot.
- El README oficial destaca 5 s para zero-shot y 1 min para few-shot.
- El soporte lingüístico documentado oficialmente no presenta español como objetivo principal, por lo que no es la primera opción para Yo-digital.

### 5. Fish Speech — descartado de momento

Repositorio oficial: https://github.com/fishaudio/fish-speech

- Proyecto técnicamente interesante y multilingüe.
- Pesos sujetos a FISH AUDIO RESEARCH LICENSE, menos adecuada para una futura explotación comercial sencilla que MIT.

## Decisión provisional

Primera PoC: `Chatterbox Multilingual V3`, priorizando el modelo `es-ES`.

Fallback: `OpenVoice V2`.

No se paga ElevenLabs antes de medir calidad, similitud y rendimiento con estas dos alternativas.

## Arquitectura de PoC

1. Dataset de voz permanece fuera de GitHub.
2. Ejecutar clonación/inferencia local en el equipo del propietario.
3. Generar frases de prueba y comparar similitud, naturalidad, ritmo y pronunciación canaria/española.
4. Solo después de validar calidad se decidirá cómo servir TTS dinámico al sitio público.

## Dato pendiente para continuar

Especificaciones del equipo donde se ejecutará la PoC: CPU, RAM y especialmente GPU/VRAM. Ese dato determina si se prueba primero Chatterbox V3 en GPU, en CPU o si conviene arrancar con OpenVoice V2.
