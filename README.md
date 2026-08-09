# Yo-digital

Yo-digital es el producto de consultoría digital de Xerach Hernández. Su objetivo es cualificar necesidades de clientes y devolver una orientación técnica clara en dos escenarios principales: desarrollo de aplicaciones a medida y consultoría/arquitectura.

## Estado actual

La versión publicada sigue ejecutándose desde `index.html` en GitHub Pages. Ese archivo es actualmente un artefacto compilado y no se considera la fuente mantenible del producto.

La reconstrucción del proyecto se está realizando sin cambiar comportamiento antes de tiempo. GitHub será la fuente de verdad para requisitos, arquitectura, decisiones y código fuente.

## Principios

- Preservar comportamiento antes de refactorizar.
- Código legible, modular y testeable.
- SOLID y Clean Code con pragmatismo.
- Sin backend, tracking o servicios externos sin decisión explícita de producto.
- Privacidad por diseño.
- `main` representa el estado estable.
- `index.html` es el artefacto publicado en GitHub Pages.

## Documentación

- [`docs/arquitectura-as-is.md`](docs/arquitectura-as-is.md): mapa del sistema heredado.
- [`docs/requisitos.md`](docs/requisitos.md): comportamiento que debe preservarse.
- [`docs/reglas-negocio.md`](docs/reglas-negocio.md): reglas funcionales conocidas.
- [`docs/roadmap.md`](docs/roadmap.md): hoja de ruta de reconstrucción.
- [`docs/contexto-proyecto.md`](docs/contexto-proyecto.md): contexto operativo para continuar el proyecto sin depender de memoria externa.

## Publicación

GitHub Pages publica desde `main` / raíz. La URL de producción es:

`https://mundoinformaticacanaria.github.io/yo-digital/`
