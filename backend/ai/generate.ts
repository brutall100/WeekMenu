import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { getClient, model } from "./client.ts";
import { GeneratedMealsSchema } from "./schemas.ts";
import { mealsPrompt, SYSTEM_PROMPT } from "./prompts.ts";
import { newId } from "../lib/id.ts";
import { AppError } from "../lib/errors.ts";
import type { Category, Meal, MealSlot, Profile } from "@shared/types.ts";

/**
 * Kiek "pastangų" Claude įdeda. Receptai nėra sunki užduotis,
 * todėl "medium" duoda tą patį rezultatą pigiau nei numatytasis "high".
 * Nori kitaip – pakeisk WEEKMENU_AI_EFFORT aplinkos kintamąjį.
 */
function effort(): "low" | "medium" | "high" | "xhigh" | "max" {
  const v = Deno.env.get("WEEKMENU_AI_EFFORT");
  if (v === "low" || v === "high" || v === "xhigh" || v === "max") return v;
  return "medium";
}

export interface GenerateMealsOptions {
  category: Category;
  count: number;
  profile?: Profile | null;
  existingNames?: string[];
  slots?: MealSlot[];
}

/**
 * Paprašo Claude sugalvoti patiekalus ir grąžina juos jau kaip `Meal` objektus.
 *
 * `output_config.format` + zod schema reiškia, kad atsakymas ATEINA kaip
 * patikrintas JSON – nereikia nei `JSON.parse`, nei vilties, kad modelis
 * nepridės paaiškinimo prieš tekstą.
 */
export async function generateMeals(
  opts: GenerateMealsOptions,
): Promise<Meal[]> {
  const client = getClient();

  const response = await client.beta.messages.parse({
    model: model(),
    max_tokens: 16000,
    system: [
      // Pastovi dalis pažymima kešavimui – kartojasi kiekvienoje užklausoje.
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: mealsPrompt(opts) }],
    thinking: { type: "adaptive" },
    output_config: {
      effort: effort(),
      format: betaZodOutputFormat(GeneratedMealsSchema),
    },
    // Jei saugos filtras atmestų užklausą, serveris pats perjungia į kitą modelį.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  if (response.stop_reason === "refusal") {
    throw new AppError(
      "Claude atsisakė generuoti šią užklausą. Pabandyk kitaip suformuluoti pageidavimus.",
      422,
    );
  }

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new AppError(
      "AI grąžino netikėtos formos atsakymą. Pabandyk dar kartą.",
      502,
    );
  }

  const now = new Date().toISOString();
  return parsed.meals.map((m): Meal => ({
    id: newId(),
    name: m.name,
    description: m.description,
    categoryIds: [opts.category.id],
    ingredients: m.ingredients,
    steps: m.steps,
    minutes: m.minutes,
    difficulty: m.difficulty,
    nutrition: m.nutrition,
    slots: m.slots,
    source: "ai",
    createdAt: now,
  }));
}
