import { describe, expect, it } from "vitest";
import { ieltsTask2 } from "./ielts-task2";

describe("IELTS Task 2 rubric", () => {
  it("has the four official, equally weighted criteria", () => {
    expect(ieltsTask2.criteria.map((c) => c.key)).toEqual(["task", "coherence", "lexical", "grammar"]);
    expect(ieltsTask2.scale).toEqual({ min: 0, max: 9 });
  });

  it("describes every Band from 4 to 8 for every Criterion", () => {
    for (const c of ieltsTask2.criteria) for (const b of [4, 5, 6, 7, 8]) expect(c.bands[b], `${c.key} band ${b}`).toBeTruthy();
  });

  it("states what separates each pair of adjacent Bands from 5 to 8", () => {
    for (const c of ieltsTask2.criteria) for (const k of ["5|6", "6|7", "7|8"]) expect(c.discriminators[k], `${c.key} ${k}`).toBeTruthy();
  });

  it("ties every cap to an existing Criterion and a cited source", () => {
    const keys = new Set(ieltsTask2.criteria.map((c) => c.key));
    for (const cap of ieltsTask2.caps) {
      expect(keys.has(cap.criterion), cap.id).toBe(true);
      expect(ieltsTask2.sources[cap.source], `${cap.id} source`).toMatch(/^https:\/\//);
    }
  });

  it("includes the bolded Task 2 caps from the official descriptors", () => {
    const caps = Object.fromEntries(ieltsTask2.caps.map((c) => [c.id, c]));
    expect(caps["prompt-part-missing"]).toMatchObject({ criterion: "task", max: 5 });
    expect(caps["no-paragraphs"]).toMatchObject({ criterion: "coherence", max: 5, check: "code" });
    expect(caps["simple-sentences"]).toMatchObject({ criterion: "grammar", max: 4 });
    expect(caps["off-task-vocabulary"]).toMatchObject({ criterion: "lexical", max: 4 });
  });
});
