import { AppError } from "@backend/lib/errors.ts";

/** Trumpinys JSON atsakymui. */
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/**
 * Vienoda klaidų forma visiems API keliams.
 * Naudotojui rodom tik tas žinutes, kurias patys parašėm (AppError);
 * netikėtos klaidos į naršyklę nepatenka – tik į serverio logą.
 */
export function fail(error: unknown): Response {
  if (error instanceof AppError) {
    return json({ error: error.message }, error.status);
  }
  console.error("Netikėta klaida:", error);
  return json({ error: "Kažkas nepavyko. Pabandyk dar kartą." }, 500);
}

/** Saugiai nuskaito JSON iš užklausos. */
export async function readJson<T>(req: Request): Promise<T> {
  try {
    return await req.json() as T;
  } catch {
    throw new AppError("Netinkamas užklausos formatas.");
  }
}
