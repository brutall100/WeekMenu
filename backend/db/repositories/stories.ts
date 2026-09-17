import { getKv } from "../kv.ts";
import { keys } from "../keys.ts";
import { newId } from "../../lib/id.ts";
import type { Story } from "@shared/types.ts";

/**
 * Istorijos = socialinis įrodymas.
 * Matydamas, kad kiti žmonės tikrai gamina, naujokas labiau tiki,
 * kad ir jam pavyks. Todėl jos rodomos pagrindiniame puslapyje.
 */
export async function listStories(limit = 20): Promise<Story[]> {
  const kv = await getKv();
  const out: Story[] = [];
  // ULID rikiuojasi pagal laiką, todėl `reverse` duoda naujausias pirma.
  for await (
    const e of kv.list<Story>({ prefix: keys.storiesPrefix() }, {
      limit,
      reverse: true,
    })
  ) {
    out.push(e.value);
  }
  return out;
}

export async function addStory(
  input: Omit<Story, "id" | "createdAt">,
): Promise<Story> {
  const story: Story = {
    ...input,
    id: newId(),
    createdAt: new Date().toISOString(),
  };
  const kv = await getKv();
  await kv.set(keys.story(story.id), story);
  return story;
}

export async function deleteStory(id: string): Promise<void> {
  const kv = await getKv();
  await kv.delete(keys.story(id));
}
