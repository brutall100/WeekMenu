/**
 * Įvykiai, kuriuos skaičiuojam.
 *
 * Sąrašas trumpas sąmoningai: kiekvienas įvykis turi atsakyti
 * į klausimą „ar žmonės grįžta antrą savaitę". Viskas, kas
 * neatsako, yra tik skaičius ekrane.
 */
export const EVENTS = [
  "apsilankymas",
  "anketa_pradeta",
  "anketa_baigta",
  "pagamino",
  "patiekalas_keistas",
  "pirkiniai_atidaryti",
  "ai_generavimas",
] as const;

export type EventName = typeof EVENTS[number];

/** Žmogui skaitomi pavadinimai skydeliui. */
export const EVENT_LABELS: Record<EventName, string> = {
  apsilankymas: "Apsilankymai",
  anketa_pradeta: "Anketa pradėta",
  anketa_baigta: "Anketa pabaigta",
  pagamino: "Pažymėta „pagaminau“",
  patiekalas_keistas: "Patiekalas pakeistas",
  pirkiniai_atidaryti: "Pirkinių sąrašas atidarytas",
  ai_generavimas: "AI generavimas",
};

/** Vieno lankytojo kelias per produktą. */
export interface Visitor {
  userId: string;
  /** Pirmo apsilankymo data, ISO. */
  firstDate: string;
  lastDate: string;
  /** Savaitės pirmadienis, kurią atėjo pirmą kartą. */
  firstWeek: string;
  lastWeek: string;
  /** Per kiek skirtingų dienų lankėsi. */
  activeDays: number;
  /** Kuriuos įvykius pasiekė bent kartą. */
  milestones: EventName[];
}
