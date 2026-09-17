import { define } from "../utils.ts";

export default define.page(function App({ Component }) {
  return (
    <html lang="lt">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Savaitės planas – AI sudarytas maisto planas</title>
        <meta
          name="description"
          content="Atsakyk į tris klausimus ir gauk savaitės maisto planą su pirkinių sąrašu. Pritaikyta diabetikams, sportininkams, vegetarams ir dar septynioms grupėms."
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#d96a3f" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
