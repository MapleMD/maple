// MapleMD core - domain types and ports.
//
// This package is I/O-free. It defines the shape of the domain
// (Document, Site, Route, Frontmatter) and the Logger port that the
// CLI implements. Additional ports live in `ports.ts` and are added
// only when a real consumer needs them. See docs/architecture.md for the
// architectural contract.

export type { Document, Frontmatter, Route, Site } from "./types.js";
export type { Logger } from "./ports.js";
export { MAPLEMD_VERSION } from "./version.js";
