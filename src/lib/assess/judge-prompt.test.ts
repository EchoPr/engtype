import { describe, expect, it } from "vitest";
import { ieltsTask2 } from "@/exams/ielts-task2";
import { buildJudgePrompt } from "./judge-prompt";
import { precheck } from "./prechecks";

const prompt = "Some people think university should be free. To what extent do you agree or disagree?";
const response = "University should be free because education is a right.";
const facts = (overrides = {}) => ({ ...precheck({ prompt, response, minWords: 250 }), minWords: 250, ...overrides });
const lexical = ieltsTask2.criteria.find((c) => c.key === "lexical")!;
const grammar = ieltsTask2.criteria.find((c) => c.key === "grammar")!;

describe("buildJudgePrompt", () => {
  const p = buildJudgePrompt({ rubric: ieltsTask2, criterion: lexical, prompt, response, facts: facts() });

  it("gives the judge this Criterion's Band checks and adjacent-Band distinctions", () => {
    expect(p.instructions).toContain("Lexical Resource");
    for (const b of [4, 5, 6, 7, 8]) expect(p.instructions).toContain(lexical.bands[b]);
    for (const d of Object.values(lexical.discriminators)) expect(p.instructions).toContain(d);
  });

  it("leaves out other Criteria's Band checks so the judge stays on one Criterion", () => {
    expect(p.instructions).not.toContain(grammar.bands[7]);
  });

  it("lists only the model-checked caps of this Criterion, by id", () => {
    expect(p.instructions).toContain("spelling-causes-difficulty");
    expect(p.instructions).toContain("off-task-vocabulary");
    expect(p.instructions).not.toContain("simple-sentences");
    expect(p.instructions).not.toContain("no-paragraphs");
  });

  it("states the scoring principles", () => {
    for (const principle of ieltsTask2.principles) expect(p.instructions).toContain(principle);
  });

  it("passes the task and the response as data, separate from instructions", () => {
    expect(p.input).toContain(`<task>\n${prompt}\n</task>`);
    expect(p.input).toContain(`<response>\n${response}\n</response>`);
    expect(p.instructions).not.toContain(response);
  });

  it("reports length facts, including under-length against the official minimum", () => {
    expect(p.input).toMatch(/9 words[^]*minimum is 250/);
    expect(p.input).toMatch(/significantly under/i);
  });

  it("mentions text copied from the prompt so the judge discounts it", () => {
    const withCopy = buildJudgePrompt({ rubric: ieltsTask2, criterion: lexical, prompt, response, facts: facts({ copiedWords: 12 }) });
    expect(withCopy.input).toMatch(/12 words .*copied from the task/i);
  });
});
