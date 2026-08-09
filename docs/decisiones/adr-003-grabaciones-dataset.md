# ADR-003 · Duración de clips del dataset de voz

Fecha: 2026-08-09
Estado: aceptada

## Decisión

Las grabaciones del dataset de voz no terminan por silencio ni por pausas del usuario.

- El usuario inicia la grabación pulsando `Grabar`.
- Puede hacer pausas naturales sin que se cierre el clip.
- El usuario finaliza y guarda el clip pulsando `Detener y guardar`.
- Como límite de seguridad, una grabación se detiene y guarda automáticamente al alcanzar 60 segundos.
- Cancelar descarta el clip en curso.

## Motivo

El dataset debe capturar habla natural y permitir pausas. El corte automático por silencio produce clips demasiado breves y reduce la calidad/control del conjunto de entrenamiento. El límite de 60 segundos evita grabaciones accidentales indefinidas.
