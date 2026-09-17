import { define } from "../utils.ts";
import { Layout } from "../components/Layout.tsx";
import { Card, EmptyState } from "../components/ui.tsx";
import StoryForm from "../islands/StoryForm.tsx";
import { listStories } from "@backend/db/repositories/stories.ts";

export default define.page(async function StoriesPage(ctx) {
  const stories = await listStories(30);

  return (
    <Layout engagement={ctx.state.engagement} active="/istorijos">
      <header class="mb-6">
        <h1 class="font-display text-3xl font-bold text-ink">Istorijos</h1>
        <p class="mt-1 text-ink-soft">
          Tikri žmonės, tikri vakarai virtuvėje. Kai matai, kad pavyko kitam,
          lengviau patikėti, kad pavyks ir tau.
        </p>
      </header>

      <div class="mb-8">
        <StoryForm />
      </div>

      {stories.length === 0
        ? (
          <EmptyState
            emoji="✍️"
            title="Istorijų dar nėra"
            body="Būk pirmas – papasakok, kas pasikeitė nuo tada, kai pradėjai planuoti."
          />
        )
        : (
          <div class="space-y-4">
            {stories.map((story) => (
              <Card key={story.id}>
                <h2 class="font-display text-xl font-bold text-ink">
                  {story.title}
                </h2>
                <p class="mt-2 whitespace-pre-line text-ink-soft">
                  {story.content}
                </p>
                <p class="mt-4 text-sm font-medium text-brand-strong">
                  — {story.author}
                  <time class="ml-2 font-normal text-ink-soft">
                    {story.createdAt.slice(0, 10)}
                  </time>
                </p>
              </Card>
            ))}
          </div>
        )}
    </Layout>
  );
});
