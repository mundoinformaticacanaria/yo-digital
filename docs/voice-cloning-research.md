# Investigación de clonación de voz local/gratuita

Última actualización: 2026-08-12

## Objetivo

Encontrar una alternativa gratuita o local a ElevenLabs para generar la voz de Yo-digital sin publicar el dataset biométrico ni introducir una suscripción recurrente durante la fase de validación.

## Candidatos evaluados

### 1. Chatterbox Multilingual V3 — candidato de mayor calidad, sujeto a hardware

Repositorio oficial: https://github.com/resemble-ai/chatterbox
Modelo general: https://huggingface.co/ResembleAI/chatterbox
Modelo específico España: https://huggingface.co/ResembleAI/Chatterbox-Multilingual-es-es

Motivos:

- Código y modelos publicados con licencia MIT.
- Voice cloning mediante un audio de referencia.
- Soporte oficial de español.
- Existe un modelo específico `es-ES`, orientado a español de España.
- El modelo general soporta ejecución `cuda`, `cpu` y `mps` en el código oficial actual.
- V3 prioriza mayor similitud de hablante, menor alucinación y habla más natural que las versiones previas.
- El modelo oficial incluye watermarking de audio.

Limitaciones:

- Los assets del modelo específico `es-ES` ocupan varios GB.
- Para una experiencia interactiva razonable es preferible GPU.
- Con 3 GB de VRAM no se asume que el modelo completo vaya a caber de forma cómoda en GPU.
- CPU es una ruta posible en el código actual, pero con 8 GB de RAM se considera una prueba de compatibilidad/rendimiento, no una plataforma objetivo garantizada.
- GitHub Pages no puede ejecutar este modelo directamente: la síntesis dinámica necesitará un proceso local o un backend de inferencia.

### 2. OpenVoice V2 — primera PoC recomendada para hardware modesto

Repositorio oficial: https://github.com/myshell-ai/OpenVoice
Uso oficial: https://github.com/myshell-ai/OpenVoice/blob/main/docs/USAGE.md

Motivos:

- MIT; uso comercial permitido explícitamente por el proyecto.
- Clonación instantánea a partir de un clip corto.
- Español soportado de forma nativa en V2.
- Control de tono, acento, ritmo, pausas e intonación.
- Arquitectura más apropiada como primera prueba si el equipo tiene poca VRAM/RAM.

Limitaciones:

- Menor foco actual que Chatterbox en calidad conversacional moderna.
- Instalación V2 depende también de MeloTTS.
- La instalación oficial está documentada para Linux; Windows tiene guías comunitarias.
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

## Hardware confirmado

- Sistema host: Windows 11.
- Entorno Linux disponible: Ubuntu bajo WSL/WSL2 (confirmado visualmente desde el Explorador de archivos de Windows; versión exacta de WSL pendiente de comprobar).
- RAM: 8 GB.
- GPU: NVIDIA GeForce GTX 1060 3GB.
- VRAM dedicada: 3 GB.
- Arquitectura GPU: Pascal; compute capability 6.1.
- CPU: pendiente, no bloquea la primera prueba.

NVIDIA mantiene Pascal / compute capability 6.x dentro de CUDA 12.x, pero la arquitectura queda fuera de la línea futura posterior; para esta PoC se priorizará una versión de PyTorch/CUDA compatible con Pascal en lugar de instalar ciegamente la versión CUDA más reciente.

## ¿Usar el teléfono como host de la PoC?

Aunque un teléfono moderno puede tener más RAM que este PC y disponer de NPU/GPU móvil potente, para esta PoC no se considera la plataforma preferente.

Razones técnicas:

- OpenVoice V2 documenta oficialmente un entorno Linux/Python/PyTorch; Windows aparece mediante guías comunitarias y no hay una ruta oficial Android.
- Chatterbox documenta `cuda`, `cpu` y `mps`, pero no una ruta Android/Adreno.
- Una GPU móvil Adreno no ofrece CUDA, por lo que no puede aprovechar directamente el camino de aceleración NVIDIA pensado por estos proyectos.
- Portar los modelos a ONNX/ExecuTorch/NNAPI u otra pila móvil sería un proyecto adicional de optimización y compatibilidad, no una PoC rápida de calidad de voz.

Conclusión: aunque el teléfono pudiera superar al PC en algunas métricas generales de CPU/RAM, el PC Windows 11 con Ubuntu bajo WSL sigue siendo la plataforma más útil para validar OpenVoice/Chatterbox debido al ecosistema Python/PyTorch/CUDA. El móvil se reconsiderará más adelante solo si queremos inferencia completamente local en Android.

## Decisión actual

Primera PoC: `OpenVoice V2`.

Estrategia de ejecución para GTX 1060 3GB:

1. Confirmar que Ubuntu se ejecuta bajo WSL2 y que abre correctamente una terminal.
2. Validar desde Ubuntu/WSL2 que la GPU y el driver NVIDIA son visibles con `nvidia-smi`.
3. Usar Python 3.9, como recomienda la guía oficial de OpenVoice.
4. Empezar con una combinación PyTorch/CUDA que conserve compatibilidad Pascal; CUDA 11.8 es la opción conservadora inicial.
5. Probar inferencia CUDA y medir VRAM real.
6. Si aparece `CUDA out of memory`, repetir el mismo flujo en CPU antes de descartar OpenVoice.
7. No probar Chatterbox en GPU hasta tener una línea base funcional y mediciones reales.

No se paga ElevenLabs antes de medir calidad, similitud y rendimiento con OpenVoice.

## Arquitectura de PoC

1. Dataset de voz permanece fuera de GitHub.
2. Ejecutar clonación/inferencia local en el equipo del propietario.
3. Generar exactamente las mismas frases de prueba con cada motor.
4. Comparar similitud, naturalidad, ritmo, pronunciación canaria/española, tiempo de generación y consumo de RAM/VRAM.
5. Solo después de validar calidad se decidirá cómo servir TTS dinámico al sitio público.

## Próximo paso operativo

Guiar al propietario de uno en uno. Primer paso: abrir la aplicación `Ubuntu` desde el menú Inicio de Windows. No instalar ni ejecutar más comandos hasta verificar que la terminal Ubuntu abre correctamente.
