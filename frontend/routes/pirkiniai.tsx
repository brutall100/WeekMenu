import { define } from "../utils.ts";
import { Layout } from "../components/Layout.tsx";
import { Card, EmptyState, LinkButton } from "../components/ui.tsx";
import { getActivePlan } from "@backend/db/repositories/plans.ts";
import { getMeals } from "@backend/db/repositories/meals.ts";
import { buildShoppingList } from "@backend/services/shopping.ts";

export default define.page(async function ShoppingPage(ctx) {
  const plan = await getActivePlan(ctx.state.user.id);

  if (!plan) {
    return (
      <Layout engagement={ctx.state.engagement} active="/pirkiniai">
        <EmptyState
          emoji="🛒"
          title="Sąrašas atsiras kartu su planu"
          body="Pirkinių sąrašas sudedamas automatiškai iš savaitės plano receptų."
          action={<LinkButton href="/pradzia">Susikurti planą</LinkButton>}
        />
      </Layout>
    );
  }

  const meals = await getMeals(plan.entries.map((e) => e.mealId));
  const household = ctx.state.user.profile?.household ?? 1;
  const sections = buildShoppingList(plan, meals, household, {
    onlyUndone: true,
  });
  const totalLines = sections.reduce((n, s) => n + s.lines.length, 0);

  return (
    <Layout engagement={ctx.state.engagement} active="/pirkiniai">
      <header class="mb-6">
        <h1 class="font-display text-3xl font-bold text-ink">
          Pirkinių sąrašas
        </h1>
        <p class="mt-1 text-sm text-ink-soft">
          {totalLines} prekės · {household}{" "}
          žmonėms · tik dar nepagamintiems patiekalams
        </p>
      </header>

      {totalLines === 0
        ? (
          <EmptyState
            emoji="🎉"
            title="Viskas jau pagaminta"
            body="Šios savaitės sąrašas tuščias, nes visi patiekalai pažymėti kaip pagaminti."
            action={
              <LinkButton href="/pradzia">Planas kitai savaitei</LinkButton>
            }
          />
        )
        : (
          <div class="grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <Card key={section.aisle}>
                <h2 class="font-display text-lg font-bold capitalize text-ink">
                  {section.aisle}
                </h2>
                <ul class="mt-3 space-y-2">
                  {section.lines.map((line) => (
                    <li
                      key={`${line.name}-${line.unit}`}
                      class="flex items-start gap-2 text-sm"
                    >
                      {/* Varnelė be serverio: pirkdamas žmogus žymi sau. */}
                      <input
                        type="checkbox"
                        class="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-fresh)]"
                      />
                      <span class="text-ink">
                        {line.name}
                        <span class="text-ink-soft">
                          — {line.amount} {line.unit}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}

      <p class="mt-6 text-sm text-ink-soft">
        Patarimas: atsidaryk šį puslapį telefone parduotuvėje. Varnelės laikosi,
        kol neperkrauni.
      </p>
    </Layout>
  );
});
