# PoC local de MuseTalk 1.5

Última actualización: 2026-08-14

## Objetivo

Validar si MuseTalk 1.5 puede proporcionar lip-sync fotorrealista para Yo-digital con **coste recurrente 0 €**, ejecutando la inferencia en hardware local y sin integrar todavía el motor en producción.

Esta PoC pertenece a la issue #7. El material biométrico utilizado para probarla permanece fuera de GitHub.

## Línea base oficial

La PoC parte de la implementación oficial `TMElyralab/MuseTalk` y no de forks de terceros.

Baseline recomendado por el proyecto oficial:

- MuseTalk 1.5.
- Python 3.10.
- CUDA 11.7 como recomendación de entorno; los wheels oficiales documentados de PyTorch utilizan CUDA 11.8.
- PyTorch 2.0.1, torchvision 0.15.2 y torchaudio 2.0.2.
- FFmpeg disponible en el sistema.
- Dependencias fijadas por `requirements.txt` y paquetes MMLab indicados en el README oficial.
- Inferencia normal y realtime soportadas por `inference.sh`.
- Realtime configurado a 25 fps; el proyecto recomienda material de entrada a 25 fps.

MuseTalk declara 30 fps o más en una NVIDIA Tesla V100. Esa referencia **no debe extrapolarse** a nuestro equipo.

El propio proyecto oficial indica como hardware mínimo que ha probado para su demo una RTX 3050 Ti Laptop de 4 GB; en fp16, un vídeo de 8 segundos tarda aproximadamente 5 minutos en ese escenario. Nuestro hardware objetivo —GTX 1060 de 3 GB— tiene menos VRAM y es anterior, por lo que la viabilidad debe demostrarse empíricamente y no asumirse.

## Hardware objetivo

- Windows 11.
- WSL2 / Debian.
- NVIDIA GeForce GTX 1060 3 GB.
- 8 GB RAM.

## Restricciones de privacidad

No se almacenarán en este repositorio:

- fotografía o vídeo fuente del propietario;
- clips de audio privados;
- embeddings o cachés derivados de identidad;
- frames intermedios;
- vídeos generados por la PoC.

Se recomienda un workspace separado, por ejemplo:

```text
~/yo-digital-labs/MuseTalk/
~/yo-digital-private/avatar/
~/yo-digital-private/audio/
~/yo-digital-private/results/
```

El repositorio `yo-digital` solo contiene documentación, scripts de diagnóstico no biométricos y resultados numéricos resumidos.

## Fase 0 — Diagnóstico del equipo

Ejecutar desde WSL2/Debian:

```bash
nvidia-smi
python3 --version
free -h
df -h .
ffmpeg -version
```

También puede utilizarse:

```bash
bash scripts/musetalk-poc/system-report.sh
```

Registrar:

- modelo y driver NVIDIA;
- VRAM total/libre;
- RAM disponible;
- versión de Python;
- disponibilidad de FFmpeg;
- versión de PyTorch/CUDA si ya existe en el entorno.

## Fase 1 — Entorno aislado

No reutilizar el entorno de OpenVoice. MuseTalk debe vivir en un entorno independiente para evitar conflictos de Python, PyTorch o dependencias multimedia.

Ejemplo siguiendo la guía oficial:

```bash
mkdir -p ~/yo-digital-labs
cd ~/yo-digital-labs
git clone https://github.com/TMElyralab/MuseTalk.git
cd MuseTalk
git rev-parse HEAD

conda create -n musetalk-yo-digital python==3.10 -y
conda activate musetalk-yo-digital

pip install torch==2.0.1 torchvision==0.15.2 torchaudio==2.0.2 \
  --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt
pip install --no-cache-dir -U openmim
mim install mmengine
mim install "mmcv==2.0.1"
mim install "mmdet==3.1.0"
mim install "mmpose==1.1.0"
```

Después descargar los modelos con el script oficial:

```bash
sh ./download_weights.sh
```

Antes de seguir, guardar en este documento o en el comentario de la issue #7 el SHA obtenido con `git rev-parse HEAD`. Esa será la versión exacta ensayada.

## Fase 2 — Verificación CUDA

Con el entorno activado:

```bash
python - <<'PY'
import torch
print("torch:", torch.__version__)
print("cuda_runtime:", torch.version.cuda)
print("cuda_available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("device:", torch.cuda.get_device_name(0))
    print("vram_total_mb:", round(torch.cuda.get_device_properties(0).total_memory / 1024**2, 1))
PY
```

Criterio para continuar por GPU: `cuda_available: True` y detección de la GTX 1060.

Si CUDA falla, registrar el error exacto antes de probar cualquier cambio de versiones.

## Fase 3 — Material privado de prueba

Preparar fuera del repositorio:

- un retrato o vídeo limpio del propietario;
- un WAV corto con la voz disponible en ese momento;
- preferiblemente un vídeo de entrada a 25 fps si se usa vídeo.

Ejemplo de rutas:

```text
~/yo-digital-private/avatar/avatar-source.mp4
~/yo-digital-private/audio/response.wav
```

Para la comparación, utilizar siempre el mismo material durante las primeras pruebas.

