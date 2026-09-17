import { HttpError } from "fresh";
import { define } from "../utils.ts";
import { Layout } from "../components/Layout.tsx";
import { Card } from "../components/ui.tsx";
import { Funnel } from "../components/Funnel.tsx";
import { statsAllowed } from "@backend/services/stats_access.ts";
import { overview } from "@backend/services/analytics.ts";
import { getDay, getTotals } from "@backend/db/repositories/stats.ts";
import { isoDate } from "@backend/lib/dates.ts";
import { EVENT_LABELS, EVENTS } from "@shared/events.ts";

/** Paskutinių N dienų datos, naujausia pirma. */
function lastDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(isoDate(d));
  }
  return out;
}

export default define.page(async function Stats(ctx) {
  // Be teisingo rakto puslapio tiesiog nėra – ne „prisijunk", o 404.
  // Taip net nepasakom, kad toks adresas egzistuoja.
  if (!statsAllowed(ctx.url)) throw new HttpError(404);

  const days = lastDays(14);
  const [data, totals, daily] = await Promise.all([
    overview(),
    getTotals(),
    Promise.all(days.map((d) => getDay(d))),
  ]);

  const maxDaily = Math.max(1, ...daily.map((row) => row.apsilankymas ?? 0));

  return (
    <Layout engagement={ctx.state.engagement}>
      <header class="mb-8">
        <h1 class="font-display text-3xl font-bold text-ink">Statistika</h1>
        <p class="mt-1 text-sm text-ink-soft">
          Privatus puslapis. Duomenys neišeina iš mūsų duomenų bazės – jokių
          trečiųjų šalių, jokių asmens duomenų.
        </p>
      </header>

      {/* Pagrindiniai skaičiai – trys, ne dvylika. */}
      <div class="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Iš viso žmonių", value: data.visitors },
          { label: "Nauji šiandien", value: data.newToday },
          {
            label: "Grįžo antrą savaitę",
            value: `${data.funnel.at(-1)?.percentOfTop ?? 0}%`,
          },
        ].map((tile) => (
          <Card key={tile.label}>
            <div class="text-sm text-ink-soft">{tile.label}</div>
            <div class="mt-1 font-display text-4xl font-bold tabular-nums text-ink">
              {tile.value}
            </div>
          </Card>
        ))}
      </div>

      <Card class="mb-8">
        <h2 class="mb-4 font-display text-xl font-bold text-ink">Piltuvėlis</h2>
        <Funnel steps={data.funnel} />

        {data.drop && data.visitors > 0 && (
          <p class="mt-5 rounded-lg bg-brand-soft p-3 text-sm text-brand-strong">
            <strong>Didžiausias kritimas:</strong>{" "}
            „{data.drop.label}" – čia prarandam {data.drop.lost} žmones (išlieka
            {" "}
            {data.drop.percentOfPrevious ?? 0}% nuo praeitos pakopos). Būtent
            šitą vietą verta taisyti pirmiausia.
          </p>
        )}

        {data.visitors === 0 && (
          <p class="mt-5 text-sm text-ink-soft">
            Duomenų dar nėra. Skaičiai atsiras, kai svetainę aplankys pirmas
            žmogus.
          </p>
        )}
      </Card>

      <Card class="mb-8">
        <h2 class="mb-4 font-display text-xl font-bold text-ink">
          Paskutinės 14 dienų
        </h2>
        <table class="w-full border-collapse text-sm">
          <caption class="sr-only">Apsilankymai ir planai pagal dieną</caption>
          <thead>
            <tr class="text-left text-xs uppercase tracking-wide text-ink-soft">
              <th scope="col" class="pb-2 font-medium">Diena</th>
              <th scope="col" class="pb-2 font-medium">Apsilankymai</th>
              <th scope="col" class="pb-2 text-right font-medium">Planai</th>
              <th scope="col" class="pb-2 text-right font-medium">Pagaminta</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, i) => (
              <tr key={day}>
                <td class="py-1.5 pr-3 tabular-nums text-ink-soft">
                  {day.slice(5)}
                </td>
                <td class="w-1/2 py-1.5 pr-3">
                  <div class="flex items-center gap-2">
                    <div class="h-2 flex-1 rounded-full bg-line/60">
                      <div
                        class="h-full rounded-full bg-brand"
                        style={{
                          width: `${
                            ((daily[i].apsilankymas ?? 0) / maxDaily) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span class="w-8 text-right tabular-nums text-ink">
                      {daily[i].apsilankymas ?? 0}
                    </span>
                  </div>
                </td>
                <td class="py-1.5 pl-3 text-right tabular-nums text-ink-soft">
                  {daily[i].anketa_baigta ?? 0}
                </td>
                <td class="py-1.5 pl-3 text-right tabular-nums text-ink-soft">
                  {daily[i].pagamino ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <h2 class="mb-4 font-display text-xl font-bold text-ink">
          Visi įvykiai nuo pradžių
        </h2>
        <dl class="grid gap-3 sm:grid-cols-2">
          {EVENTS.map((event) => (
            <div
              key={event}
              class="flex justify-between gap-3 border-b border-line pb-2"
            >
              <dt class="text-sm text-ink-soft">{EVENT_LABELS[event]}</dt>
              <dd class="text-sm font-semibold tabular-nums text-ink">
                {totals[event] ?? 0}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </Layout>
  );
});
