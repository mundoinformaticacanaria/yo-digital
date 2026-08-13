# Estado PoC de voz

Actualizado: 2026-08-14

## OpenVoice V2

PoC local completada en WSL2 con GTX 1060 3 GB.

- MeloTTS español genera audio correctamente en CUDA.
- Síntesis base medida: 14.27 s, pico CUDA 626.9 MB.
- OpenVoice V2 extrae correctamente el speaker embedding desde referencias locales.
- Una referencia de ~5 s resultó demasiado corta tras VAD; con ~10 s y ~30 s la extracción funciona.
- Primera conversión real: 5.98 s, pico CUDA 580.3 MB.
- Segunda conversión usando ~30 s de referencia: 2.5 s.
- Evaluación del propietario: la voz se aproxima, pero la mejora entre ~10 s y ~30 s es inapreciable; la salida se percibe demasiado robótica.
- MeloTTS pronuncia incorrectamente el nombre "Xerach" en la frase de prueba.

Conclusión: OpenVoice V2 queda como línea base técnica, pero no alcanza todavía la naturalidad deseada. El siguiente candidato a probar es Chatterbox Multilingual V3, en un entorno Python separado para no alterar la PoC de OpenVoice.

Los audios de referencia y salidas locales no se almacenan en GitHub.
