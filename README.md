# MapleMD

Very early - assembling the pieces. Not usable end-to-end yet.

## Status

Alpha, WIP. Currently in the repo:

- pnpm workspace + turbo pipeline
- TypeScript strict base config, ESLint (flat), Prettier, Vitest
- CI (typecheck, lint, test, build) via GitHub Actions
- `@maplemd/core` - shared domain types
- `@maplemd/config` - `defineConfig` + zod-validated schema
- `@maplemd/content` - frontmatter schemas + small helpers (slug, tags, pagination, reading time)

More landing over the next few days: theme, git-aware loaders, CLI, plugins, starter templates.

## Dev

Requires Node.js 22+ and pnpm 9+ (or use corepack).

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

## License

[MIT](./LICENSE)
