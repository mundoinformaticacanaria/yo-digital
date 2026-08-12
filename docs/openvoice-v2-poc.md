# PoC local de OpenVoice V2

Última actualización: 2026-08-12

## Hardware objetivo

- Windows 11 con WSL2/Debian.
- 8 GB RAM.
- NVIDIA GeForce GTX 1060 3GB (Pascal, compute capability 6.1).

## Objetivo

Generar una primera frase de Yo-digital con la voz del propietario sin subir el dataset a terceros y sin contratar un servicio de pago.

## Principios

- El dataset privado no entra en GitHub.
- La instalación se realiza en un entorno aislado.
- La primera validación debe demostrar compatibilidad CUDA antes de instalar el stack completo.
- CUDA 11.8 se toma como punto de partida conservador por compatibilidad con Pascal y disponibilidad de wheels oficiales de PyTorch.
- Si la VRAM de 3 GB resulta insuficiente, se probará CPU sin cambiar de motor.

## Fase 0 — diagnóstico

Desde Debian/WSL2 ejecutar:

```bash
nvidia-smi
```

Criterio de éxito: aparece la GTX 1060 y el comando no falla.

Después comprobar:

```bash
python3 --version
free -h
```

No instalar nada hasta registrar estas salidas.

## Fase 1 — entorno aislado

Pendiente de ejecutar después de validar la Fase 0. Se usará Python 3.9, siguiendo la guía oficial de OpenVoice V2.

## Fase 2 — OpenVoice V2

- Clonar el repositorio oficial.
- Instalar OpenVoice y MeloTTS.
- Descargar checkpoints V2.
- Verificar `torch.cuda.is_available()` y memoria GPU.
- Extraer el embedding de voz desde un clip privado limpio.
- Generar una frase de prueba en español.

## Frase fija de validación

> Hola, soy Xerach. Te ayudo a convertir un problema tecnológico en una solución clara, práctica y mantenible.

Esta frase se mantendrá igual en todas las alternativas para permitir comparación A/B.

## Métricas mínimas

- tiempo total de generación;
- pico de VRAM;
- pico aproximado de RAM;
- inteligibilidad;
- similitud percibida;
- naturalidad;
- conservación del acento y ritmo.

## Fallback

Si CUDA falla por memoria:

1. repetir inferencia en CPU;
2. medir tiempo y RAM;
3. solo si CPU tampoco es viable, evaluar otra implementación/motor.

Chatterbox queda fuera de esta primera ejecución hasta terminar esta PoC.
