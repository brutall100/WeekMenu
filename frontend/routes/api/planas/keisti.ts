import { define } from "../../../utils.ts";
import { fail, json, readJson } from "../../../lib/http.ts";
import { getActivePlan, savePlan } from "@backend/db/repositories/plans.ts";
import { listMealsByCategory } from "@backend/db/repositories/meals.ts";
import { swapEntry } from "@backend/services/planner.ts";
import { AppError } from "@backend/lib/errors.ts";
import { track } from "@backend/services/analytics.ts";
import type { MealSlot } from "@shared/types.ts";

/**
 * „Nepatinka – duok kitą“.
 *
 * Be šito mygtuko planas jaučiasi kaip įsakymas. Su juo – kaip pasiūlymas.
 * Žmonės, kurie bent kartą pakeičia patiekalą, plano laikosi kur kas dažniau,
 * nes jis tampa „jų“.
 */
export const handler = define.handlers({
  async POST(ctx) {
    try {
      const { day, slot } = await readJson<{ day: number; slot: MealSlot }>(
        ctx.req,
      );

      const plan = await getActivePlan(ctx.state.user.id);
      if (!plan) throw new AppError("Neturi aktyvaus plano.", 404);

      const candidates = await listMealsByCategory(plan.categoryId);
      const updated = swapEntry(plan, day, slot, candidates);
      await savePlan(updated, false);

      await track(ctx.state.user.id, "patiekalas_keistas");

      const entry = updated.entries.find((e) =>
        e.day === day && e.slot === slot
      );
      const meal = candidates.find((m) => m.id === entry?.mealId);

      return json({ ok: true, meal });
    } catch (error) {
      return fail(error);
    }
  },
});
