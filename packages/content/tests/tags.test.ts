import { describe, expect, it } from "vitest";
import { groupByTag, listTagSlugs } from "../src/tags.js";

function post(tags: string[]) {
  return { data: { tags } };
}

describe("groupByTag", () => {
  it("one bucket per distinct tag, item appears in each of its tags", () => {
    const items = [post(["typescript", "web"]), post(["typescript"]), post(["web"])];
    const buckets = groupByTag(items);
    expect(buckets).toHaveLength(2);
    const ts = buckets.find((b) => b.slug === "typescript");
    const web = buckets.find((b) => b.slug === "web");
    expect(ts?.count).toBe(2);
    expect(web?.count).toBe(2);
  });

  it("São Paulo slugifies to sao-paulo but keeps the display form", () => {
    const buckets = groupByTag([post(["São Paulo"])]);
    expect(buckets[0]?.slug).toBe("sao-paulo");
    expect(buckets[0]?.tag).toBe("São Paulo");
  });

  it("no tags anywhere -> no buckets", () => {
    expect(groupByTag([post([])])).toEqual([]);
  });

  it("output order is alphabetical, not insertion", () => {
    const buckets = groupByTag([post(["zeta", "alpha", "mu"])]);
    expect(buckets.map((b) => b.slug)).toEqual(["alpha", "mu", "zeta"]);
  });
});

describe("listTagSlugs", () => {
  it("returns unique slugs across items", () => {
    const slugs = listTagSlugs([post(["a", "b"]), post(["b", "c"])]);
    expect(slugs).toEqual(["a", "b", "c"]);
  });
});
