import { getKv } from "../kv.ts";
import { keys } from "../keys.ts";
import { newId } from "../../lib/id.ts";
import type { Profile, User } from "@shared/types.ts";

/**
 * Sąmoningai BE slaptažodžių.
 * Kiekvienas lankytojas gauna anoniminį ID sausainyje (cookie).
 * Registracija yra didžiausia kliūtis, dėl kurios žmonės išeina
 * nepabandę produkto – todėl pirmą planą duodam be jokios formos.
 */
export async function getUser(id: string): Promise<User | null> {
  const kv = await getKv();
  return (await kv.get<User>(keys.user(id))).value;
}

export async function createUser(): Promise<User> {
  const user: User = {
    id: newId(),
    profile: null,
    createdAt: new Date().toISOString(),
  };
  const kv = await getKv();
  await kv.set(keys.user(user.id), user);
  return user;
}

/** Grąžina esamą naudotoją arba sukuria naują, jei sausainis pasenęs. */
export async function ensureUser(id: string | null): Promise<User> {
  if (id) {
    const existing = await getUser(id);
    if (existing) return existing;
  }
  return await createUser();
}

export async function saveProfile(
  userId: string,
  profile: Profile,
): Promise<User> {
  const kv = await getKv();
  const user = await getUser(userId) ??
    { id: userId, profile: null, createdAt: new Date().toISOString() };
  const updated: User = { ...user, profile };
  await kv.set(keys.user(userId), updated);
  return updated;
}
