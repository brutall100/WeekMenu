import { useSignal } from "@preact/signals";
import { Button } from "../components/ui.tsx";

/**
 * Istorijos forma.
 *
 * Rodom ją tik paspaudus mygtuką: forma, kuri visada atverta,
 * tyliai sako „čia daug darbo“. Suskleista ji kviečia.
 */
export default function StoryForm() {
  const open = useSignal(false);
  const title = useSignal("");
  const content = useSignal("");
  const author = useSignal("");
  const sending = useSignal(false);
  const error = useSignal<string | null>(null);

  async function submit(e: Event) {
    e.preventDefault();
    sending.value = true;
    error.value = null;
    try {
      const res = await fetch("/api/istorijos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.value,
          content: content.value,
          author: author.value,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      globalThis.location.reload();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Nepavyko išsiųsti.";
      sending.value = false;
    }
  }

  if (!open.value) {
    return (
      <Button onClick={() => open.value = true}>
        Papasakoti savo istoriją
      </Button>
    );
  }

  return (
    <form
      onSubmit={submit}
      class="rounded-card border border-line bg-surface-raised p-5"
    >
      <label class="block">
        <span class="text-sm font-semibold text-ink">Pavadinimas</span>
        <input
          type="text"
          required
          value={title.value}
          onInput={(e) => title.value = e.currentTarget.value}
          placeholder="Kas pasikeitė nuo tada, kai pradėjai planuoti?"
          class="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink"
        />
      </label>

      <label class="mt-4 block">
        <span class="text-sm font-semibold text-ink">Istorija</span>
        <textarea
          required
          rows={5}
          value={content.value}
          onInput={(e) => content.value = e.currentTarget.value}
          class="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink"
        />
      </label>

      <label class="mt-4 block">
        <span class="text-sm font-semibold text-ink">Vardas (nebūtina)</span>
        <input
          type="text"
          value={author.value}
          onInput={(e) => author.value = e.currentTarget.value}
          placeholder="Anonimas"
          class="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink"
        />
      </label>

      {error.value && (
        <p class="mt-3 text-sm text-brand-strong">{error.value}</p>
      )}

      <div class="mt-5 flex gap-2">
        <Button type="submit" disabled={sending.value}>
          {sending.value ? "Siunčiam…" : "Paskelbti"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => open.value = false}
        >
          Atšaukti
        </Button>
      </div>
    </form>
  );
}
