// Ports - interfaces that adapters implement.
//
// This file started life aspirational - a full set of layered ports
// (ContentSource, Renderer, Plugin, Theme, …) for a framework that
// owned its whole pipeline. The M1 pivot ("MapleMD sits on top of
// Astro") retired most of those: content collections come from
// `astro:content`, rendering comes from Astro, plugins ship as Astro
// integrations. Keeping the abstractions around anyway violated
// docs/architecture.md's "no abstractions without justification" and misled
// readers about the architecture.
//
// The one port that remains is `Logger` - the CLI implements it
// (`apps/cli/src/util/logger.ts`) and it will grow into a proper
// injection point when packages start needing to log through it.
// When we cross that bridge we may reintroduce the others. Until
// then, we lean on Astro's own extension mechanisms.

/**
 * Structured logging. Core packages log through this - never directly
 * to stdout/stderr - so the CLI (or the consumer) controls presentation.
 * See docs/architecture.md ("Logging" section).
 */
export interface Logger {
  info(msg: string, meta?: Record<string, unknown>): void;
  warn(msg: string, meta?: Record<string, unknown>): void;
  error(msg: string, err?: Error, meta?: Record<string, unknown>): void;
  debug(msg: string, meta?: Record<string, unknown>): void;
}
