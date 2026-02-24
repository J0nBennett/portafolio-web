import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.SITE_URL || "https://username.github.io";
const base =
  process.env.BASE_PATH && process.env.BASE_PATH !== "/"
    ? process.env.BASE_PATH
    : "/";

export default defineConfig({
  site,
  base,
  output: "static",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

