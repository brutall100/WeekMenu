/**
 * Sugeneruoja patiekalus su Claude ir įrašo į duomenų bazę.
 *
 * Paleidimas:
 *   deno task generate                     # po 8 kiekvienai kategorijai
 *   deno task generate diabetikams 12      # 12 patiekalų vienai kategorijai
 */
import { aiEnabled } from "@backend/ai/client.ts";
import { generateMeals } from "@backend/ai/generate.ts";
import { listCategories } from "@backend/db/repositories/categories.ts";
import {
  listMealsByCategory,
  saveMeals,
} from "@backend/db/repositories/meals.ts";
import { closeKv } from "@backend/db/kv.ts";

if (!aiEnabled()) {
  console.error("Nėra ANTHROPIC_API_KEY. Įrašyk jį į .env failą.");
  Deno.exit(1);
}

const [slugArg, countArg] = Deno.args;
const count = Number(countArg) || 8;

const all = await listCategories();
const targets = slugArg ? all.filter((c) => c.slug === slugArg) : all;

if (targets.length === 0) {
  console.error(
    `Kategorija "${slugArg}" nerasta. Turimos: ${
      all.map((c) => c.slug).join(", ")
    }`,
  );
  Deno.exit(1);
}

for (const category of targets) {
  const existing = await listMealsByCategory(category.id);
  console.log(
    `${category.emoji} ${category.name}: turim ${existing.length}, generuojam ${count}...`,
  );
  try {
    const meals = await generateMeals({
      category,
      count,
      existingNames: existing.map((m) => m.name),
    });
    await saveMeals(meals);
    console.log(
      `   ✓ įrašyta ${meals.length}: ${meals.map((m) => m.name).join(", ")}`,
    );
  } catch (error) {
    console.error(
      `   ✗ nepavyko: ${error instanceof Error ? error.message : error}`,
    );
  }
}

await closeKv();
