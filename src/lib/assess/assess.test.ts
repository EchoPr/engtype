import { describe, expect, it } from "vitest";
import { assess, type Judge, type JudgeRequest } from "./index";

const PROMPT =
  "Some people believe that homework should be banned in primary schools. To what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.";
const sentence = "Homework helps children practise what they learned in class and builds useful habits for later life.";
const paragraph = Array(5).fill(sentence).join(" ");
const essay = Array(4).fill(paragraph).join("\n\n"); // 4 paragraphs of 5 × 16 words = 320 words

/** A fake judge: returns the given Band per Criterion and records what it was asked. */
function fakeJudge(bands: Record<string, number>, caps: Record<string, string[]> = {}) {
  const calls: JudgeRequest[] = [];
  const judge: Judge = async (req) => {
    calls.push(req);
    return {
      evidence: [{ quote: sentence, note: "example" }],
      capsTriggered: caps[req.criterion.key] ?? [],
      band: bands[req.criterion.key],
      whyNotHigher: "because",
      comment: `comment for ${req.criterion.key}`,
    };
  };
  return { judge, calls };
}

const all = (b: number) => ({ task: b, coherence: b, lexical: b, grammar: b });

describe("assess (IELTS Task 2)", () => {
  it("asks the judge once per Criterion and computes the overall Band in code", async () => {
    const { judge, calls } = fakeJudge({ task: 7, coherence: 6, lexical: 7, grammar: 6 });
    const a = await assess({ taskType: "ielts-task2", prompt: PROMPT, response: essay }, { judge });
    expect(calls.map((c) => c.criterion.key).sort()).toEqual(["coherence", "grammar", "lexical", "task"]);
    expect(a.criteria.map((c) => [c.key, c.band])).toEqual([["task", 7], ["coherence", 6], ["lexical", 7], ["grammar", 6]]);
    expect(a.overall).toBe(6.5);
    expect(a.criteria[0]).toMatchObject({ label: "Task Response", comment: "comment for task", whyNotHigher: "because" });
  });

  it("rates every Criterion Band 1 without calling the judge when the response has 20 words or fewer", async () => {
    const { judge, calls } = fakeJudge(all(7));
    const a = await assess({ taskType: "ielts-task2", prompt: PROMPT, response: "Homework is bad for small kids because they are tired." }, { judge });
    expect(calls).toHaveLength(0);
    expect(a.criteria.every((c) => c.band === 1)).toBe(true);
    expect(a.overall).toBe(1);
  });

  it("caps Coherence & Cohesion at 5 when the response has no paragraphs, whatever the judge says", async () => {
    const { judge } = fakeJudge(all(7));
    const a = await assess({ taskType: "ielts-task2", prompt: PROMPT, response: Array(4).fill(paragraph).join(" ") }, { judge });
    expect(a.criteria.find((c) => c.key === "coherence")).toMatchObject({ band: 5, judgedBand: 7, capsApplied: ["no-paragraphs"] });
    expect(a.overall).toBe(6.5); // (7+5+7+7)/4 = 6.5
  });

  it("applies caps the judge reports", async () => {
    const { judge } = fakeJudge(all(7), { task: ["prompt-part-missing"] });
    const a = await assess({ taskType: "ielts-task2", prompt: PROMPT, response: essay }, { judge });
    expect(a.criteria[0]).toMatchObject({ key: "task", band: 5, capsApplied: ["prompt-part-missing"] });
  });

  it("tells the judge the deterministic facts it cannot see reliably itself", async () => {
    const { judge, calls } = fakeJudge(all(6));
    await assess({ taskType: "ielts-task2", prompt: PROMPT, response: essay }, { judge });
    expect(calls[0].facts).toMatchObject({ wordCount: 320, paragraphs: 4, minWords: 250, underLength: "none" });
  });

  it("rejects Task Types that have no Rubric yet", async () => {
    const { judge } = fakeJudge(all(6));
    await expect(assess({ taskType: "story", prompt: "x", response: essay }, { judge })).rejects.toThrow(/no rubric/i);
  });
});
