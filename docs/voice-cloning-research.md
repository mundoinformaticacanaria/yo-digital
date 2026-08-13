# Investigación de clonación de voz local/gratuita

Última actualización: 2026-08-13

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
Checkpoints oficiales en Hugging Face: https://huggingface.co/myshell-ai/OpenVoiceV2

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
- Arquitectura GPU: Pascal; compute capability 6.1 (`sm_61`).
- Driver NVIDIA visible desde WSL: 582.28.
- `nvidia-smi` visible y operativo dentro de Ubuntu.
- `nvidia-smi` informa `CUDA Version: 13.0`; este valor indica la versión CUDA máxima soportada por el driver, no demuestra que exista un CUDA Toolkit 13.0 instalado dentro de Ubuntu.
- Python del sistema: 3.12.3; no se modifica.
- `uv` 0.12.3 instalado para el usuario.
- Python aislado 3.9.25 instalado mediante `uv`.
- Directorio local de PoC: `~/yo-digital-voice-poc`.
- Entorno virtual: `~/yo-digital-voice-poc/.venv`.
- Repositorio oficial `myshell-ai/OpenVoice` clonado en `~/yo-digital-voice-poc/OpenVoice`.
- Espacio libre comprobado antes de checkpoints: ~942 GB.

## Estado de instalación de OpenVoice V2

- Primer `uv pip install -e .`: falló compilando `av==10.0.0` porque faltaba `pkg-config`.
- Cadena original: `myshell-openvoice` → `faster-whisper==0.9.0` → PyAV 10.
- Se instalaron `pkg-config` y las librerías de desarrollo FFmpeg requeridas.
- PyAV 10.0.0 no es viable con FFmpeg 6.1 del Ubuntu 24.04 actual por APIs eliminadas (`AVFMT_FLAG_PRIV_OPT`). No se degradó FFmpeg del sistema.
- Se adoptó `faster-whisper==1.0.0` + `av==11.0.0` como compatibilidad local.
- OpenVoice se instaló editable mediante `uv pip install -e . --no-deps` para evitar que el pin histórico fuerce `faster-whisper==0.9.0`.
- Se instalaron manualmente las restantes dependencias declaradas por OpenVoice.
- La primera prueba de imports falló porque `librosa==0.9.1` usa `pkg_resources` y Setuptools 82 lo eliminó. Se bajó Setuptools y los imports reales de OpenVoice pasaron correctamente.
- FFmpeg 6.1.1 quedó instalado como ejecutable de sistema para Pydub.
- MeloTTS quedó instalado desde `myshell-ai/MeloTTS`.
- UniDic 3.1.0+2021-08-31 se descargó correctamente (~526 MB).

## Checkpoints V2

- El enlace S3 todavía citado en la documentación oficial (`myshell-public-repo-host.s3.amazonaws.com/openvoice/checkpoints_v2_0417.zip`) devolvió un XML `NoSuchBucket`; el archivo descargado tenía solo 314 bytes y no era un ZIP válido.
- Se usó como alternativa el repositorio oficial de MyShell en Hugging Face: `myshell-ai/OpenVoiceV2`.
- Descarga realizada con `huggingface_hub.snapshot_download`, limitada a `base_speakers/**` y `converter/**`.
- Se descargaron 14 archivos correctamente, incluido `converter/checkpoint.pth` (~131 MB), `converter/config.json` y los embeddings de base speakers, incluido `base_speakers/ses/es.pth`.
- Directorio local resultante: `checkpoints_v2`.

## PyTorch y CUDA en GTX 1060

- MeloTTS instaló inicialmente `torch==2.8.0+cu128`.
- Esa build detectaba la GTX 1060 pero advertía que solo soportaba capacidades CUDA `sm_70` o superiores; la GTX 1060 es `sm_61`.
- Se sustituyó únicamente la variante CUDA por `torch==2.8.0+cu126` desde el índice oficial de PyTorch.
- Resultado validado:
  - `torch=2.8.0+cu126`
  - `torch.version.cuda=12.6`
  - `torch.cuda.is_available()=True`
  - GPU: `NVIDIA GeForce GTX 1060 3GB`
  - capability: `(6, 1)`
  - creación real de `torch.tensor([1.0], device='cuda')`: OK.
