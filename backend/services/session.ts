import { ensureUser } from "../db/repositories/users.ts";
import type { User } from "@shared/types.ts";

/**
 * Sesija be registracijos.
 *
 * Įdedam anoniminį ID į sausainį (cookie) ir viskas. Jokio el. pašto,
 * jokio slaptažodžio, jokio patvirtinimo laiško. Registracijos forma
 * yra ta vieta, kurioje didžioji dalis naujų lankytojų pasitraukia,
 * todėl produktą parodom PIRMA, o paskyros klausiam vėliau (arba niekada).
 */
export const COOKIE_NAME = "wm_uid";
const YEAR_SECONDS = 60 * 60 * 24 * 365;

export function readUserId(req: Request): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE_NAME) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function userCookie(userId: string, secure: boolean): string {
  const bits = [
    `${COOKIE_NAME}=${encodeURIComponent(userId)}`,
    "Path=/",
    `Max-Age=${YEAR_SECONDS}`,
    "SameSite=Lax",
    // HttpOnly: JavaScript naršyklėje šito sausainio neperskaitys.
    // Apsauga nuo svetimo skripto, kuris norėtų pavogti sesiją.
    "HttpOnly",
  ];
  if (secure) bits.push("Secure");
  return bits.join("; ");
}

export interface SessionContext {
  user: User;
  /** true, jei sausainį reikia nusiųsti atgal (naujas naudotojas). */
  isNew: boolean;
}

export async function loadSession(req: Request): Promise<SessionContext> {
  const existingId = readUserId(req);
  const user = await ensureUser(existingId);
  return { user, isNew: user.id !== existingId };
}

/** Prisega sausainį prie atsakymo, jei naudotojas naujas. */
export function attachSession(
  res: Response,
  ctx: SessionContext,
  url: URL,
): Response {
  if (!ctx.isNew) return res;
  res.headers.append(
    "set-cookie",
    userCookie(ctx.user.id, url.protocol === "https:"),
  );
  return res;
}
