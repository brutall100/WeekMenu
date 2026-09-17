import type { Nudge } from "@backend/services/engagement.ts";
import { LinkButton } from "./ui.tsx";

const TONE_STYLES = {
  sveikinimas: "border-fresh bg-fresh-soft",
  padrasinimas: "border-line bg-surface-raised",
  priminimas: "border-brand bg-brand-soft",
  kvietimas: "border-brand bg-brand-soft",
} as const;

/**
 * Viena žinutė, vienas mygtukas.
 * Sąmoningai nerodom kelių pasiūlymų vienu metu: kuo daugiau
 * pasirinkimų, tuo didesnė tikimybė, kad žmogus nepasirinks nieko.
 */
export function NudgeCard({ nudge }: { nudge: Nudge }) {
  return (
    <div class={`rounded-card border-l-4 p-5 ${TONE_STYLES[nudge.tone]}`}>
      <h2 class="font-display text-xl font-bold text-ink">{nudge.title}</h2>
      <p class="mt-1 text-sm text-ink-soft">{nudge.body}</p>
      <LinkButton href={nudge.href} class="mt-4">{nudge.cta}</LinkButton>
    </div>
  );
}
