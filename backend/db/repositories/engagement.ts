import { getKv } from "../kv.ts";
import { keys } from "../keys.ts";
import type { Engagement } from "@shared/types.ts";

export function emptyEngagement(userId: string): Engagement {
  return {
    userId,
    streak: 0,
    bestStreak: 0,
    lastActiveDate: null,
    totalCooked: 0,
    badges: [],
  };
}

export async function getEngagement(userId: string): Promise<Engagement> {
  const kv = await getKv();
  return (await kv.get<Engagement>(keys.engagement(userId))).value ??
    emptyEngagement(userId);
}

export async function saveEngagement(e: Engagement): Promise<void> {
  const kv = await getKv();
  await kv.set(keys.engagement(e.userId), e);
}
