# MapleMD

Very early. Just the monorepo scaffold - more coming this week.

## Status

Alpha, WIP. Currently in the repo:

- pnpm workspace + turbo pipeline
- TypeScript strict base config
- ESLint (flat config) + Prettier
- Vitest configured for future package tests
- GitHub Actions CI stub

Nothing usable yet. Real packages land over the next few days.

## Dev

Requires Node.js 20+ and pnpm 9+.

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

## License

[MIT](./LICENSE)
