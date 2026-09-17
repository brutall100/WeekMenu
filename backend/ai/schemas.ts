import { z } from "zod";
import { GROCERY_AISLES, MEAL_SLOTS } from "@shared/types.ts";

/**
 * Šitos schemos daro DU darbus vienu metu:
 *  1. pasako Claude, kokios formos JSON grąžinti (SDK paverčia jas į JSON Schema);
 *  2. patikrina atsakymą, kai jis grįžta.
 *
 * Todėl į duomenų bazę niekada nepatenka "beveik teisingas" patiekalas.
 */
export const IngredientSchema = z.object({
  name: z.string().min(1).describe(
    "Ingrediento pavadinimas lietuviškai, pvz. 'vištienos krūtinėlė'",
  ),
  amount: z.number().positive().describe("Kiekis skaičiumi vienai porcijai"),
  unit: z.string().min(1).describe("Matas: g, ml, vnt., šaukštas, žiupsnelis"),
  aisle: z.enum(GROCERY_AISLES).describe("Į kurį parduotuvės skyrių dėti"),
});

export const NutritionSchema = z.object({
  kcal: z.number().int().positive(),
  protein: z.number().nonnegative().describe("Baltymai gramais"),
  carbs: z.number().nonnegative().describe("Angliavandeniai gramais"),
  fat: z.number().nonnegative().describe("Riebalai gramais"),
});

export const GeneratedMealSchema = z.object({
  name: z.string().min(3).describe("Trumpas patiekalo pavadinimas lietuviškai"),
  description: z.string().min(10).describe(
    "1–2 sakiniai, kodėl šis patiekalas skanus ir tinka",
  ),
  ingredients: z.array(IngredientSchema).min(2).max(15),
  steps: z.array(z.string().min(5)).min(2).max(10).describe(
    "Gaminimo žingsniai iš eilės",
  ),
  minutes: z.number().int().min(5).max(180).describe(
    "Kiek minučių nuo pradžios iki stalo",
  ),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]).describe(
    "1 lengva, 3 sunku",
  ),
  nutrition: NutritionSchema,
  slots: z.array(z.enum(MEAL_SLOTS)).min(1).describe(
    "Kada šį patiekalą valgyti",
  ),
});

export const GeneratedMealsSchema = z.object({
  meals: z.array(GeneratedMealSchema).min(1).max(12),
});

export type GeneratedMeal = z.infer<typeof GeneratedMealSchema>;
