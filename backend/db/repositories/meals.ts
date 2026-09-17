import { getKv } from "../kv.ts";
import { keys } from "../keys.ts";
import type { Meal } from "@shared/types.ts";

export async function getMeal(id: string): Promise<Meal | null> {
  const kv = await getKv();
  return (await kv.get<Meal>(keys.meal(id))).value;
}

/** Keli patiekalai vienu kreipimusi – greičiau nei ciklas su await. */
export async function getMeals(ids: string[]): Promise<Map<string, Meal>> {
  const map = new Map<string, Meal>();
  if (ids.length === 0) return map;
  const kv = await getKv();
  const unique = [...new Set(ids)];
  // KV leidžia daugiausia 10 raktų viename getMany, todėl dalinam.
  for (let i = 0; i < unique.length; i += 10) {
    const batch = unique.slice(i, i + 10);
    const rows = await kv.getMany<Meal[]>(batch.map((id) => keys.meal(id)));
    for (const row of rows) {
      if (row.value) map.set(row.value.id, row.value);
    }
  }
  return map;
}

export async function listMeals(limit = 200): Promise<Meal[]> {
  const kv = await getKv();
  const out: Meal[] = [];
  for await (
    const e of kv.list<Meal>({ prefix: keys.mealsPrefix() }, { limit })
  ) {
    out.push(e.value);
  }
  return out;
}

export async function listMealsByCategory(
  categoryId: string,
  limit = 100,
): Promise<Meal[]> {
  const kv = await getKv();
  const ids: string[] = [];
  for await (
    const e of kv.list<string>({
      prefix: keys.mealsByCategoryPrefix(categoryId),
    }, { limit })
  ) {
    ids.push(e.value);
  }
  const map = await getMeals(ids);
  return ids.map((id) => map.get(id)).filter((m): m is Meal => Boolean(m));
}

/** Įrašo patiekalą ir po indekso įrašą kiekvienai jo kategorijai. */
export async function saveMeal(meal: Meal): Promise<void> {
  const kv = await getKv();
  let tx = kv.atomic().set(keys.meal(meal.id), meal);
  for (const categoryId of meal.categoryIds) {
    tx = tx.set(keys.mealByCategory(categoryId, meal.id), meal.id);
  }
  const res = await tx.commit();
  if (!res.ok) throw new Error("Nepavyko įrašyti patiekalo");
}

export async function saveMeals(meals: Meal[]): Promise<void> {
  // Atominiame bloke telpa ribotas įrašų kiekis, todėl sukam po vieną.
  for (const meal of meals) await saveMeal(meal);
}

export async function deleteMeal(meal: Meal): Promise<void> {
  const kv = await getKv();
  let tx = kv.atomic().delete(keys.meal(meal.id));
  for (const categoryId of meal.categoryIds) {
    tx = tx.delete(keys.mealByCategory(categoryId, meal.id));
  }
  await tx.commit();
}

export async function countMealsByCategory(
  categoryId: string,
): Promise<number> {
  const kv = await getKv();
  let n = 0;
  for await (
    const _ of kv.list({ prefix: keys.mealsByCategoryPrefix(categoryId) })
  ) n++;
  return n;
}
