import { describe, expect, it } from "vitest";
import { applyCaps, taskBand } from "./rules";
import type { Rubric } from "@/exams/types";

const rubric = {
  exam: "ielts",
  taskType: "ielts-task2",
  scale: { min: 0, max: 9 },
  principles: [],
  sources: {},
  criteria: ["task", "coherence", "lexical", "grammar"].map((key) => ({ key, label: key, assesses: "", bands: {}, discriminators: {} })),
  caps: [
    { id: "no-paragraphs", criterion: "coherence", max: 5, when: "", check: "code", source: "" },
    { id: "part-missing", criterion: "task", max: 5, when: "", check: "model", source: "" },
    { id: "simple-sentences", criterion: "grammar", max: 4, when: "", check: "model", source: "" },
  ],
} satisfies Rubric;

const judged = (band: number, caps: string[] = []) => ({ band, capsTriggered: caps });

describe("applyCaps", () => {
  it("keeps the judged Band when no cap applies", () => {
    const out = applyCaps(rubric, { task: judged(7), coherence: judged(7), lexical: judged(6), grammar: judged(6) }, []);
    expect(out.map((c) => c.band)).toEqual([7, 7, 6, 6]);
  });

  it("limits a Criterion when the judge reports one of its caps", () => {
    const out = applyCaps(rubric, { task: judged(7, ["part-missing"]), coherence: judged(7), lexical: judged(6), grammar: judged(6) }, []);
    expect(out[0]).toMatchObject({ key: "task", band: 5, judgedBand: 7, capsApplied: ["part-missing"] });
  });

  it("applies code caps from prechecks regardless of the judge", () => {
    const out = applyCaps(rubric, { task: judged(6), coherence: judged(7), lexical: judged(6), grammar: judged(6) }, ["no-paragraphs"]);
    expect(out[1]).toMatchObject({ key: "coherence", band: 5, capsApplied: ["no-paragraphs"] });
  });

  it("ignores caps reported for the wrong Criterion or unknown ids", () => {
    const out = applyCaps(rubric, { task: judged(7, ["simple-sentences", "made-up"]), coherence: judged(7), lexical: judged(6), grammar: judged(6) }, []);
    expect(out[0]).toMatchObject({ band: 7, capsApplied: [] });
  });

  it("never raises a Band that is already below the cap", () => {
    const out = applyCaps(rubric, { task: judged(4, ["part-missing"]), coherence: judged(7), lexical: judged(6), grammar: judged(6) }, []);
    expect(out[0]).toMatchObject({ band: 4, capsApplied: [] });
  });

  it("clamps judged Bands to whole numbers on the Scale", () => {
    const out = applyCaps(rubric, { task: judged(6.5), coherence: judged(11), lexical: judged(-1), grammar: judged(6) }, []);
    expect(out.map((c) => c.band)).toEqual([6, 9, 0, 6]);
  });
});

describe("taskBand", () => {
  // criteria are equally weighted and the task score is their average (official);
  // rounding is unpublished: we round to the nearest half Band with ties going down, so we never over-promise
  it("averages the four criteria", () => {
    expect(taskBand([7, 7, 7, 7])).toBe(7);
    expect(taskBand([6, 7, 6, 7])).toBe(6.5);
  });
  it("rounds to the nearest half band", () => {
    expect(taskBand([6, 6, 6, 7])).toBe(6); // 6.25 -> tie between 6 and 6.5 -> down
    expect(taskBand([6, 7, 7, 7])).toBe(6.5); // 6.75 -> tie between 6.5 and 7 -> down
    expect(taskBand([5, 6, 6, 6])).toBe(5.5); // 5.75 -> down
    expect(taskBand([6, 6, 7, 7])).toBe(6.5);
  });
});
