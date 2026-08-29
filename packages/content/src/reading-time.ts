// Reading time - pure, deterministic, ~200 wpm default.
//
// Approach: count whitespace-separated tokens (crude but stable). Strip
// code fences from wpm math because code is scanned, not read. For CJK
// content we'd need character-based counting - punted until someone asks.

// 200 wpm is the reading-research consensus, 600 for code is a guess
// I made and never validated. If it feels wrong, it probably is.
const DEFAULT_WPM = 200;
const CODE_BLOCK_WPM = 600;

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  seconds: number;
}

export function readingTime(
  markdown: string,
  options: { wpm?: number; codeWpm?: number } = {},
): ReadingTimeResult {
  const wpm = options.wpm ?? DEFAULT_WPM;
  const codeWpm = options.codeWpm ?? CODE_BLOCK_WPM;

  const { prose, code } = splitCodeBlocks(markdown);
  const proseWords = countWords(prose);
  const codeWords = countWords(code);

  const seconds = (proseWords / wpm) * 60 + (codeWords / codeWpm) * 60;
  const minutes = Math.max(1, Math.round(seconds / 60));

  return { minutes, words: proseWords + codeWords, seconds: Math.round(seconds) };
}

function splitCodeBlocks(md: string): { prose: string; code: string } {
  // Matches ```lang?\n<body>\n``` fenced blocks. Extract just the body
  // (group 1) so the ``` delimiters and optional language token don't get
  // counted as prose or code words.
  const fenceRegex = /```[^\n]*\n([\s\S]*?)\n```/g;
  const codeParts: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = fenceRegex.exec(md)) !== null) {
    if (match[1]) codeParts.push(match[1]);
  }
  const prose = md.replace(fenceRegex, " ");
  return { prose, code: codeParts.join("\n") };
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
