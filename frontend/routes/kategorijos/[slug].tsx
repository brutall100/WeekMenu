import { HttpError } from "fresh";
import { define } from "../../utils.ts";
import { Layout } from "../../components/Layout.tsx";
import { MealCard } from "../../components/MealCard.tsx";
import { Card, EmptyState, LinkButton } from "../../components/ui.tsx";
import GenerateMealsButton from "../../islands/GenerateMealsButton.tsx";
import { getCategoryBySlug } from "@backend/db/repositories/categories.ts";
import { listMealsByCategory } from "@backend/db/repositories/meals.ts";
import { aiEnabled } from "@backend/ai/client.ts";

export default define.page(async function CategoryPage(ctx) {
  const category = await getCategoryBySlug(ctx.params.slug);
  if (!category) throw new HttpError(404);

  const meals = await listMealsByCategory(category.id);

  return (
    <Layout engagement={ctx.state.engagement} active="/kategorijos">
      <header class="mb-6">
        <a href="/kategorijos" class="text-sm text-ink-soft hover:text-ink">
          ← Kategorijos
        </a>
        <h1 class="mt-2 font-display text-3xl font-bold text-ink">
          {category.emoji} {category.name}
        </h1>
        <p class="mt-1 text-ink-soft">{category.summary}</p>
      </header>

      {
        /* Taisyklės rodomos atvirai – tai kuria pasitikėjimą.
          Žmogus mato, kad tai ne atsitiktiniai receptai. */
      }
      <Card class="mb-8">
        <h2 class="font-semibold text-ink">Taisyklės, kurių laikomasi</h2>
        <ul class="mt-3 space-y-2">
          {category.rules.map((rule) => (
            <li key={rule} class="flex gap-2 text-sm text-ink-soft">
              <span class="text-fresh">✓</span>
              {rule}
            </li>
          ))}
        </ul>
      </Card>

      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-display text-2xl font-bold text-ink">
          Patiekalai ({meals.length})
        </h2>
        <GenerateMealsButton categoryId={category.id} enabled={aiEnabled()} />
      </div>

      {meals.length === 0
        ? (
          <EmptyState
            emoji="🍳"
            title="Šiai kategorijai patiekalų dar nėra"
            body="Paspausk generavimo mygtuką arba susikurk planą – patiekalai atsiras automatiškai."
            action={<LinkButton href="/pradzia">Susikurti planą</LinkButton>}
          />
        )
        : (
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meals.map((meal) => <MealCard key={meal.id} meal={meal} />)}
          </div>
        )}
    </Layout>
  );
});
