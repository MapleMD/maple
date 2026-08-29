import { z } from "zod";

// MapleMD config schema - the single source of truth for what a user can put
// in `maplemd.config.ts`. Defaults live here (not in code that reads config)
// so behavior is predictable and documented.

export const SiteConfigSchema = z.object({
  title: z.string().min(1, "Site title is required."),
  description: z.string().default(""),
  url: z.string().url().optional(),
  author: z.string().optional(),
  language: z.string().default("en"),
});

export const ContentConfigSchema = z
  .object({
    directory: z.string().default("./src/content"),
    collections: z.array(z.string()).default(["posts"]),
  })
  .default({});

export const ThemeConfigSchema = z
  .object({
    name: z.string().default("default"),
    options: z.record(z.string(), z.unknown()).default({}),
  })
  .default({});

export const MaplemdConfigSchema = z.object({
  site: SiteConfigSchema,
  content: ContentConfigSchema,
  theme: ThemeConfigSchema,
  outDir: z.string().default("./dist"),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type ContentConfig = z.infer<typeof ContentConfigSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type ResolvedMaplemdConfig = z.infer<typeof MaplemdConfigSchema>;

// UserConfig is what the user writes: everything except `site.title` is
// optional. We reconstruct as `input` to the schema before parsing so the
// schema fills defaults.
export type UserMaplemdConfig = z.input<typeof MaplemdConfigSchema>;
