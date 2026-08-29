import { describe, expect, it } from "vitest";
import { paginate } from "../src/pagination.js";

describe("paginate", () => {
  it("splits items into pages of pageSize", () => {
    const items = [1, 2, 3, 4, 5, 6, 7];
    const pages = paginate(items, { pageSize: 3 });
    expect(pages).toHaveLength(3);
    expect(pages[0]?.items).toEqual([1, 2, 3]);
    expect(pages[1]?.items).toEqual([4, 5, 6]);
    expect(pages[2]?.items).toEqual([7]);
  });

  it("marks hasPrev/hasNext and builds URLs from baseUrl", () => {
    const pages = paginate([1, 2, 3, 4, 5], { pageSize: 2, baseUrl: "/" });
    expect(pages).toHaveLength(3);
    expect(pages[0]).toMatchObject({ hasPrev: false, hasNext: true, nextUrl: "/2/" });
    expect(pages[1]).toMatchObject({ hasPrev: true, hasNext: true, prevUrl: "/", nextUrl: "/3/" });
    expect(pages[2]).toMatchObject({ hasPrev: true, hasNext: false, prevUrl: "/2/" });
  });

  it("returns at least one page for empty input", () => {
    const pages = paginate([], { pageSize: 5 });
    expect(pages).toHaveLength(1);
    expect(pages[0]?.items).toEqual([]);
    expect(pages[0]?.totalItems).toBe(0);
  });

  it("handles nested baseUrl", () => {
    const pages = paginate([1, 2, 3], { pageSize: 1, baseUrl: "/tags/web" });
    expect(pages[0]?.nextUrl).toBe("/tags/web/2/");
  });
});
