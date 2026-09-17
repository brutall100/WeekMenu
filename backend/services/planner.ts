import { newId } from "../lib/id.ts";
import { weekStart } from "../lib/dates.ts";
import { ensureMeals } from "./catalog.ts";
import { savePlan } from "../db/repositories/plans.ts";
import { AppError } from "../lib/errors.ts";
import { MEAL_SLOTS } from "@shared/types.ts";
import type {
  Meal,
  MealSlot,
  PlanEntry,
  Profile,
  WeekPlan,
} from "@shared/types.ts";

/** Savaitgalis: šeštadienis (5) ir sekmadienis (6) – laiko gaminti daugiau. */
function isWeekend(day: number): boolean {
  return day >= 5;
}

/**
 * Ar patiekalas tinka šiai dienai ir šiam valgymui.
 * Darbo dieną gerbiam žmogaus turimą laiką; savaitgalį leidžiam dvigubai.
 */
function fits(
  meal: Meal,
  slot: MealSlot,
  day: number,
  profile: Profile,
): boolean {
  if (!meal.slots.includes(slot)) return false;
  const budget = isWeekend(day)
    ? profile.minutesPerDay * 2
    : profile.minutesPerDay;
  if (meal.minutes > budget) return false;
  const text = `${meal.name} ${meal.description} ${
    meal.ingredients.map((i) => i.name).join(" ")
  }`
    .toLowerCase();
  return !profile.dislikes.some((d) =>
    d.trim() && text.includes(d.trim().toLowerCase())
  );
}

/**
 * Sudėlioja savaitės planą.
 *
 * Taisyklė, kurios laikomasi griežtai: tas pats patiekalas nekartojamas,
 * kol nepanaudoti visi tinkami. Pasikartojimas – dažniausia priežastis,
 * dėl kurios žmonės meta maisto planavimo programėles.
 */
export function composePlan(opts: {
  userId: string;
  profile: Profile;
  meals: Meal[];
  weekStartIso?: string;
}): WeekPlan {
  const { userId, profile, meals } = opts;
  const slots = profile.slots.length ? profile.slots : ["pietūs" as MealSlot];
  const entries: PlanEntry[] = [];

  // Kiekvienam valgymui vedam savo "krepšelį" ir semiam iš jo,
  // kol ištuštėja – tada pripildom iš naujo.
  const pools = new Map<MealSlot, Meal[]>();

  for (let day = 0; day < 7; day++) {
    for (const slot of slots) {
      let pool = pools.get(slot) ?? [];
      let pick = pool.find((m) => fits(m, slot, day, profile));

      if (!pick) {
        pool = shuffle(meals.filter((m) => m.slots.includes(slot)));
        pick = pool.find((m) => fits(m, slot, day, profile)) ?? pool[0];
      }
      if (!pick) continue; // šitam valgymui patiekalų nėra – praleidžiam

      pools.set(slot, pool.filter((m) => m.id !== pick.id));
      entries.push({ day, slot, mealId: pick.id, done: false });
    }
  }

  if (entries.length === 0) {
    throw new AppError(
      "Nepavyko rasti tinkamų patiekalų. Pabandyk kitą kategoriją.",
      422,
    );
  }

  return {
    id: newId(),
    userId,
    categoryId: profile.categoryId,
    weekStart: opts.weekStartIso ?? weekStart(),
    entries,
    createdAt: new Date().toISOString(),
  };
}

/** Sumaišo masyvą (Fisher–Yates). Nauja kopija, originalo neliečiam. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Visas kelias: pasirūpinam patiekalais, sudėliojam planą, įrašom. */
export async function createPlanForUser(
  userId: string,
  profile: Profile,
): Promise<WeekPlan> {
  const slots = profile.slots.length ? profile.slots : [MEAL_SLOTS[1]];
  // Norim bent 1,5 karto daugiau patiekalų nei langelių – kad būtų iš ko rinktis.
  const need = Math.ceil(7 * slots.length * 1.5);
  const { meals } = await ensureMeals({
    categoryId: profile.categoryId,
    need,
    profile,
    slots,
  });
  const plan = composePlan({ userId, profile: { ...profile, slots }, meals });
  await savePlan(plan);
  return plan;
}

/**
 * Pakeičia vieną langelį kitu patiekalu.
 * Tai "nepatinka – duok kitą" mygtukas: žmogus jaučia, kad valdo planą,
 * o ne planas jį. Be šito mygtuko žmonės tiesiog uždaro puslapį.
 */
export function swapEntry(
  plan: WeekPlan,
  day: number,
  slot: MealSlot,
  candidates: Meal[],
): WeekPlan {
  const current = plan.entries.find((e) => e.day === day && e.slot === slot)
    ?.mealId;
  const suitable = candidates.filter((m) =>
    m.slots.includes(slot) && m.id !== current
  );

  // Pirma renkam tą, kurio šioje savaitėje dar nėra. Jei tokių nebėra –
  // leidžiam pasikartojimą, nes tylus "nieko negaliu" būtų blogiau
  // nei tas pats patiekalas du kartus per savaitę.
  const used = new Set(plan.entries.map((e) => e.mealId));
  const unused = suitable.filter((m) => !used.has(m.id));
  const pick = shuffle(unused.length > 0 ? unused : suitable)[0];

  if (!pick) {
    throw new AppError(
      "Šiam valgymui kitų patiekalų neturim. Sugeneruok naujų kategorijos puslapyje.",
      409,
    );
  }

  return {
    ...plan,
    entries: plan.entries.map((e) =>
      e.day === day && e.slot === slot
        ? { ...e, mealId: pick.id, done: false }
        : e
    ),
  };
}
