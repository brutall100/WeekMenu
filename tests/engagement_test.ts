import { assertEquals } from "@std/assert";
import {
  buildNudge,
  currentStreak,
  earnedBadges,
  registerCooked,
  weekProgress,
} from "@backend/services/engagement.ts";
import { emptyEngagement } from "@backend/db/repositories/engagement.ts";
import type { WeekPlan } from "@shared/types.ts";

/**
 * Įpročio variklis yra vienintelė vieta, kur klaida būtų NEMATOMA
 * ir tyliai meluotų žmogui apie jo pastangas. Todėl testuojam jį.
 */

Deno.test("pirmas gaminimas pradeda seriją nuo 1", () => {
  const { engagement, streakGrew } = registerCooked(
    emptyEngagement("u1"),
    "2026-09-17",
  );
  assertEquals(engagement.streak, 1);
  assertEquals(engagement.totalCooked, 1);
  assertEquals(streakGrew, true);
});

Deno.test("gaminimas kitą dieną pratęsia seriją", () => {
  let e = registerCooked(emptyEngagement("u1"), "2026-09-17").engagement;
  e = registerCooked(e, "2026-09-18").engagement;
  e = registerCooked(e, "2026-09-19").engagement;
  assertEquals(e.streak, 3);
  assertEquals(e.bestStreak, 3);
});

Deno.test("kelis kartus per tą pačią dieną serijos neaugina", () => {
  let e = registerCooked(emptyEngagement("u1"), "2026-09-17").engagement;
  e = registerCooked(e, "2026-09-17").engagement;
  e = registerCooked(e, "2026-09-17").engagement;
  assertEquals(e.streak, 1, "serija turi likti 1");
  assertEquals(e.totalCooked, 3, "bet bendras skaičius auga");
});

Deno.test("praleista diena pradeda seriją iš naujo, bet rekordas lieka", () => {
  let e = registerCooked(emptyEngagement("u1"), "2026-09-14").engagement;
  e = registerCooked(e, "2026-09-15").engagement;
  e = registerCooked(e, "2026-09-16").engagement;
  e = registerCooked(e, "2026-09-20").engagement; // keturių dienų pertrauka
  assertEquals(e.streak, 1);
  assertEquals(e.bestStreak, 3);
});

Deno.test("currentStreak nuvysta, kai praėjo daugiau nei diena", () => {
  const e = registerCooked(emptyEngagement("u1"), "2026-09-17").engagement;
  assertEquals(currentStreak(e, "2026-09-17"), 1, "tą pačią dieną – gyva");
  assertEquals(currentStreak(e, "2026-09-18"), 1, "kitą dieną dar gyva");
  assertEquals(currentStreak(e, "2026-09-19"), 0, "po dviejų dienų – nulis");
});

Deno.test("ženkliukai duodami pasiekus ribas", () => {
  const { newBadges } = registerCooked(emptyEngagement("u1"), "2026-09-17");
  assertEquals(newBadges.map((b) => b.id), ["pirmas-kartas"]);

  const seven = {
    ...emptyEngagement("u2"),
    streak: 7,
    bestStreak: 7,
    totalCooked: 20,
  };
  assertEquals(
    earnedBadges(seven),
    ["pirmas-kartas", "trys-dienos", "savaite", "penkiolika"],
  );
});

function planWith(done: number, total: number): WeekPlan {
  return {
    id: "p1",
    userId: "u1",
    categoryId: "c1",
    weekStart: "2026-09-14",
    createdAt: "2026-09-14T00:00:00.000Z",
    entries: Array.from({ length: total }, (_, i) => ({
      day: i % 7,
      slot: "pietūs" as const,
      mealId: `m${i}`,
      done: i < done,
    })),
  };
}

Deno.test("weekProgress skaičiuoja procentus ir likutį", () => {
  assertEquals(weekProgress(planWith(11, 14)), {
    done: 11,
    total: 14,
    percent: 79,
    remaining: 3,
  });
  assertEquals(
    weekProgress(null).percent,
    0,
    "be plano – nulis, ne dalyba iš nulio",
  );
});

Deno.test("be plano kviečiam susikurti planą", () => {
  const nudge = buildNudge({ engagement: emptyEngagement("u1"), plan: null });
  assertEquals(nudge.tone, "kvietimas");
  assertEquals(nudge.href, "/pradzia");
});

Deno.test("baigus savaitę – sveikinimas, ne naujas reikalavimas", () => {
  const nudge = buildNudge({
    engagement: { ...emptyEngagement("u1"), totalCooked: 14 },
    plan: planWith(14, 14),
  });
  assertEquals(nudge.tone, "sveikinimas");
});

Deno.test("nutrūkus serijai žinutė padrąsina, o ne gėdina", () => {
  const nudge = buildNudge({
    engagement: {
      ...emptyEngagement("u1"),
      totalCooked: 12,
      streak: 5,
      bestStreak: 5,
      lastActiveDate: "2026-09-01",
    },
    plan: planWith(3, 14),
    today: "2026-09-17",
  });
  assertEquals(nudge.tone, "padrasinimas");
  // Etinė riba: jokio kaltinimo žodyno.
  const forbidden = [
    "vėl",
    "pamiršai",
    "neparuošei",
    "praradai",
    "nesugebėjai",
  ];
  const text = `${nudge.title} ${nudge.body}`.toLowerCase();
  for (const word of forbidden) {
    assertEquals(text.includes(word), false, `žinutėje neturi būti "${word}"`);
  }
});
