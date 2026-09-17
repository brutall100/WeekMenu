import { define } from "../../utils.ts";
import { fail, json, readJson } from "../../lib/http.ts";
import { saveProfile } from "@backend/db/repositories/users.ts";
import { createPlanForUser } from "@backend/services/planner.ts";
import { AppError } from "@backend/lib/errors.ts";
import { MEAL_SLOTS } from "@shared/types.ts";
import type { MealSlot, Profile } from "@shared/types.ts";

/**
 * Onboarding'o pabaiga: išsaugom profilį IR iš karto sudėliojam planą.
 *
 * Svarbu, kad tai būtų vienas veiksmas. Jei po anketos parodytume
 * „profilis išsaugotas“ ir liktų dar vienas mygtukas – dalis žmonių
 * tiesiog išeitų. Atlygis turi ateiti tą pačią sekundę.
 */
export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await readJson<Partial<Profile>>(ctx.req);

      if (!body.categoryId) throw new AppError("Pasirink kategoriją.");

      const slots = (body.slots ?? []).filter((s): s is MealSlot =>
        (MEAL_SLOTS as readonly string[]).includes(s)
      );

      const profile: Profile = {
        name: (body.name ?? "").slice(0, 60),
        categoryId: body.categoryId,
        household: clamp(Number(body.household) || 1, 1, 12),
        dislikes: (body.dislikes ?? []).map((d) => String(d).trim()).filter(
          Boolean,
        ).slice(0, 20),
        minutesPerDay: clamp(Number(body.minutesPerDay) || 30, 10, 180),
        slots: slots.length ? slots : ["pietūs", "vakarienė"],
      };

      await saveProfile(ctx.state.user.id, profile);
      const plan = await createPlanForUser(ctx.state.user.id, profile);

      return json({ ok: true, planId: plan.id, entries: plan.entries.length });
    } catch (error) {
      return fail(error);
    }
  },
});

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
