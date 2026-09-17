import type { Category, MealSlot, Profile } from "@shared/types.ts";

/**
 * Sistemos promptas – nuolatinis. Jis nesikeičia tarp užklausų,
 * todėl Claude gali jį laikyti kešą ir mes mokam mažiau.
 * Todėl viskas, kas kintama (kategorija, profilis), keliauja į user žinutę.
 */
export const SYSTEM_PROMPT =
  `Tu esi patyręs lietuvis maisto technologas ir šeimos virtuvės planuotojas.

Tavo darbas – kurti realius, gaminamus patiekalus lietuviškai kalbančiai šeimai.

Griežtos taisyklės:
- VISKAS lietuviškai: pavadinimai, aprašymai, ingredientai, žingsniai.
- Ingredientai turi būti realiai perkami įprastoje Lietuvos parduotuvėje.
- Kiekiai – vienai porcijai, tikroviški (ne "500 g druskos").
- Žingsniai – trumpi ir konkretūs, tarsi rašytum draugui, kuris gamina pirmą kartą.
- Maistinė vertė – apytikslė, bet įtikinama ir suderinta su ingredientais.
- Jokių pramanytų "stebuklingų" savybių ir jokių medicininių pažadų.
- Nesikartok: kiekvienas patiekalas viename atsakyme turi būti aiškiai skirtingas
  (skirtingas pagrindinis baltymas, skirtinga gaminimo technika).

Tu NESI gydytojas. Jei prašoma kažko medicinai pavojingo, siūlyk saugų variantą.`;

/** Užsakymas sugeneruoti patiekalus vienai kategorijai. */
export function mealsPrompt(opts: {
  category: Category;
  count: number;
  profile?: Profile | null;
  /** Ką jau turim – kad AI nepasiūlytų to paties dar kartą. */
  existingNames?: string[];
  slots?: MealSlot[];
}): string {
  const { category, count, profile, existingNames = [], slots } = opts;

  const lines = [
    `Sugalvok ${count} patiekalus kategorijai "${category.name}".`,
    ``,
    `Kategorijos esmė: ${category.summary}`,
    ``,
    `PRIVALOMOS šios kategorijos taisyklės:`,
    ...category.rules.map((r) => `- ${r}`),
  ];

  if (slots?.length) {
    lines.push(``, `Reikia patiekalų šiems valgymams: ${slots.join(", ")}.`);
  }

  if (profile) {
    lines.push(``, `Šeimos kontekstas:`);
    lines.push(`- Valgo ${profile.household} žmonės (-ių).`);
    lines.push(
      `- Darbo dieną gaminti turi ne daugiau ${profile.minutesPerDay} min.`,
    );
    if (profile.dislikes.length) {
      lines.push(
        `- NEVALGO ir negalima naudoti: ${profile.dislikes.join(", ")}.`,
      );
    }
  }

  if (existingNames.length) {
    lines.push(
      ``,
      `Šitie patiekalai JAU yra, sugalvok kitokių:`,
      ...existingNames.slice(0, 40).map((n) => `- ${n}`),
    );
  }

  lines.push(``, `Grąžink tiksliai ${count} patiekalus.`);
  return lines.join("\n");
}
