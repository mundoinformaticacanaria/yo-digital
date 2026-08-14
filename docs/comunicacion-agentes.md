# Comunicación entre agentes — Yo-digital

Última actualización: 2026-08-14

## Objetivo

Definir cómo se coordinan los distintos chats/agentes técnicos del proyecto sin depender de memoria conversacional implícita ni de que el propietario copie mensajes manualmente entre chats.

GitHub es la fuente de verdad y el canal formal de coordinación. La memoria de ChatGPT Projects puede ayudar a recuperar contexto de otras conversaciones del mismo proyecto, pero no se considera un canal de mensajería activo ni sustituye la trazabilidad en GitHub.

## Roles técnicos actuales

### Tech Lead

Responsable de:

- definir y priorizar trabajo técnico;
- preparar y mantener issues;
- decidir sobre implementación y calidad dentro de su ámbito;
- revisar resultados, PR, CI y documentación;
- convertir hallazgos en nuevas issues cuando proceda;
- mantener el contexto técnico del repositorio.

### Desarrollo / Integración local

Rol actualmente cubierto por el chat histórico que creó y probó buena parte del producto y conserva el contexto operativo del entorno local.

Responsable de:

- ejecutar issues con etiqueta `PROGRAMADOR`;
- trabajar con el propietario en WSL2/Windows cuando sea necesaria interacción local;
- instalar y probar PoC, modelos y herramientas locales;
- ejecutar diagnósticos, pruebas de navegador y mediciones de hardware;
- implementar código dentro del alcance de la issue asignada;
- documentar resultados, bloqueos y riesgos;
- preparar commits/ramas/PR cuando la tarea lo requiera.

No decide de forma silenciosa cambios de arquitectura, alcance de producto o nuevas dependencias relevantes fuera de la issue.

## Canal formal: GitHub

La coordinación se realiza en este orden:

1. **Issue**: contrato de trabajo y contexto inicial.
2. **Comentarios de la issue**: resultados parciales, bloqueos, preguntas técnicas y hallazgos.
3. **Rama/PR**: cambios de código o documentación cuando corresponda.
4. **CI y pruebas**: evidencia objetiva de validación.
5. **Documentación/ADR**: decisiones duraderas y estado consolidado.
6. **Cierre de issue**: solo cuando se cumplen los criterios o se documenta explícitamente el motivo alternativo de cierre.

## Inicio de una tarea de Desarrollo

Antes de ejecutar una tarea, Desarrollo debe:

1. leer la issue completa;
2. confirmar que lleva `PROGRAMADOR`;
3. leer los documentos enlazados por la issue;
4. trabajar exclusivamente dentro del alcance definido;
5. usar la propia issue para cualquier duda o bloqueo que pueda afectar la decisión técnica.

Si la tarea requiere interacción en WSL2, el propietario puede seguir usando el chat de Desarrollo para ejecutar comandos paso a paso. El resultado relevante debe volver a GitHub.

## Formato mínimo de entrega de Desarrollo

Al finalizar una ejecución o alcanzar un bloqueo relevante, Desarrollo debe dejar un comentario en la issue con, cuando aplique:

```text
## Resultado
- Estado: completado | bloqueado | parcial
- Rama/commit/PR: ...

## Validaciones
- Comandos/tests ejecutados: ...
- Resultado: ...

## Pruebas locales
- Entorno: ...
- Hardware/navegador: ...
- Métricas: ...

## Hallazgos
- ...

## Trabajo fuera de alcance detectado
- ...

## Decisiones requeridas al Tech Lead
- ...
```

No se deben publicar secretos, audios privados, imágenes biométricas, embeddings ni otros materiales sensibles en los comentarios.

## Respuesta del Tech Lead

El Tech Lead revisa la issue y responde mediante una de estas acciones:

- acepta el resultado y procede a revisión/cierre;
- solicita corrección dentro del alcance original;
- aclara una decisión de implementación;
- crea una nueva issue para trabajo descubierto fuera de alcance;
- escala al Product Owner / Arquitecto o propietario cuando la decisión excede el ámbito técnico del Tech Lead;
- solicita ADR si el hallazgo implica una decisión arquitectónica duradera.

Una propuesta de Desarrollo no se convierte en decisión por el mero hecho de estar implementada localmente.

## Hallazgos y bloqueos

### Dentro del alcance

Desarrollo puede resolver autónomamente detalles de implementación normales siempre que no cambie el objetivo, los criterios de aceptación ni restricciones relevantes.

### Fuera del alcance

Si aparece una necesidad nueva, Desarrollo debe describirla en la issue y detener cualquier cambio que dependa de esa nueva decisión. El Tech Lead decide si:

- amplía formalmente el alcance de la issue;
- abre una issue nueva;
- descarta el trabajo;
- lo escala a otro rol.

La opción preferida ante trabajo materialmente diferente es una issue nueva.

## Uso de la memoria del Proyecto de ChatGPT

Los chats dentro del mismo Proyecto pueden reutilizar contexto de otras conversaciones cuando la configuración de memoria lo permite. Esto es útil para evitar repetir antecedentes, pero tiene tres límites operativos para Yo-digital:

- no existe una conversación directa y activa entre chats;
- el contexto recuperado puede no equivaler a leer de forma íntegra y ordenada la conversación de otro chat;
- una decisión técnica no se considera comunicada ni aceptada hasta quedar registrada en GitHub.

Por tanto:

**memoria del Proyecto = apoyo contextual**  
**GitHub = coordinación y fuente de verdad**

## Regla para el propietario

El propietario no debe actuar como mensajero técnico entre chats salvo cuando una prueba local requiera su participación interactiva.

En un flujo normal basta con indicar al chat de Desarrollo qué issue debe ejecutar. Ese chat debe leer GitHub, trabajar, y registrar allí el resultado. Posteriormente el Tech Lead puede leer directamente la misma issue.

## Ejemplo: PoC MuseTalk

1. Tech Lead define la issue `#7` y sus métricas.
2. El propietario abre el chat de Desarrollo y le indica que ejecute `#7`.
3. Desarrollo consulta la issue y trabaja con el propietario en WSL2.
4. Desarrollo registra en `#7` instalación, errores, métricas, resultado y bloqueos.
5. Tech Lead lee `#7` sin necesidad de recibir el transcript del otro chat.
6. Tech Lead decide viabilidad y crea las siguientes issues necesarias.

## Conflictos de información

Si memoria conversacional, documentación y GitHub se contradicen, se aplica este orden:

1. código/estado verificable del repositorio;
2. issue/PR/ADR vigente;
3. documentación actual del repositorio;
4. memoria o conversación de ChatGPT como contexto auxiliar.

La contradicción debe corregirse mediante issue; no se resuelve silenciosamente.