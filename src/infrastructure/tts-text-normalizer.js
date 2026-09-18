const NAME_PRONUNCIATIONS = Object.freeze([
  { pattern: /\bXerach\b/giu, spoken: "Será" },
]);

export function normalizeTtsText(text) {
  let value = String(text ?? "").trim();
  for (const { pattern, spoken } of NAME_PRONUNCIATIONS) {
    value = value.replace(pattern, spoken);
  }
  return value;
}
