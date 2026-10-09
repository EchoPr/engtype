import { z } from "zod";
import type { Assessment } from "./assess";

/** Level 1: inline, span-anchored issues (spelling, grammar, word choice). */
export const InlineIssue = z.object({
  quote: z.string().describe("exact substring copied from the essay, as short as possible (usually 1-4 words)"),
  occurrence: z.number().int().describe("1 if the quote appears once; otherwise which occurrence (1-based) is meant"),
  kind: z.enum(["spelling", "grammar", "punctuation", "word_choice", "collocation", "style", "register"]),
  severity: z.enum(["error", "improve"]).describe("error = wrong; improve = acceptable but a better option exists"),
  replacement: z.string().describe("corrected text that replaces the quote exactly"),
  explanation: z.string().describe("max 20 words, simple English matched to the learner level"),
});

export const InlineResult = z.object({ issues: z.array(InlineIssue) });

export const CRITERIA = ["task", "coherence", "lexical", "grammar"] as const;
export const CRITERIA_LABEL: Record<(typeof CRITERIA)[number], string> = {
  task: "task response",
  coherence: "coherence & cohesion",
  lexical: "lexical resource",
  grammar: "grammar range & accuracy",
};

/** Level 2: meaning, structure and overall assessment. */
export const ReviewResult = z.object({
  band: z.number().describe("overall IELTS-equivalent band 0-9 in steps of 0.5"),
  cefr: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).describe("CEFR level the text demonstrates"),
  level_fit: z.enum(["below", "at", "above"]).describe("compared to the target level of the task"),
  summary: z.string().describe("2-3 sentences overall verdict"),
  criteria: z.array(
    z.object({
      key: z.enum(CRITERIA),
      score: z.number().describe("0-9 in steps of 0.5"),
      comment: z.string(),
    }),
  ),
  meaning_issues: z.array(
    z.object({
      category: z.enum(["task_response", "logic", "coherence", "cohesion", "relevance", "clarity", "development", "tone"]),
      quote: z.string().describe("exact sentence or fragment from the essay this refers to, or empty string if general"),
      problem: z.string(),
      suggestion: z.string(),
    }),
  ),
  strengths: z.array(z.string()),
  recommendations: z.array(z.object({ title: z.string(), detail: z.string(), priority: z.number().int().describe("1 = most important") })),
  improved_sentences: z.array(z.object({ original: z.string(), improved: z.string(), why: z.string() })),
  vocabulary: z.array(z.object({ used: z.string(), alternatives: z.array(z.string()), note: z.string() })),
});

export type InlineIssueT = z.infer<typeof InlineIssue>;
export type ReviewT = z.infer<typeof ReviewResult>;

export type LocatedIssue = InlineIssueT & { id: number; start: number; end: number };

/** Quick Check: Level and overall score only (CONTEXT.md). */
export const QuickResult = z.object({
  cefr: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).describe("CEFR level the text demonstrates"),
  band: z.number().describe("overall IELTS-equivalent band 0-9 in steps of 0.5"),
  summary: z.string().describe("one sentence: the single most important thing to improve"),
});
export type QuickResultT = z.infer<typeof QuickResult>;

/** What the feedback column holds: a Full Review, or { quick } for a Quick Check. */
export type StoredFeedback = Feedback | { quick: QuickResultT };
export const isFullFeedback = (f: StoredFeedback | null): f is Feedback => Boolean(f && "review" in f);

export type Feedback = {
  issues: LocatedIssue[];
  review: ReviewT;
  counts: Record<string, number>;
  /** rubric-based Assessment; present for Task Types that have a Rubric (src/exams) */
  assessment?: Assessment;
};

/**
 * Turns model quotes into character offsets. Drops quotes that can't be found and
 * overlapping spans (the first, i.e. most important per model ordering, wins).
 */
export function locateIssues(text: string, issues: InlineIssueT[]): LocatedIssue[] {
  const out: LocatedIssue[] = [];
  const taken: [number, number][] = [];
  const lower = text.toLowerCase();
  issues.forEach((issue, i) => {
    const quote = issue.quote.trim();
    if (!quote || quote === issue.replacement.trim()) return;
    const positions: number[] = [];
    for (const hay of [text, lower]) {
      const needle = hay === lower ? quote.toLowerCase() : quote;
      let idx = hay.indexOf(needle);
      while (idx !== -1) {
        positions.push(idx);
        idx = hay.indexOf(needle, idx + 1);
      }
      if (positions.length) break;
    }
    if (!positions.length) return;
    const free = positions.filter((p) => !taken.some(([s, e]) => p < e && p + quote.length > s));
    if (!free.length) return;
    const start = free[Math.min(Math.max(issue.occurrence, 1), free.length) - 1] ?? free[0];
    const end = start + quote.length;
    taken.push([start, end]);
    out.push({ ...issue, quote: text.slice(start, end), id: i, start, end });
  });
  return out.sort((a, b) => a.start - b.start);
}

const MAX_DIFF_CELLS = 10_000;

/** Character-level diff for spelling errors: which letters of `a` are wrong / missing relative to `b`. */
export function letterDiff(a: string, b: string): { ch: string; wrong: boolean }[] {
  const n = a.length;
  const m = b.length;
  // the table is n×m: model output is untrusted, so oversized pairs just get the whole quote marked
  if (n * m > MAX_DIFF_CELLS) return [...a].map((ch) => ({ ch, wrong: true }));
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i].toLowerCase() === b[j].toLowerCase() ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: { ch: string; wrong: boolean }[] = [];
  let i = 0;
  let j = 0;
  let pendingMissing = false;
  while (i < n) {
    if (j < m && a[i].toLowerCase() === b[j].toLowerCase()) {
      out.push({ ch: a[i], wrong: pendingMissing });
      pendingMissing = false;
      i++;
      j++;
    } else if (j < m && dp[i][j + 1] >= dp[i + 1][j]) {
      // letter missing in `a`: mark the next letter so the gap is visible
      pendingMissing = true;
      j++;
    } else {
      out.push({ ch: a[i], wrong: true });
      i++;
    }
  }
  if (pendingMissing && out.length) out[out.length - 1].wrong = true;
  return out;
}
