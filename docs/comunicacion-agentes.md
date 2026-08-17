# Comunicación entre agentes — Yo-digital

Última actualización: 2026-08-17

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

En operación normal son mutuamente excluyentes: una issue abierta no debe mantener simultáneamente más de una label de turno (`PROGRAMADOR`, `TECH LEAD`, `PROPIETARIO`). Durante una transición técnica puede existir durante unos segundos la label anterior y la nueva, pero el estado final debe contener una sola.

### `PROGRAMADOR`

La siguiente actuación corresponde a Desarrollo / Integración local o a quien esté ejerciendo el rol de Programador.

Mientras una issue tenga `PROGRAMADOR`, Desarrollo debe considerarla parte de su cola de trabajo.

### `TECH LEAD`

Existe una actuación inmediata pendiente del Tech Lead: revisión, decisión, respuesta a un bloqueo, validación, redefinición de alcance o cierre.

Mientras una issue tenga `TECH LEAD`, forma parte de la bandeja de entrada activa del Tech Lead.

### `PROPIETARIO`

La siguiente actuación corresponde al propietario del producto. Se utiliza cuando Desarrollo o el Tech Lead no pueden continuar sin una intervención que solo el propietario puede realizar o validar.

Ejemplos:

- interacción física/local con el equipo del propietario;
- proporcionar de forma privada una credencial, audio, imagen u otro material que no debe publicarse en GitHub;
- validación humana de un resultado;
- decisión sobre costes, privacidad, seguridad o servicios externos reservada al propietario.

GitHub debe registrar qué tipo de actuación está pendiente y el estado del bloqueo, pero **nunca** el secreto, credencial, material biométrico o contenido privado en sí.

Mientras una issue tenga `PROPIETARIO`, ni Desarrollo ni el Tech Lead deben continuar el trabajo que dependa de esa actuación.

### Issue abierta sin label de rol

No significa que la issue carezca de responsable. Permanece bajo **responsabilidad de supervisión del Tech Lead**, pero no tiene una actuación inmediata asignada a Desarrollo, Tech Lead o propietario.

Puede representar, por ejemplo:

- backlog todavía no activado;
- trabajo pendiente de prioridad;
- una issue que espera una dependencia;
- una actuación futura que el Tech Lead debe vigilar.

El Tech Lead debe revisar periódicamente tanto las issues `TECH LEAD` como las issues abiertas sin label de rol. También debe vigilar que las issues `PROPIETARIO` vuelvan al circuito cuando el propietario complete su actuación. Por tanto, ninguna issue abierta queda huérfana.

### Dependencias y bloqueos

Cuando una issue no puede avanzar porque depende de otra, debe quedar escrito explícitamente en el cuerpo o en un comentario, por ejemplo: `Bloqueada por #17`.

Una issue que espera una dependencia puede permanecer sin label de rol. El Tech Lead es responsable de revisar su situación al cerrar o avanzar la issue de la que depende y de asignar entonces el siguiente turno (`PROGRAMADOR`, `TECH LEAD` o `PROPIETARIO`).

### Traspaso Desarrollo → Tech Lead

Cuando Desarrollo:

- completa el trabajo;
- alcanza un bloqueo que requiere decisión técnica;
- descubre una alternativa que excede su autoridad;
- necesita revisión antes de continuar;

debe:

1. dejar en la issue el comentario de entrega con el contexto necesario;
2. retirar `PROGRAMADOR`;
3. asignar `TECH LEAD`.

No debe cerrar por sí mismo una issue simplemente porque haya terminado su ejecución técnica, salvo que el procedimiento de una issue concreta lo autorice expresamente.

### Traspaso Desarrollo → Propietario

Si Desarrollo necesita una actuación que solo puede realizar el propietario:

1. deja un comentario describiendo la necesidad sin publicar información privada;
2. retira `PROGRAMADOR`;
3. asigna `PROPIETARIO`;
4. detiene el trabajo que dependa de esa actuación.

### Traspaso Tech Lead → Desarrollo

Si tras revisar la issue el Tech Lead determina que Desarrollo debe continuar:

1. registra la decisión o corrección necesaria en la issue;
2. retira `TECH LEAD`;
3. asigna `PROGRAMADOR`.

Si la issue queda aparcada, pendiente de otra dependencia o pasa a backlog, el Tech Lead retira la label de turno y mantiene su responsabilidad de supervisión.

### Traspaso Tech Lead → Propietario

Cuando la siguiente actuación requiere una decisión o acción reservada al propietario, el Tech Lead registra el contexto suficiente, retira `TECH LEAD` y asigna `PROPIETARIO`.

### Traspaso Propietario → siguiente rol

Cuando el propietario completa su actuación, la issue debe pasar al rol que pueda continuar:

- `PROPIETARIO` → `PROGRAMADOR` si Desarrollo debe seguir ejecutando;
- `PROPIETARIO` → `TECH LEAD` si corresponde revisión, decisión técnica o cierre;
- `PROPIETARIO` → sin label de turno si la issue vuelve a backlog/espera bajo supervisión del Tech Lead.

El propietario no necesita publicar en GitHub material privado usado durante su actuación; basta con dejar constancia de que la condición necesaria se ha completado cuando corresponda.

### Cierre

Cuando el Tech Lead valida que la issue puede cerrarse, se retiran las labels de turno (`PROGRAMADOR`, `TECH LEAD`, `PROPIETARIO`) y se cierra la issue.

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

## Decisiones requeridas
- Tech Lead / Propietario: ...
```

Después debe realizar el traspaso de label definido anteriormente según quién tenga la siguiente actuación.

No se deben publicar secretos, audios privados, imágenes biométricas, embeddings ni otros materiales sensibles en los comentarios.

## Respuesta del Tech Lead

El Tech Lead revisa la issue y responde mediante una de estas acciones:

- acepta el resultado y procede a revisión/cierre;
- solicita corrección dentro del alcance original;
- aclara una decisión de implementación;
- crea una nueva issue para trabajo descubierto fuera de alcance;
- escala al Product Owner / Arquitecto o propietario cuando la decisión excede el ámbito técnico del Tech Lead;
- transfiere el turno a `PROPIETARIO` cuando la siguiente actuación corresponde al propietario;
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

Las issues `PROPIETARIO` constituyen su cola de actuaciones pendientes. Al completar una de ellas, el turno debe transferirse al rol que corresponda para que el trabajo pueda continuar.

## Ejemplo: PoC MuseTalk

1. Tech Lead define la issue `#7`, sus métricas y asigna `PROGRAMADOR`.
2. Desarrollo detecta `#7` en su cola y trabaja con el propietario en WSL2.
3. Desarrollo llega a un punto que requiere interacción del propietario y deja el contexto necesario en la issue.
4. Cambia `PROGRAMADOR` por `PROPIETARIO` sin publicar material privado.
5. El propietario completa la actuación requerida.
6. La issue vuelve a `PROGRAMADOR` si Desarrollo debe continuar o a `TECH LEAD` si procede revisión/decisión.
7. Desarrollo registra instalación, errores, métricas, resultado y bloqueos.
8. Al terminar, cambia `PROGRAMADOR` por `TECH LEAD`.
9. Tech Lead revisa y, si está completada, retira las labels de turno y cierra la issue.

## Conflictos de información

Si memoria conversacional, documentación y GitHub se contradicen, se aplica este orden:

1. código/estado verificable del repositorio;
2. issue/PR/ADR vigente;
3. documentación actual del repositorio;
4. memoria o conversación de ChatGPT como contexto auxiliar.

La contradicción debe corregirse mediante issue; no se resuelve silenciosamente.
