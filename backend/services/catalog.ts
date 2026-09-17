import { generateMeals } from "../ai/generate.ts";
import { aiEnabled } from "../ai/client.ts";
import { listMealsByCategory, saveMeals } from "../db/repositories/meals.ts";
import { getCategory } from "../db/repositories/categories.ts";
import { NotFoundError } from "../lib/errors.ts";
import type { Meal, MealSlot, Profile } from "@shared/types.ts";

/**
 * Patiekalų sandėlis.
 *
 * Svarbiausia mintis: AI kviečiamas TIK kai sandėlyje trūksta.
 * Sugeneruota vieną kartą – guli duomenų bazėje ir tarnauja visiems.
 * Todėl antras lankytojas gauna planą per milisekundes ir nemokamai.
 */
export interface EnsureOptions {
  categoryId: string;
  /** Kiek patiekalų reikia turėti sandėlyje. */
  need: number;
  profile?: Profile | null;
  slots?: MealSlot[];
}

export interface EnsureResult {
  meals: Meal[];
  /** Kiek naujų patiekalų teko sugeneruoti dabar. */
  generated: number;
}

export async function ensureMeals(opts: EnsureOptions): Promise<EnsureResult> {
  const category = await getCategory(opts.categoryId);
  if (!category) throw new NotFoundError("Kategorija");

  let meals = await listMealsByCategory(opts.categoryId);
  const missing = opts.need - meals.length;

  if (missing <= 0 || !aiEnabled()) {
    return { meals, generated: 0 };
  }

  // Generuojam po truputį: vienoje užklausoje daugiausia 8 patiekalai,
  // kad atsakymas grįžtų greitai ir nesibaigtų max_tokens.
  const batch = Math.min(missing, 8);
  const fresh = await generateMeals({
    category,
    count: batch,
    profile: opts.profile,
    slots: opts.slots,
    existingNames: meals.map((m) => m.name),
  });

  await saveMeals(fresh);
  meals = [...meals, ...fresh];
  return { meals, generated: fresh.length };
}
