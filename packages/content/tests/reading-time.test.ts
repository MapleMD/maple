import { describe, expect, it } from "vitest";
import { readingTime } from "../src/reading-time.js";

describe("readingTime", () => {
  it("rounds tiny input up to 1 minute", () => {
    expect(readingTime("Hello world").minutes).toBe(1);
  });

  it("600 words at default wpm = 3 minutes", () => {
    const words = new Array(600).fill("word").join(" ");
    expect(readingTime(words).minutes).toBe(3);
  });

  it("code fences count at code wpm, not prose wpm", () => {
    // 400 prose (~120s) + 400 code (~40s) = 160s -> 3 min rounded.
    const prose = new Array(400).fill("word").join(" ");
    const code = "```\n" + new Array(400).fill("word").join(" ") + "\n```";
    const total = readingTime(`${prose}\n\n${code}`);
    expect(total.words).toBe(800);
    expect(total.minutes).toBe(3);
  });

  it("wpm option overrides the default", () => {
    const words = new Array(500).fill("w").join(" ");
    expect(readingTime(words, { wpm: 500 }).minutes).toBe(1);
  });
});
