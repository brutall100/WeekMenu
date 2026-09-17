import { getKv } from "../kv.ts";
import { keys } from "../keys.ts";
import { isoDate, weekStart } from "../../lib/dates.ts";
import { EVENTS } from "@shared/events.ts";
import type { EventName, Visitor } from "@shared/events.ts";

/**
 * Statistikos saugykla.
 *
 * Svarbiausia taisyklė: statistika NIEKADA nesugriauna puslapio.
 * Jei skaičiavimas nepavyksta, žmogus to nepamato – klaida tik į žurnalą.
 * Skaitliukas yra įrankis mums, ne funkcija naudotojui.
 */

/** Padidina bendrą ir dienos skaitliuką vienu. */
export async function bump(event: EventName, date = isoDate()): Promise<void> {
  const kv = await getKv();
  // `sum` yra atominis: du vienu metu vykstantys apsilankymai
  // nenurašo vienas kito, kaip nutiktų su skaityk-pridėk-įrašyk.
  await kv.atomic()
    .sum(keys.statTotal(event), 1n)
    .sum(keys.statDay(date, event), 1n)
    .commit();
}

export async function getTotals(): Promise<Record<string, number>> {
  const kv = await getKv();
  const out: Record<string, number> = {};
  for (const event of EVENTS) out[event] = 0;
  for await (
    const e of kv.list<Deno.KvU64>({ prefix: keys.statTotalsPrefix() })
  ) {
    const event = String(e.key[1]);
    out[event] = Number(e.value.value);
  }
  return out;
}

export async function getDay(date: string): Promise<Record<string, number>> {
  const kv = await getKv();
  const out: Record<string, number> = {};
  for (const event of EVENTS) out[event] = 0;
  for await (
    const e of kv.list<Deno.KvU64>({ prefix: keys.statDayPrefix(date) })
  ) {
    const event = String(e.key[2]);
    out[event] = Number(e.value.value);
  }
  return out;
}

/**
 * Atnaujina lankytojo kelią.
 *
 * Grąžina `true`, jei šis apsilankymas yra nauja diena šiam žmogui –
 * tada iškviečiantis kodas žino, kad verta didinti „apsilankymas" skaitliuką.
 * Taip vienas žmogus, atsidaręs dešimt puslapių, skaičiuojamas kartą.
 */
export async function touchVisitor(
  userId: string,
  today = isoDate(),
): Promise<{ isNewDay: boolean; isNewVisitor: boolean }> {
  const kv = await getKv();
  const key = keys.visitor(userId);
  const existing = await kv.get<Visitor>(key);

  if (!existing.value) {
    const fresh: Visitor = {
      userId,
      firstDate: today,
      lastDate: today,
      firstWeek: weekStart(new Date(today)),
      lastWeek: weekStart(new Date(today)),
      activeDays: 1,
      milestones: [],
    };
    // `check` su null versija: įrašom tik jei niekas nespėjo prieš mus.
    const res = await kv.atomic().check({ key, versionstamp: null }).set(
      key,
      fresh,
    ).commit();
    return { isNewDay: res.ok, isNewVisitor: res.ok };
  }

  const visitor = existing.value;
  if (visitor.lastDate === today) {
    return { isNewDay: false, isNewVisitor: false };
  }

  const updated: Visitor = {
    ...visitor,
    lastDate: today,
    lastWeek: weekStart(new Date(today)),
    activeDays: visitor.activeDays + 1,
  };
  await kv.atomic().check(existing).set(key, updated).commit();
  return { isNewDay: true, isNewVisitor: false };
}

/**
 * Pažymi, kad lankytojas pasiekė pakopą.
 * Grąžina `true` tik pirmą kartą – pakartotinis pažymėjimas nieko nekeičia.
 *
 * Jei lankytojo įrašo dar nėra (pvz., žmogus lankėsi dar prieš atsirandant
 * statistikai, arba pirmas jo veiksmas buvo API kvietimas), sukuriam jį čia.
 * Tyliai prarasta pakopa būtų blogiau nei viena diena netikslios pradžios datos.
 */
export async function markMilestone(
  userId: string,
  event: EventName,
): Promise<boolean> {
  const kv = await getKv();
  const key = keys.visitor(userId);
  const existing = await kv.get<Visitor>(key);

  if (!existing.value) {
    await touchVisitor(userId);
    const created = await kv.get<Visitor>(key);
    if (!created.value) return false;
    const res = await kv.atomic()
      .check(created)
      .set(key, { ...created.value, milestones: [event] })
      .commit();
    return res.ok;
  }

  if (existing.value.milestones.includes(event)) return false;

  const updated: Visitor = {
    ...existing.value,
    milestones: [...existing.value.milestones, event],
  };
  const res = await kv.atomic().check(existing).set(key, updated).commit();
  return res.ok;
}

export async function listVisitors(limit = 5000): Promise<Visitor[]> {
  const kv = await getKv();
  const out: Visitor[] = [];
  for await (
    const e of kv.list<Visitor>({ prefix: keys.visitorsPrefix() }, { limit })
  ) {
    out.push(e.value);
  }
  return out;
}
