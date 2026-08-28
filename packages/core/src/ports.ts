/**
 * Structured logging. Consumers (CLI, plugins) implement this so packages
 * don't write directly to stdout/stderr - keeps presentation in one place.
 */
export interface Logger {
  info(msg: string, meta?: Record<string, unknown>): void;
  warn(msg: string, meta?: Record<string, unknown>): void;
  error(msg: string, err?: Error, meta?: Record<string, unknown>): void;
  debug(msg: string, meta?: Record<string, unknown>): void;
}
