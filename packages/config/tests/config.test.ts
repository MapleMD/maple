import { describe, expect, it } from "vitest";
import { ConfigValidationError, defineConfig, resolveConfig } from "../src/index.js";

describe("@maplemd/config", () => {
  describe("defineConfig", () => {
    it("returns the input as-is (identity helper)", () => {
      const cfg = defineConfig({ site: { title: "My Blog" } });
      expect(cfg).toEqual({ site: { title: "My Blog" } });
    });
  });

  describe("resolveConfig", () => {
    it("fills defaults for optional sections", () => {
      const resolved = resolveConfig({ site: { title: "Hello" } });
      expect(resolved.site.language).toBe("en");
      expect(resolved.content.directory).toBe("./src/content");
      expect(resolved.content.collections).toEqual(["posts"]);
      expect(resolved.theme.name).toBe("default");
      expect(resolved.outDir).toBe("./dist");
    });

    it("preserves user overrides", () => {
      const resolved = resolveConfig({
        site: { title: "Docs", language: "pt-BR" },
        outDir: "./build",
      });
      expect(resolved.site.language).toBe("pt-BR");
      expect(resolved.outDir).toBe("./build");
    });

    it("throws ConfigValidationError with field/expected/received on missing title", () => {
      try {
        resolveConfig({ site: {} });
      } catch (err) {
        expect(err).toBeInstanceOf(ConfigValidationError);
        const issues = (err as ConfigValidationError).issues;
        const titleIssue = issues.find((i) => i.field === "site.title");
        expect(titleIssue).toBeDefined();
        expect(titleIssue?.expected).toBeTruthy();
        expect(titleIssue?.received).toBeTruthy();
        return;
      }
      expect.fail("expected ConfigValidationError");
    });

    it("rejects invalid URL", () => {
      expect(() => resolveConfig({ site: { title: "X", url: "not-a-url" } })).toThrow(
        ConfigValidationError,
      );
    });

    it("formats error message with Expected and Received lines", () => {
      try {
        resolveConfig({ site: { title: 42 } });
      } catch (err) {
        const msg = (err as Error).message;
        expect(msg).toContain("Invalid MapleMD config");
        expect(msg).toContain("site.title");
        expect(msg).toContain("Expected:");
        expect(msg).toContain("Received:");
        return;
      }
      expect.fail("expected ConfigValidationError");
    });

    it("prepends the file path when provided", () => {
      try {
        resolveConfig({ site: {} }, "path/to/maplemd.config.ts");
      } catch (err) {
        expect((err as Error).message.startsWith("path/to/maplemd.config.ts")).toBe(true);
        return;
      }
      expect.fail("expected ConfigValidationError");
    });
  });
});
