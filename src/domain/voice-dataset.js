function sampleDurationMs(sample = {}) {
  if (Number.isFinite(Number(sample.durationMs))) return Number(sample.durationMs);
  if (Number.isFinite(Number(sample.duration))) return Number(sample.duration) * 1000;
  return 0;
}

export function summarizeVoiceDataset(samples = []) {
  const totalDurationMs = samples.reduce((total, sample) => total + sampleDurationMs(sample), 0);
  const totalSeconds = totalDurationMs / 1000;
  const totalMinutes = totalSeconds / 60;
  const averageSeconds = samples.length ? totalSeconds / samples.length : 0;

  let quality = "Insuficiente — graba al menos 5 min";
  if (totalMinutes >= 10) quality = "Excelente — dataset premium";
  else if (totalMinutes >= 6) quality = "Muy bueno — válido para clonación";
  else if (totalMinutes >= 3) quality = "Bueno — cerca del mínimo";
  else if (totalMinutes >= 1) quality = "Básico — sigue grabando";

  return {
    count: samples.length,
    totalDurationMs,
    totalSeconds,
    totalMinutes,
    averageSeconds,
    quality,
    progressPercent: Math.min(100, (totalMinutes / 10) * 100),
  };
}

export function extensionForMimeType(mimeType = "") {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
}
