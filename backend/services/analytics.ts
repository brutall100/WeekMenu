import {
  bump,
  listVisitors,
  markMilestone,
  touchVisitor,
} from "../db/repositories/stats.ts";
import { isoDate } from "../lib/dates.ts";
import type { EventName, Visitor } from "@shared/events.ts";

/**
 * ANALITIKA.
 *
 * Ką matuojam ir kodėl – vienas tikslas: ar žmonės grįžta antrą savaitę.
 *
 * Privatumas nėra priedas, o projektavimo sąlyga:
 *  - nerenkam IP, naršyklės, vietos, jokių asmens duomenų;
 *  - tas pats anoniminis ID, kuris jau reikalingas planui laikyti;
 *  - jokių trečiųjų šalių – duomenys neišeina iš mūsų bazės;
 *  - todėl nereikia nei sausainių banerio, nei sutikimo lango.
 *
 * Tai, ko nesurenkam, negali nutekėti.
 */

/**
 * Užfiksuoja įvykį. Niekada nemeta klaidos.
 *
 * Jei statistika nulūžtų, žmogui rodomas puslapis privalo likti sveikas –
 * matavimo įrankis neturi teisės sugadinti to, ką matuoja.
 */
export async function track(
  userId: string,
  event: EventName,
  options: { uniquePerVisitor?: boolean } = {},
): Promise<void> {
  try {
    if (options.uniquePerVisitor) {
      const isFirst = await markMilestone(userId, event);
      if (!isFirst) return;
    }
    await bump(event);
  } catch (error) {
    console.error(`Statistikos klaida (${event}):`, error);
  }
}

/**
 * Apsilankymas. Skaičiuojam vieną kartą per dieną vienam žmogui –
 * antraip žmogus, atsidaręs penkis puslapius, atrodytų kaip penki žmonės.
 */
export async function trackVisit(userId: string): Promise<void> {
  try {
    const { isNewDay } = await touchVisitor(userId);
    if (isNewDay) await bump("apsilankymas");
  } catch (error) {
    console.error("Statistikos klaida (apsilankymas):", error);
  }
}

/** Viena piltuvėlio pakopa. */
export interface FunnelStep {
  id: string;
  label: string;
  /** Kiek žmonių iki čia atėjo. */
  count: number;
  /** Kiek % nuo pačios pirmos pakopos. */
  percentOfTop: number;
  /**
   * Kiek % išliko nuo PRIEŠ TAI buvusios pakopos – čia matyti, kur žmonės krenta.
   * `null`, kai lyginti nėra su kuo: pirma pakopa arba į praeitą niekas neatėjo.
   * Rodyti „100%", kai praeitoje pakopoje nulis žmonių, būtų melas.
   */
  percentOfPrevious: number | null;
  /** Kiek žmonių prarasta būtent šioje pakopoje. */
  lost: number;
}

/**
 * Suskaičiuoja piltuvėlį iš lankytojų įrašų.
 *
 * Grynoji funkcija – jokio KV, todėl ją galima testuoti be duomenų bazės.
 */
export function computeFunnel(visitors: Visitor[]): FunnelStep[] {
  const has = (v: Visitor, e: EventName) => v.milestones.includes(e);

  const raw = [
    { id: "atejo", label: "Atėjo į svetainę", count: visitors.length },
    {
      id: "anketa_pradeta",
      label: "Pradėjo anketą",
      count: visitors.filter((v) => has(v, "anketa_pradeta")).length,
    },
    {
      id: "anketa_baigta",
      label: "Gavo planą",
      count: visitors.filter((v) => has(v, "anketa_baigta")).length,
    },
    {
      id: "pagamino",
      label: "Pažymėjo bent vieną patiekalą",
      count: visitors.filter((v) => has(v, "pagamino")).length,
    },
    {
      id: "grizo_diena",
      label: "Grįžo kitą dieną",
      count: visitors.filter((v) => v.activeDays >= 2).length,
    },
    {
      id: "grizo_savaite",
      label: "Grįžo kitą savaitę",
      count: visitors.filter((v) => v.lastWeek !== v.firstWeek).length,
    },
  ];

  const top = raw[0].count;
  return raw.map((step, i) => ({
    ...step,
    percentOfTop: top === 0 ? 0 : Math.round((step.count / top) * 100),
    percentOfPrevious: i === 0 || raw[i - 1].count === 0
      ? null
      : Math.round((step.count / raw[i - 1].count) * 100),
    lost: i === 0 ? 0 : Math.max(0, raw[i - 1].count - step.count),
  }));
}

/**
 * Kurioje vietoje prarandam daugiausia žmonių.
 *
 * Matuojam PRARASTŲ ŽMONIŲ SKAIČIŲ, o ne procentą.
 *
 * Kodėl: jei iš 103 atėjusių planą gauna 3, o iš tų 3 negamina nė vienas,
 * procentais blogiausia atrodo paskutinė pakopa (0%). Bet ten prarandam
 * tris žmones, o anksčiau – šimtą. Taisyti pirmiausia reikia ten, kur
 * prarandi šimtą. Procentas mažoje imtyje yra triukšmas, ne signalas.
 */
export function biggestDrop(steps: FunnelStep[]): FunnelStep | null {
  const candidates = steps.slice(1).filter((s) => s.lost > 0);
  if (candidates.length === 0) return null;
  return candidates.reduce((worst, s) => {
    if (s.lost !== worst.lost) return s.lost > worst.lost ? s : worst;
    // Vienodai prarasta – tada svarbesnis blogesnis išlikimo procentas.
    return (s.percentOfPrevious ?? 100) < (worst.percentOfPrevious ?? 100)
      ? s
      : worst;
  });
}

export interface Overview {
  funnel: FunnelStep[];
  drop: FunnelStep | null;
  visitors: number;
  /** Šiandien pirmą kartą atėjusių. */
  newToday: number;
}

export async function overview(today = isoDate()): Promise<Overview> {
  const visitors = await listVisitors();
  const funnel = computeFunnel(visitors);
  return {
    funnel,
    drop: biggestDrop(funnel),
    visitors: visitors.length,
    newToday: visitors.filter((v) => v.firstDate === today).length,
  };
}
