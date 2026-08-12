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
- Cadena de dependencia confirmada: `myshell-openvoice` → `faster-whisper==0.9.0` → `av>=10.dev0,<11.dev0`; el resolver selecciona `av==10.0.0` y en este entorno necesita compilarse desde fuente.
- `pkg-config` instalado correctamente.
- Segundo intento: PyAV detectó que faltaban las librerías de desarrollo FFmpeg `avformat`, `avcodec`, `avdevice`, `avutil`, `avfilter`, `swscale` y `swresample`.
- El primer intento de instalar esas librerías falló por índices APT obsoletos con varios errores 404; se corrigió con `sudo apt update`.
- Librerías de desarrollo FFmpeg instaladas correctamente: `libavformat-dev`, `libavcodec-dev`, `libavdevice-dev`, `libavutil-dev`, `libavfilter-dev`, `libswscale-dev` y `libswresample-dev`.
- Tercer intento: PyAV 10.0.0 llega ya a Cython, pero falla en `av/logging.pyx` por incompatibilidad de firmas `except`/`noexcept` al compilar con Cython 3.
- Causa confirmada en el código oficial de PyAV 10.0.0: su `pyproject.toml` declara `cython` sin fijar versión, por lo que un build aislado actual puede recibir Cython 3. El propio proyecto PyAV resolvió posteriormente el soporte de Cython 3 en PR #1145; durante esa corrección se validó explícitamente que Cython 0.29.36 compilaba el código anterior.
- Estrategia conservadora: mantener primero las versiones que exige OpenVoice (`faster-whisper==0.9.0` y `av==10.0.0`), instalar Cython 0.29.36 en el `.venv` y construir PyAV sin aislamiento para evitar que el build vuelva a introducir Cython 3. No se actualizará `av`/`faster-whisper` hasta demostrar que esta ruta upstream-compatible no funciona.

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

1. WSL2: validado por kernel `6.6.87.2-microsoft-standard-WSL2`.
2. GPU/driver desde Ubuntu: validado con `nvidia-smi`.
3. Distribución: Ubuntu 24.04.4 LTS (`noble`) confirmada.
4. Python del sistema: 3.12.3; no se modificará.
5. Python aislado 3.9.25: instalado correctamente con `uv`.
6. `uv` 0.12.3 está instalado y operativo.
7. Directorio y `.venv` aislados de la PoC: creados, activados y validados.
8. Git 2.43.0: disponible.
9. Repositorio oficial `myshell-ai/OpenVoice`: clonado correctamente.
10. Dependencias de sistema necesarias para compilar PyAV (`pkg-config` + librerías FFmpeg de desarrollo): instaladas.
11. Fijar Cython 0.29.36 dentro del `.venv` para compilar el PyAV 10.0.0 heredado por `faster-whisper==0.9.0`.
12. Construir/instalar PyAV 10.0.0 sin aislamiento y, si funciona, reanudar `uv pip install -e .`.
13. Instalar MeloTTS y descargar UniDic para V2, según la guía oficial.
14. Descargar checkpoints V2 y probar inferencia CUDA midiendo VRAM real.
15. Si aparece `CUDA out of memory`, repetir el mismo flujo en CPU antes de descartar OpenVoice.
16. No probar Chatterbox en GPU hasta tener una línea base funcional y mediciones reales.

No se paga ElevenLabs antes de medir calidad, similitud y rendimiento con OpenVoice.

## Arquitectura de PoC

1. Dataset de voz permanece fuera de GitHub.
2. Ejecutar clonación/inferencia local en el equipo del propietario.
3. Generar exactamente las mismas frases de prueba con cada motor.
4. Comparar similitud, naturalidad, ritmo, pronunciación canaria/española, tiempo de generación y consumo de RAM/VRAM.
5. Solo después de validar calidad se decidirá cómo servir TTS dinámico al sitio público.

## Próximo paso operativo

Guiar al propietario de uno en uno. El siguiente paso es instalar Cython 0.29.36, `setuptools` y `wheel` dentro del `.venv` activo. Después se intentará instalar `av==10.0.0` con `--no-build-isolation`, para impedir que el build aislado vuelva a usar Cython 3.
