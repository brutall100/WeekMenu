import { define } from "../utils.ts";
import { Layout } from "../components/Layout.tsx";
import { NudgeCard } from "../components/NudgeCard.tsx";
import { MealCard } from "../components/MealCard.tsx";
import { Card, LinkButton } from "../components/ui.tsx";
import { buildNudge } from "@backend/services/engagement.ts";
import { getActivePlan } from "@backend/db/repositories/plans.ts";
import { listCategories } from "@backend/db/repositories/categories.ts";
import { listMeals } from "@backend/db/repositories/meals.ts";
import { listStories } from "@backend/db/repositories/stories.ts";

export default define.page(async function Home(ctx) {
  const [plan, categories, meals, stories] = await Promise.all([
    getActivePlan(ctx.state.user.id),
    listCategories(),
    listMeals(60),
    listStories(2),
  ]);

  const nudge = buildNudge({ engagement: ctx.state.engagement, plan });
  const featured = meals.slice(0, 3);

  return (
    <Layout engagement={ctx.state.engagement}>
      {/* Pirmas ekranas: vienas pažadas, vienas mygtukas, jokio triukšmo. */}
      <section class="text-center">
        <h1 class="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Nustok kas vakarą klausti<br />
          <span class="text-brand">„ką šiandien valgom?“</span>
        </h1>
        <p class="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
          Trys klausimai – ir turi savaitės planą su receptais bei pirkinių
          sąrašu. Pritaikyta diabetikams, sportininkams, vegetarams ir dar
          septynioms grupėms.
        </p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <LinkButton href="/pradzia" class="px-7 py-3 text-base">
            Susikurti planą per 60 sekundžių
          </LinkButton>
          <LinkButton
            href="/patiekalai"
            variant="secondary"
            class="px-7 py-3 text-base"
          >
            Pirma pasižiūrėti patiekalus
          </LinkButton>
        </div>
        <p class="mt-3 text-sm text-ink-soft">
          Be registracijos. Be el. pašto. Iš karto.
        </p>
      </section>

      {/* Asmeninis kvietimas – keičiasi pagal tai, kur žmogus yra kelyje. */}
      <div class="mt-12">
        <NudgeCard nudge={nudge} />
      </div>

      <section class="mt-12">
        <h2 class="font-display text-2xl font-bold text-ink">
          Kaip tai veikia
        </h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "1",
              t: "Atsakai į tris klausimus",
              d: "Kam gaminam, kiek jūsų ir kiek turi laiko.",
            },
            {
              n: "2",
              t: "Claude sudėlioja savaitę",
              d: "Septynios dienos, jokių pasikartojimų, viskas pagal tavo taisykles.",
            },
            {
              n: "3",
              t: "Gamini ir žymi",
              d: "Kiekvienas pažymėjimas ilgina tavo seriją. Pirkinių sąrašas jau paruoštas.",
            },
          ].map((step) => (
            <Card key={step.n}>
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {step.n}
              </span>
              <h3 class="mt-3 font-semibold text-ink">{step.t}</h3>
              <p class="mt-1 text-sm text-ink-soft">{step.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section class="mt-12">
        <div class="flex items-baseline justify-between">
          <h2 class="font-display text-2xl font-bold text-ink">Kategorijos</h2>
          <a
            href="/kategorijos"
            class="text-sm font-semibold text-brand-strong"
          >
            Visos →
          </a>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`/kategorijos/${c.slug}`}
              class="rounded-full border border-line bg-surface-raised px-4 py-2 text-sm text-ink transition-colors hover:border-brand"
            >
              {c.emoji} {c.name}
            </a>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section class="mt-12">
          <div class="flex items-baseline justify-between">
            <h2 class="font-display text-2xl font-bold text-ink">
              Iš mūsų virtuvės
            </h2>
            <a
              href="/patiekalai"
              class="text-sm font-semibold text-brand-strong"
            >
              Visi →
            </a>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            {featured.map((meal) => <MealCard key={meal.id} meal={meal} />)}
          </div>
        </section>
      )}

      {/* Socialinis įrodymas. Tikri žmonės, tikri sakiniai. */}
      {stories.length > 0 && (
        <section class="mt-12">
          <div class="flex items-baseline justify-between">
            <h2 class="font-display text-2xl font-bold text-ink">
              Ką sako kiti
            </h2>
            <a
              href="/istorijos"
              class="text-sm font-semibold text-brand-strong"
            >
              Daugiau →
            </a>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            {stories.map((s) => (
              <Card key={s.id}>
                <h3 class="font-semibold text-ink">{s.title}</h3>
                <p class="mt-2 line-clamp-4 text-sm text-ink-soft">
                  {s.content}
                </p>
                <p class="mt-3 text-sm font-medium text-brand-strong">
                  — {s.author}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
});