## Fase 4 — Inferencia normal

Empezar por inferencia normal. No intentar realtime hasta demostrar que el modelo cabe en memoria y produce una salida válida.

MuseTalk permite configurar `video_path` y `audio_path` en el YAML de inferencia. Crear una copia privada de la configuración dentro del checkout local de MuseTalk o en otro directorio no sincronizado con `yo-digital`.

La ejecución oficial de referencia para MuseTalk 1.5 en Linux es:

```bash
sh inference.sh v1.5 normal
```

Si se usa una configuración privada distinta de `configs/inference/test.yaml`, ejecutar directamente el módulo conservando los parámetros oficiales de v1.5:

```bash
python -m scripts.inference \
  --inference_config /ruta/privada/yo-digital.yaml \
  --result_dir ~/yo-digital-private/results/normal \
  --unet_model_path models/musetalkV15/unet.pth \
  --unet_config models/musetalkV15/musetalk.json \
  --version v15
```

No añadir flags de fp16 a este comando salvo que la versión exacta probada los soporte explícitamente. El README oficial documenta `--use_float16` para la demo Gradio, no como argumento universal de `scripts.inference`.

## Fase 5 — Realtime

Solo si la Fase 4 funciona sin OOM ni fallos de compatibilidad.

El flujo oficial realtime prepara un avatar una vez y permite reutilizarlo con varios audios:

1. configurar el avatar en `configs/inference/realtime.yaml`;
2. usar `preparation: True` la primera vez;
3. ejecutar realtime;
4. cambiar a `preparation: False` para reutilizar el avatar con nuevos clips;
5. medir generación sin escritura de imágenes con `--skip_save_images` cuando interese aislar el rendimiento de inferencia.

Comando oficial de referencia:

```bash
sh inference.sh v1.5 realtime
```

El script oficial fija `--fps 25` para este modo.

Para medir generación sin guardar frames:

```bash
python -m scripts.realtime_inference \
  --inference_config configs/inference/realtime.yaml \
  --skip_save_images
```

Al usar este comando directamente deben conservarse también los parámetros de modelo/versionado que exija el script de la versión ensayada.

## Métricas

Registrar una fila por prueba:

| Modo | Duración audio | Preparación avatar | Tiempo inferencia | FPS efectivos | Pico VRAM | Pico RAM | Resultado |
|---|---:|---:|---:|---:|---:|---:|---|
| normal | — | — | — | — | — | — | pendiente |
| realtime | — | — | — | — | — | — | pendiente |

Además de las métricas numéricas, evaluar:

- sincronización labial;
- estabilidad de la identidad;
- parpadeo/jitter alrededor de boca y cara;
- naturalidad general;
- continuidad entre segmentos;
- latencia percibida respecto al audio.

## Clasificación de resultado

### Viable

El hardware puede producir el vídeo con calidad aceptable y latencia próxima al tiempo real o compatible con la experiencia prevista.

### Viable con limitaciones

La calidad es suficiente, pero la generación es claramente más lenta que el audio o exige pre-generación/buffering. Puede seguir siendo útil para una fase visual previa o para un servidor con GPU distinta en el futuro.

### No viable en hardware local

OOM, incompatibilidad no razonable, rendimiento demasiado bajo o calidad insuficiente incluso después de ajustar parámetros soportados oficialmente.

Una clasificación `no viable en hardware local` no descarta MuseTalk como motor futuro; separa la validez del software de la capacidad de la GTX 1060 3 GB.

## Encaje con Yo-digital

La aplicación ya expone un contrato de avatar independiente del proveedor:

```text
AvatarController
  ├─ idle
  ├─ listening
  ├─ thinking
  └─ speaking
        ↓
     renderer
```

Una futura integración podría añadir un `MuseTalkAvatarRenderer` o, si la inferencia se ejecuta fuera del navegador, un adaptador cliente que hable con un servicio de avatar. `ConsultationController` y el dominio no deben importar MuseTalk.

### Restricción crítica: audio reutilizable

El TTS actual usa Web Speech API (`speechSynthesis`). Esa API reproduce la voz en el dispositivo, pero nuestra implementación no obtiene de ella un WAV/PCM/stream reutilizable para alimentar MuseTalk.

Por tanto, un avatar dinámico basado en MuseTalk necesita que la capa de voz pueda proporcionar **el audio como dato**, no solo reproducirlo.

La integración futura deberá utilizar uno de estos patrones:

```text
Texto → TTS que devuelve audio → AvatarEngine(MuseTalk) → vídeo + audio
```

ó

```text
Texto → servicio local/remoto de voz → stream/archivo de audio
                                  └→ MuseTalk
```

El `AvatarController` no cambia; el futuro adaptador de voz/avatar sí deberá compartir una referencia de audio o stream durante `speaking`.

Esta dependencia no se resolverá dentro de la PoC #7: para la prueba se utilizará un WAV generado previamente con la voz disponible.

## Estado

- Preparación técnica/documental: en curso.
- Inferencia local real: pendiente de ejecutar en el equipo objetivo.
- Clasificación de viabilidad: pendiente de métricas reales.
