# Rol Tech Lead — Yo-digital

Última actualización: 2026-08-14

## Misión

El Tech Lead es responsable de la salud técnica de Yo-digital: calidad del código, mantenibilidad, rendimiento, fiabilidad, deuda técnica y disciplina de ejecución. GitHub es la fuente de verdad de su trabajo.

El Tech Lead se incorpora a un producto ya iniciado. Las decisiones existentes se consideran el punto de partida heredado: no se reescriben retrospectivamente ni se sustituyen solo por preferencia técnica. Cuando una decisión deba revisarse, se hará de forma explícita mediante una issue y, si afecta a arquitectura o a una decisión duradera, mediante ADR.

## Situación temporal de ejecución

Hasta que se incorpore un desarrollador dedicado, el Tech Lead asume también temporalmente la ejecución de las issues de Desarrollo / Programador.

Esta acumulación de funciones no elimina la separación de responsabilidades:

- como Tech Lead, identifica, define, prioriza y revisa el trabajo técnico;
- como ejecutor temporal, implementa únicamente issues previamente definidas para Desarrollo;
- toda issue de desarrollo mantiene la etiqueta `PROGRAMADOR`, aunque sea ejecutada por el propio Tech Lead;
- cuando se incorpore un programador, cambiará el ejecutor, no el proceso ni la trazabilidad.

El proyecto dispone además de un rol de Desarrollo / Integración local, cubierto actualmente por el chat técnico histórico, especialmente adecuado para trabajo interactivo en Windows/WSL2 y PoC locales. El Tech Lead puede asignar a ese rol issues `PROGRAMADOR` sin ceder la responsabilidad de dirección técnica.

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
- Revisar las entregas y bloqueos de Desarrollo / Integración local registrados en GitHub.

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

Mientras el Tech Lead sea también el ejecutor temporal, esta regla se mantiene sin excepciones para las issues de desarrollo. La etiqueta identifica el tipo de responsabilidad de ejecución, no a la persona o chat concreto que la realiza.

Las tareas exclusivas de gobierno, análisis o documentación del Tech Lead no necesitan esa etiqueta salvo que se deleguen a Desarrollo.

### Comunicación con Desarrollo / Integración local

El protocolo completo está en `docs/comunicacion-agentes.md`.

Reglas operativas:

- el Tech Lead prepara la issue y sus criterios antes de delegar;
- Desarrollo lee la issue directamente en GitHub;
- resultados, métricas, bloqueos y hallazgos vuelven a la misma issue;
- el Tech Lead responde allí con aceptación, correcciones, nuevas issues o escalado;
- la memoria del Proyecto de ChatGPT sirve como apoyo contextual, no como mecanismo de coordinación;
- el propietario no debería tener que copiar mensajes entre chats salvo durante una interacción local paso a paso.

### Flujo mínimo

1. Issue creada y suficientemente definida.
2. Tech Lead valida alcance, dependencias y criterios de aceptación.
3. Si corresponde a Desarrollo, la issue lleva `PROGRAMADOR`.
4. Implementación trazable a la issue, por el programador, por Desarrollo / Integración local o temporalmente por el Tech Lead.
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
- Tests actuales: `node:test` sobre dominio, sesión, controladores, voz, dataset, waveform y estados de avatar.
- El avatar está desacoplado mediante `AvatarController`, con estados `idle`, `listening`, `thinking` y `speaking`, y renderer intercambiable.
- La preview utiliza actualmente `DomAvatarRenderer`; motores futuros no deben acoplarse al flujo de consulta.
- No existe backend de producto ni tracking autorizado.
- Las respuestas de consultoría no se persisten en servidor.
- Las muestras de entrenamiento de voz se almacenan localmente en IndexedDB y pueden exportarse.
- El material biométrico/dataset privado no debe entrar en GitHub.
- La PoC local de OpenVoice V2 funciona técnicamente pero no alcanza todavía la naturalidad deseada; la mejora de voz continúa en paralelo.
- La issue #7 valida MuseTalk 1.5 como primera línea de lip-sync fotorrealista con coste recurrente 0 €, sin integración en producción.

## Prioridades técnicas actuales

El orden vigente responde a que Yo-digital es actualmente un proyecto personal de exploración tecnológica; la captación comercial no condiciona el desarrollo inmediato.

1. Mantener el avatar como capacidad intercambiable y escalable; la abstracción inicial ya está implementada.
2. Validar una PoC de avatar fotorrealista/lip-sync sin coste recurrente, empezando por MuseTalk 1.5 y midiendo específicamente la GTX 1060 3 GB.
3. Mejorar la presencia visual del avatar —reposo, escucha, pensamiento y habla— antes de priorizar persistencia comercial.
4. Continuar la mejora de voz en paralelo y hacer que el avatar consuma la mejor voz disponible en cada momento, sin casarse con un proveedor.
5. Revalidar los flujos de navegador sensibles: voz, IndexedDB, exportación y waveform.
6. Endurecer CI, build reproducible y operación de despliegue antes de sustituir el `index.html` heredado.
7. Abordar persistencia/captación cuando pase a ser una prioridad de producto; el código debe estar preparado para añadirla sin reestructuración masiva.

Estas prioridades no autorizan trabajo por sí solas: cada intervención debe disponer de su issue correspondiente.

## Restricción arquitectónica de voz + avatar

El TTS actual basado en Web Speech API reproduce audio pero no entrega a la aplicación un WAV/PCM/stream reutilizable. Los motores de lip-sync como MuseTalk necesitan el audio como dato de entrada.

Por tanto, la futura integración de avatar dinámico requerirá una implementación de TTS que pueda devolver o transmitir audio, aunque la UI y `AvatarController` permanezcan independientes de esa decisión. La PoC #7 utiliza un WAV preparado fuera del repositorio para validar primero el motor visual.

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
- `docs/comunicacion-agentes.md`: protocolo formal entre Tech Lead y Desarrollo / Integración local.
- `docs/musetalk-poc.md`: ejecución y resultados de la PoC de avatar/lip-sync local.
- `docs/decisiones/` y `docs/adr/`: decisiones técnicas y evaluaciones versionadas.

Si uno de estos documentos contradice el código o el estado real, el Tech Lead debe abrir o utilizar una issue para corregir la discrepancia.

## Criterio de calidad

La meta no es maximizar abstracciones. Se aplican SOLID, Clean Code y separación de responsabilidades de forma pragmática. Un cambio técnico debe mejorar al menos una propiedad verificable —mantenibilidad, claridad, testabilidad, rendimiento, fiabilidad o seguridad— sin degradar innecesariamente las demás.
