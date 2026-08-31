// Tiny logger - no dependency. The CLI controls presentation, so it can
// choose formats/colors here. Core packages route through @maplemd/core's
// Logger port; this is the CLI's concrete implementation.

import type { Logger } from "@maplemd/core";

const prefix = {
  info: "  ",
  warn: "! ",
  error: "✗ ",
  debug: "· ",
};

function formatMeta(meta?: Record<string, unknown>): string {
  if (!meta || Object.keys(meta).length === 0) return "";
  return " " + JSON.stringify(meta);
}

export function createConsoleLogger(options: { verbose?: boolean } = {}): Logger {
  return {
    info(msg, meta) {
      process.stdout.write(prefix.info + msg + formatMeta(meta) + "\n");
    },
    warn(msg, meta) {
      process.stderr.write(prefix.warn + msg + formatMeta(meta) + "\n");
    },
    error(msg, err, meta) {
      process.stderr.write(prefix.error + msg + formatMeta(meta) + "\n");
      if (err && options.verbose) {
        process.stderr.write((err.stack ?? String(err)) + "\n");
      }
    },
    debug(msg, meta) {
      if (!options.verbose) return;
      process.stderr.write(prefix.debug + msg + formatMeta(meta) + "\n");
    },
  };
}
