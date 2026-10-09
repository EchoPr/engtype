import { describe, expect, it } from "vitest";
import { precheck } from "./prechecks";

const PROMPT =
  "Some people believe that homework should be banned in primary schools. To what extent do you agree or disagree?";

const para = (n: number) => Array.from({ length: n }, (_, i) => `Sentence number ${i + 1} adds another idea here.`).join(" ");

describe("precheck", () => {
  it("treats a response of 20 words or fewer as Band 1 territory (official rule)", () => {
    const r = precheck({ prompt: PROMPT, response: "I think homework is bad because children are tired and they need to play with friends." });
    expect(r.wordCount).toBe(16);
    expect(r.tooShortToRate).toBe(true);
  });

  it("does not flag a normal-length response as too short to rate", () => {
    const r = precheck({ prompt: PROMPT, response: `${para(8)}\n\n${para(8)}` });
    expect(r.tooShortToRate).toBe(false);
  });

  it("counts paragraphs separated by blank lines or single line breaks", () => {
    expect(precheck({ prompt: PROMPT, response: `${para(3)}\n\n${para(3)}\n\n${para(3)}` }).paragraphs).toBe(3);
    expect(precheck({ prompt: PROMPT, response: `${para(3)}\n${para(3)}` }).paragraphs).toBe(2);
    expect(precheck({ prompt: PROMPT, response: para(20) }).paragraphs).toBe(1);
  });

  it("detects bullet points or numbered lists (not connected text)", () => {
    expect(precheck({ prompt: PROMPT, response: `${para(5)}\n- first reason\n- second reason` }).hasList).toBe(true);
    expect(precheck({ prompt: PROMPT, response: `${para(5)}\n1. first reason\n2) second reason` }).hasList).toBe(true);
    expect(precheck({ prompt: PROMPT, response: `${para(5)}\n\n${para(5)}` }).hasList).toBe(false);
  });

  it("does not count prompt text copied into the response (copied rubric is discounted)", () => {
    const response = `${PROMPT} ${para(10)}`;
    const r = precheck({ prompt: PROMPT, response });
    // the copied prompt sentence (19 words) is excluded from the counted words
    expect(r.copiedWords).toBe(19);
    expect(r.wordCount).toBe(precheck({ prompt: PROMPT, response: para(10) }).wordCount);
  });

  it("flags responses under half the official minimum as significantly under length", () => {
    expect(precheck({ prompt: PROMPT, response: para(10), minWords: 250 }).underLength).toBe("significant");
    expect(precheck({ prompt: PROMPT, response: para(25), minWords: 250 }).underLength).toBe("some");
    expect(precheck({ prompt: PROMPT, response: para(45), minWords: 250 }).underLength).toBe("none");
  });
});
