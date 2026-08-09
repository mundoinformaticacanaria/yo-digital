# Reglas de negocio conocidas

## Señales del motor heredado

El motor normaliza todas las respuestas a minúsculas y detecta cuatro señales:

- **Escala alta:** `1000`, `10k`, `20k`, `alto`, `escala`, `mucho`, `miles`.
- **Legacy:** `excel`, `wordpress`, `legacy`, `monolito`, `php antiguo`.
- **Tiempo real/operación:** `tiempo real`, `chat`, `notificacion`, `cita`, `reserva`, `remision`, `veterinaria`.
- **SaaS/dominio:** `saas`, `b2b`, `suscripcion`, `multi-tenant`, `veterinaria`, `remisiones`.

## Modo App a medida

La recomendación cambia según las señales:

- Legacy modifica el diagnóstico.
- SaaS/dominio selecciona una propuesta de frontend orientada a Next.js/PWA/roles; en caso contrario propone Next.js + React Native/Expo cuando haya movilidad.
- Escala alta selecciona backend NestJS + tRPC + BullMQ/Redis; en caso contrario propone Supabase como MVP y migración posterior.
- Tiempo real selecciona PostgreSQL + Realtime + RLS + Redis; en caso contrario PostgreSQL + Prisma + almacenamiento de adjuntos.
- Integraciones se construyen usando el stack indicado por el usuario y webhooks/n8n.

El roadmap heredado se divide en tres fases aproximadas de 1-3, 4-8 y 9-12 semanas.

## Modo Consultoría/Arquitectura

- Escala alta modifica el diagnóstico hacia riesgo por límites del sistema.
- La arquitectura heredada propone desacoplar frontend, aplicar patrón Strangler al backend, PostgreSQL/Redis y observabilidad.
- El roadmap se divide en auditoría, observabilidad/aislamiento y migración por oleadas.

## Regla de reconstrucción

Estas reglas se consideran **compatibilidad heredada**, no necesariamente la estrategia técnica futura correcta. Primero deben cubrirse con tests. Después podrán evolucionar mediante decisiones de producto documentadas.

## Riesgos detectados

- Las reglas mezclan señales genéricas con referencias veterinarias específicas.
- Algunas recomendaciones tecnológicas están codificadas como respuesta fija aunque el contexto no siempre las justifique.
- Las expresiones regulares son sensibles a variantes lingüísticas y acentos.
- El resultado aparenta razonamiento, pero actualmente es selección de plantillas determinista.
