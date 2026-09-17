import type { ComponentChildren, JSX } from "preact";

/**
 * Pagrindiniai statybiniai blokai.
 * Taisyklė: jei tą patį stilių rašai trečią kartą – jam vieta čia.
 */

type ButtonVariant = "primary" | "secondary" | "ghost";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong shadow-sm",
  secondary: "bg-surface-raised text-ink border border-line hover:border-brand",
  ghost: "text-ink-soft hover:text-ink hover:bg-brand-soft",
};

export function Button(
  { variant = "primary", class: extra = "", ...props }:
    & JSX.ButtonHTMLAttributes<HTMLButtonElement>
    & { variant?: ButtonVariant },
) {
  return (
    <button
      {...props}
      class={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        BUTTON_STYLES[variant]
      } ${extra}`}
    />
  );
}

export function LinkButton(
  { variant = "primary", class: extra = "", ...props }:
    & JSX.AnchorHTMLAttributes<HTMLAnchorElement>
    & { variant?: ButtonVariant },
) {
  return (
    <a
      {...props}
      class={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
        BUTTON_STYLES[variant]
      } ${extra}`}
    />
  );
}

export function Card(
  { children, class: extra = "" }: {
    children: ComponentChildren;
    class?: string;
  },
) {
  return (
    <div
      class={`rounded-card border border-line bg-surface-raised p-5 ${extra}`}
    >
      {children}
    </div>
  );
}

export function Chip(
  { children, tone = "neutral" }: {
    children: ComponentChildren;
    tone?: "neutral" | "brand" | "fresh";
  },
) {
  const tones = {
    neutral: "bg-surface text-ink-soft border-line",
    brand: "bg-brand-soft text-brand-strong border-transparent",
    fresh: "bg-fresh-soft text-fresh border-transparent",
  };
  return (
    <span
      class={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
        tones[tone]
      }`}
    >
      {children}
    </span>
  );
}

/** Tuščio sąrašo būsena. Niekada nerodom tuščio ekrano be paaiškinimo. */
export function EmptyState(
  { emoji, title, body, action }: {
    emoji: string;
    title: string;
    body: string;
    action?: ComponentChildren;
  },
) {
  return (
    <div class="rounded-card border border-dashed border-line px-6 py-12 text-center">
      <div class="text-4xl">{emoji}</div>
      <h3 class="mt-3 text-lg font-semibold text-ink">{title}</h3>
      <p class="mx-auto mt-1 max-w-sm text-sm text-ink-soft">{body}</p>
      {action ? <div class="mt-5">{action}</div> : null}
    </div>
  );
}
