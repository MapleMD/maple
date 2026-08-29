# @maplemd/config

Type-safe configuration for [MapleMD](../..).

## Usage

In your site's `maplemd.config.ts`:

```ts
import { defineConfig } from "@maplemd/config";

export default defineConfig({
  site: {
    title: "My Blog",
    description: "Thoughts and code.",
    url: "https://example.com",
    author: "Jane Doe",
  },
});
```

Everything except `site.title` has a sensible default. Invalid config throws a `ConfigValidationError` with the exact path and reason.

## API

- `defineConfig(config)` - identity helper for TypeScript inference.
- `resolveConfig(userConfig)` - validate + fill defaults. Throws `ConfigValidationError` on invalid input.
- `MaplemdConfigSchema` - the raw zod schema (for adapters/tests).
