import { assertEquals } from "@std/assert";
import { biggestDrop, computeFunnel } from "@backend/services/analytics.ts";
import { statsAllowed, statsEnabled } from "@backend/services/stats_access.ts";
import type { EventName, Visitor } from "@shared/events.ts";

function visitor(over: Partial<Visitor> = {}): Visitor {
  return {
    userId: crypto.randomUUID(),
    firstDate: "2026-09-14",
    lastDate: "2026-09-14",
    firstWeek: "2026-09-14",
    lastWeek: "2026-09-14",
    activeDays: 1,
    milestones: [],
    ...over,
  };
}

const ALL: EventName[] = ["anketa_pradeta", "anketa_baigta", "pagamino"];

Deno.test("tuščias piltuvėlis nedalija iš nulio", () => {
  const steps = computeFunnel([]);
  assertEquals(steps.length, 6);
  assertEquals(steps.every((s) => s.count === 0), true);
  assertEquals(steps.every((s) => Number.isFinite(s.percentOfTop)), true);
  assertEquals(steps[0].percentOfTop, 0);
});

Deno.test("piltuvėlis skaičiuoja kiekvieną pakopą atskirai", () => {
  const visitors = [
    // 1: atėjo ir viskas
    visitor(),
    // 2: pradėjo anketą, nepabaigė
    visitor({ milestones: ["anketa_pradeta"] }),
    // 3: gavo planą, negamino
    visitor({ milestones: ["anketa_pradeta", "anketa_baigta"] }),
    // 4: gamino ir grįžo kitą dieną
    visitor({
      milestones: ALL,
      activeDays: 2,
      lastDate: "2026-09-15",
    }),
    // 5: gamino ir grįžo kitą savaitę
    visitor({
      milestones: ALL,
      activeDays: 5,
      lastDate: "2026-09-22",
      lastWeek: "2026-09-21",
    }),
  ];

  const s = computeFunnel(visitors);
  assertEquals(s.map((x) => x.count), [5, 4, 3, 2, 2, 1]);
  assertEquals(s[0].percentOfTop, 100);
  assertEquals(s[1].percentOfTop, 80);
  assertEquals(s[5].percentOfTop, 20);
});

Deno.test("percentOfPrevious rodo išlikimą nuo praeitos pakopos", () => {
  const visitors = [
    ...Array.from({ length: 10 }, () => visitor()),
    ...Array.from(
      { length: 4 },
      () => visitor({ milestones: ["anketa_pradeta"] }),
    ),
  ];
  const s = computeFunnel(visitors);
  // 14 atėjo, 4 pradėjo anketą
  assertEquals(s[0].count, 14);
  assertEquals(s[1].count, 4);
  assertEquals(s[1].percentOfPrevious, 29);
});

Deno.test("biggestDrop matuoja prarastus žmones, o ne procentą", () => {
  const visitors = [
    ...Array.from(
      { length: 100 },
      () => visitor({ milestones: ["anketa_pradeta"] }),
    ),
    // tik 3 iš 103 gauna planą – čia prarandam 100 žmonių
    ...Array.from(
      { length: 3 },
      () => visitor({ milestones: ["anketa_pradeta", "anketa_baigta"] }),
    ),
  ];
  const steps = computeFunnel(visitors);
  const drop = biggestDrop(steps);

  // Procentais blogiausiai atrodo "pagamino" (0% nuo 3), bet ten prarandam
  // tik 3 žmones. Tikroji skylė – "anketa_baigta", kur prarandam 100.
  assertEquals(
    steps[3].percentOfPrevious,
    0,
    "pagamino procentas tikrai blogesnis",
  );
  assertEquals(drop?.id, "anketa_baigta");
  assertEquals(drop?.lost, 100);
});

Deno.test("biggestDrop grąžina null, kai dar niekas neprarasta", () => {
  assertEquals(biggestDrop(computeFunnel([])), null);
});

Deno.test("grįžimas kitą savaitę matuojamas pagal savaitę, ne dienų skaičių", () => {
  // Žmogus lankėsi 6 dienas, bet visos tą pačią savaitę – tai NE grįžimas.
  const busyOneWeek = visitor({ activeDays: 6, lastWeek: "2026-09-14" });
  // Žmogus lankėsi 2 kartus, bet skirtingomis savaitėmis – TAI grįžimas.
  const twoWeeks = visitor({ activeDays: 2, lastWeek: "2026-09-21" });

  const s = computeFunnel([busyOneWeek, twoWeeks]);
  assertEquals(s[4].count, 2, "abu grįžo kitą dieną");
  assertEquals(s[5].count, 1, "tik vienas grįžo kitą savaitę");
});

Deno.test("be rakto aplinkoje statistika išjungta ir neprieinama", () => {
  Deno.env.delete("WEEKMENU_STATS_TOKEN");
  assertEquals(statsEnabled(), false);
  assertEquals(
    statsAllowed(new URL("https://x.lt/statistika?raktas=belekas")),
    false,
    "be serverio rakto neįleidžiam net su spėjimu",
  );
});

Deno.test("su raktu įleidžia tik tikslų sutapimą", () => {
  Deno.env.set("WEEKMENU_STATS_TOKEN", "slaptas-raktas-123");
  try {
    assertEquals(
      statsAllowed(
        new URL("https://x.lt/statistika?raktas=slaptas-raktas-123"),
      ),
      true,
    );
    assertEquals(
      statsAllowed(new URL("https://x.lt/statistika?raktas=slaptas-raktas-12")),
      false,
    );
    assertEquals(
      statsAllowed(
        new URL("https://x.lt/statistika?raktas=slaptas-raktas-1234"),
      ),
      false,
    );
    assertEquals(statsAllowed(new URL("https://x.lt/statistika")), false);
  } finally {
    Deno.env.delete("WEEKMENU_STATS_TOKEN");
  }
});

Deno.test("išlikimas nerodomas, kai praeitoje pakopoje nulis žmonių", () => {
  // Niekas nepasiekė „pagamino", todėl „grįžo kitą dieną" neturi su kuo lygintis.
  const steps = computeFunnel([visitor(), visitor()]);
  assertEquals(
    steps[0].percentOfPrevious,
    null,
    "pirma pakopa neturi praeitos",
  );
  assertEquals(steps[1].percentOfPrevious, 0, "0 iš 2 – tikras nulis");
  assertEquals(
    steps[3].percentOfPrevious,
    null,
    "praeitoje pakopoje nulis – nėra ką lyginti",
  );
  assertEquals(steps[5].percentOfPrevious, null);
});
