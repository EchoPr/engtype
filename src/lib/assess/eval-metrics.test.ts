import { describe, expect, it } from "vitest";
import { spearman, linearFit, summarize } from "./eval-metrics";

describe("eval metrics", () => {
  it("spearman is 1 for the same ranking and -1 for the reverse", () => {
    expect(spearman([1, 2, 3, 4], [10, 20, 30, 40])).toBeCloseTo(1);
    expect(spearman([1, 2, 3, 4], [40, 30, 20, 10])).toBeCloseTo(-1);
  });

  it("spearman handles ties with average ranks", () => {
    // worked example: x ranks [1.5,1.5,3,4], y ranks [1,2,3,4] -> rho = 0.9487 (Pearson on ranks)
    expect(spearman([5, 5, 6, 7], [1, 2, 3, 4])).toBeCloseTo(0.9487, 3);
  });

  it("linearFit maps model scores onto the human scale", () => {
    const fit = linearFit([4, 5, 6, 7], [1, 2, 3, 4]); // human = model - 3
    expect(fit.slope).toBeCloseTo(1);
    expect(fit.intercept).toBeCloseTo(-3);
  });

  it("summarize reports agreement after mapping onto the human scale", () => {
    const s = summarize([4, 5, 6, 7], [1, 2, 3, 4]);
    expect(s).toMatchObject({ n: 4, spearman: 1, maeAfterFit: 0, exactAfterFit: 1 });
  });
});
