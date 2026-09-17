import { define } from "../../../utils.ts";
import { fail, json, readJson } from "../../../lib/http.ts";
import { getActivePlan, savePlan } from "@backend/db/repositories/plans.ts";
import {
  getEngagement,
  saveEngagement,
} from "@backend/db/repositories/engagement.ts";
import {
  currentStreak,
  registerCooked,
  weekProgress,
} from "@backend/services/engagement.ts";
import { AppError } from "@backend/lib/errors.ts";
import type { MealSlot } from "@shared/types.ts";

/**
 * „Pagaminau“ mygtukas.
 *
 * Tai vienintelis veiksmas, kuris augina seriją, todėl jis turi būti
 * pigus (vienas paspaudimas) ir iš karto duoti matomą atsakymą –
 * naują serijos skaičių ir, jei pelnytas, ženkliuką.
 */
export const handler = define.handlers({
  async POST(ctx) {
    try {
      const { day, slot, done } = await readJson<
        { day: number; slot: MealSlot; done: boolean }
      >(ctx.req);

      const plan = await getActivePlan(ctx.state.user.id);
      if (!plan) throw new AppError("Neturi aktyvaus plano.", 404);

      const target = plan.entries.find((e) => e.day === day && e.slot === slot);
      if (!target) throw new AppError("Tokio langelio plane nėra.", 404);

      const wasDone = target.done;
      target.done = Boolean(done);
      await savePlan(plan, false);

      // Seriją auginam tik kai pažymima IŠ NAUJO. Atžymėjimas jos neatima:
      // žmogus tikrai gamino, o klaidingas paspaudimas neturi bausti.
      let engagement = await getEngagement(ctx.state.user.id);
      let newBadges: { id: string; name: string; emoji: string }[] = [];

      if (!wasDone && target.done) {
        const result = registerCooked(engagement);
        engagement = result.engagement;
        newBadges = result.newBadges.map((b) => ({
          id: b.id,
          name: b.name,
          emoji: b.emoji,
        }));
        await saveEngagement(engagement);
      }

      return json({
        ok: true,
        done: target.done,
        streak: currentStreak(engagement),
        bestStreak: engagement.bestStreak,
        totalCooked: engagement.totalCooked,
        progress: weekProgress(plan),
        newBadges,
      });
    } catch (error) {
      return fail(error);
    }
  },
});
