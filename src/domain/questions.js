export const CONSULTATION_MODES = Object.freeze({
  APP: "app",
  ARCHITECTURE: "arch",
});

export const QUESTION_BANK = Object.freeze({
  app: [
    {
      key: "negocio",
      variants: [
        "Para dimensionar tu app a medida: ¿Qué tipo de negocio tienes y qué hace exactamente?",
        "Cuéntame de tu negocio, ¿a qué se dedica y cómo opera hoy en el día a día?",
        "Para empezar: ¿qué hace tu empresa y cuál es su modelo de negocio principal?",
      ],
      placeholder: "Ej: Clínica veterinaria con 3 sedes, 40 empleados...",
    },
    {
      key: "problema",
      variants: [
        "¿Cuál es el mayor dolor hoy? ¿Qué pierdes en tiempo, dinero o clientes por no tener esta app?",
        "¿Dónde duele más la operación? ¿Qué tarea manual te quita más horas?",
        "Si tuvieras varita mágica, ¿qué proceso eliminarías mañana mismo?",
      ],
      placeholder: "Ej: Perdemos 10h/semana en Excel y citas duplicadas...",
    },
    {
      key: "volumen",
      variants: [
        "Hablemos de volumen. ¿Cuántos usuarios, transacciones o datos moverá al mes?",
        "¿Qué escala manejas? Usuarios activos, citas, pedidos o facturas mensuales.",
        "Para infra: ¿picos, usuarios concurrentes, datos al mes?",
      ],
      placeholder: "Ej: 200 usuarios, 1000 citas/mes...",
    },
    {
      key: "stack",
      variants: [
        "¿Qué herramientas usan hoy? ¿Hay algo que deba integrarse sí o sí?",
        "¿Stack actual? CRM, Excel, WordPress, Holded... ¿qué se queda y qué se jubila?",
        "¿Con qué convive la futura app? ¿Calendarios, facturación, WhatsApp?",
      ],
      placeholder: "Ej: Usamos Holded y Google Calendar...",
    },
    {
      key: "objetivo",
      variants: [
        "Última: Si en 6 meses la app es un éxito, ¿qué indicador habrá cambiado?",
        "¿Qué significa éxito en 6 meses? Ponle número: % menos, horas ahorradas, € más.",
        "Cierra con objetivo medible. ¿Qué KPI te diría 'ha merecido la pena'?",
      ],
      placeholder: "Ej: Reducir no-shows un 30% y automatizar facturación",
    },
  ],
  arch: [
    {
      key: "negocio",
      variants: [
        "Entendido, vamos a auditar arquitectura. ¿Qué tipo de sistema es y qué escala tiene hoy?",
        "¿Qué sistema mantenéis? SaaS, marketplace, ERP... ¿usuarios y edad del código?",
        "Dame contexto del sistema: tipo, usuarios, antigüedad.",
      ],
      placeholder: "Ej: SaaS B2B de facturación, 5k usuarios activos...",
    },
    {
      key: "problema",
      variants: [
        "¿Dónde duele más? ¿Caídas, lentitud, costes cloud, deuda técnica o escalabilidad?",
        "¿Cuál es el incendio actual? ¿La BBDD, la factura de AWS, los deploys con miedo?",
        "¿Qué síntoma te preocupa? ¿Caídas en picos, lentitud, coste?",
      ],
      placeholder: "Ej: La BBDD se cae en picos y AWS nos cuesta 4k/mes...",
    },
    {
      key: "volumen",
      variants: [
        "¿Cuál es el volumen y crecimiento esperado? (rps, datos, usuarios concurrentes)",
        "¿Picos y crecimiento? ¿Cuánto tráfico en hora punta y cuánto esperas en 6 meses?",
        "Dimensionemos: rps, GB, usuarios concurrentes y % crecimiento.",
      ],
      placeholder: "Ej: 300 rps pico, crecemos 20% mes...",
    },
    {
      key: "stack",
      variants: [
        "¿Stack actual? ¿Qué querrías mantener y qué te gustaría jubilar?",
        "¿Sobre qué corre hoy? ¿Monolito Laravel, Node, MySQL? ¿Qué se queda?",
        "¿Qué parte del stack te da más dolor y cuál quieres conservar?",
      ],
      placeholder: "Ej: Laravel + MySQL monolito, queremos microservicios...",
    },
    {
      key: "objetivo",
      variants: [
        "¿Objetivo arquitectónico a 6 meses? ¿Qué significa 'estar tranquilo' para tu equipo?",
        "¿Qué es estar tranquilo en 6 meses? ¿99.9% uptime, deploys diarios sin miedo?",
        "Define 'paz mental técnica' en 6 meses. ¿Qué métrica te deja dormir?",
      ],
      placeholder: "Ej: 99.9% uptime y deploys diarios sin miedo",
    },
  ],
});

export function pickQuestionVariant(question, random = Math.random) {
  const index = Math.floor(random() * question.variants.length);
  return question.variants[index];
}
