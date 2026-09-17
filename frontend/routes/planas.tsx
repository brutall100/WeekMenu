import { define } from "../utils.ts";
import { Layout } from "../components/Layout.tsx";
import { EmptyState, LinkButton } from "../components/ui.tsx";
import PlanBoard from "../islands/PlanBoard.tsx";
import { getActivePlan } from "@backend/db/repositories/plans.ts";
import { getMeals } from "@backend/db/repositories/meals.ts";
import { getCategory } from "@backend/db/repositories/categories.ts";
import type { Meal } from "@shared/types.ts";

/** Kuri savaitės diena šiandien: 0 = pirmadienis. */
function todayIndex(): number {
  return (new Date().getDay() + 6) % 7;
}

export default define.page(async function PlanPage(ctx) {
  const plan = await getActivePlan(ctx.state.user.id);

  if (!plan) {
    return (
      <Layout engagement={ctx.state.engagement} active="/planas">
        <EmptyState
          emoji="📋"
          title="Plano dar nėra"
          body="Atsakyk į tris klausimus – po minutės čia bus visa savaitė su receptais."
          action={<LinkButton href="/pradzia">Susikurti planą</LinkButton>}
        />
      </Layout>
    );
  }

  const [mealMap, category] = await Promise.all([
    getMeals(plan.entries.map((e) => e.mealId)),
    getCategory(plan.categoryId),
  ]);

  // Signalams reikia paprasto objekto, ne Map – todėl paverčiam.
  const meals: Record<string, Meal> = {};
  for (const [id, meal] of mealMap) meals[id] = meal;

  return (
    <Layout engagement={ctx.state.engagement} active="/planas">
      <header class="mb-6">
        <h1 class="font-display text-3xl font-bold text-ink">
          Savaitės planas
        </h1>
        <p class="mt-1 text-sm text-ink-soft">
          {category ? `${category.emoji} ${category.name}` : "Tavo planas"}{" "}
          · savaitė nuo {plan.weekStart}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <LinkButton href="/pirkiniai" variant="secondary">
            🛒 Pirkinių sąrašas
          </LinkButton>
          <LinkButton href="/pradzia" variant="ghost">
            Sudaryti naują planą
          </LinkButton>
        </div>
      </header>

      <PlanBoard
        entries={plan.entries}
        meals={meals}
        todayIndex={todayIndex()}
      />
    </Layout>
  );
});
