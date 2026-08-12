# Registro operativo de instalación de OpenVoice V2

Última actualización: 2026-08-13

## Entorno

- Windows 11 + Ubuntu 24.04.4 LTS sobre WSL2.
- Python aislado 3.9.25 en `~/yo-digital-voice-poc/.venv`.
- OpenVoice clonado en `~/yo-digital-voice-poc/OpenVoice`.
- GPU NVIDIA GeForce GTX 1060 3GB visible desde WSL2.

## Incidencias y decisiones

- `uv pip install -e .` falló inicialmente porque PyAV 10.0.0 necesitaba `pkg-config`.
- Se instaló `pkg-config` tras recuperar un estado `dpkg` interrumpido con `sudo dpkg --configure -a`.
- PyAV necesitó las librerías de desarrollo FFmpeg: `libavformat-dev`, `libavcodec-dev`, `libavdevice-dev`, `libavutil-dev`, `libavfilter-dev`, `libswscale-dev` y `libswresample-dev`.
- APT devolvió 404 por índices obsoletos; se corrigió con `sudo apt update` y después se instalaron correctamente las librerías FFmpeg.
- PyAV 10.0.0 falló con Cython 3. Se fijó Cython 0.29.36 y se reintentó sin aislamiento.
- PyAV 10.0.0 siguió fallando contra FFmpeg 6.1 por `AVFMT_FLAG_PRIV_OPT`, eliminado en FFmpeg actual.
- Para no degradar FFmpeg del sistema, se instaló `faster-whisper==1.0.0`, que instaló correctamente `av==11.0.0`.
- OpenVoice se instaló después con `uv pip install -e . --no-deps` para impedir que su pin histórico `faster-whisper==0.9.0` degradase el entorno.
- Se instalaron manualmente el resto de dependencias declaradas por OpenVoice.
- `uv pip check` actual: 130 paquetes comprobados y una única incompatibilidad de metadatos: OpenVoice declara `faster-whisper==0.9.0`, pero el entorno usa deliberadamente `faster-whisper==1.0.0` para mantener compatibilidad con FFmpeg 6.1/PyAV 11.

## Estado actual

OpenVoice está instalado. El siguiente paso es validar imports reales de OpenVoice y su ruta de extracción de voz antes de instalar MeloTTS y descargar checkpoints V2.

No se almacena ninguna contraseña ni audio privado en GitHub.
