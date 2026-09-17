import { define } from "../../../utils.ts";
import { fail, json, readJson } from "../../../lib/http.ts";
import { aiEnabled } from "@backend/ai/client.ts";
import { generateMeals } from "@backend/ai/generate.ts";
import { getCategory } from "@backend/db/repositories/categories.ts";
import {
  listMealsByCategory,
  saveMeals,
} from "@backend/db/repositories/meals.ts";
import { AppError, NotFoundError } from "@backend/lib/errors.ts";
import { track } from "@backend/services/analytics.ts";

/**
 * Sugeneruoja naujų patiekalų kategorijai.
 *
 * Rezultatas įrašomas į duomenų bazę, todėl kitas lankytojas
 * tuos pačius patiekalus gaus iš karto ir nemokamai.
 */
export const handler = define.handlers({
  async POST(ctx) {
    try {
      if (!aiEnabled()) {
        throw new AppError(
          "AI generavimas išjungtas: serveryje nėra ANTHROPIC_API_KEY.",
          503,
        );
      }

      const { categoryId, count } = await readJson<
        { categoryId: string; count?: number }
      >(ctx.req);
      const category = await getCategory(categoryId);
      if (!category) throw new NotFoundError("Kategorija");

      const existing = await listMealsByCategory(category.id);
      const meals = await generateMeals({
        category,
        count: Math.min(Math.max(Number(count) || 4, 1), 8),
        profile: ctx.state.user.profile,
        existingNames: existing.map((m) => m.name),
      });

      await saveMeals(meals);
      await track(ctx.state.user.id, "ai_generavimas");
      return json({ ok: true, meals });
    } catch (error) {
      return fail(error);
    }
  },
});
