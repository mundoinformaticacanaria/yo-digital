# Código fuente reconstruido

Este directorio contiene la reconstrucción legible del comportamiento heredado.

## Estado

Todavía **no alimenta la versión publicada**. Producción continúa usando el `index.html` heredado mientras se alcanza equivalencia funcional.

## Capas

- `domain/`: reglas puras, preguntas, señales y recomendaciones.
- `application/`: casos de uso y flujo de sesión.
- `infrastructure/`: adaptadores de navegador y persistencia local.
- `ui/`: se incorporará durante la reconstrucción de presentación.

## Regla de transición

No sustituir el `index.html` publicado por esta fuente hasta disponer de:

1. tests de compatibilidad suficientes;
2. UI equivalente;
3. adaptadores de voz/almacenamiento verificados;
4. build reproducible.
