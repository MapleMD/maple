// @maplemd/loaders - git-aware metadata helpers.

export { findRepoRoot, parseGitLog, readGitFileHistory } from "./git.js";
export type { GitCommit, GitFileHistory } from "./git.js";
export { getGitMetadata } from "./git-metadata.js";
export type { GitMetadata } from "./git-metadata.js";
