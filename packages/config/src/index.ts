// @maplemd/config - user-facing config helper + validated schema.
//
// Users write `maplemd.config.ts` and export `defineConfig({...})`. The CLI
// loads that file, calls `resolveConfig()` on the result, and everything
// downstream sees a fully-defaulted, validated `ResolvedMaplemdConfig`.

import { MaplemdConfigSchema, type ResolvedMaplemdConfig, type UserMaplemdConfig } from "./schema.js";

export type {
  ContentConfig,
  ResolvedMaplemdConfig,
  SiteConfig,
  ThemeConfig,
  UserMaplemdConfig,
} from "./schema.js";
export { MaplemdConfigSchema } from "./schema.js";

/**
 * Identity helper that gives the user's config file inline autocomplete
 * and type-checking without importing zod. Runtime-cheap: just returns
 * the input.
 */
export function defineConfig(config: UserMaplemdConfig): UserMaplemdConfig {
  return config;
}

/**
 * A single validation problem: `field` (dotted path) + `expected` (what
 * the schema wanted) + `received` (what we saw). `file` is optional -
 * callers that know the source file (a loader reading `maplemd.config.ts`)
 * can attach it before rethrowing.
 */
export interface ConfigIssue {
  file?: string;
  field: string;
  expected: string;
  received: string;
  message: string;
}

export class ConfigValidationError extends Error {
  public readonly issues: ConfigIssue[];

  constructor(issues: ConfigIssue[], file?: string) {
    super(formatIssues(issues, file));
    this.name = "ConfigValidationError";
    this.issues = issues;
  }
}

function formatIssues(issues: ConfigIssue[], file?: string): string {
  const header = file ? `${file}\n\nInvalid frontmatter:` : "Invalid MapleMD config:";
  const body = issues
    .map((i) => {
      const field = i.field || "(root)";
      return [
        `  ${field}`,
        `    Expected: ${i.expected}`,
        `    Received: ${i.received}`,
      ].join("\n");
    })
    .join("\n\n");
  return `${header}\n${body}`;
}

/**
 * Validate the user-supplied config and fill defaults. Throws
 * `ConfigValidationError` with actionable messages when invalid.
 */
export function resolveConfig(userConfig: unknown, file?: string): ResolvedMaplemdConfig {
  const result = MaplemdConfigSchema.safeParse(userConfig);
  if (!result.success) {
    const issues = result.error.issues.map(zodIssueToConfigIssue);
    throw new ConfigValidationError(issues, file);
  }
  return result.data;
}

// Normalize a Zod issue into ConfigIssue. Zod's discriminant carries
// different fields per code (invalid_type has expected/received;
// too_small has minimum; invalid_string has a validation kind, etc.).
// We coerce to a stable `{ expected, received }` string pair so
// downstream consumers don't need to know Zod internals.
//
// Typed as `unknown` on the way in - index into the record shape after
// narrowing. Avoids coupling to Zod's private issue types (which change
// between minor releases).

function zodIssueToConfigIssue(raw: unknown): ConfigIssue {
  const issue = raw as Record<string, unknown>;
  const path = Array.isArray(issue["path"]) ? issue["path"] : [];
  const field = path.map((p) => String(p)).join(".");
  const message = typeof issue["message"] === "string" ? issue["message"] : "Invalid value";
  const { expected, received } = deriveExpectedReceived(issue);
  return { field, expected, received, message };
}

function deriveExpectedReceived(issue: Record<string, unknown>): {
  expected: string;
  received: string;
} {
  if (issue["expected"] !== undefined || issue["received"] !== undefined) {
    return {
      expected: String(issue["expected"] ?? "unknown"),
      received: String(issue["received"] ?? "unknown"),
    };
  }
  const code = typeof issue["code"] === "string" ? issue["code"] : "";
  switch (code) {
    case "too_small":
      return {
        expected: `at least ${String(issue["minimum"] ?? "?")}`,
        received: "smaller value",
      };
    case "too_big":
      return {
        expected: `at most ${String(issue["maximum"] ?? "?")}`,
        received: "larger value",
      };
    case "invalid_string": {
      const validation = issue["validation"];
      const kind =
        typeof validation === "string"
          ? validation
          : typeof validation === "object" && validation !== null
            ? Object.keys(validation)[0]
            : undefined;
      return {
        expected: kind ? `valid ${kind}` : "valid string",
        received: "malformed string",
      };
    }
    case "invalid_enum_value":
      return { expected: "one of the allowed values", received: "unexpected value" };
    default:
      return { expected: typeof issue["message"] === "string" ? String(issue["message"]) : "valid input", received: "invalid input" };
  }
}
