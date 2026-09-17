import { App, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";
import { attachSession, loadSession } from "@backend/services/session.ts";
import { getEngagement } from "@backend/db/repositories/engagement.ts";
import { seed } from "@backend/db/seed.ts";

export const app = new App<State>();

app.use(staticFiles());

/**
 * Pirmas paleidimas: jei duomenų bazė tuščia, pasėjam.
 * Deno Deploy kiekvieną kartą startuoja švariai, todėl
 * tikrinam čia, o ne tikimės, kad kažkas rankomis paleis skriptą.
 */
let seeded = false;
app.use(async (ctx) => {
  if (!seeded) {
    seeded = true;
    try {
      await seed();
    } catch (error) {
      console.error("Sėklos klaida:", error);
    }
  }
  return await ctx.next();
});

/**
 * Sesija. Kiekvienas lankytojas gauna anoniminį ID.
 * Registracijos nėra – produktą rodom iš karto.
 */
const session = define.middleware(async (ctx) => {
  const ctxSession = await loadSession(ctx.req);
  ctx.state.user = ctxSession.user;
  ctx.state.isNewUser = ctxSession.isNew;
  ctx.state.engagement = await getEngagement(ctxSession.user.id);

  const res = await ctx.next();
  return attachSession(res, ctxSession, ctx.url);
});
app.use(session);

app.fsRoutes();
