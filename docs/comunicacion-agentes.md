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
2. **Labels de turno**: indican qué rol tiene la siguiente actuación pendiente.
3. **Comentarios de la issue**: resultados parciales, bloqueos, preguntas técnicas y hallazgos.
4. **Rama/PR**: cambios de código o documentación cuando corresponda.
5. **CI y pruebas**: evidencia objetiva de validación.
6. **Documentación/ADR**: decisiones duraderas y estado consolidado.
7. **Cierre de issue**: solo cuando se cumplen los criterios o se documenta explícitamente el motivo alternativo de cierre.

## Labels como turno de actuación

Las labels de rol son un mecanismo operativo. Indican **quién debe actuar a continuación**; no describen quién creó la issue ni quién trabajó históricamente en ella.

### `PROGRAMADOR`

La siguiente actuación corresponde a Desarrollo / Integración local o a quien esté ejerciendo el rol de Programador.

Mientras una issue tenga `PROGRAMADOR`, Desarrollo debe considerarla parte de su cola de trabajo.

### `TECH LEAD`

Existe una actuación inmediata pendiente del Tech Lead: revisión, decisión, respuesta a un bloqueo, validación, redefinición de alcance o cierre.

Mientras una issue tenga `TECH LEAD`, forma parte de la bandeja de entrada activa del Tech Lead.

### Issue abierta sin label de rol

No significa que la issue carezca de responsable. Permanece bajo **responsabilidad de supervisión del Tech Lead**, pero no tiene una actuación inmediata delegada a Desarrollo ni un traspaso activo pendiente.

Puede representar, por ejemplo:

- backlog todavía no activado;
- trabajo pendiente de prioridad;
- una issue que espera una dependencia;
- una actuación futura que el Tech Lead debe vigilar.

El Tech Lead debe revisar periódicamente tanto las issues `TECH LEAD` como las issues abiertas sin label de rol. Por tanto, ninguna issue abierta queda huérfana.

### Dependencias y bloqueos

Cuando una issue no puede avanzar porque depende de otra, debe quedar escrito explícitamente en el cuerpo o en un comentario, por ejemplo: `Bloqueada por #17`.

Una issue que espera una dependencia puede permanecer sin label de rol. El Tech Lead es responsable de revisar su situación al cerrar o avanzar la issue de la que depende y de asignar entonces el siguiente turno (`PROGRAMADOR` o `TECH LEAD`).

### Traspaso Desarrollo → Tech Lead

Cuando Desarrollo:

- completa el trabajo;
- alcanza un bloqueo que requiere decisión;
- descubre una alternativa que excede su autoridad;
- necesita revisión antes de continuar;

debe:

1. dejar en la issue el comentario de entrega con el contexto necesario;
2. retirar `PROGRAMADOR`;
3. asignar `TECH LEAD`.

No debe cerrar por sí mismo una issue simplemente porque haya terminado su ejecución técnica, salvo que el procedimiento de una issue concreta lo autorice expresamente.

### Traspaso Tech Lead → Desarrollo

Si tras revisar la issue el Tech Lead determina que Desarrollo debe continuar:

1. registra la decisión o corrección necesaria en la issue;
2. retira `TECH LEAD`;
3. asigna `PROGRAMADOR`.

Si la issue queda aparcada, pendiente de otra dependencia o pasa a backlog, el Tech Lead retira la label de turno y mantiene su responsabilidad de supervisión.

### Cierre

Cuando el Tech Lead valida que la issue puede cerrarse, se retiran las labels de turno (`PROGRAMADOR` / `TECH LEAD`) y se cierra la issue.

Una issue cerrada no debe conservar una label que indique trabajo pendiente de un rol.

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

Después debe realizar el traspaso de label definido anteriormente cuando la siguiente actuación corresponda al Tech Lead.

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

1. Tech Lead define la issue `#7`, sus métricas y asigna `PROGRAMADOR`.
2. Desarrollo detecta `#7` en su cola y trabaja con el propietario en WSL2.
3. Desarrollo registra en `#7` instalación, errores, métricas, resultado y bloqueos.
4. Al terminar o necesitar decisión, cambia `PROGRAMADOR` por `TECH LEAD`.
5. Tech Lead detecta `#7` en su bandeja, revisa el resultado y decide la siguiente actuación.
6. Si hay que continuar, devuelve la issue a `PROGRAMADOR`; si está completada, retira labels de turno y la cierra; si debe esperar otra dependencia, la deja sin label de rol y mantiene su supervisión.

## Conflictos de información

Si memoria conversacional, documentación y GitHub se contradicen, se aplica este orden:

1. código/estado verificable del repositorio;
2. issue/PR/ADR vigente;
3. documentación actual del repositorio;
4. memoria o conversación de ChatGPT como contexto auxiliar.

La contradicción debe corregirse mediante issue; no se resuelve silenciosamente.