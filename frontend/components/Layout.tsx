import type { ComponentChildren } from "preact";
import type { Engagement } from "@shared/types.ts";
import { currentStreak } from "@backend/services/engagement.ts";

const NAV = [
  { href: "/planas", label: "Mano planas" },
  { href: "/kategorijos", label: "Kategorijos" },
  { href: "/patiekalai", label: "Patiekalai" },
  { href: "/pirkiniai", label: "Pirkiniai" },
  { href: "/istorijos", label: "Istorijos" },
];

/** Serijos skaitliukas viršuje – matomas kiekviename puslapyje. */
function StreakChip({ engagement }: { engagement: Engagement }) {
  const streak = currentStreak(engagement);
  if (streak === 0) return null;
  return (
    <span
      class="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-strong"
      title={`Ilgiausia serija: ${engagement.bestStreak} d.`}
    >
      <span class="streak-flame">🔥</span>
      {streak}
    </span>
  );
}

export function Layout(
  { children, engagement, active }: {
    children: ComponentChildren;
    engagement: Engagement;
    active?: string;
  },
) {
  return (
    <div class="flex min-h-screen flex-col">
      <header class="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
        <div class="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <a href="/" class="font-display text-lg font-bold text-ink shrink-0">
            <span class="text-brand">Savaitės</span> planas
          </a>
          <nav class="ml-auto hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                class={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active === item.href
                    ? "bg-brand-soft font-semibold text-brand-strong"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div class="ml-auto sm:ml-0">
            <StreakChip engagement={engagement} />
          </div>
        </div>
        {/* Mobiliajame navigacija atskiroje juostoje, kad tilptų. */}
        <nav class="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 sm:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              class={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
                active === item.href
                  ? "bg-brand-soft font-semibold text-brand-strong"
                  : "text-ink-soft"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

      <footer class="border-t border-line">
        <div class="mx-auto max-w-5xl px-4 py-6 text-sm text-ink-soft">
          <p>
            Savaitės planas · mokyklinis projektas, statomas kaip tikras
            produktas.
          </p>
          <p class="mt-1">
            Patiekalus generuoja Claude. Tai nėra medicininė konsultacija –
            esant ligai pasitark su gydytoju ar dietologu.
          </p>
        </div>
      </footer>
    </div>
  );
}
