import Anthropic from "@anthropic-ai/sdk";

/**
 * Vienas Claude klientas visai programai.
 *
 * Raktas imamas iš aplinkos kintamojo, NIEKADA nerašomas į kodą.
 * Lokaliai – iš .env failo, Deno Deploy – iš projekto nustatymų.
 */
let client: Anthropic | null = null;

export function aiEnabled(): boolean {
  return Boolean(Deno.env.get("ANTHROPIC_API_KEY"));
}

export function getClient(): Anthropic {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error(
      "Nėra ANTHROPIC_API_KEY. Įrašyk jį į .env failą arba Deno Deploy nustatymuose.",
    );
  }
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

/** Kurį modelį naudoti. Galima pakeisti nekeičiant kodo. */
export function model(): string {
  return Deno.env.get("WEEKMENU_AI_MODEL") ?? "claude-opus-5";
}

/** Testams: priverstinai pamiršti klientą. */
export function resetClient(): void {
  client = null;
}
