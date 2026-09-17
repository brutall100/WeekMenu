/**
 * VISI KV raktai vienoje vietoje.
 *
 * Deno KV neturi lentelių ar SQL. Ji turi tik raktus ir reikšmes,
 * kaip didelis žodynas. Raktas – masyvas, pvz. ["meal", "01J..."].
 * Norint "ieškoti pagal kategoriją", reikia pačiam pasidaryti indeksą:
 * antrą įrašą, kurio raktas prasideda kategorija.
 *
 * Laikom juos čia, kad niekada neliktų dviejų skirtingų rašybų.
 */
export const keys = {
  category: (id: string) => ["category", id] as const,
  categoryBySlug: (slug: string) => ["category_by_slug", slug] as const,
  categoriesPrefix: () => ["category"] as const,

  meal: (id: string) => ["meal", id] as const,
  mealsPrefix: () => ["meal"] as const,
  /** Indeksas: visi kategorijos patiekalai. */
  mealByCategory: (categoryId: string, mealId: string) =>
    ["meal_by_category", categoryId, mealId] as const,
  mealsByCategoryPrefix: (categoryId: string) =>
    ["meal_by_category", categoryId] as const,

  user: (id: string) => ["user", id] as const,

  plan: (userId: string, planId: string) => ["plan", userId, planId] as const,
  plansPrefix: (userId: string) => ["plan", userId] as const,
  /** Kuris planas šiuo metu aktyvus šiam žmogui. */
  activePlan: (userId: string) => ["plan_active", userId] as const,

  engagement: (userId: string) => ["engagement", userId] as const,

  story: (id: string) => ["story", id] as const,
  storiesPrefix: () => ["story"] as const,

  /** Žymė, kad pradinė duomenų sėkla jau pasėta. */
  seeded: () => ["meta", "seeded"] as const,

  /** Statistika: bendras įvykio skaitliukas nuo pat pradžių. */
  statTotal: (event: string) => ["stat_total", event] as const,
  statTotalsPrefix: () => ["stat_total"] as const,
  /** Statistika: to paties įvykio skaitliukas vienai dienai. */
  statDay: (date: string, event: string) => ["stat_day", date, event] as const,
  statDayPrefix: (date: string) => ["stat_day", date] as const,
  /** Vieno lankytojo kelias: kada pirmą kartą, kada paskutinį, ką pasiekė. */
  visitor: (userId: string) => ["visitor", userId] as const,
  visitorsPrefix: () => ["visitor"] as const,
};
