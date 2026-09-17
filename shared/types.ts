/**
 * Bendri tipai. Juos naudoja IR front-end'as, IR back-end'as.
 * Vienas žodynas – nebėra "serveris sako meal, o frontas mealItem".
 */

/** Savaitės dienos – indeksas 0 = pirmadienis. */
export const WEEKDAYS = [
  "Pirmadienis",
  "Antradienis",
  "Trečiadienis",
  "Ketvirtadienis",
  "Penktadienis",
  "Šeštadienis",
  "Sekmadienis",
] as const;
export type Weekday = typeof WEEKDAYS[number];

/** Valgymo laikas per dieną. */
export const MEAL_SLOTS = [
  "pusryčiai",
  "pietūs",
  "vakarienė",
  "užkandis",
] as const;
export type MealSlot = typeof MEAL_SLOTS[number];

/** Mitybos kategorija, pvz. "Diabetikams". */
export interface Category {
  id: string;
  /** URL draugiškas vardas, pvz. "diabetikams". */
  slug: string;
  name: string;
  /** Vienas sakinys, ką ši kategorija reiškia. */
  summary: string;
  /** Emoji piktograma – pigus būdas duoti puslapiui charakterį. */
  emoji: string;
  /** Taisyklės, kurias AI privalo gerbti generuodamas šiai kategorijai. */
  rules: string[];
  /** Rikiavimui sąraše. */
  order: number;
}

export interface Ingredient {
  name: string;
  /** Kiekis skaičiumi, pvz. 150. */
  amount: number;
  /** Matas, pvz. "g", "vnt.", "šaukštas". */
  unit: string;
  /** Į kurį pirkinių sąrašo skyrių dėti. */
  aisle: GroceryAisle;
}

export const GROCERY_AISLES = [
  "daržovės ir vaisiai",
  "mėsa ir žuvis",
  "pieno gaminiai",
  "kruopos ir miltai",
  "prieskoniai",
  "kita",
] as const;
export type GroceryAisle = typeof GROCERY_AISLES[number];

export interface Nutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  /** Trumpas viliojantis aprašymas (1–2 sakiniai). */
  description: string;
  categoryIds: string[];
  ingredients: Ingredient[];
  /** Gaminimo žingsniai iš eilės. */
  steps: string[];
  /** Kiek minučių užtrunka nuo pradžios iki stalo. */
  minutes: number;
  /** 1 = labai lengva, 3 = reikia patirties. */
  difficulty: 1 | 2 | 3;
  nutrition: Nutrition;
  slots: MealSlot[];
  /** Kas sukūrė: AI ar žmogus. */
  source: "ai" | "seed" | "user";
  createdAt: string;
}

/** Vienas langelis savaitės plane. */
export interface PlanEntry {
  /** 0–6, pirmadienis = 0. */
  day: number;
  slot: MealSlot;
  mealId: string;
  /** Ar žmogus pažymėjo, kad pagamino. */
  done: boolean;
}

export interface WeekPlan {
  id: string;
  userId: string;
  categoryId: string;
  /** Savaitės pirmadienio data ISO formatu, pvz. "2026-09-14". */
  weekStart: string;
  entries: PlanEntry[];
  createdAt: string;
}

/** Ko žmogus nori – klausiam vieną kartą per onboarding'ą. */
export interface Profile {
  /** Rodomas vardas; tuščias, kol nepasakė. */
  name: string;
  categoryId: string;
  /** Kiek žmonių valgo. Keičia porcijas ir pirkinių sąrašą. */
  household: number;
  /** Ko nevalgo, laisvu tekstu, pvz. ["grybai", "žuvis"]. */
  dislikes: string[];
  /** Kiek minučių realiai turi gaminti darbo dieną. */
  minutesPerDay: number;
  /** Kuriuos valgymus planuoja. */
  slots: MealSlot[];
}

/** Įpročio matuoklis. Čia gyvena visa "kad žmogus grįžtų" psichologija. */
export interface Engagement {
  userId: string;
  /** Kiek dienų iš eilės pažymėta bent viena pagaminta dienos dalis. */
  streak: number;
  /** Ilgiausia serija visais laikais – tai, ko nenorima prarasti. */
  bestStreak: number;
  /** Paskutinės dienos, kurią kas nors pažymėta, ISO data. */
  lastActiveDate: string | null;
  /** Iš viso pagamintų patiekalų. */
  totalCooked: number;
  /** Uždirbti ženkliukai (id sąrašas). */
  badges: string[];
}

export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface User {
  id: string;
  profile: Profile | null;
  createdAt: string;
}
