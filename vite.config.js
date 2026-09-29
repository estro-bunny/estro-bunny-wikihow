import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// "base" must match the repository name for GitHub Pages
// (https://estro-bunny.github.io/estro-bunny-wikihow/).
export default defineConfig({
  base: "/estro-bunny-wikihow/",
  plugins: [react(), tailwindcss()]
});
