# ADR-004 · Proveedor de clonación de voz

Estado: **propuesto / pendiente de autorización del cliente**  
Fecha: 2026-08-11

## Contexto

Yo-digital necesita una voz sintética que replique la voz del propietario. El material biométrico no puede incluirse en el repositorio público ni enviarse a un tercero sin autorización explícita.

Se ha preparado un dataset privado maestro v1 de ~6,19 min y un subconjunto de ~1,90 min para pruebas de clonación instantánea.

## Opciones evaluadas

### ElevenLabs

- Instant Voice Cloning disponible desde plan Starter.
- Recomendación oficial: 1–2 min de audio limpio; más de 2–3 min aporta poco y puede perjudicar estabilidad.
- Español soportado en modelos TTS multilingües.
- Professional Voice Cloning requiere Creator o superior y aproximadamente 30–180 min de audio.
- La API debe usarse con clave secreta en servidor; no debe exponerse en navegador.
- El modo de retención cero es Enterprise y no cubre las muestras usadas para crear clones.

### Cartesia

- Plan Pro incluye uso comercial e Instant Voice Cloning.
- El endpoint actual de clonación de alta similitud recomienda un clip de alrededor de 5–10 s.
- Español soportado; Sonic 3.5 soporta 42 idiomas.
- La API recomienda claves solo en servidor y tokens temporales para cliente.
- Zero Data Retention es Enterprise y no se aplica a voice cloning.

### OpenAI Custom Voices

- La API admite voces personalizadas con grabación de consentimiento y muestra de audio.
- Actualmente está limitada a clientes elegibles, por lo que no se toma como dependencia base del producto.

## Propuesta técnica

Para una **prueba de concepto inmediata**, comparar al menos una clonación instantánea antes de diseñar la integración definitiva. El dataset actual es suficiente para una prueba IVC, pero no para una clonación profesional de 30+ minutos.

No se enviará audio a ningún proveedor hasta recibir autorización explícita del propietario sobre el proveedor elegido y sus implicaciones de privacidad/coste.

## Impacto arquitectónico

Una integración dinámica TTS no puede poner la API key en GitHub Pages. Requerirá un backend/proxy serverless o un mecanismo de tokens efímeros emitidos desde servidor. Esto cambia la arquitectura actual sin backend y deberá aprobarse antes de producción.
