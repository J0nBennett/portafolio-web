import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    stack: z.array(z.string()),
    links: z.object({
      repo: z.string().url(),
      demo: z.string().url().optional(),
    }),
    thumbnail: z.string().optional(),
    featured: z.boolean(),
    date: z.coerce.date(),
  }),
});

const caseStudies = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string().optional(),
    date: z.coerce.date(),
  }),
});

const posts = defineCollection({
  type: "content",
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
};
