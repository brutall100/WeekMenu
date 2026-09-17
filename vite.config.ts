import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

// Front-end'as gyvena `frontend/`, back-end'as `backend/`.
// Fresh'ui pasakome, kur ko ieškoti.
export default defineConfig({
  plugins: [
    fresh({
      serverEntry: "frontend/main.ts",
      clientEntry: "frontend/client.ts",
      routeDir: "frontend/routes",
      islandsDir: "frontend/islands",
      staticDir: "frontend/static",
    }),
    tailwindcss(),
  ],
});
