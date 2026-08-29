// @maplemd/content - frontmatter schemas + small pure helpers (slug,
// tags, pagination, reading time). Used inside a site's Astro content
// collection config and wherever else the same shape is needed.

export { docSchema, pageSchema, postSchema } from "./schema.js";
export type { DocFrontmatter, PageFrontmatter, PostFrontmatter } from "./schema.js";
export { slugify } from "./slug.js";
export { readingTime } from "./reading-time.js";
export type { ReadingTimeResult } from "./reading-time.js";
export { groupByTag, listTagSlugs } from "./tags.js";
export type { TagBucket, Tagged } from "./tags.js";
export { paginate } from "./pagination.js";
export type { Page, PaginateOptions } from "./pagination.js";
