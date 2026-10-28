import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    stack: z.array(z.string()),
    links: z.object({
      repo: z.url({ protocol: /^https?$/ }),
      demo: z.url({ protocol: /^https?$/ }).optional(),
    }),
    thumbnail: z.string().optional(),
    featured: z.boolean(),
    date: z.coerce.date(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string().optional(),
    date: z.coerce.date(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    date: z.coerce.date(),
  }),
});

export const collections = {
  projects,
  "case-studies": caseStudies,
  posts,
  "projects-en": defineCollection({ ...projects, type: "content_layer", loader: glob({ pattern: "**/*.mdx", base: "./src/content/en/projects" }) }),
  "case-studies-en": defineCollection({ ...caseStudies, type: "content_layer", loader: glob({ pattern: "**/*.mdx", base: "./src/content/en/case-studies" }) }),
  "posts-en": defineCollection({ ...posts, type: "content_layer", loader: glob({ pattern: "**/*.mdx", base: "./src/content/en/posts" }) }),
};
