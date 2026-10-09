import { words } from "@/lib/metrics";

/**
 * Deterministic checks that run before any model judgement. Each one encodes an official rule
 * or a code-checkable signal from docs/research/ielts-writing.md (section D5).
 */

export type PrecheckInput = { prompt: string; response: string; minWords?: number };

export type Precheck = {
  /** words that count, i.e. excluding sentences copied from the prompt */
  wordCount: number;
  /** words in sentences copied from the prompt ("any copied rubric must be discounted") */
  copiedWords: number;
  /** ≤20 counted words: every criterion is rated Band 1 */
  tooShortToRate: boolean;
  paragraphs: number;
  /** bullet points or a numbered list: not "a whole piece of connected text" */
  hasList: boolean;
  /** "significant" = under half the minimum (our threshold; the official text only says "significantly underlength") */
  underLength: "none" | "some" | "significant";
};

const LIST_LINE = /^\s*([-*•]|\d+[.)])\s+/m;

const sentencesOf = (text: string) => text.split(/(?<=[.!?])\s+|\n+/).filter((s) => words(s).length > 0);

const trigrams = (ws: string[]) => {
  const out = new Set<string>();
  for (let i = 0; i + 3 <= ws.length; i++) out.add(ws.slice(i, i + 3).join(" "));
  return out;
};

/** A sentence counts as copied when almost all of its word trigrams also occur in the prompt. */
function copiedSentenceWords(prompt: string, response: string) {
  const promptGrams = trigrams(words(prompt).map((w) => w.toLowerCase()));
  let copied = 0;
  for (const s of sentencesOf(response)) {
    const ws = words(s).map((w) => w.toLowerCase());
    if (ws.length < 5) continue;
    const grams = [...trigrams(ws)];
    const shared = grams.filter((g) => promptGrams.has(g)).length;
    if (shared / grams.length >= 0.8) copied += ws.length;
  }
  return copied;
}

export function precheck({ prompt, response, minWords = 0 }: PrecheckInput): Precheck {
  const copiedWords = copiedSentenceWords(prompt, response);
  const wordCount = words(response).length - copiedWords;
  const underLength =
    !minWords || wordCount >= minWords ? "none" : wordCount < minWords / 2 ? "significant" : "some";
  return {
    wordCount,
    copiedWords,
    tooShortToRate: wordCount <= 20,
    paragraphs: response.split(/\n+/).filter((p) => words(p).length > 0).length,
    hasList: LIST_LINE.test(response),
    underLength,
  };
}
