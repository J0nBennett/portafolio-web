import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import siteData from "./src/data/site.json";

const site = process.env.SITE_URL || "https://j0nbennett.github.io";
const base =
  process.env.BASE_PATH && process.env.BASE_PATH !== "/"
    ? `/${process.env.BASE_PATH.replace(/^\/+|\/+$/g, "")}/`
    : "/portafolio-web/";

console.log(`Building site with: SITE_URL=${site}, BASE_PATH=${base}`);

export default defineConfig({
  site,
  base,
  output: "static",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

