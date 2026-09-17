/** Data ISO formatu be laiko, pvz. "2026-09-17". */
export function isoDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Kurio pirmadienio savaitei priklauso ši diena.
 * Naudojam "šviežio starto" efektui: planas visada prasideda pirmadienį.
 */
export function weekStart(d: Date = new Date()): string {
  const copy = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  // getUTCDay(): 0 = sekmadienis. Mums pirmadienis = 0, todėl pasukam.
  const shift = (copy.getUTCDay() + 6) % 7;
  copy.setUTCDate(copy.getUTCDate() - shift);
  return isoDate(copy);
}

/** Kiek pilnų dienų praėjo tarp dviejų ISO datų. */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(fromIso + "T00:00:00Z");
  const to = Date.parse(toIso + "T00:00:00Z");
  return Math.round((to - from) / 86_400_000);
}
