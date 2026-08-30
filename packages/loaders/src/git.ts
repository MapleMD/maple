// Thin wrapper over `git log` - pure I/O. Parsing is separated
// (parseGitLog) so it's testable without spawning processes.
//
// We stay off `simple-git` and other libraries: one `git log` invocation
// per file at build time isn't hot; adding a dep isn't worth the reduced
// noise here.

import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const LOG_FORMAT = "%H%x1f%aI%x1f%an%x1f%ae"; // sha, ISO author date, name, email
const LOG_RECORD_SEP = "\x1f";
const LOG_LINE_SEP = "\n";

export interface GitCommit {
  sha: string;
  date: Date;
  authorName: string;
  authorEmail: string;
}

export interface GitFileHistory {
  /** Chronological ascending - first entry is the earliest commit. */
  commits: GitCommit[];
  createdAt?: Date;
  updatedAt?: Date;
  authors: string[];
}

/**
 * Walks up from `startDir` looking for a `.git` directory. Returns the
 * repo root, or undefined if we ran off the filesystem. Used to make
 * `git log` calls robust to being invoked from a nested directory.
 */
export function findRepoRoot(startDir: string): string | undefined {
  let current = path.resolve(startDir);
  const { root } = path.parse(current);
  while (current !== root) {
    if (existsSync(path.join(current, ".git"))) return current;
    current = path.dirname(current);
  }
  if (existsSync(path.join(root, ".git"))) return root;
  return undefined;
}

/**
 * Returns the parsed commit log for a single file, oldest first.
 * Follows renames (`--follow`). Returns `{ commits: [], ... }` when the
 * file has never been committed (still tracked, or brand new).
 */
export async function readGitFileHistory(filePath: string): Promise<GitFileHistory> {
  const absolute = path.resolve(filePath);
  const cwd = findRepoRoot(path.dirname(absolute));
  if (!cwd) return emptyHistory();

  try {
    const { stdout } = await execFileAsync(
      "git",
      ["log", "--follow", `--pretty=format:${LOG_FORMAT}`, "--", absolute],
      { cwd, maxBuffer: 10 * 1024 * 1024 },
    );
    return parseGitLog(stdout);
  } catch {
    // `git` missing, not a repo, file untracked - all soft failures.
    // Callers get an empty history and fall back to frontmatter dates.
    return emptyHistory();
  }
}

// FIXME: at build time we spawn one `git log` per file. Fine for blogs
// with tens of posts, painful for a docs site with thousands. Consider
// running a single `git log --name-only` and building a map, then reading
// from it. Haven't hit the pain point yet so haven't bothered.

export function parseGitLog(stdout: string): GitFileHistory {
  const trimmed = stdout.trim();
  if (!trimmed) return emptyHistory();

  const commits: GitCommit[] = [];
  for (const line of trimmed.split(LOG_LINE_SEP)) {
    const parts = line.split(LOG_RECORD_SEP);
    if (parts.length < 4) continue;
    const [sha, dateIso, authorName, authorEmail] = parts;
    if (!sha || !dateIso) continue;
    const date = new Date(dateIso);
    if (Number.isNaN(date.getTime())) continue;
    commits.push({
      sha,
      date,
      authorName: authorName ?? "",
      authorEmail: authorEmail ?? "",
    });
  }
  if (commits.length === 0) return emptyHistory();

  // `git log` emits newest-first; flip to chronological order for
  // predictable createdAt/updatedAt semantics.
  const chronological = commits.slice().reverse();
  const authors = uniqueAuthors(chronological);
  return {
    commits: chronological,
    createdAt: chronological[0]?.date,
    updatedAt: chronological[chronological.length - 1]?.date,
    authors,
  };
}

function emptyHistory(): GitFileHistory {
  return { commits: [], authors: [] };
}

function uniqueAuthors(commits: readonly GitCommit[]): string[] {
  const seen = new Set<string>();
  const authors: string[] = [];
  for (const c of commits) {
    const key = c.authorEmail || c.authorName;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    if (c.authorName) authors.push(c.authorName);
  }
  return authors;
}
