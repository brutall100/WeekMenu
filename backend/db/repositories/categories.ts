import { getKv } from "../kv.ts";
import { keys } from "../keys.ts";
import type { Category } from "@shared/types.ts";

export async function listCategories(): Promise<Category[]> {
  const kv = await getKv();
  const out: Category[] = [];
  for await (
    const e of kv.list<Category>({ prefix: keys.categoriesPrefix() })
  ) {
    out.push(e.value);
  }
  return out.sort((a, b) => a.order - b.order);
}

export async function getCategory(id: string): Promise<Category | null> {
  const kv = await getKv();
  return (await kv.get<Category>(keys.category(id))).value;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const kv = await getKv();
  const ref = await kv.get<string>(keys.categoryBySlug(slug));
  return ref.value ? await getCategory(ref.value) : null;
}

/** Įrašo kategoriją ir kartu jos slug indeksą – abu arba nė vieno. */
export async function saveCategory(category: Category): Promise<void> {
  const kv = await getKv();
  const res = await kv.atomic()
    .set(keys.category(category.id), category)
    .set(keys.categoryBySlug(category.slug), category.id)
    .commit();
  if (!res.ok) throw new Error("Nepavyko įrašyti kategorijos");
}
