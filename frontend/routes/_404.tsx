import { define } from "../utils.ts";
import { Layout } from "../components/Layout.tsx";
import { EmptyState, LinkButton } from "../components/ui.tsx";
import type { Engagement } from "@shared/types.ts";

function NotFoundBody({ engagement }: { engagement: Engagement }) {
  return (
    <Layout engagement={engagement}>
      <EmptyState
        emoji="🍽️"
        title="Tokio puslapio nėra"
        body="Gal nuoroda pasenusi arba įsivėlė klaida adrese. Nuo pradžios visada galima grįžti."
        action={<LinkButton href="/">Į pradžią</LinkButton>}
      />
    </Layout>
  );
}

/**
 * Handler'is reikalingas tam, kad atsakymas turėtų teisingą 404 kodą.
 * Be jo Fresh grąžintų 200, o paieškos sistemos indeksuotų klaidos puslapį.
 */
export const handler = define.handlers({
  GET(ctx) {
    return ctx.render(<NotFoundBody engagement={ctx.state.engagement} />, {
      status: 404,
    });
  },
});

export default define.page(function NotFound(ctx) {
  return <NotFoundBody engagement={ctx.state.engagement} />;
});
