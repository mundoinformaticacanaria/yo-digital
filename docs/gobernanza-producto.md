# Gobernanza del producto

Última actualización: 2026-08-14

## Roles

### Cliente / propietario

Xerach Hernández es el propietario del producto y conserva la decisión final sobre costes, privacidad, seguridad, servicios externos, uso de datos y promoción del producto cuando requiera validación humana.

### Product Owner / Arquitecto

Rol en proceso de incorporación formal.

Será responsable del criterio de producto y de las decisiones de arquitectura que correspondan a su ámbito. El producto ya contiene decisiones técnicas y arquitectónicas tomadas antes de la incorporación del Tech Lead; se consideran estado heredado válido hasta que exista una razón documentada para revisarlas.

La incorporación de este rol no debe provocar una reescritura retrospectiva de decisiones. Los cambios futuros se registrarán mediante issues y, cuando proceda, ADR.

### Tech Lead

Responsable de la salud técnica y de la ejecución ordenada del desarrollo:

- calidad, mantenibilidad, rendimiento y fiabilidad del código;
- deuda técnica, tests y CI;
- desglose y mantenimiento del backlog técnico;
- definición técnica de las issues;
- revisión del trabajo de Desarrollo;
- coherencia entre código, documentación y arquitectura vigente;
- mantenimiento de `docs/tech-lead.md` y `docs/desarrollo.md`.

Puede decidir autónomamente detalles de implementación, refactorización, estructura interna, tests, CI y optimizaciones que no alteren materialmente producto, privacidad, seguridad, costes o compromisos arquitectónicos acordados.

### Desarrollo / Programador

Ejecuta las issues preparadas para desarrollo. Toda issue que deba ejecutar un programador debe llevar la etiqueta `PROGRAMADOR`.

Su contrato operativo está definido en `docs/desarrollo.md`.

### Acumulación temporal de funciones

Hasta que se incorpore un desarrollador dedicado, el Tech Lead asume también temporalmente la ejecución de las issues de Desarrollo / Programador.

La acumulación es únicamente de persona ejecutora, no de proceso ni de responsabilidades. El Tech Lead debe seguir diferenciando cuándo actúa como responsable técnico y cuándo actúa como ejecutor. Toda issue de desarrollo seguirá llevando la etiqueta `PROGRAMADOR`, aunque la implemente temporalmente el Tech Lead.

Cuando se incorpore un desarrollador, asumirá la ejecución de dichas issues sin necesidad de modificar el flujo de trabajo establecido.

## Regla de trazabilidad

Todo trabajo sobre el repositorio debe estar previamente identificado mediante una issue.

No se inicia implementación, refactorización, corrección o cambio documental relevante sin trazabilidad previa. Si durante una tarea aparece trabajo adicional fuera de alcance, se registra en otra issue en vez de incorporarlo silenciosamente.

Flujo general:

1. identificar el trabajo mediante issue;
2. definir alcance y criterios de aceptación;
3. etiquetar `PROGRAMADOR` si corresponde a ejecución de Desarrollo;
4. implementar y verificar;
5. revisar técnicamente;
6. actualizar documentación/ADR cuando corresponda;
7. cerrar la issue con el resultado trazable.

## Coordinación Product Owner / Arquitecto ↔ Tech Lead

El Product Owner / Arquitecto define el qué y las restricciones de producto/arquitectura de su ámbito; el Tech Lead gobierna el cómo de la implementación y la calidad técnica.

Cuando una decisión afecte simultáneamente producto y arquitectura/implementación, ambos roles deben converger antes de que la issue se considere lista para ejecutar.

El Tech Lead debe detenerse y coordinar cuando una decisión implique:

- coste económico o contratación de un servicio;
- backend, tracking o envío de datos fuera del dispositivo;
- cambio relevante de privacidad o seguridad;
- cambio material del comportamiento o posicionamiento del producto;
- sustitución de una decisión arquitectónica acordada;
- credenciales, permisos o acciones que solo pueda realizar el propietario;
- validación humana imprescindible antes de promover una versión a producción.

## Forma de trabajo

- GitHub contiene el contexto suficiente para retomar el proyecto sin depender de memoria conversacional.
- `main` representa el estado estable conocido del proyecto.
- La producción principal no se sustituye durante la reconstrucción hasta alcanzar validación suficiente.
- Los cambios deben quedar trazados mediante issues y commits; las decisiones duraderas mediante documentación o ADR.
- SOLID y Clean Code se aplican con pragmatismo, evitando abstracciones sin beneficio verificable.
- El Tech Lead mantiene el contexto técnico actualizado para que un nuevo programador pueda ser productivo desde su incorporación.

## Restricciones de producto actuales

- Aplicación web estática compatible con GitHub Pages y HTTPS.
- Sin backend propio ni tracking salvo autorización expresa.
- Consultoría centrada en aplicaciones a medida y arquitectura tecnológica.
- Voz en español mediante capacidades del navegador.
- Grabaciones de entrenamiento almacenadas localmente en IndexedDB y exportables por decisión del usuario.
- Material biométrico privado fuera del repositorio.
