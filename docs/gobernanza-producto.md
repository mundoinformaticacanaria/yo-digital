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

Ejecuta las issues preparadas para desarrollo. Toda issue cuya siguiente actuación corresponda a Desarrollo debe llevar la etiqueta `PROGRAMADOR`.

Su contrato operativo está definido en `docs/desarrollo.md`.

### Desarrollo / Integración local

El chat técnico histórico del proyecto actúa actualmente como ejecutor especializado en el entorno local.

Su ámbito incluye:

- ejecución de issues `PROGRAMADOR`;
- pruebas y diagnóstico en Windows / WSL2;
- instalación y evaluación de PoC y modelos locales;
- mediciones de GPU, VRAM, RAM, navegador y rendimiento;
- implementación dentro del alcance asignado;
- registro de resultados, bloqueos y hallazgos en la issue correspondiente.

Conserva su conocimiento histórico del proyecto, pero las nuevas decisiones de arquitectura, alcance o dependencias relevantes siguen el flujo vigente de issues/ADR y revisión del Tech Lead.

### Acumulación temporal de funciones

Hasta que se incorpore un desarrollador dedicado, el Tech Lead asume también temporalmente la ejecución de las issues de Desarrollo / Programador.

La acumulación es únicamente de persona ejecutora, no de proceso ni de responsabilidades. El Tech Lead debe seguir diferenciando cuándo actúa como responsable técnico y cuándo actúa como ejecutor. Toda issue de desarrollo seguirá llevando la etiqueta `PROGRAMADOR` cuando el turno activo corresponda a ese rol, aunque la implemente temporalmente el Tech Lead.

Las issues pueden ejecutarse también desde el rol de Desarrollo / Integración local cuando requieran interacción con el entorno WSL2 o cuando sea el ejecutor más adecuado. Las labels identifican el rol que debe actuar, no un chat o persona concreta.

Cuando se incorpore un desarrollador, asumirá la ejecución de dichas issues sin necesidad de modificar el flujo de trabajo establecido.

## Regla de trazabilidad

Todo trabajo sobre el repositorio debe estar previamente identificado mediante una issue.

No se inicia implementación, refactorización, corrección o cambio documental relevante sin trazabilidad previa. Si durante una tarea aparece trabajo adicional fuera de alcance, se registra en otra issue en vez de incorporarlo silenciosamente.

## Labels de turno y responsabilidad

Las labels de rol expresan **quién tiene la siguiente actuación pendiente**:

- `PROGRAMADOR`: debe actuar Desarrollo / Integración local o quien ejerza el rol de Programador.
- `TECH LEAD`: existe una actuación inmediata pendiente del Tech Lead.
- sin label de rol: la issue abierta continúa bajo supervisión del Tech Lead, pero no tiene un turno inmediato delegado; puede estar en backlog, pendiente de prioridad o esperando una dependencia.

Las issues abiertas sin label de rol no están huérfanas. El Tech Lead es responsable de revisar periódicamente ese backlog y activar el siguiente turno cuando corresponda.

Cuando Desarrollo termina una ejecución o necesita una decisión, registra el resultado en comentarios y cambia `PROGRAMADOR` por `TECH LEAD`. Cuando el Tech Lead devuelve trabajo a Desarrollo, cambia `TECH LEAD` por `PROGRAMADOR`.

Si una issue queda esperando otra, la dependencia debe constar explícitamente (`Bloqueada por #N`). Al cambiar el estado de la dependencia, el Tech Lead revisa las issues dependientes y asigna el siguiente turno.

Las issues cerradas no deben conservar `PROGRAMADOR` ni `TECH LEAD`, porque ambas labels significan trabajo pendiente.

Flujo general:

1. identificar el trabajo mediante issue;
2. definir alcance, criterios de aceptación y dependencias;
3. asignar la label del rol que debe actuar a continuación;
4. ejecutar y registrar resultados en la issue;
5. traspasar la label al siguiente rol cuando cambie el turno;
6. revisar técnicamente;
7. actualizar documentación/ADR cuando corresponda;
8. retirar labels de turno y cerrar la issue cuando esté completada.

## Comunicación entre agentes

La coordinación entre Tech Lead y Desarrollo / Integración local se rige por `docs/comunicacion-agentes.md`.

Principios:

- GitHub es el canal formal de comunicación y la fuente de verdad.
- La issue es el contrato de trabajo y el hilo principal para resultados, preguntas, bloqueos y hallazgos.
- Las labels de rol indican quién debe actuar a continuación.
- Los PR contienen los cambios revisables; CI y pruebas aportan la evidencia de validación.
- La memoria de ChatGPT Projects puede aportar contexto de otras conversaciones del mismo proyecto, pero no sustituye GitHub ni constituye mensajería directa entre chats.
- El propietario no debe copiar manualmente información entre chats salvo cuando una prueba local interactiva lo haga necesario.

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
