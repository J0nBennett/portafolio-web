import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.SITE_URL || "https://j0nbennett.github.io";
const configuredBase = process.env.BASE_PATH ?? "/portafolio-web/";
const base = `/${configuredBase.replace(/^\/+|\/+$/g, "")}`.replace(/\/?$/, "/");

console.log(`Building site with: SITE_URL=${site}, BASE_PATH=${base}`);

export default defineConfig({
  site,
  base,
  output: "static",
  security: {
    csp: {
      algorithm: "SHA-256",
      directives: [
        "default-src 'self'",
        "base-uri 'none'",
        "object-src 'none'",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self'",
        "form-action 'self' https://formsubmit.co",
      ],
      styleDirective: {
        resources: [
          { resource: "'self'", kind: "element" },
          { resource: "https://fonts.googleapis.com", kind: "element" },
          // Syntax-highlighted MDX uses inline color attributes, not inline scripts.
          { resource: "'unsafe-inline'", kind: "attribute" },
        ],
      },
    },
  },
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

