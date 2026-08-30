# @maplemd/loaders

Git-aware metadata helpers for [MapleMD](../..) sites.

## Install

```bash
pnpm add @maplemd/loaders
```

## `getGitMetadata(filePath)`

Returns the git history summary for a file - first/last commit dates + distinct authors + total commits. Perfect for showing a "Last updated" line on docs.

```astro
---
import { getGitMetadata } from "@maplemd/loaders";

// In Astro 5, entries loaded via `glob()` expose `filePath`.
const meta = await getGitMetadata(entry.filePath);
const lastUpdated = meta.updatedAt ?? entry.data.date;
---

<p>Last updated {lastUpdated.toLocaleDateString()}</p>
{meta.authors.length > 0 && <p>Contributors: {meta.authors.join(", ")}</p>}
```

When git isn't available (fresh checkout without history, CI without full clone, not a repo) the function returns an empty metadata object rather than throwing - callers fall through to frontmatter defaults.

## API

```ts
export interface GitMetadata {
  createdAt?: Date;
  updatedAt?: Date;
  authors: string[];
  commitCount: number;
}

export function getGitMetadata(filePath: string): Promise<GitMetadata>;

// Lower-level: full commit list with SHAs
export function readGitFileHistory(filePath: string): Promise<GitFileHistory>;
export function parseGitLog(stdout: string): GitFileHistory;
export function findRepoRoot(startDir: string): string | undefined;
```
