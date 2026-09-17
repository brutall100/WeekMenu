import type { FunnelStep } from "@backend/services/analytics.ts";

/**
 * PILTUVĖLIS.
 *
 * Forma pasirinkta pagal darbą, kurį turi atlikti skaitytojas:
 * palyginti dydžius tvarkingose pakopose → horizontalios juostos.
 *
 * Viena spalva visoms juostoms, ne paletė: visose pakopose ta pati
 * populiacija, tik mažėjanti. Skirtingos spalvos meluotų, kad tai
 * skirtingi dalykai. Juostos ilgis jau koduoja dydį – antrą kartą
 * koduoti jį spalva būtų iššvaistytas kanalas.
 *
 * Struktūra – tikra `<table>`: taip vienu metu gaunam ir vaizdą,
 * ir prieinamą lentelę ekrano skaitytuvui. Visos reikšmės užrašytos
 * šalia, todėl informacijos niekada neneša vien spalva.
 */
export function Funnel({ steps }: { steps: FunnelStep[] }) {
  const top = steps[0]?.count ?? 0;

  return (
    <table class="w-full border-collapse">
      <caption class="sr-only">
        Piltuvėlis: kiek žmonių pasiekė kiekvieną pakopą
      </caption>
      <thead>
        <tr class="text-left text-xs uppercase tracking-wide text-ink-soft">
          <th scope="col" class="pb-2 font-medium">Pakopa</th>
          <th scope="col" class="pb-2 text-right font-medium">Žmonių</th>
          <th scope="col" class="pb-2 text-right font-medium">Nuo pradžios</th>
          <th scope="col" class="pb-2 text-right font-medium">Išliko</th>
        </tr>
      </thead>
      <tbody>
        {steps.map((step) => {
          const width = top === 0 ? 0 : (step.count / top) * 100;
          // Kritimas daugiau nei 50% nuo praeitos pakopos – verta pažiūrėti.
          const isDrop = step.percentOfPrevious !== null &&
            step.percentOfPrevious < 50;

          return (
            <tr key={step.id} class="align-middle">
              <td class="py-2 pr-3">
                <div class="text-sm font-medium text-ink">{step.label}</div>
                {/* Juosta: plona, suapvalintais galais, 2px tarpas iki fono. */}
                <div class="mt-1.5 h-2.5 w-full rounded-full bg-line/60">
                  <div
                    class="h-full rounded-full bg-brand"
                    style={{
                      width: `${Math.max(width, step.count > 0 ? 1.5 : 0)}%`,
                    }}
                  />
                </div>
              </td>
              <td class="py-2 text-right text-sm font-semibold tabular-nums text-ink">
                {step.count}
              </td>
              <td class="py-2 pl-3 text-right text-sm tabular-nums text-ink-soft">
                {step.percentOfTop}%
              </td>
              <td
                class={`py-2 pl-3 text-right text-sm tabular-nums ${
                  isDrop ? "font-semibold text-brand-strong" : "text-ink-soft"
                }`}
              >
                {step.percentOfPrevious === null
                  ? "—"
                  : `${step.percentOfPrevious}%`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
