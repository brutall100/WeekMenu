import { define } from "../../../utils.ts";
import { fail, json } from "../../../lib/http.ts";
import { createPlanForUser } from "@backend/services/planner.ts";
import { AppError } from "@backend/lib/errors.ts";

/** Naujas planas kitai savaitei su tuo pačiu profiliu. */
export const handler = define.handlers({
  async POST(ctx) {
    try {
      const profile = ctx.state.user.profile;
      if (!profile) throw new AppError("Pirma užpildyk trumpą anketą.", 409);
      const plan = await createPlanForUser(ctx.state.user.id, profile);
      return json({ ok: true, planId: plan.id });
    } catch (error) {
      return fail(error);
    }
  },
});
