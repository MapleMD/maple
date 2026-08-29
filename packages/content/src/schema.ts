import { z } from "zod";

// Reusable frontmatter schemas. Users compose these in their Astro content
// collection config so posts/pages/docs share a common baseline while
// allowing per-collection extensions.

/**
 * Baseline post frontmatter. Extend with `postSchema().extend({...})` when
 * a project needs more fields.
 */
export function postSchema() {
  return z.object({
    title: z.string().min(1, "Post title is required."),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    author: z.string().optional(),
  });
}

/**
 * Baseline page frontmatter - no date, no tags, no draft. Good for
 * static pages like /about.
 */
export function pageSchema() {
  return z.object({
    title: z.string().min(1, "Page title is required."),
    description: z.string().optional(),
  });
}

/**
 * Baseline docs frontmatter. Adds `sidebar.order` for controlling sort
 * order in generated navigation.
 */
export function docSchema() {
  return z.object({
    title: z.string().min(1, "Doc title is required."),
    description: z.string().optional(),
    sidebar: z
      .object({
        order: z.number().default(0),
        label: z.string().optional(),
        hidden: z.boolean().default(false),
      })
      .default({}),
  });
}

export type PostFrontmatter = z.infer<ReturnType<typeof postSchema>>;
export type PageFrontmatter = z.infer<ReturnType<typeof pageSchema>>;
export type DocFrontmatter = z.infer<ReturnType<typeof docSchema>>;
