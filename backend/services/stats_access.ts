/**
 * Prieiga prie statistikos skydelio.
 *
 * Taisyklė – „fail closed": jei raktas serveryje nenustatytas,
 * puslapio NĖRA. Antraip vieną dieną kas nors paleistų projektą
 * be rakto ir skydelis tyliai taptų viešas.
 */
export function statsEnabled(): boolean {
  return Boolean(Deno.env.get("WEEKMENU_STATS_TOKEN"));
}

/**
 * Palyginimas pastoviu laiku.
 *
 * Įprastas `===` nutrūksta ties pirmu skirtingu simboliu, todėl
 * pagal atsakymo greitį raktą teoriškai galima atspėti po simbolį.
 * Čia visada peržiūrimi visi simboliai.
 */
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  // Skirtingo ilgio eilutes vis tiek lyginam iki galo, kad laikas nesiskirtų.
  let diff = aBytes.length ^ bBytes.length;
  const max = Math.max(aBytes.length, bBytes.length);
  for (let i = 0; i < max; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

export function statsAllowed(url: URL): boolean {
  const expected = Deno.env.get("WEEKMENU_STATS_TOKEN");
  if (!expected) return false;
  const given = url.searchParams.get("raktas") ?? "";
  return safeEqual(given, expected);
}
