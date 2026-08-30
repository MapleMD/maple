// getGitMetadata - the convenience shape that pages usually need. Wraps
// readGitFileHistory + folds it into a small "publication" record so
// callers don't need to sort commits themselves.

import { readGitFileHistory } from "./git.js";

export interface GitMetadata {
  /** Date of the first commit that added the file. Missing when the file
   *  isn't tracked yet. */
  createdAt?: Date;
  /** Date of the most recent commit that touched the file. */
  updatedAt?: Date;
  /** Distinct author names in chronological order (first appearance). */
  authors: string[];
  /** Total commits touching the file. Useful to decide "high-churn"
   *  visual cues in a docs UI. */
  commitCount: number;
}

/**
 * Convenience shape for use inside an Astro page's frontmatter:
 *
 *   const meta = await getGitMetadata(entry.filePath);
 *   const displayDate = meta.updatedAt ?? entry.data.date;
 *
 * When git isn't available (CI without full checkout, project not in a
 * repo, etc.) the returned metadata is empty rather than throwing -
 * callers fall through to frontmatter defaults.
 */
export async function getGitMetadata(filePath: string): Promise<GitMetadata> {
  const history = await readGitFileHistory(filePath);
  return {
    createdAt: history.createdAt,
    updatedAt: history.updatedAt,
    authors: history.authors,
    commitCount: history.commits.length,
  };
}
