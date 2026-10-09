import { describe, expect, it } from "vitest";
import { letterDiff } from "./feedback";

describe("letterDiff", () => {
  it("marks the wrong letters of a misspelt word", () => {
    expect(letterDiff("becuase", "because").map((c) => (c.wrong ? c.ch.toUpperCase() : c.ch)).join("")).toBe("becUAse");
  });

  it("gives up on letter detail for oversized input instead of building a huge table", () => {
    const started = performance.now();
    const out = letterDiff("a".repeat(20_000), "b".repeat(20_000));
    expect(performance.now() - started).toBeLessThan(200);
    expect(out).toHaveLength(20_000);
    expect(out.every((c) => c.wrong)).toBe(true);
  });
});
