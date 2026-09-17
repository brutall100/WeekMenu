/**
 * Vienintelis ryšys su Deno KV.
 *
 * Deno KV – tai duomenų bazė, įmontuota į patį Deno.
 * Lokaliai tai vienas failas diske; Deno Deploy ji duodama nemokamai
 * ir replikuojama po pasaulį. Jokio Mongo, jokio connection string.
 */
let kvPromise: Promise<Deno.Kv> | null = null;

export function getKv(): Promise<Deno.Kv> {
  if (!kvPromise) {
    // Deno Deploy: kelio nenurodom – platforma duoda savo KV.
    // Lokaliai: rašom į failą, kad duomenys išliktų tarp paleidimų.
    const path = Deno.env.get("DENO_DEPLOYMENT_ID")
      ? undefined
      : Deno.env.get("WEEKMENU_KV_PATH") ?? "./data/weekmenu.kv";
    if (path) {
      const dir = path.slice(0, path.lastIndexOf("/"));
      if (dir) Deno.mkdirSync(dir, { recursive: true });
    }
    kvPromise = Deno.openKv(path);
  }
  return kvPromise;
}

/** Testams: uždaryti ir pamiršti ryšį. */
export async function closeKv(): Promise<void> {
  if (kvPromise) {
    const kv = await kvPromise;
    kv.close();
    kvPromise = null;
  }
}
