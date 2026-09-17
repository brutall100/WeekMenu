import { define } from "../../utils.ts";
import { fail, json, readJson } from "../../lib/http.ts";
import { addStory } from "@backend/db/repositories/stories.ts";
import { AppError } from "@backend/lib/errors.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await readJson<
        { title: string; content: string; author: string }
      >(ctx.req);

      const title = (body.title ?? "").trim();
      const content = (body.content ?? "").trim();
      const author = (body.author ?? "").trim() || "Anonimas";

      if (title.length < 3) throw new AppError("Pavadinimas per trumpas.");
      if (content.length < 20) throw new AppError("Parašyk bent porą sakinių.");

      const story = await addStory({
        title: title.slice(0, 120),
        content: content.slice(0, 2000),
        author: author.slice(0, 60),
      });
      return json({ ok: true, story }, 201);
    } catch (error) {
      return fail(error);
    }
  },
});
