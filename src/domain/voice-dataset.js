function sampleDurationMs(sample = {}) {
  if (Number.isFinite(Number(sample.durationMs))) return Number(sample.durationMs);
  if (Number.isFinite(Number(sample.duration))) return Number(sample.duration) * 1000;
  return 0;
}

const INSTANT_REFERENCE_MINUTES = 2;
const PROFESSIONAL_REFERENCE_MINUTES = 30;

export function summarizeVoiceDataset(samples = []) {
  const totalDurationMs = samples.reduce((total, sample) => total + sampleDurationMs(sample), 0);
  const totalSeconds = totalDurationMs / 1000;
  const totalMinutes = totalSeconds / 60;
  const averageSeconds = samples.length ? totalSeconds / samples.length : 0;

  let quality = "Insuficiente — objetivo inicial: 1–2 min de voz limpia";
  if (totalMinutes >= PROFESSIONAL_REFERENCE_MINUTES) {
    quality = "Dataset amplio — candidato a clonación profesional";
  } else if (totalMinutes >= INSTANT_REFERENCE_MINUTES) {
    quality = "Listo para probar clonación instantánea — sigue grabando para mayor fidelidad";
  } else if (totalMinutes >= 1) {
    quality = "Casi listo para una primera clonación instantánea";
  }

  return {
    count: samples.length,
    totalDurationMs,
    totalSeconds,
    totalMinutes,
    averageSeconds,
    quality,
    instantProgressPercent: Math.min(100, (totalMinutes / INSTANT_REFERENCE_MINUTES) * 100),
    professionalProgressPercent: Math.min(100, (totalMinutes / PROFESSIONAL_REFERENCE_MINUTES) * 100),
    progressPercent: Math.min(100, (totalMinutes / PROFESSIONAL_REFERENCE_MINUTES) * 100),
  };
}

export function extensionForMimeType(mimeType = "") {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
}
