import { createDefine } from "fresh";
import type { Engagement, User } from "@shared/types.ts";

/**
 * Kas keliauja kartu su kiekviena užklausa.
 * Middleware `main.ts` faile tai užpildo prieš pasiekiant puslapį,
 * todėl kiekvienas maršrutas jau "žino", kas yra lankytojas.
 */
export interface State {
  user: User;
  engagement: Engagement;
  /** true, jei šią užklausą reikia atsakyti su nauju sausainiu. */
  isNewUser: boolean;
}

export const define = createDefine<State>();