- La reinstalación de PyTorch alteró `networkx` y `markupsafe`; se restauraron `networkx==2.8.8` y `markupsafe==2.1.5`.
- Setuptools quedó finalmente en `78.1.0`, compatible con el uso actual de `pkg_resources` por `librosa==0.9.1`.
- `uv pip check` vuelve a mostrar una única incompatibilidad conocida e intencional: `myshell-openvoice` declara `faster-whisper==0.9.0`, mientras el entorno usa `1.0.0` para mantener PyAV 11/FFmpeg 6.1.
- Tras cambiar Torch a CUDA 12.6, `torchaudio` seguía compilado para CUDA 12.8 y MeloTTS falló al importar. Se reinstaló `torchaudio==2.8.0` desde el índice oficial CUDA 12.6 para alinear ambos paquetes.

## Pruebas reales de carga CUDA

- `ToneColorConverter` de OpenVoice V2 cargado correctamente en `cuda:0` con `converter/checkpoint.pth`:
  - memoria asignada tras carga: ~135.4 MB;
  - reservada: ~280.0 MB;
  - pico: ~262.5 MB.
- MeloTTS español cargado correctamente en `cuda:0` y descargó su checkpoint (~208 MB):
  - speaker disponible: `{'ES': 0}`;
  - memoria asignada tras carga: ~200.8 MB;
  - reservada: ~406.0 MB;
  - pico: ~401.6 MB.
- MeloTTS español + ToneColorConverter cargados simultáneamente en la GTX 1060:
  - memoria asignada: ~336.2 MB;
  - reservada: ~482.0 MB;
  - pico de carga: ~463.3 MB.
- Conclusión de esta fase: los 3 GB de VRAM no son un impedimento para mantener simultáneamente los dos modelos necesarios para el flujo OpenVoice V2. Queda por medir el pico durante inferencia real y conversión de voz.

## ¿Usar el teléfono como host de la PoC?

Aunque un teléfono moderno puede tener más RAM que este PC y disponer de NPU/GPU móvil potente, para esta PoC no se considera la plataforma preferente.

Razones técnicas:

- OpenVoice V2 documenta oficialmente un entorno Linux/Python/PyTorch; Windows aparece mediante guías comunitarias y no hay una ruta oficial Android.
- Chatterbox documenta `cuda`, `cpu` y `mps`, pero no una ruta Android/Adreno.
- Una GPU móvil Adreno no ofrece CUDA, por lo que no puede aprovechar directamente el camino de aceleración NVIDIA pensado por estos proyectos.
- Portar los modelos a ONNX/ExecuTorch/NNAPI u otra pila móvil sería un proyecto adicional de optimización y compatibilidad, no una PoC rápida de calidad de voz.

Conclusión: el PC Windows 11 con Ubuntu bajo WSL sigue siendo la plataforma de validación.

## Decisión actual

Primera PoC: `OpenVoice V2`.

Estrategia actual:

1. WSL2, Ubuntu, Python aislado y GPU: validados.
2. OpenVoice, FFmpeg, MeloTTS y UniDic: instalados.
3. Checkpoints V2 oficiales: descargados correctamente desde Hugging Face.
4. PyTorch/TorchAudio CUDA 12.6 compatibles con la GTX 1060: validados mediante ejecución real y carga de modelos.
5. Entorno Python: solo conserva el conflicto intencional de metadatos `faster-whisper 1.0.0` frente al pin `0.9.0` de OpenVoice.
6. OpenVoice y MeloTTS pueden coexistir en GPU con un pico de carga de ~463 MB, muy por debajo de los 3 GB disponibles.
7. Siguiente prueba: generar audio español real con MeloTTS y medir pico/tiempo de inferencia.
8. Después: extraer la embedding de una referencia privada y ejecutar la primera conversión de voz OpenVoice.
9. No probar Chatterbox ni pagar ElevenLabs hasta tener esta línea base medida.

## Arquitectura de PoC

1. Dataset de voz permanece fuera de GitHub.
2. Ejecutar clonación/inferencia local en el equipo del propietario.
3. Generar exactamente las mismas frases de prueba con cada motor.
4. Comparar similitud, naturalidad, ritmo, pronunciación canaria/española, tiempo de generación y consumo de RAM/VRAM.
5. Solo después de validar calidad se decidirá cómo servir TTS dinámico al sitio público.

## Próximo paso operativo

Guiar al propietario de uno en uno. La carga simultánea de MeloTTS español y OpenVoice V2 funciona en CUDA con amplio margen de VRAM. El siguiente paso es ejecutar una síntesis española real con MeloTTS, guardar el WAV base y medir tiempo y pico de VRAM antes de introducir el audio privado de referencia.
