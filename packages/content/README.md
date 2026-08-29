# @maplemd/content

Content collection helpers for [MapleMD](../..) sites.

## Usage

In your Astro site's `src/content/config.ts`:

```ts
import { defineCollection } from "astro:content";
import { postSchema } from "@maplemd/content";

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: postSchema(),
  }),
};
```

## API

### Schema helpers

All return a zod schema. Extend with `.extend({...})`.

- `postSchema()` - `title`, `description?`, `date`, `tags[]`, `draft`, `author?`
- `pageSchema()` - `title`, `description?`
- `docSchema()` - `title`, `description?`, `sidebar.{order,label?,hidden}`

### Utilities

- `slugify(str)` - deterministic URL slug (unicode-aware).
