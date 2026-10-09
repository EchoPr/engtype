import type { Rubric } from "@/exams/types";

export type Judged = { band: number; capsTriggered: string[] };

export type ScoredCriterion = {
  key: string;
  band: number;
  /** what the judge said before caps */
  judgedBand: number;
  capsApplied: string[];
};

/**
 * Official rule: bolded negative features "will limit a rating". The judge reports which caps it saw;
 * code caps come from prechecks. A cap only ever lowers a Band.
 */
export function applyCaps(rubric: Rubric, judged: Record<string, Judged>, codeCaps: string[]): ScoredCriterion[] {
  const { min, max } = rubric.scale;
  return rubric.criteria.map(({ key }) => {
    const j = judged[key];
    const judgedBand = Math.min(max, Math.max(min, Math.floor(j.band)));
    const reported = new Set([...j.capsTriggered, ...codeCaps]);
    const applicable = rubric.caps.filter((c) => c.criterion === key && reported.has(c.id) && c.max < judgedBand);
    const band = applicable.reduce((b, c) => Math.min(b, c.max), judgedBand);
    return { key, band, judgedBand, capsApplied: applicable.map((c) => c.id) };
  });
}

/**
 * Mean of equally weighted criteria (official), to the nearest half Band with ties going down.
 * IELTS does not publish this rounding; rounding down keeps our estimate from over-promising.
 */
export function taskBand(bands: number[]): number {
  const mean = bands.reduce((a, b) => a + b, 0) / bands.length;
  return Math.ceil(mean * 2 - 0.5) / 2;
}
