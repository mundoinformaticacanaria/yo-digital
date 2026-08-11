# Dataset privado para clonación de voz

Última actualización: 2026-08-11

## Objetivo

Preparar una referencia de voz natural del propietario de Yo-digital para una futura integración de voz clonada.

## Material recibido

- 8 archivos de audio aportados por el propietario.
- 2 grabaciones largas realizadas durante una conversación/reunión telefónica.
- 6 clips cortos de referencia.
- El propietario confirma que en todos los archivos se escucha únicamente su propia voz. En las grabaciones largas, las pausas prolongadas corresponden a momentos en los que hablaba la otra persona por teléfono, cuya voz no quedó registrada.

## Dataset derivado v1

Se ha preparado fuera del repositorio público:

- 43 clips útiles.
- 371,5 segundos (~6,19 min) de voz.
- WAV PCM 16-bit, mono, 48 kHz.
- Normalización EBU R128 a -20 LUFS, true peak -3 dB.
- En las grabaciones largas se usan pausas >= 1,2 s y umbral aproximado de -45 dB como fronteras de segmentación.
- Se descartan fragmentos inferiores a 2 s por su bajo valor para clonación.
- Se conservan completos los seis clips cortos de referencia.
- No se aplica reducción de ruido, ecualización ni modificación de timbre para no alterar la identidad vocal.
- Se genera un `manifest.csv` con trazabilidad desde cada clip al archivo e intervalo fuente.

## Privacidad y repositorio

El material de voz es dato biométrico/sensible del propietario y **no debe publicarse en este repositorio**, que es público.

La raíz incluye reglas `.gitignore` que bloquean formatos habituales de audio y carpetas de datasets para reducir el riesgo de publicación accidental.

Los archivos fuente y datasets derivados deben mantenerse en almacenamiento privado/local o en el proveedor de clonación elegido explícitamente por el propietario.

## Siguiente etapa

Evaluar proveedor de clonación/TTS y sus requisitos técnicos, privacidad, coste y condiciones de uso. Adaptar el dataset al formato requerido por el proveedor sin degradar los originales.
