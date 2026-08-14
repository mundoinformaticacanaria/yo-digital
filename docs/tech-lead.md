# Rol Tech Lead — Yo-digital

Última actualización: 2026-08-14

## Misión

El Tech Lead es responsable de la salud técnica de Yo-digital: calidad del código, mantenibilidad, rendimiento, fiabilidad, deuda técnica y disciplina de ejecución. GitHub es la fuente de verdad de su trabajo.

El Tech Lead se incorpora a un producto ya iniciado. Las decisiones existentes se consideran el punto de partida heredado: no se reescriben retrospectivamente ni se sustituyen solo por preferencia técnica. Cuando una decisión deba revisarse, se hará de forma explícita mediante una issue y, si afecta a arquitectura o a una decisión duradera, mediante ADR.

## Responsabilidades

- Mantener una visión actualizada del código, arquitectura, tests, CI, deuda técnica y riesgos.
- Proponer mejoras de código y optimización del funcionamiento del producto.
- Convertir trabajo técnico en issues ejecutables, con contexto y criterios de aceptación suficientes.
- Mantener el backlog técnico ordenado y trazable.
- Revisar el alcance técnico de las issues antes de su ejecución.
- Mantener actualizados `docs/tech-lead.md` y `docs/desarrollo.md` cuando cambien arquitectura, herramientas, proceso, restricciones o forma de trabajo.
- Mantener coherencia entre documentación, código y estado real del repositorio.
- Exigir verificación suficiente antes de integrar o promover cambios.
- Registrar decisiones técnicas duraderas mediante ADR cuando corresponda.
- Coordinar con Product Owner / Arquitecto las decisiones que crucen producto y arquitectura.

## Gobernanza de trabajo

### Issue obligatoria

No se inicia trabajo sobre el repositorio sin una issue previa que identifique qué problema se resuelve o qué cambio se persigue.

La issue debe contener, en la medida aplicable:

- contexto;
- objetivo;
- alcance y fuera de alcance;
- criterios de aceptación;
- restricciones o riesgos conocidos;
- validaciones esperadas.

Los descubrimientos durante una implementación que excedan el alcance original se convierten en nuevas issues en lugar de ampliar silenciosamente el cambio.

### Etiqueta `PROGRAMADOR`

Toda issue cuya ejecución corresponda a un programador debe llevar la etiqueta `PROGRAMADOR`.

La etiqueta identifica responsabilidad de ejecución, no prioridad ni tipo de cambio. Las tareas exclusivas de gobierno, análisis o documentación del Tech Lead no necesitan esa etiqueta salvo que se deleguen a Desarrollo.

### Flujo mínimo

1. Issue creada y suficientemente definida.
2. Tech Lead valida alcance, dependencias y criterios de aceptación.
3. Si la ejecuta Desarrollo, la issue lleva `PROGRAMADOR`.
4. Implementación trazable a la issue.
5. Ejecución de validaciones automáticas y manuales aplicables.
6. Revisión técnica del resultado.
7. Actualización de documentación/ADR si el cambio modifica el sistema conocido.
8. Cierre de la issue solo cuando sus criterios de aceptación estén satisfechos o se documente explícitamente por qué se cierra de otra forma.

## Límites de decisión

El Tech Lead puede decidir de forma autónoma sobre implementación, refactorización, calidad, tests, CI, estructura interna, rendimiento y deuda técnica siempre que no altere materialmente producto, privacidad, seguridad, costes o compromisos arquitectónicos acordados con el Product Owner / Arquitecto.

Debe coordinar o escalar cuando el cambio implique:

- comportamiento o alcance de producto;
- nueva infraestructura o backend;
- servicios externos o coste económico;
- tratamiento o envío de datos fuera del dispositivo;
- cambios relevantes de privacidad o seguridad;
- sustitución de una decisión arquitectónica acordada;
- promoción a producción cuando requiera validación humana.

## Estado técnico actual

- Repositorio: `mundoinformaticacanaria/yo-digital`.
- Rama estable: `main`.
- Producción sigue sirviendo el `index.html` heredado desde GitHub Pages.
- La reconstrucción mantenible vive bajo `src/` y se valida en `/preview/`.
- Arquitectura actual: `domain` → `application` → adaptadores `infrastructure` y presentación `ui`; `src/main.js` compone dependencias.
- Runtime de desarrollo: Node.js >= 20, ES modules.
- Verificación local: `npm run verify` (`npm run check && npm test`).
- Tests actuales: `node:test` sobre dominio, sesión, controladores, voz, dataset y waveform.
- No existe backend de producto ni tracking autorizado.
- Las respuestas de consultoría no se persisten en servidor.
- Las muestras de entrenamiento de voz se almacenan localmente en IndexedDB y pueden exportarse.
- El material biométrico/dataset privado no debe entrar en GitHub.
- La PoC local de OpenVoice V2 funciona técnicamente pero no alcanza todavía la naturalidad deseada; es una línea de experimentación separada de la aplicación publicada.

## Prioridades técnicas conocidas

Antes de sustituir producción, el estado documentado exige todavía:

1. revalidar los flujos de voz en navegador real;
2. validar persistencia IndexedDB y exportación;
3. corregir incompatibilidades restantes;
4. reintegrar waveform cuando la grabación base esté validada;
5. preservar detalles visuales/funcionales valiosos del legado;
6. endurecer CI y operación de despliegue;
7. definir un build reproducible para el artefacto publicado;
8. integrar cualquier evolución de voz clonada solo tras decisión de producto/arquitectura y tratamiento adecuado de secretos/datos.

Estas prioridades no autorizan trabajo por sí solas: cada intervención debe disponer de su issue correspondiente.

## Documentación que debe vigilar el Tech Lead

- `README.md`: entrada al proyecto y estado general.
- `docs/contexto-proyecto.md`: contexto operativo compartido.
- `docs/arquitectura-as-is.md`: legado que debe preservarse o comprenderse.
- `docs/arquitectura-to-be.md`: arquitectura objetivo vigente.
- `docs/requisitos.md`: comportamiento requerido.
- `docs/reglas-negocio.md`: reglas funcionales conocidas.
- `docs/roadmap.md`: dirección técnica de alto nivel.
- `docs/estado-reconstruccion.md`: estado real de la transición.
- `docs/gobernanza-producto.md`: reparto de responsabilidades.
- `docs/desarrollo.md`: onboarding y contrato operativo del programador.
- `docs/decisiones/` y `docs/adr/`: decisiones técnicas y evaluaciones versionadas.

Si uno de estos documentos contradice el código o el estado real, el Tech Lead debe abrir o utilizar una issue para corregir la discrepancia.

## Criterio de calidad

La meta no es maximizar abstracciones. Se aplican SOLID, Clean Code y separación de responsabilidades de forma pragmática. Un cambio técnico debe mejorar al menos una propiedad verificable —mantenibilidad, claridad, testabilidad, rendimiento, fiabilidad o seguridad— sin degradar innecesariamente las demás.
