import { CONSULTATION_MODES } from "./questions.js";
import { detectSignals } from "./signals.js";

function safeText(value, maxLength = 80) {
  return String(value ?? "").slice(0, maxLength);
}

function buildAppRecommendation(answers, signals) {
  const diagnostico = signals.legacy
    ? `Patrón clásico detectado: operación atrapada en herramientas no escalables (${safeText(answers.stack, 60)}...). El dolor en "${safeText(answers.problema)}" es fricción operativa pura. Cada semana sin automatizar es coste hundido, especialmente en flujos como remisiones veterinarias donde la trazabilidad es crítica.`
    : `Negocio con tracción validada (${safeText(answers.negocio, 60)}...). El cuello de botella en "${safeText(answers.problema)}" indica que has superado el Excel/WhatsApp. Necesitas sistema propietario, más aún para programa de remisiones.`;

  return {
    diagnostico,
    arquitectura: {
      frontend: signals.saas
        ? "Next.js 14 App Router + Tailwind + shadcn/ui. PWA para equipo en campo (veterinarios). Roles: clínica origen, especialista, admin."
        : "Next.js + React Native (Expo) si necesitas movilidad. Una codebase web/móvil.",
      backend: signals.highScale
        ? "NestJS + tRPC + BullMQ/Redis para picos de remisiones. Módulo de notificaciones (WhatsApp/Email) desacoplado."
        : "Supabase para MVP rápido (Auth, Realtime para estados de remisión), migra a NestJS + Postgres cuando valides.",
      bbdd: signals.realtime
        ? "PostgreSQL + Realtime + RLS. Tablas: clinics, referrals, cases, reports. Redis para caché de citas y búsquedas."
        : "PostgreSQL + Prisma. Backups PITR. S3 para informes/imágenes clínicas.",
      integraciones: `Conectores para ${answers.stack || "tu stack"} vía webhooks + n8n. Para veterinaria: integración con software clínico, Stripe/Holded, Calendar, WhatsApp Business API para avisos.`,
    },
    roadmap: {
      fase1: "Semana 1-3: Discovery + modelo de datos remisiones + MVP flujo crítico (crear remisión → notificar especialista → seguimiento). Usable desde día 10.",
      fase2: "Semana 4-8: Panel admin + roles + métricas + automatización notificaciones. Elimina 80% del trabajo manual.",
      fase3: "Semana 9-12: Hardening, adjuntos, informes, formación y traspaso. Quedas autónomo, sin vendor lock-in.",
    },
    proximos: [
      "Te preparo mapa de flujos de remisión en FigJam y presupuesto cerrado por fases.",
      "Si me pasas 1 Excel real de remisiones, te devuelvo modelo de datos en 48h.",
      "Siguiente paso: call de 30min para validar. Sin humo, sin comercial.",
    ],
  };
}

function buildArchitectureRecommendation(answers, signals) {
  const diagnostico = signals.highScale
    ? `Sistema en límite. ${answers.volumen ?? ""} con stack actual (${answers.stack ?? ""}) explica caídas y costes. Deuda técnica + falta de observabilidad = riesgo de negocio.`
    : `Arquitectura funcional pero frágil. El dolor en "${answers.problema ?? ""}" es síntoma de acoplamiento. Escalar ahora sin refactorizar es quemar dinero en infra.`;

  return {
    diagnostico,
    arquitectura: {
      frontend: "Desacoplar front del monolito: Next.js en Vercel Edge. BFF pattern. Feature flags con Flagsmith.",
      backend: "Strangler: aislar módulos críticos (ej: remisiones) a microservicios NestJS/Hono + API Gateway. Monolito como fallback.",
      bbdd: "PostgreSQL con réplicas lectura + particionado por fecha. Redis para caché/colas. ClickHouse para analítica de remisiones.",
      integraciones: "OpenTelemetry + Grafana Loki. CI/CD con preview envs. Cost optimizer: S3 Intelligent-Tiering + RDS right-sizing.",
    },
    roadmap: {
      fase1: "Semana 1-2: Auditoría 360º (código, infra, costes, logs). 3 quick wins que se pagan solos.",
      fase2: "Semana 3-6: Observabilidad + aislar 1 servicio crítico. Deploys sin downtime.",
      fase3: "Semana 7-12: Migración por oleadas, runbook y formación. Objetivo: -40% coste cloud, +99.9% uptime.",
    },
    proximos: [
      "Informe de arquitectura 5 páginas con diagrama C4 y estimación de ahorro.",
      "Checklist de seguridad y costes ocultos.",
      "45min revisión infra actual (read-only). NDA si lo necesitas.",
    ],
  };
}

export function buildRecommendation(answers, mode) {
  const signals = detectSignals(answers);

  if (mode === CONSULTATION_MODES.APP) {
    return buildAppRecommendation(answers, signals);
  }

  if (mode === CONSULTATION_MODES.ARCHITECTURE) {
    return buildArchitectureRecommendation(answers, signals);
  }

  throw new TypeError(`Unsupported consultation mode: ${mode}`);
}
