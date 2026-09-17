import { getKv } from "../kv.ts";
import { keys } from "../keys.ts";
import type { WeekPlan } from "@shared/types.ts";

export async function getPlan(
  userId: string,
  planId: string,
): Promise<WeekPlan | null> {
  const kv = await getKv();
  return (await kv.get<WeekPlan>(keys.plan(userId, planId))).value;
}

/** Planas, kurį žmogus mato atsidaręs /planas. */
export async function getActivePlan(userId: string): Promise<WeekPlan | null> {
  const kv = await getKv();
  const ref = await kv.get<string>(keys.activePlan(userId));
  return ref.value ? await getPlan(userId, ref.value) : null;
}

export async function savePlan(
  plan: WeekPlan,
  makeActive = true,
): Promise<void> {
  const kv = await getKv();
  let tx = kv.atomic().set(keys.plan(plan.userId, plan.id), plan);
  if (makeActive) tx = tx.set(keys.activePlan(plan.userId), plan.id);
  const res = await tx.commit();
  if (!res.ok) throw new Error("Nepavyko įrašyti plano");
}

/** Ankstesni planai – istorijai ir "žiūrėk, kiek jau nuveikei" jausmui. */
export async function listPlans(
  userId: string,
  limit = 12,
): Promise<WeekPlan[]> {
  const kv = await getKv();
  const out: WeekPlan[] = [];
  for await (
    const e of kv.list<WeekPlan>({ prefix: keys.plansPrefix(userId) }, {
      limit,
      reverse: true,
    })
  ) {
    out.push(e.value);
  }
  return out;
}
