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
- Entorno Linux disponible: Ubuntu 24.04.4 LTS (`noble`) bajo WSL2.
- Kernel WSL2 confirmado: `6.6.87.2-microsoft-standard-WSL2`.
- RAM: 8 GB.
- GPU: NVIDIA GeForce GTX 1060 3GB.
- VRAM dedicada: 3072 MiB.
- Arquitectura GPU: Pascal; compute capability 6.1.
- Driver NVIDIA visible desde WSL: 582.28.
- `nvidia-smi` visible y operativo dentro de Ubuntu.
- `nvidia-smi` informa `CUDA Version: 13.0`; este valor indica la versión CUDA máxima soportada por el driver, no demuestra que exista un CUDA Toolkit 13.0 instalado dentro de Ubuntu.
- En la comprobación inicial había ~1167 MiB de VRAM ocupada y ~2 % de uso de GPU; `nvidia-smi` no mostró procesos Linux en ejecución.
- Python del sistema: 3.12.3.
- `uv` 0.12.3 instalado para el usuario en `/home/xerach/.local/bin` mediante el instalador oficial y validado desde la shell actual.
- Python aislado 3.9.25 instalado correctamente mediante `uv python install 3.9`.
- Directorio local de PoC creado: `~/yo-digital-voice-poc`.
- Entorno virtual creado dentro de la PoC: `~/yo-digital-voice-poc/.venv`, basado en CPython 3.9.25, activado y validado con `python --version`.
- Git disponible: 2.43.0.
- Repositorio oficial `myshell-ai/OpenVoice` clonado correctamente en `~/yo-digital-voice-poc/OpenVoice`.
- CPU: pendiente, no bloquea la primera prueba.

La validación de `nvidia-smi`, del kernel, de Ubuntu, de Python, de `uv` y de Git confirma que el entorno de PoC es Windows 11 + Ubuntu 24.04.4 LTS sobre WSL2, con la GPU expuesta correctamente al entorno Linux. No se instalarán drivers NVIDIA dentro de WSL y no se sustituirá el Python 3.12 del sistema.

## Estado de instalación de OpenVoice V2

- Primer `uv pip install -e .`: falló compilando `av==10.0.0` porque faltaba `pkg-config`.
- Cadena de dependencia original: `myshell-openvoice` → `faster-whisper==0.9.0` → `av>=10.dev0,<11.dev0`; el resolver selecciona `av==10.0.0`.
- `pkg-config` y las librerías de desarrollo FFmpeg (`libavformat-dev`, `libavcodec-dev`, `libavdevice-dev`, `libavutil-dev`, `libavfilter-dev`, `libswscale-dev`, `libswresample-dev`) quedaron instaladas correctamente.
- PyAV 10.0.0 falló primero con Cython 3; se fijó Cython 0.29.36 y se repitió sin aislamiento.
- Con Cython 0.29.36, PyAV 10.0.0 avanzó hasta compilar contra FFmpeg 6.1, pero falló porque `AVFMT_FLAG_PRIV_OPT` ya no existe en esa versión de FFmpeg. Por tanto, PyAV 10 no es una combinación viable con el FFmpeg 6.1 del Ubuntu 24.04 actual sin parchear o degradar FFmpeg.
- Se eligió la ruta menos invasiva para el sistema: mantener Ubuntu/FFmpeg actual y probar `faster-whisper==1.0.0`, que depende de `av==11.*`, en lugar de degradar FFmpeg del sistema.
- `uv pip install "faster-whisper==1.0.0"` completó correctamente.
- Estado confirmado tras esa instalación: `faster-whisper==1.0.0`, `av==11.0.0`, `ctranslate2==4.8.1`, `onnxruntime==1.19.2`, `tokenizers==0.13.3`, entre otras dependencias.
- El `setup.py` oficial de OpenVoice sigue fijando `faster-whisper==0.9.0`, por lo que no se debe ejecutar de nuevo `uv pip install -e .` con resolución normal: volvería a intentar degradar `faster-whisper` y PyAV.
- Próxima estrategia: instalar el paquete OpenVoice editable con `--no-deps`, conservando `faster-whisper==1.0.0`/`av==11.0.0`; después instalar manualmente las demás dependencias declaradas por OpenVoice y validar imports antes de continuar con MeloTTS.

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

1. WSL2, GPU, Ubuntu y Python aislado: validados.
2. OpenVoice clonado en `~/yo-digital-voice-poc/OpenVoice`.
3. Dependencias de sistema para PyAV/FFmpeg: instaladas.
4. PyAV 10 descartado en este Ubuntu por incompatibilidad con FFmpeg 6.1 (`AVFMT_FLAG_PRIV_OPT`).
5. `faster-whisper==1.0.0` + `av==11.0.0`: instalados correctamente.
6. Instalar OpenVoice editable con `--no-deps` para evitar que su pin histórico fuerce `faster-whisper==0.9.0`.
7. Instalar manualmente el resto de dependencias de OpenVoice y validar imports.
8. Instalar MeloTTS y descargar UniDic para V2, según la guía oficial.
9. Descargar checkpoints V2 y probar inferencia CUDA midiendo VRAM real.
10. Si aparece `CUDA out of memory`, repetir el mismo flujo en CPU antes de descartar OpenVoice.
11. No probar Chatterbox en GPU hasta tener una línea base funcional y mediciones reales.

No se paga ElevenLabs antes de medir calidad, similitud y rendimiento con OpenVoice.

## Arquitectura de PoC

1. Dataset de voz permanece fuera de GitHub.
2. Ejecutar clonación/inferencia local en el equipo del propietario.
3. Generar exactamente las mismas frases de prueba con cada motor.
4. Comparar similitud, naturalidad, ritmo, pronunciación canaria/española, tiempo de generación y consumo de RAM/VRAM.
5. Solo después de validar calidad se decidirá cómo servir TTS dinámico al sitio público.

## Próximo paso operativo

Guiar al propietario de uno en uno. Siguiente paso: desde `~/yo-digital-voice-poc/OpenVoice` con el `.venv` activo, ejecutar `uv pip install -e . --no-deps`. No volver a usar la resolución normal de dependencias mientras OpenVoice siga fijando `faster-whisper==0.9.0`.
