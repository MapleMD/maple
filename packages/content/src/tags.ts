// Tag helpers - pure functions over the shape produced by Astro's
// getCollection. Kept generic (accepts any object with `data.tags`) so
// tests don't need the astro:content module.

import { slugify } from "./slug.js";

export interface Tagged {
  data: {
    tags?: readonly string[];
    draft?: boolean;
  };
}

export interface TagBucket<T> {
  tag: string;
  slug: string;
  count: number;
  items: T[];
}

/** Group items by each tag they carry. An item with 3 tags appears in 3
 *  buckets. Items with no tags are excluded. Result sorted by tag slug for
 *  deterministic output. */
export function groupByTag<T extends Tagged>(items: readonly T[]): TagBucket<T>[] {
  const buckets = new Map<string, TagBucket<T>>();
  for (const item of items) {
    const tags = item.data.tags ?? [];
    for (const tag of tags) {
      const slug = slugify(tag);
      if (!slug) continue;
      let bucket = buckets.get(slug);
      if (!bucket) {
        bucket = { tag, slug, count: 0, items: [] };
        buckets.set(slug, bucket);
      }
      bucket.items.push(item);
      bucket.count++;
    }
  }
  return [...buckets.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Flat list of unique tag slugs across items - used to build
 *  getStaticPaths for /tags/[slug]. */
export function listTagSlugs<T extends Tagged>(items: readonly T[]): string[] {
  return groupByTag(items).map((b) => b.slug);
}
