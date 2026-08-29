import { describe, expect, it } from "vitest";
import { docSchema, pageSchema, postSchema, slugify } from "../src/index.js";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips diacritics", () => {
    expect(slugify("São Paulo café")).toBe("sao-paulo-cafe");
  });

  it("collapses repeated separators and trims", () => {
    expect(slugify("  --Hello -- World--  ")).toBe("hello-world");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
  });
});

describe("postSchema", () => {
  it("accepts a minimal valid post", () => {
    const parsed = postSchema().parse({ title: "Hi", date: "2024-03-17" });
    expect(parsed.title).toBe("Hi");
    expect(parsed.date).toBeInstanceOf(Date);
    expect(parsed.tags).toEqual([]);
    expect(parsed.draft).toBe(false);
  });

  it("rejects empty title", () => {
    expect(() => postSchema().parse({ title: "", date: "2024-03-17" })).toThrow();
  });

  it("is extensible via .extend", () => {
    const extended = postSchema().extend({ hero: postSchema().shape.title });
    const parsed = extended.parse({ title: "Hi", date: "2024-03-17", hero: "banner.jpg" });
    expect(parsed.hero).toBe("banner.jpg");
  });
});

describe("pageSchema / docSchema", () => {
  it("pageSchema requires only title", () => {
    expect(pageSchema().parse({ title: "About" }).title).toBe("About");
  });

  it("docSchema fills sidebar defaults", () => {
    const doc = docSchema().parse({ title: "Getting started" });
    expect(doc.sidebar.order).toBe(0);
    expect(doc.sidebar.hidden).toBe(false);
  });
});
