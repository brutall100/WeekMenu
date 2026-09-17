import { define } from "../utils.ts";
import { Layout } from "../components/Layout.tsx";
import OnboardingWizard from "../islands/OnboardingWizard.tsx";
import { listCategories } from "@backend/db/repositories/categories.ts";

export default define.page(async function Start(ctx) {
  const categories = await listCategories();

  return (
    <Layout engagement={ctx.state.engagement} active="/pradzia">
      <OnboardingWizard categories={categories} />
    </Layout>
  );
});
