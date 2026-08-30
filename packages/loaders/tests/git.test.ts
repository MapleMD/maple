import { describe, expect, it } from "vitest";
import { parseGitLog } from "../src/git.js";

const SEP = "\x1f";

function record(sha: string, iso: string, name: string, email: string): string {
  return [sha, iso, name, email].join(SEP);
}

describe("parseGitLog", () => {
  it("returns empty history for empty input", () => {
    expect(parseGitLog("")).toMatchObject({ commits: [], authors: [] });
    expect(parseGitLog("   \n  \n")).toMatchObject({ commits: [] });
  });

  it("parses commits and orders them chronologically (oldest first)", () => {
    // git emits newest-first; parseGitLog flips.
    const stdout = [
      record("c3", "2024-08-11T10:00:00Z", "Bob", "bob@example.com"),
      record("c2", "2024-05-02T10:00:00Z", "Alice", "alice@example.com"),
      record("c1", "2024-03-17T10:00:00Z", "Alice", "alice@example.com"),
    ].join("\n");
    const h = parseGitLog(stdout);
    expect(h.commits.map((c) => c.sha)).toEqual(["c1", "c2", "c3"]);
    expect(h.createdAt?.toISOString()).toBe("2024-03-17T10:00:00.000Z");
    expect(h.updatedAt?.toISOString()).toBe("2024-08-11T10:00:00.000Z");
  });

  it("dedupes authors by email, preserving first-seen order", () => {
    const stdout = [
      record("c3", "2024-08-11T00:00:00Z", "Bob (renamed)", "bob@example.com"),
      record("c2", "2024-05-02T00:00:00Z", "Bob", "bob@example.com"),
      record("c1", "2024-03-17T00:00:00Z", "Alice", "alice@example.com"),
    ].join("\n");
    const h = parseGitLog(stdout);
    // Chronological → Alice first (c1), then Bob (c2 - deduped so "Bob renamed" c3 skipped).
    expect(h.authors).toEqual(["Alice", "Bob"]);
  });

  it("skips malformed records without throwing", () => {
    const stdout = ["", "not-enough-fields", record("c1", "2024-03-17T00:00:00Z", "A", "a@a.com")].join("\n");
    const h = parseGitLog(stdout);
    expect(h.commits).toHaveLength(1);
  });

  it("skips records with invalid dates", () => {
    const stdout = [
      record("c1", "not-a-date", "A", "a@a.com"),
      record("c2", "2024-03-17T00:00:00Z", "B", "b@b.com"),
    ].join("\n");
    const h = parseGitLog(stdout);
    expect(h.commits.map((c) => c.sha)).toEqual(["c2"]);
  });
});
